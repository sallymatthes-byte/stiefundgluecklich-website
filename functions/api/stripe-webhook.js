// Cloudflare Pages Function — Stripe Webhook
// Sets AC tags when a purchase is completed
// Env vars needed: STRIPE_WEBHOOK_SECRET, AC_API_URL, AC_API_KEY

const PRODUCT_TAG_MAP = {
  'beyondbonus': '73',    // beyondbonus-gekauft
  'its-bundle': '79',     // its-gekauft
};

export async function onRequestPost(context) {
  const { request, env } = context;

  const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const AC_URL = env.AC_API_URL || 'https://sallymatthes.api-us1.com';
  const AC_KEY = env.AC_API_KEY;

  if (!WEBHOOK_SECRET || !AC_KEY) {
    console.error('Missing env vars: STRIPE_WEBHOOK_SECRET or AC_API_KEY');
    return new Response('Server config error', { status: 500 });
  }

  // Verify Stripe signature
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = await verifyStripeSignature(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signature verification failed:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  // Only handle checkout.session.completed
  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true, skipped: event.type }), { status: 200 });
  }

  const session = event.data.object;
  const email = session.customer_details?.email || session.customer_email;
  const product = session.metadata?.product;

  if (!email || !product) {
    console.log('No email or product in session', { email, product });
    return new Response(JSON.stringify({ received: true, skipped: 'no email or product' }), { status: 200 });
  }

  const tagId = PRODUCT_TAG_MAP[product];
  if (!tagId) {
    console.log(`Unknown product: ${product}, no tag to set`);
    return new Response(JSON.stringify({ received: true, skipped: `unknown product: ${product}` }), { status: 200 });
  }

  // Find or create contact in AC
  try {
    const acHeaders = { 'Api-Token': AC_KEY, 'Content-Type': 'application/json' };

    // Sync contact (creates if not exists)
    const contactRes = await fetch(`${AC_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers: acHeaders,
      body: JSON.stringify({ contact: { email } })
    });
    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    if (!contactId) {
      console.error('Could not find/create AC contact for', email);
      return new Response(JSON.stringify({ received: true, error: 'AC contact not found' }), { status: 200 });
    }

    // Add tag
    const tagRes = await fetch(`${AC_URL}/api/3/contactTags`, {
      method: 'POST',
      headers: acHeaders,
      body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } })
    });
    const tagData = await tagRes.json();

    // Also subscribe to Newsletter list (ID 29) if not already
    await fetch(`${AC_URL}/api/3/contactLists`, {
      method: 'POST',
      headers: acHeaders,
      body: JSON.stringify({ contactList: { list: '29', contact: contactId, status: '1' } })
    });

    console.log(`✅ Tagged ${email} with tag ${tagId} (product: ${product}), contact ID: ${contactId}`);
    return new Response(JSON.stringify({ received: true, tagged: true, email, product, tagId }), { status: 200 });

  } catch (acErr) {
    console.error('AC error:', acErr);
    return new Response(JSON.stringify({ received: true, error: 'AC tagging failed' }), { status: 200 });
  }
}

// Stripe signature verification (without stripe-node SDK)
async function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader) throw new Error('No signature header');

  const parts = sigHeader.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const signature = parts['v1'];

  if (!timestamp || !signature) throw new Error('Invalid signature format');

  // Check timestamp (allow 5 min tolerance)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    throw new Error('Timestamp too old');
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (expectedSig !== signature) {
    throw new Error('Signature mismatch');
  }

  return JSON.parse(payload);
}

export async function onRequestOptions() {
  return new Response(null, { status: 200 });
}
