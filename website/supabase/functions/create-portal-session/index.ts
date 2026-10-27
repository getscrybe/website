import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY  = Deno.env.get('STRIPE_SECRET_KEY')!;
const DEFAULT_RETURN_URL = 'https://getscrybe.net/purchase.html';

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Resolve the Stripe customer for this user
    const { data: profile } = await sb.from('users')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? null;

    // Fallback: locate an existing customer by email (accounts created before
    // the id was persisted), then save it for next time.
    if (!customerId) {
      const email = profile?.email ?? user.email ?? '';
      if (email) {
        const q   = new URLSearchParams({ email, limit: '1' });
        const res = await fetch(`https://api.stripe.com/v1/customers?${q.toString()}`, {
          headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
        });
        const list = await res.json();
        customerId = list?.data?.[0]?.id ?? null;
        if (customerId) {
          await sb.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id);
        }
      }
    }

    if (!customerId) {
      return new Response(JSON.stringify({ error: 'No billing account found for this user.' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a Stripe Billing Portal session (cancel / change plan / update card)
    const body      = await req.json().catch(() => ({}));
    const returnUrl = body?.return_url ?? DEFAULT_RETURN_URL;

    const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ customer: customerId, return_url: returnUrl }),
    });
    const session = await res.json();

    if (!res.ok || session.error) {
      console.error('Stripe portal error:', session.error ?? session);
      return new Response(JSON.stringify({ error: session.error?.message ?? 'Failed to create portal session.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
