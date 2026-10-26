import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Read-only reconciliation preview. Deploy temporarily, call it as the owner,
// then delete it. It never writes to Stripe or to public.users.
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const OWNER_EMAIL       = 'getscrybe@gmail.com';
const PRO_PRICE_ID      = 'price_1TQfNIQJ639dGC2Y6NlC8K5J';
const UNLIMITED_PRICE_ID = 'price_1TQfNeQJ639dGC2YDRAUamcr';
const PRO_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_PRO_ANNUAL') ?? '';
const UNLIMITED_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_UNLIMITED_ANNUAL') ?? '';

const TIER_RANK: Record<string, number> = { free: 0, pro: 1, unlimited: 2 };
const ACCESS_STATUSES   = new Set(['active', 'trialing']);
const RECOVERY_STATUSES = new Set(['past_due', 'unpaid']);
const LIVE_STATUSES     = new Set([...ACCESS_STATUSES, ...RECOVERY_STATUSES]);

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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

function periodEndISO(sub: any): string | null {
  const seconds = periodEndUnix(sub);
  return seconds ? new Date(seconds * 1000).toISOString() : null;
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

function summarize(sub: any) {
  const price = sub?.items?.data?.[0]?.price;
  return {
    id: sub?.id ?? null,
    status: sub?.status ?? null,
    tier: tierOfSubscription(sub),
    price_id: price?.id ?? null,
    interval: price?.recurring?.interval ?? null,
    current_period_end: periodEndISO(sub),
    cancel_at_period_end: !!sub?.cancel_at_period_end,
    created: sub?.created ? new Date(sub.created * 1000).toISOString() : null,
  };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const jsonResponse = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await sb.auth.getUser(token);
    if (authErr || !user) return jsonResponse({ error: 'Unauthorized' }, 401);
    if ((user.email ?? '').toLowerCase() !== OWNER_EMAIL) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    const { data: rows, error } = await sb.from('users').select(
      'id, email, tier, subscription_status, stripe_customer_id, stripe_subscription_id, period_end'
    );
    if (error) throw error;

    const targets = (rows ?? []).filter(row =>
      row.stripe_customer_id || row.tier !== 'free' || row.stripe_subscription_id
    );

    const results: any[] = [];
    for (const row of targets) {
      const base = {
        email: row.email,
        user_id: row.id,
        customer_id: row.stripe_customer_id,
        db: {
          tier: row.tier,
          status: row.subscription_status,
          subscription_id: row.stripe_subscription_id,
          period_end: row.period_end,
        },
      };

      if (!row.stripe_customer_id) {
        results.push({ ...base, error: 'no_stripe_customer_id' });
        continue;
      }

      try {
        const subscriptions = await listSubscriptions(row.stripe_customer_id);
        const live = subscriptions.filter(sub => LIVE_STATUSES.has(sub?.status));
        const primary = pickPrimarySubscription(subscriptions);
        const duplicates = live
          .filter(sub => sub.id !== primary?.id && !sub.cancel_at_period_end)
          .map(sub => ({ id: sub.id, tier: tierOfSubscription(sub), status: sub.status }));

        const wouldBe = primary
          ? {
              tier: tierOfSubscription(primary),
              status: primary.status,
              subscription_id: primary.id,
              period_end: periodEndISO(primary),
            }
          : { tier: 'free', status: 'inactive', subscription_id: null, period_end: null };

        const matches = {
          tier: wouldBe.tier === row.tier,
          status: wouldBe.status === row.subscription_status,
          subscription_id: wouldBe.subscription_id === row.stripe_subscription_id,
          period_end: wouldBe.period_end === row.period_end,
        };

        const notes: string[] = [];
        if (live.length > 1) notes.push('multiple_live_subscriptions');
        if (primary && RECOVERY_STATUSES.has(primary.status)) notes.push('primary_subscription_is_past_due');
        if (!matches.tier) notes.push('tier_mismatch');
        if (!matches.subscription_id) notes.push('primary_subscription_mismatch');
        if (!matches.period_end) notes.push('period_end_mismatch');
        if (duplicates.length) notes.push('would_cancel_duplicates_at_period_end');

        results.push({
          ...base,
          subscriptions: subscriptions.map(summarize),
          live_subscriptions: live.map(summarize),
          would_be: wouldBe,
          duplicates_would_cancel: duplicates,
          matches_db: matches,
          all_match: matches.tier && matches.status && matches.subscription_id && matches.period_end,
          notes,
        });
      } catch (err) {
        results.push({ ...base, error: (err as Error).message });
      }
    }

    return jsonResponse({
      generated_at: new Date().toISOString(),
      cancel_duplicates_enabled: false,
      count: results.length,
      issues: results.filter(r => r.error || r.notes?.length).length,
      users: results,
    });
  } catch (err) {
    console.error('stripe-audit error:', err);
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
