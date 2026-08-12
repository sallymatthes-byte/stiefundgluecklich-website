import type { APIRoute } from 'astro';
import { onRequestPost } from '../../../functions/api/beyondbonus-vormerken.js';

export const prerender = false;

export const POST: APIRoute = (context) => onRequestPost({
  request: context.request,
  env: (context.locals as { runtime?: { env?: Record<string, string> } }).runtime?.env || {},
});
