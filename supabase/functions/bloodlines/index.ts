// Bloodlines online play: the game server. Every request loads one session row (locked), applies one operation with
// the game rules, saves it and tells everyone in the game to refresh. The rules (src/net/serverCore.ts with the engine)
// are bundled by scripts/build-server.mjs into public/server/core.js on the website; the function fetches that file
// when it starts, so pushing a rules change updates the server too. Deploy with the Supabase MCP or
// `supabase functions deploy bloodlines`.
import postgres from 'npm:postgres@3.4.5';

const CORE_URL = 'https://zesty-puffpuff-852680.netlify.app/server/core.js';
// deno-lint-ignore no-explicit-any
let core: any = null;
let loadedAt = 0;
// The rules are re-read every few minutes, so a website deploy reaches warm servers too.
async function loadCore() {
  if (core && Date.now() - loadedAt < 5 * 60_000) return core;
  try {
    const res = await fetch(`${CORE_URL}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`Could not load the game rules (${res.status})`);
    core = new Function(`${await res.text()}\nreturn BloodlinesCore;`)();
    loadedAt = Date.now();
  } catch (e) {
    if (!core) throw e;                      // keep the last good copy if the website is briefly unreachable
  }
  return core;
}

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { prepare: false, max: 3 });
const URL_ = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const rand = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
const env = { rand, token: () => crypto.randomUUID(), now: () => Date.now() };

// Tell everyone in the game something changed; they fetch their own view.
async function ping(code: string, version: number) {
  try {
    await fetch(`${URL_}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ topic: `bl-${code}`, event: 'update', payload: { v: version } }] }),
    });
  } catch { /* clients also poll */ }
}

// Load, change and save one session inside a transaction with the row locked.
async function withSession<T>(code: string, fn: (s: any) => T): Promise<{ s: any; out: T }> {
  return await sql.begin(async tx => {
    const rows = await tx`select data from bloodlines.sessions where code = ${code} for update`;
    if (!rows.length) throw new core.GameError('No game with that code.');
    const s = rows[0].data;
    const before = s.version;
    const out = fn(s);
    if (s.version !== before) {
      await tx`update bloodlines.sessions set data = ${sql.json(s)}, status = ${s.status}, updated_at = now() where code = ${code}`;
    }
    return { s, out };
  });
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    await loadCore();
    const r = await req.json();
    const code = r.code ? core.normCode(String(r.code)) : '';
    switch (r.op) {
      case 'create': {
        for (let tries = 0; tries < 8; tries++) {
          const c = core.newCode(env);
          const { session, token } = core.createSession(env, c, String(r.name ?? ''), Number(r.total), Number(r.humans), r.mode === 'battle' ? 'battle' : 'race',
        r.suddenDeath === undefined ? undefined : Number(r.suddenDeath));
          const done = await sql`insert into bloodlines.sessions (code, status, data) values (${c}, ${session.status}, ${sql.json(session)})
            on conflict (code) do nothing returning code`;
          if (done.length) return json({ ok: true, code: c, token, seat: 0, lobby: core.lobbyView(session, 0) });
        }
        throw new core.GameError('Could not make a game code; try again.');
      }
      case 'join': {
        const { s, out } = await withSession(code, s => core.joinSession(env, s, String(r.name ?? '')));
        await ping(code, s.version);
        return json({ ok: true, code, token: out.token, seat: out.seat, lobby: core.lobbyView(s, out.seat) });
      }
      case 'lobby': case 'view': {
        const rows = await sql`select data from bloodlines.sessions where code = ${code}`;
        if (!rows.length) throw new core.GameError('No game with that code.');
        const s = rows[0].data;
        const seat = core.seatOf(s, String(r.token));
        if (s.setup && (s.status === 'active' || s.status === 'ended')) return json({ ok: true, lobby: core.lobbyView(s, seat), game: core.gameView(s, seat) });
        return json({ ok: true, lobby: core.lobbyView(s, seat) });
      }
      case 'vote': case 'start': case 'pick': case 'answer': case 'bot': case 'leave': {
        const { s, out } = await withSession(code, s => {
          const seat = core.seatOf(s, String(r.token));
          if (r.op === 'vote') core.vote(s, seat, !!r.pick);
          if (r.op === 'start') core.startSession(env, s, seat);
          if (r.op === 'pick') core.pickHouse(env, s, seat, r.house);
          if (r.op === 'answer') core.answer(s, seat, Number(r.index), Number(r.at));
          if (r.op === 'bot') core.botStep(s, Number(r.at));
          if (r.op === 'leave') core.leaveSession(s, seat);
          return seat;
        });
        await ping(code, s.version);
        if (r.op === 'leave') return json({ ok: true });
        if (s.setup && (s.status === 'active' || s.status === 'ended')) return json({ ok: true, lobby: core.lobbyView(s, out), game: core.gameView(s, out) });
        return json({ ok: true, lobby: core.lobbyView(s, out) });
      }
      default:
        return json({ ok: false, error: 'Unknown request.' }, 400);
    }
  } catch (e) {
    const known = core && e instanceof core.GameError;
    const msg = known ? e.message : 'Something went wrong on the server.';
    if (!known) console.error(e);
    return json({ ok: false, error: msg }, known ? 200 : 500);
  }
});
