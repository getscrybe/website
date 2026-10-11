import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY  = Deno.env.get('STRIPE_SECRET_KEY')!;
const PRO_PRICE_ID       = 'price_1TQfNIQJ639dGC2Y6NlC8K5J';
const UNLIMITED_PRICE_ID = 'price_1TQfNeQJ639dGC2YDRAUamcr';
// Annual Pro price. Set the STRIPE_PRICE_PRO_ANNUAL secret in Supabase to enable it.
const PRO_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_PRO_ANNUAL') ?? '';
// Annual Unlimited price. Set the STRIPE_PRICE_UNLIMITED_ANNUAL secret to enable it.
const UNLIMITED_ANNUAL_PRICE_ID = Deno.env.get('STRIPE_PRICE_UNLIMITED_ANNUAL') ?? '';
const DEFAULT_SUCCESS_URL = 'https://getscrybe.net/purchase.html?checkout=success';
const DEFAULT_CANCEL_URL  = 'https://getscrybe.net/purchase.html?checkout=cancelled';

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Only trust redirects back to our own site.
function safeUrl(candidate: unknown, fallback: string): string {
  if (typeof candidate === 'string' && candidate.startsWith('https://getscrybe.net/')) {
    return candidate;
  }
  return fallback;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Verify Supabase JWT
    const authHeader = req.headers.get('Authorization') ?? '';
    const token      = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await sb.auth.getUser(token);
    if (authErr || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

    const { plan, success_url, cancel_url } = await req.json();
    const priceId =
      plan === 'unlimited'        ? UNLIMITED_PRICE_ID         :
      plan === 'unlimited_annual' ? UNLIMITED_ANNUAL_PRICE_ID  :
      plan === 'pro_annual'       ? PRO_ANNUAL_PRICE_ID        :
      PRO_PRICE_ID;
    if (!priceId) {
      return new Response(JSON.stringify({ error: 'This plan is not configured yet.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const successUrl = safeUrl(success_url, DEFAULT_SUCCESS_URL);
    const cancelUrl  = safeUrl(cancel_url, DEFAULT_CANCEL_URL);

    // Get or create Stripe customer
    const { data: profile } = await sb.from('users').select('stripe_customer_id, email').eq('id', user.id).single();
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const res  = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type':  'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email: profile?.email ?? user.email ?? '', 'metadata[supabase_user_id]': user.id }),
      });
      const customer = await res.json();
      customerId     = customer.id;
      await sb.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    // Create Checkout session
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer:                customerId,
        mode:                    'subscription',
        'line_items[0][price]':  priceId,
        'line_items[0][quantity]': '1',
        success_url:             successUrl,
        cancel_url:              cancelUrl,
        'metadata[user_id]':     user.id,
        allow_promotion_codes:   'true',
      }),
    });
    const session = await res.json();

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
