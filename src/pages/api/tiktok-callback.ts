import type { APIRoute } from 'astro';
import { onRequestGet } from '../../../functions/api/tiktok-callback.js';

export const prerender = false;

function toPagesFunctionContext(context: Parameters<APIRoute>[0]) {
  return {
    request: context.request,
    env: (context.locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env || {},
  };
}

export const GET: APIRoute = (context) => onRequestGet(toPagesFunctionContext(context));
