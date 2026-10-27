import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const STRIPE_SECRET_KEY     = Deno.env.get('STRIPE_SECRET_KEY')!;
const PRO_PRICE_ID          = 'price_1TQfNIQJ639dGC2Y6NlC8K5J';
const UNLIMITED_PRICE_ID    = 'price_1TQfNeQJ639dGC2YDRAUamcr';
const PRO_ANNUAL_PRICE_ID   = Deno.env.get('STRIPE_PRICE_PRO_ANNUAL') ?? '';
const UNLIMITED_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_UNLIMITED_ANNUAL') ?? '';

// Flip this to true only after the read-only audit confirms which customers,
// if any, have more than one live subscription. It then stops the duplicate
// subscription from renewing so only the best plan is billed going forward.
const CANCEL_DUPLICATE_SUBSCRIPTIONS = false;

// The owner account is intentionally comped and is not backed by a live
// subscription. Never let a stale Stripe event downgrade it.
const COMPED_CUSTOMER_IDS = new Set(['cus_UPNC8dikFi7okr']);

const POSTHOG_API_KEY = Deno.env.get('POSTHOG_API_KEY') ?? 'phc_rdKunrFnC9t6eeDkaR6tz7FTtEXw3yPDYpEkF6ZqUMRy';
const POSTHOG_HOST    = (Deno.env.get('POSTHOG_HOST') ?? 'https://us.i.posthog.com').replace(/\/+$/, '');

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const TIER_RANK: Record<string, number> = { free: 0, pro: 1, unlimited: 2 };
const ACCESS_STATUSES   = new Set(['active', 'trialing']);
const RECOVERY_STATUSES = new Set(['past_due', 'unpaid']);
const LIVE_STATUSES     = new Set([...ACCESS_STATUSES, ...RECOVERY_STATUSES]);

class StripeApiError extends Error {}

type Subscription = any;
type UserRow = {
  id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  period_end: string | null;
  tier: string | null;
  subscription_status: string | null;
};

type ReconcileResult = {
  tier: string;
  status: string;
  primaryId: string | null;
  userId: string | null;
  periodEnd: string | null;
  duplicateIds: string[];
};

