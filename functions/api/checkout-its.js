// Cloudflare Pages Function: ITS Bundle Stripe Checkout.

import { createProductCheckout, productCheckoutOptions } from '../lib/product-checkout.js';

export async function onRequestPost(context) {
  return createProductCheckout(context, {
    product: 'its-bundle',
    amount: 5900,
    name: "ITS Bundle: It's Time to Shine",
    description: 'I Belong, Talk like a Team und Setting Limits',
    successPath: '/its-bundle-danke',
    cancelPath: '/its-bundle?checkout=abgebrochen',
  });
}

export const onRequestOptions = productCheckoutOptions;
