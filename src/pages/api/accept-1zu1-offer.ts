import type { APIRoute } from 'astro';
import { onRequestPost } from '../../../functions/api/accept-1zu1-offer.js';

export const prerender = false;

function toPagesFunctionContext(context: Parameters<APIRoute>[0]) {
  return {
    request: context.request,
    env: (context.locals as { runtime?: { env?: Record<string, string> } }).runtime?.env || {},
  };
}

export const POST: APIRoute = (context) => onRequestPost(toPagesFunctionContext(context));
