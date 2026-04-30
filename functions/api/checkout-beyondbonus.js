// Cloudflare Pages Function — BeyondBonus Stripe Checkout
// Direct sale paused during Sally's Babypause. Next entry window planned for Herbst 2026.

export async function onRequestPost() {
  return new Response(JSON.stringify({
    error: 'Beyond Bonus ist aktuell nicht im direkten Verkauf.',
    redirect: '/warteliste'
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
