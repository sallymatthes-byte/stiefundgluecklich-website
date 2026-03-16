// Cloudflare Pages Function — BeyondBonus Stripe Checkout
// Env vars needed: STRIPE_SECRET_KEY, AC_API_URL, AC_API_KEY

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { name, email } = await request.json();

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: corsHeaders });
    }

    const STRIPE_KEY = env.STRIPE_SECRET_KEY;
    if (!STRIPE_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('customer_email', email);
    params.append('success_url', `${baseUrl}/beyondbonus-danke`);
    params.append('cancel_url', `${baseUrl}/beyondbonus?canceled=true`);
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][unit_amount]', '49700'); // 497€ in cents
    params.append('line_items[0][price_data][product_data][name]', 'Beyond Bonus – Online-Intensivprogramm');
    params.append('line_items[0][price_data][product_data][description]', '17+ Stunden Video-Module, Workbooks, 10-Wochen-E-Mail-Begleitung, 12 Monate Zugang');
    params.append('line_items[0][quantity]', '1');
    params.append('payment_method_types[0]', 'card');
    params.append('payment_method_types[1]', 'sepa_debit');
    params.append('payment_method_types[2]', 'klarna');
    params.append('payment_method_types[3]', 'link');
    params.append('allow_promotion_codes', 'true');
    params.append('metadata[product]', 'beyondbonus');
    params.append('metadata[customer_name]', name);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (session.error) {
      console.error('Stripe error:', session.error);
      return new Response(JSON.stringify({ error: session.error.message }), { status: 400, headers: corsHeaders });
    }

    // Add contact to AC list "BeyondBonus" (ID 24)
    try {
      const AC_URL = env.AC_API_URL || 'https://sallymatthes.api-us1.com';
      const AC_KEY = env.AC_API_KEY;
      if (AC_KEY) {
        const acHeaders = { 'Api-Token': AC_KEY, 'Content-Type': 'application/json' };
        
        const contactRes = await fetch(`${AC_URL}/api/3/contact/sync`, {
          method: 'POST',
          headers: acHeaders,
          body: JSON.stringify({ contact: { email, firstName: name.split(' ')[0] } })
        });
        const contactData = await contactRes.json();
        const contactId = contactData?.contact?.id;

        if (contactId) {
          await fetch(`${AC_URL}/api/3/contactLists`, {
            method: 'POST',
            headers: acHeaders,
            body: JSON.stringify({ contactList: { list: '24', contact: contactId, status: '1' } })
          });
        }
      }
    } catch (acErr) {
      console.error('AC error (non-blocking):', acErr);
    }

    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
