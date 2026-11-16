// A local stand-in for the online game server (supabase/functions/bloodlines), for testing without Supabase:
// same requests, sessions kept in memory, no live channel (the app polls). Run: node scripts/dev-server.mjs
// then open the app with ?server=http://localhost:8787
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { randomUUID, randomInt } from 'node:crypto';

const core = new Function(`${readFileSync(new URL('../public/server/core.js', import.meta.url), 'utf8')}\nreturn BloodlinesCore;`)();
const sessions = new Map();
const env = { rand: () => randomInt(0, 2 ** 31) / 2 ** 31, token: () => randomUUID(), now: () => Date.now() };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

function handle(r) {
  const code = r.code ? core.normCode(String(r.code)) : '';
  const get = () => { const s = sessions.get(code); if (!s) throw new core.GameError('No game with that code.'); return s; };
  const out = (s, seat) => (s.setup && (s.status === 'active' || s.status === 'ended'))
    ? { ok: true, lobby: core.lobbyView(s, seat), game: core.gameView(s, seat) } : { ok: true, lobby: core.lobbyView(s, seat) };
  switch (r.op) {
    case 'create': {
      const c = core.newCode(env);
      const { session, token } = core.createSession(env, c, String(r.name ?? ''), Number(r.total), Number(r.humans), r.mode === 'battle' ? 'battle' : 'race',
        r.suddenDeath === undefined ? undefined : Number(r.suddenDeath));
      sessions.set(c, session);
      return { ok: true, code: c, token, seat: 0, lobby: core.lobbyView(session, 0) };
    }
    case 'join': {
      const s = get();
      const { seat, token } = core.joinSession(env, s, String(r.name ?? ''));
      return { ok: true, code, token, seat, lobby: core.lobbyView(s, seat) };
    }
    case 'lobby': case 'view': { const s = get(); return out(s, core.seatOf(s, String(r.token))); }
    default: {
      const s = structuredClone(get());          // like a transaction: only saved if it worked
      const seat = core.seatOf(s, String(r.token));
      if (r.op === 'vote') core.vote(s, seat, !!r.pick);
      else if (r.op === 'start') core.startSession(env, s, seat);
      else if (r.op === 'pick') core.pickHouse(env, s, seat, r.house);
      else if (r.op === 'answer') core.answer(s, seat, Number(r.index), Number(r.at));
      else if (r.op === 'bot') core.botStep(s, Number(r.at));
      else if (r.op === 'leave') core.leaveSession(s, seat);
      else return { ok: false, error: 'Unknown request.' };
      sessions.set(code, s);
      return r.op === 'leave' ? { ok: true } : out(s, seat);
    }
  }
}

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(200, cors); res.end('ok'); return; }
  let body = '';
  req.on('data', d => (body += d));
  req.on('end', () => {
    let reply;
    try { reply = handle(JSON.parse(body)); } catch (e) {
      reply = { ok: false, error: e instanceof core.GameError ? e.message : 'Something went wrong on the server.' };
      if (!(e instanceof core.GameError)) console.error(e);
    }
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reply));
  });
}).listen(8787, () => console.log('dev game server on http://localhost:8787/bloodlines'));