function verifyStripeSignature(body: string, header: string, secret: string): Promise<boolean> {
  return (async () => {
    try {
      const parts    = Object.fromEntries(header.split(',').map(p => p.split('=')));
      const ts       = parts['t'];
      const sig      = parts['v1'];
      const payload  = `${ts}.${body}`;
      const key      = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const sigBuf   = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
      const computed = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
      return computed === sig;
    } catch {
      return false;
    }
  })();
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

function tierOfSubscription(sub: Subscription): string {
  return tierFromPriceId(sub?.items?.data?.[0]?.price?.id);
}

function periodEndUnix(sub: Subscription | null): number | null {
  if (!sub) return null;
  const item = sub?.items?.data?.[0];
  const value = item?.current_period_end ?? sub?.current_period_end;
  return typeof value === 'number' ? value : null;
}

function periodEndISO(sub: Subscription | null): string | null {
  const seconds = periodEndUnix(sub);
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

// Access-bearing subscriptions win over failed ones, then the highest tier
// wins, then the newest billing period. That means a working Pro is never
// displaced by a past-due Unlimited.
function pickPrimarySubscription(subs: Subscription[]): Subscription | null {
  const live = subs.filter(sub => LIVE_STATUSES.has(sub?.status));
  const choose = (pool: Subscription[]) => {
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
    throw new StripeApiError(`Stripe GET ${path} failed: ${res.status} ${json?.error?.message ?? ''}`);
  }
  return json;
}

async function listSubscriptions(customerId: string): Promise<Subscription[]> {
  const out: Subscription[] = [];
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

async function fetchSubscription(subscriptionId: string): Promise<Subscription> {
  return await stripeGet(`subscriptions/${subscriptionId}`);
}

async function setCancelAtPeriodEnd(subscriptionId: string): Promise<void> {
  const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ cancel_at_period_end: 'true' }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.error) {
    throw new StripeApiError(`Stripe cancel_at_period_end failed for ${subscriptionId}: ${res.status}`);
  }
}

async function fetchSchedule(scheduleId: string): Promise<any> {
  return await stripeGet(`subscription_schedules/${scheduleId}`);
}

async function releaseSchedule(scheduleId: string): Promise<void> {
  const res = await fetch(`https://api.stripe.com/v1/subscription_schedules/${scheduleId}/release`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.error) {
    throw new StripeApiError(`Stripe schedule release failed for ${scheduleId}: ${json?.error?.message ?? res.status}`);
  }
}

function scheduleIdOf(sub: Subscription): string | null {
  if (!sub?.schedule) return null;
  return typeof sub.schedule === 'string' ? sub.schedule : (sub.schedule.id ?? null);
}

async function stopSubscriptionAtPeriodEnd(sub: Subscription): Promise<void> {
  const scheduleId = scheduleIdOf(sub);
  if (scheduleId) {
    const schedule = await fetchSchedule(scheduleId);
    if (schedule?.status === 'active' || schedule?.status === 'not_started') {
      await releaseSchedule(scheduleId);
    }
  }
  await setCancelAtPeriodEnd(sub.id);
}

async function resolveUserRow(customerId: string, userId: string | null): Promise<UserRow | null> {
  const columns = 'id, stripe_customer_id, stripe_subscription_id, period_end, tier, subscription_status';
  if (userId) {
    const { data, error } = await sb.from('users').select(columns).eq('id', userId).maybeSingle();
    if (error) throw error;
    if (data && (!data.stripe_customer_id || data.stripe_customer_id === customerId)) {
      return data as UserRow;
    }
  }
  if (customerId) {
    const { data, error } = await sb.from('users').select(columns).eq('stripe_customer_id', customerId).limit(1);
    if (error) throw error;
    if (data?.[0]) return data[0] as UserRow;
  }
  return null;
}

async function reconcileCustomer(
  customerId: string,
  opts: {
    userId?: string | null;
    resetForSubscriptionId?: string | null;
    terminalStatus?: string;
    upgradeFrom?: string | null;
  } = {}
): Promise<ReconcileResult> {
  const subscriptions = await listSubscriptions(customerId);
  const primary = pickPrimarySubscription(subscriptions);
  const current = await resolveUserRow(customerId, opts.userId ?? null);

  if (COMPED_CUSTOMER_IDS.has(customerId)) {
    console.log('stripe-webhook: keeping comped customer unlimited', customerId);
    return {
      tier: current?.tier ?? 'unlimited',
      status: current?.subscription_status ?? 'active',
      primaryId: current?.stripe_subscription_id ?? null,
      userId: current?.id ?? null,
      periodEnd: current?.period_end ?? null,
      duplicateIds: [],
    };
  }

  const tier = primary ? tierOfSubscription(primary) : 'free';
  const status = primary?.status ?? opts.terminalStatus ?? 'inactive';
  const primaryId = primary?.id ?? null;
  const periodEnd = periodEndISO(primary);

  const payload: Record<string, unknown> = {
    tier,
    stripe_subscription_id: primaryId,
    subscription_status: status,
    period_end: periodEnd,
  };
  if (!current?.stripe_customer_id) payload.stripe_customer_id = customerId;

  const previousPeriodEnd = current?.period_end ? Date.parse(current.period_end) : 0;
  const nextPeriodEnd = periodEnd ? Date.parse(periodEnd) : 0;
  const primaryChanged = !!primary && current?.stripe_subscription_id !== primary.id;
  const periodAdvanced = !!primary
    && opts.resetForSubscriptionId === primary.id
    && nextPeriodEnd > previousPeriodEnd;

  // Only a new primary subscription or a genuinely advanced billing period may
  // reset usage. A cancellation, payment-method edit, or duplicate event must
  // never wipe a paid user's counters.
  if (primary && ACCESS_STATUSES.has(primary.status) && (primaryChanged || periodAdvanced)) {
    payload.essay_count = 0;
    payload.pastetype_count = 0;
    payload.pastetype_reset_at = new Date().toISOString();
  }

  const targetId = current?.id ?? opts.userId ?? null;
  let update = sb.from('users').update(payload);
  update = targetId ? update.eq('id', targetId) : update.eq('stripe_customer_id', customerId);
  const { data: updated, error: updateError } = await update.select('id');
  if (updateError) throw updateError;

  let resolvedUserId = updated?.[0]?.id ?? targetId ?? null;
  if ((!updated || !updated.length) && opts.userId && opts.userId !== targetId) {
    const retry = await sb.from('users').update(payload).eq('id', opts.userId).select('id');
    if (retry.error) throw retry.error;
    if (retry.data?.[0]?.id) resolvedUserId = retry.data[0].id;
  }
  if (!resolvedUserId) {
    console.error('stripe-webhook: no users row found for customer', customerId);
  }

  const duplicateIds: string[] = [];

  // An explicit upgrade (e.g. monthly Pro -> Unlimited) always schedules the
  // older lower-tier subscription to stop at its paid period end. This is the
  // "keep the $5 for this month, then only bill $25" rule and does not depend
  // on the broader duplicate cleanup flag.
  if (primary && opts.upgradeFrom && opts.upgradeFrom !== primary.id) {
    try {
      const oldSubscription = await fetchSubscription(opts.upgradeFrom);
      const oldRank = TIER_RANK[tierOfSubscription(oldSubscription)] ?? 0;
      const newRank = TIER_RANK[tierOfSubscription(primary)] ?? 0;
      if (LIVE_STATUSES.has(oldSubscription.status) && oldRank < newRank) {
        if (!oldSubscription.cancel_at_period_end || scheduleIdOf(oldSubscription)) {
          await stopSubscriptionAtPeriodEnd(oldSubscription);
          duplicateIds.push(oldSubscription.id);
        }
      }
    } catch (err) {
      console.error('stripe-webhook: upgrade cleanup failed', opts.upgradeFrom, (err as Error).message);
    }
  }

  if (CANCEL_DUPLICATE_SUBSCRIPTIONS && primary) {
    for (const sub of subscriptions) {
      if (sub.id === primary.id) continue;
      if (!LIVE_STATUSES.has(sub.status)) continue;
      if (sub.cancel_at_period_end) continue;
      if (duplicateIds.includes(sub.id)) continue;
      try {
        await setCancelAtPeriodEnd(sub.id);
        duplicateIds.push(sub.id);
      } catch (err) {
        console.error('stripe-webhook: duplicate cancellation failed', sub.id, (err as Error).message);
      }
    }
  }

  return { tier, status, primaryId, userId: resolvedUserId, periodEnd, duplicateIds };
}

// Last-resort path if Stripe's subscription list is unavailable. Never resets
// usage counters; the next successful reconcile will handle those correctly.
async function legacyApplySubscription(subscription: Subscription): Promise<void> {
  const priceId = subscription?.items?.data?.[0]?.price?.id;
  const customerId = idOf(subscription?.customer);
  if (!priceId || !customerId) return;
  if (COMPED_CUSTOMER_IDS.has(customerId)) return;
  const { error } = await sb.from('users').update({
    tier: tierFromPriceId(priceId),
    stripe_subscription_id: subscription.id,
    subscription_status: subscription?.status ?? 'unknown',
    period_end: periodEndISO(subscription),
  }).eq('stripe_customer_id', customerId);
  if (error) throw error;
}

async function capturePostHog(
  eventName: string,
  distinctId: string | null,
  properties: Record<string, unknown>,
  insertId: string | null
): Promise<void> {
  if (!distinctId) {
    console.warn(`PostHog ${eventName} skipped: no user resolved`);
    return;
  }

  try {
    const res = await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: eventName,
        distinct_id: distinctId,
        properties: {
          ...properties,
          app: 'website',
          instrumentation: 'server-v1',
          ...(insertId ? { $insert_id: `${insertId}:${eventName}` } : {}),
        },
      }),
    });
    if (!res.ok) {
      console.error(`PostHog ${eventName} failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error(`PostHog ${eventName} error:`, (err as Error).message);
  }
}

async function trackSubscriptionActivated(session: any, subscription: any, event: any): Promise<void> {
  const price = subscription?.items?.data?.[0]?.price;
  const tier = tierFromPriceId(price?.id ?? '');
  const customerId = idOf(session?.customer) ?? idOf(subscription?.customer);
  const userId = await resolveUserRow(customerId ?? '', session?.metadata?.user_id ?? subscription?.metadata?.user_id ?? null)
    .then(row => row?.id ?? null)
    .catch(() => null);

  await capturePostHog('subscription_activated', userId, {
    tier,
    price_id: price?.id ?? null,
    interval: price?.recurring?.interval ?? null,
    amount_total: session?.amount_total ?? null,
    currency: session?.currency ?? null,
    payment_status: session?.payment_status ?? null,
    checkout_session_id: session?.id ?? null,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription?.id ?? idOf(session?.subscription),
    mode: session?.mode ?? null,
    $set: {
      tier,
      stripe_customer_id: customerId,
      subscription_status: subscription?.status ?? null,
    },
    $set_once: {
      initial_plan: tier,
      initial_price_id: price?.id ?? null,
    },
  }, event?.id ?? null);
}

async function trackSubscriptionCanceled(
  subscription: any,
  event: any,
  result: ReconcileResult
): Promise<void> {
  const price = subscription?.items?.data?.[0]?.price;
  const customerId = idOf(subscription?.customer);
  const userId = await resolveUserRow(customerId ?? '', subscription?.metadata?.user_id ?? null)
    .then(row => row?.id ?? null)
    .catch(() => null);

  await capturePostHog('subscription_canceled', userId, {
    tier_before: tierFromPriceId(price?.id ?? ''),
    tier_after: result.tier,
    price_id: price?.id ?? null,
    interval: price?.recurring?.interval ?? null,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription?.id ?? null,
    subscription_status: result.status,
    canceled_at: subscription?.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    $set: {
      tier: result.tier,
      subscription_status: result.status,
      stripe_subscription_id: result.primaryId,
      period_end: result.periodEnd,
    },
  }, event?.id ?? null);
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body = await req.text();
  const sigHeader = req.headers.get('stripe-signature') ?? '';
  if (!(await verifyStripeSignature(body, sigHeader, STRIPE_WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await fetchSubscription(idOf(session.subscription)!);
          const userId = session?.metadata?.user_id ?? subscription?.metadata?.user_id ?? null;
          await reconcileCustomer(idOf(subscription.customer)!, {
            userId,
            resetForSubscriptionId: subscription.id,
            upgradeFrom: subscription?.metadata?.upgrade_from ?? session?.metadata?.upgrade_from ?? null,
          });
          await trackSubscriptionActivated(session, subscription, event);
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await fetchSubscription(idOf(invoice.subscription)!);
          await reconcileCustomer(idOf(subscription.customer)!, {
            userId: subscription?.metadata?.user_id ?? null,
            resetForSubscriptionId: idOf(invoice.subscription),
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await fetchSubscription(idOf(invoice.subscription)!);
          await reconcileCustomer(idOf(subscription.customer)!, {
            userId: subscription?.metadata?.user_id ?? null,
          });
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await reconcileCustomer(idOf(subscription.customer)!, {
          userId: subscription?.metadata?.user_id ?? null,
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const result = await reconcileCustomer(idOf(subscription.customer)!, {
          userId: subscription?.metadata?.user_id ?? null,
          terminalStatus: 'canceled',
        });
        await trackSubscriptionCanceled(subscription, event, result);
        break;
      }
      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', event?.id, event?.type, (err as Error).message);

    // Apply the event's own subscription as a safety net. This keeps the user
    // on the right tier even if the Stripe list call is temporarily down.
    try {
      const object = event?.data?.object;
      if (object?.object === 'subscription') {
        await legacyApplySubscription(object);
      } else if (object?.object === 'invoice' && object.subscription) {
        await legacyApplySubscription(await fetchSubscription(idOf(object.subscription)!));
      } else if (event.type === 'checkout.session.completed' && object?.subscription) {
        await legacyApplySubscription(await fetchSubscription(idOf(object.subscription)!));
      }
    } catch (fallbackErr) {
      console.error('Webhook fallback failed:', (fallbackErr as Error).message);
    }

    // A Stripe read outage should not make Stripe retry for days; a database or
    // logic failure should retry, because the fallback may not have persisted.
    const status = err instanceof StripeApiError ? 200 : 500;
    return new Response(JSON.stringify({
      received: status === 200,
      error: (err as Error).message,
    }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
