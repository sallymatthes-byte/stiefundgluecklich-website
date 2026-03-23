// Cloudflare Pages Function — ITS Bundle Stripe Checkout
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

    // Determine base URL from request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('customer_email', email);
    params.append('success_url', `${baseUrl}/its-bundle-danke`);
    params.append('cancel_url', `${baseUrl}/its-bundle?canceled=true`);
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][unit_amount]', '5900'); // 59€ in cents
    params.append('line_items[0][price_data][product_data][name]', 'ITS Bundle – It\'s Time to Shine');
    params.append('line_items[0][price_data][product_data][description]', 'I Belong + Talk like a Team + Setting Limits');
    params.append('line_items[0][quantity]', '1');
    params.append('payment_method_types[0]', 'card');
    params.append('payment_method_types[1]', 'sepa_debit');
    params.append('payment_method_types[2]', 'klarna');
    params.append('payment_method_types[3]', 'link');
    params.append('allow_promotion_codes', 'true');
    params.append('invoice_creation[enabled]', 'true');
    params.append('invoice_creation[invoice_data][footer]', 'Sally Matthes – Coaching, Beratung & Training | SIRET: 935040469 00014 | TVA: FR 50935040469');
    params.append('metadata[product]', 'its-bundle');
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

    // Add contact to AC list "It's time to shine" (ID 25) with tag
    try {
      const AC_URL = env.AC_API_URL || 'https://sallymatthes.api-us1.com';
      const AC_KEY = env.AC_API_KEY;
      if (AC_KEY) {
        const acHeaders = { 'Api-Token': AC_KEY, 'Content-Type': 'application/json' };
        
        // Create/update contact
        const contactRes = await fetch(`${AC_URL}/api/3/contact/sync`, {
          method: 'POST',
          headers: acHeaders,
          body: JSON.stringify({ contact: { email, firstName: name.split(' ')[0] } })
        });
        const contactData = await contactRes.json();
        const contactId = contactData?.contact?.id;

        if (contactId) {
          // Add to ITS list (25)
          await fetch(`${AC_URL}/api/3/contactLists`, {
            method: 'POST',
            headers: acHeaders,
            body: JSON.stringify({ contactList: { list: '25', contact: contactId, status: '1' } })
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
