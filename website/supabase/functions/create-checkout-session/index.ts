import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY  = Deno.env.get('STRIPE_SECRET_KEY')!;
const PRO_PRICE_ID       = 'price_1TQfNIQJ639dGC2Y6NlC8K5J';
const UNLIMITED_PRICE_ID = 'price_1TQfNeQJ639dGC2YDRAUamcr';
// Annual Pro price. Set the STRIPE_PRICE_PRO_ANNUAL secret in Supabase to enable it.
const PRO_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_PRO_ANNUAL') ?? '';
// Annual Unlimited price. Set the STRIPE_PRICE_UNLIMITED_ANNUAL secret to enable it.
const UNLIMITED_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_UNLIMITED_ANNUAL') ?? '';
const DEFAULT_SUCCESS_URL = 'https://getscrybe.net/purchase?checkout=success';
const DEFAULT_CANCEL_URL  = 'https://getscrybe.net/purchase?checkout=cancelled';
const DEFAULT_PORTAL_RETURN_URL = 'https://getscrybe.net/purchase';

const TIER_RANK: Record<string, number> = { free: 0, pro: 1, unlimited: 2 };
const ACCESS_STATUSES   = new Set(['active', 'trialing']);
const RECOVERY_STATUSES = new Set(['past_due', 'unpaid']);
const LIVE_STATUSES     = new Set([...ACCESS_STATUSES, ...RECOVERY_STATUSES]);

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

function safeUrl(candidate: unknown, fallback: string): string {
  if (typeof candidate === 'string' && candidate.startsWith('https://getscrybe.net/')) {
    return candidate;
  }
  return fallback;
}

function idOf(value: any): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : (value.id ?? null);
}

function tierFromPriceId(priceId: string | null | undefined): string {
  if (!priceId) return 'free';
  if (priceId === PRO_PRICE_ID || (PRO_ANNUAL_PRICE_ID && priceId === PRO_ANNUAL_PRICE_ID)) return 'pro';
  if (priceId === UNLIMITED_PRICE_ID || (UNLIMITED_ANNUAL_PRICE_ID && priceId === UNLIMITED_ANNUAL_PRICE_ID)) return 'unlimited';
  return 'free';
}

function tierOfSubscription(sub: any): string {
  return tierFromPriceId(sub?.items?.data?.[0]?.price?.id);
}

function periodEndUnix(sub: any): number | null {
  const item = sub?.items?.data?.[0];
  const value = item?.current_period_end ?? sub?.current_period_end;
  return typeof value === 'number' ? value : null;
}

function isAnnualSubscription(sub: any): boolean {
  return sub?.items?.data?.[0]?.price?.recurring?.interval === 'year';
}

function pickPrimarySubscription(subs: any[]): any | null {
  const live = subs.filter(sub => LIVE_STATUSES.has(sub?.status));
  const choose = (pool: any[]) => {
    if (!pool.length) return null;
    return pool.slice().sort((a, b) => {
      const rank = (TIER_RANK[tierOfSubscription(b)] ?? 0) - (TIER_RANK[tierOfSubscription(a)] ?? 0);
      if (rank !== 0) return rank;
      const period = (periodEndUnix(b) ?? 0) - (periodEndUnix(a) ?? 0);
      if (period !== 0) return period;
      return (b?.created ?? 0) - (a?.created ?? 0);
    })[0];
  };

  const access = live.filter(sub => ACCESS_STATUSES.has(sub.status));
  if (access.length) return choose(access);
  return choose(live.filter(sub => RECOVERY_STATUSES.has(sub.status)));
}

async function stripeGet(path: string): Promise<any> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.error) {
    throw new Error(`Stripe GET ${path} failed: ${res.status} ${json?.error?.message ?? ''}`);
  }
  return json;
}

async function listSubscriptions(customerId: string): Promise<any[]> {
  const out: any[] = [];
  let after: string | null = null;
  for (let page = 0; page < 10; page++) {
    const q = new URLSearchParams({ customer: customerId, status: 'all', limit: '100' });
    if (after) q.set('starting_after', after);
    const json = await stripeGet(`subscriptions?${q.toString()}`);
    out.push(...(json?.data ?? []));
    if (!json?.has_more || !json?.data?.length) break;
    after = json.data[json.data.length - 1].id;
  }
  return out;
}

