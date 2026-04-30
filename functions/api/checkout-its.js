// Cloudflare Pages Function — ITS Bundle Stripe Checkout
// Sale paused during Sally's Babypause.

export async function onRequestPost() {
  return new Response(JSON.stringify({
    error: 'Das ITS Bundle ist aktuell nicht buchbar.',
    redirect: '/bonusmama-check?source=website_internal'
  }), {
    status: 403,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
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
