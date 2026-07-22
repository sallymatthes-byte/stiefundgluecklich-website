import type { APIRoute } from 'astro';
import { onRequestPost, onRequestOptions } from '../../../functions/api/1zu1-bewerbung.js';

export const prerender = false;

function toPagesFunctionContext(context: Parameters<APIRoute>[0]) {
  return {
    request: context.request,
    env: (context.locals as { runtime?: { env?: Record<string, string> } }).runtime?.env || {},
  };
}

export const POST: APIRoute = (context) => onRequestPost(toPagesFunctionContext(context));
export const OPTIONS: APIRoute = (context) => onRequestOptions(toPagesFunctionContext(context));
