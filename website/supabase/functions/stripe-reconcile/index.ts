import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Temporary owner-only reconciliation tool. It schedules every non-primary
// live subscription to stop at its paid period end, then writes the correct
// primary subscription back to public.users. It never changes usage counters.
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
    throw new Error(`Stripe cancel_at_period_end failed for ${subscriptionId}: ${json?.error?.message ?? res.status}`);
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
    throw new Error(`Stripe schedule release failed for ${scheduleId}: ${json?.error?.message ?? res.status}`);
  }
}

function scheduleIdOf(sub: any): string | null {
  if (!sub?.schedule) return null;
  return typeof sub.schedule === 'string' ? sub.schedule : (sub.schedule.id ?? null);
}

async function stopSubscriptionAtPeriodEnd(sub: any): Promise<void> {
  const scheduleId = scheduleIdOf(sub);
  if (scheduleId) {
    const schedule = await fetchSchedule(scheduleId);
    if (schedule?.status === 'active' || schedule?.status === 'not_started') {
      // A schedule controls cancellation while it is attached. Release it so
      // the subscription keeps its current paid phase, then stop renewal.
      await releaseSchedule(scheduleId);
    }
  }
  await setCancelAtPeriodEnd(sub.id);
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  const jsonResponse = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await sb.auth.getUser(token);
    if (authErr || !user) return jsonResponse({ error: 'Unauthorized' }, 401);
    if ((user.email ?? '').toLowerCase() !== OWNER_EMAIL) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    const { email, dryRun } = await req.json();
    if (typeof email !== 'string' || !email) {
      return jsonResponse({ error: 'email is required' }, 400);
    }

    const { data: row, error: rowError } = await sb.from('users')
      .select('id, email, tier, subscription_status, stripe_customer_id, stripe_subscription_id, period_end')
      .eq('email', email)
      .maybeSingle();
    if (rowError) throw rowError;
    if (!row) return jsonResponse({ error: 'user not found' }, 404);
    if (!row.stripe_customer_id) return jsonResponse({ error: 'no stripe_customer_id on user' }, 400);

    const subscriptions = await listSubscriptions(row.stripe_customer_id);
    const live = subscriptions.filter(sub => LIVE_STATUSES.has(sub?.status));
    const primary = pickPrimarySubscription(subscriptions);

    if (dryRun) {
      const details: any[] = [];
      for (const sub of live) {
        const scheduleId = scheduleIdOf(sub);
        let schedule: any = null;
        if (scheduleId) {
          try {
            schedule = await fetchSchedule(scheduleId);
          } catch (err) {
            schedule = { error: (err as Error).message };
          }
        }
        details.push({
          id: sub.id,
          tier: tierOfSubscription(sub),
          status: sub.status,
          cancel_at_period_end: !!sub.cancel_at_period_end,
          current_period_end: periodEndISO(sub),
          schedule_id: scheduleId,
          schedule: schedule ? {
            id: schedule.id,
            status: schedule.status,
            end_behavior: schedule.end_behavior,
            current_phase: schedule.current_phase ? {
              start_date: schedule.current_phase.start_date,
              end_date: schedule.current_phase.end_date,
              price_id: schedule.current_phase.items?.[0]?.price ?? null,
            } : null,
            phases: (schedule.phases ?? []).map((phase: any) => ({
              start_date: phase.start_date,
              end_date: phase.end_date,
              price_id: phase.items?.[0]?.price ?? null,
            })),
            error: schedule.error ?? null,
          } : null,
        });
      }
      return jsonResponse({ dry_run: true, email: row.email, live_subscriptions: details });
    }

    if (!primary) return jsonResponse({ error: 'no live subscription to keep' }, 400);

    const actions: any[] = [];
    for (const sub of live) {
      if (sub.id === primary.id) continue;
      if (sub.cancel_at_period_end && !scheduleIdOf(sub)) {
        actions.push({ id: sub.id, tier: tierOfSubscription(sub), action: 'already_scheduled' });
        continue;
      }
      await stopSubscriptionAtPeriodEnd(sub);
      actions.push({ id: sub.id, tier: tierOfSubscription(sub), action: 'cancel_at_period_end' });
    }

    const payload = {
      tier: tierOfSubscription(primary),
      stripe_subscription_id: primary.id,
      subscription_status: primary.status,
      period_end: periodEndISO(primary),
    };
    const { error: updateError } = await sb.from('users').update(payload).eq('id', row.id);
    if (updateError) throw updateError;

    const refreshed = await listSubscriptions(row.stripe_customer_id);

    return jsonResponse({
      ok: true,
      email: row.email,
      customer_id: row.stripe_customer_id,
      before: {
        tier: row.tier,
        status: row.subscription_status,
        subscription_id: row.stripe_subscription_id,
        period_end: row.period_end,
      },
      after: payload,
      actions,
      live_subscriptions: refreshed
        .filter(sub => LIVE_STATUSES.has(sub?.status))
        .map(sub => ({
          id: sub.id,
          tier: tierOfSubscription(sub),
          status: sub.status,
          current_period_end: periodEndISO(sub),
          cancel_at_period_end: sub.cancel_at_period_end,
          schedule_id: scheduleIdOf(sub),
        })),
    });
  } catch (err) {
    console.error('stripe-reconcile error:', err);
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
