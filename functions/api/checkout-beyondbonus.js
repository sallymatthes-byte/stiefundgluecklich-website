// Cloudflare Pages Function: BeyondBonus Stripe Checkout.

import { createProductCheckout, productCheckoutOptions } from '../lib/product-checkout.js';

export async function onRequestPost(context) {
  return createProductCheckout(context, {
    product: 'beyondbonus',
    amount: 49700,
    name: 'Beyond Bonus: Online-Intensivprogramm',
    description: '54 Video- und Audio-Lektionen, Workbook, 10-Wochen-E-Mail-Begleitung und 12 Monate Zugang',
    successPath: '/beyondbonus-danke',
    cancelPath: '/beyondbonus?checkout=abgebrochen',
  });
}

export const onRequestOptions = productCheckoutOptions;
