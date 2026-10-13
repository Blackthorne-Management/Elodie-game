// Talking to the game server: one POST per request, plus a live channel that says "something changed".
import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { SERVER } from './config';
import type { Request, Response } from './protocol';

export async function call(req: Request): Promise<Response> {
  const url = SERVER.override ? `${SERVER.override}/bloodlines` : `${SERVER.url}/functions/v1/bloodlines`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVER.anonKey}`, apikey: SERVER.anonKey },
      body: JSON.stringify(req),
    });
    return await res.json();
  } catch {
    return { ok: false, error: 'Could not reach the game server. Check your connection.' };
  }
}

let client: SupabaseClient | null = null;
// Calls onChange whenever the server says the game changed. Returns a function that stops listening.
export function listen(code: string, onChange: () => void): () => void {
  if (SERVER.override) return () => {};                 // the local test server has no live channel; polling covers it
  client ??= createClient(SERVER.url, SERVER.anonKey, { auth: { persistSession: false } });
  const ch: RealtimeChannel = client.channel(`bl-${code}`).on('broadcast', { event: 'update' }, () => onChange()).subscribe();
  return () => { void client?.removeChannel(ch); };
}