async function findExistingCustomerByEmail(email: string): Promise<string | null> {
  if (!email) return null;
  try {
    const q = new URLSearchParams({ email, limit: '1' });
    const json = await stripeGet(`customers?${q.toString()}`);
    return json?.data?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function findOpenCheckoutSession(customerId: string, userId: string, plan: string): Promise<string | null> {
  try {
    const q = new URLSearchParams({ customer: customerId, status: 'open', limit: '20' });
    const json = await stripeGet(`checkout/sessions?${q.toString()}`);
    const match = (json?.data ?? []).find(
      (session: any) => session?.metadata?.user_id === userId
        && session?.metadata?.plan === plan
        && typeof session?.url === 'string'
    );
    return match?.url ?? null;
  } catch {
    return null;
  }
}

async function createPortalSession(customerId: string): Promise<string> {
  const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      customer: customerId,
      return_url: DEFAULT_PORTAL_RETURN_URL,
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.error || !json?.url) {
    throw new Error(json?.error?.message ?? `Failed to create billing portal session (${res.status})`);
  }
  return json.url;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  const jsonResponse = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Verify Supabase JWT
    const authHeader = req.headers.get('Authorization') ?? '';
    const token      = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await sb.auth.getUser(token);
    if (authErr || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

    const { plan, success_url, cancel_url } = await req.json();
    const requestedTier = plan === 'unlimited' || plan === 'unlimited_annual' ? 'unlimited' : 'pro';
    const priceId =
      plan === 'unlimited'        ? UNLIMITED_PRICE_ID         :
      plan === 'unlimited_annual' ? UNLIMITED_ANNUAL_PRICE_ID  :
      plan === 'pro_annual'       ? PRO_ANNUAL_PRICE_ID        :
      PRO_PRICE_ID;
    if (!priceId) {
      return jsonResponse({ error: 'This plan is not configured yet.' }, 400);
    }
    const successUrl = safeUrl(success_url, DEFAULT_SUCCESS_URL);
    const cancelUrl  = safeUrl(cancel_url, DEFAULT_CANCEL_URL);

    // Get or create the Stripe customer
    const { data: profile } = await sb.from('users')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();
    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      // An account can predate the customer-id column. Reuse the Stripe
      // customer with the same email before creating a second one.
      customerId = await findExistingCustomerByEmail(profile?.email ?? user.email ?? '');
    }

    if (!customerId) {
      const res = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type':  'application/x-www-form-urlencoded',
          'Idempotency-Key': `customer:${user.id}`,
        },
        body: new URLSearchParams({
          email: profile?.email ?? user.email ?? '',
          'metadata[supabase_user_id]': user.id,
        }),
      });
      const customer = await res.json().catch(() => null);
      if (!res.ok || customer?.error || !customer?.id) {
        console.error('Stripe customer creation failed:', customer?.error ?? res.status);
        return jsonResponse({ error: 'Failed to prepare billing. Please try again.' }, 502);
      }
      customerId = customer.id;
    }

    // Persist the customer id for accounts that did not have one.
    if (!profile?.stripe_customer_id) {
      const { error: saveError } = await sb.from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
      if (saveError) console.error('Failed to save Stripe customer id:', saveError.message);
    }

    // Never create a second subscription for a customer who already has one.
    const subscriptions = await listSubscriptions(customerId);
    const liveSubscriptions = subscriptions.filter(sub => LIVE_STATUSES.has(sub?.status));
    const primary = pickPrimarySubscription(subscriptions);

    if (primary) {
      const currentTier = tierOfSubscription(primary);
      let reason: string | null = null;

      if (liveSubscriptions.length > 1) {
        reason = 'multiple_subscriptions';
      } else if (RECOVERY_STATUSES.has(primary.status)) {
        reason = 'payment_issue';
      } else if ((TIER_RANK[requestedTier] ?? 0) <= (TIER_RANK[currentTier] ?? 0)) {
        reason = 'existing_subscription';
      } else if (isAnnualSubscription(primary)) {
        // Annual plans carry a long paid term; changing them belongs in the
        // Stripe Billing Portal, not a second subscription.
        reason = 'annual_plan_change';
      }

      if (reason) {
        let portalUrl: string;
        try {
          portalUrl = await createPortalSession(customerId);
        } catch (err) {
          console.error('Portal creation failed:', (err as Error).message);
          return jsonResponse({
            error: 'You already have a plan. Open the billing portal to change it, or contact support.',
          }, 502);
        }
        return jsonResponse({ url: portalUrl, mode: 'portal', reason });
      }
    }

    // Reuse an open checkout for the same plan so a double click cannot create
    // two subscriptions.
    const openCheckoutUrl = await findOpenCheckoutSession(customerId, user.id, plan);
    if (openCheckoutUrl) {
      return jsonResponse({ url: openCheckoutUrl, mode: 'checkout', reused: true });
    }

    const params = new URLSearchParams({
      customer:                customerId,
      mode:                    'subscription',
      'line_items[0][price]':  priceId,
      'line_items[0][quantity]': '1',
      success_url:             successUrl,
      cancel_url:              cancelUrl,
      'metadata[user_id]':     user.id,
      'metadata[plan]':        plan,
      'metadata[requested_tier]': requestedTier,
      client_reference_id:     user.id,
      'subscription_data[metadata][user_id]': user.id,
      'subscription_data[metadata][plan]': plan,
      allow_promotion_codes:   'true',
    });
    if (primary) params.set('subscription_data[metadata][upgrade_from]', primary.id);

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type':  'application/x-www-form-urlencoded',
        'Idempotency-Key': `checkout:${user.id}:${plan}:${Math.floor(Date.now() / 1000)}`,
      },
      body: params,
    });
    const session = await res.json().catch(() => null);

    if (!res.ok || session?.error || !session?.url) {
      console.error('Stripe checkout creation failed:', session?.error ?? res.status);
      return jsonResponse({ error: session?.error?.message ?? 'Failed to create checkout session.' }, 502);
    }

    return jsonResponse({ url: session.url, mode: 'checkout' });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Something went wrong. Please try again.' }, 500);
  }
});
