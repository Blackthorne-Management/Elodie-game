// Run with `npm run analyse`: plays many bot games and prints a design report (length, endings,
// house and seat balance, challenges, deaths, resource sources, card and ability usage).
// Skipped in the normal test run.
import { it } from 'vitest';
import { CONTENT } from '../src/data';
import { Runner } from '../src/engine/runner';
import { makeRng } from '../src/engine/rng';
import { botChoose } from '../src/ai/bot';
import { THRESHOLDS, TUNING } from '../src/config';

declare const process: { env: Record<string, string | undefined> };

const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : '–');
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const med = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)] ?? 0; };

it.skipIf(!process.env.ANALYSE)('design report', () => {
  const N = Number(process.env.GAMES ?? 300);
  // Optional experiment knobs, e.g. TILE=3/2 CAP=3 SPECTER=5 SINGLE=7/8 COMBINED=8/10 FLAT_HP=3 PLAYERS=4,8 npm run analyse
  const env = process.env;
  if (env.TILE) [TUNING.tileAlone, TUNING.tileShared] = env.TILE.split('/').map(Number);
  if (env.CAP) TUNING.maxDamage = Number(env.CAP);
  if (env.SPECTER) TUNING.specterChoices = Number(env.SPECTER);
  if (env.SINGLE) [THRESHOLDS.small.single, THRESHOLDS.normal.single] = env.SINGLE.split('/').map(Number);
  if (env.FLAT_HP) for (const h of Object.values(CONTENT.houses)) h.hp = h.hp.map(() => Number(env.FLAT_HP)) as typeof h.hp;
  if (env.COMBINED) [THRESHOLDS.small.combined, THRESHOLDS.normal.combined] = env.COMBINED.split('/').map(Number);
  const cardPlays: Record<string, number> = {};
  const instantDraws: Record<string, number> = {};
  const blockPlays: Record<string, number> = {};
  const abilityUses: Record<string, number> = {};
  const cardsSeen: Record<string, number> = {};
  let gainsTile = 0, gainsOther = 0;
  const lines: string[] = [];

  for (const n of (env.PLAYERS ?? '2,3,4,6,8').split(',').map(Number)) {
    const wins: Record<string, number> = {}, seats: Record<string, number> = {};
    const rounds: number[] = [], deaths: number[] = [], specters: number[] = [], turnsPerGame: number[] = [];
    let claims = 0, sudden = 0, challenges = 0, claimantSurvived = 0, failedClaims = 0, reckonings = 0;
    let turns = 0, attackTurns = 0, cardTurns = 0, idleTurns = 0;
    let specterTurns = 0, specterPlays = 0;
    let firstWinRound: number[] = [];
    for (let seed = 1; seed <= N; seed++) {
      const r = new Runner({ seed: seed * 7919 + n, seats: Array.from({ length: n }, (_, i) => ({ name: `P${i}`, isBot: true })) }, CONTENT);
      const rng = makeRng(seed ^ 0xabc);
      while (!r.over) r.answer(botChoose(r.game, r.pending!, rng));
      const s = r.state;
      const w = s.players[s.winner!];
      wins[w.house] = (wins[w.house] ?? 0) + 1;
      const seat = s.order.indexOf(w.id);
      seats[seat] = (seats[seat] ?? 0) + 1;
      rounds.push(s.round);
      if (/Sudden Death/.test(s.endReason!)) sudden++; else { claims++; firstWinRound.push(s.round); }
      deaths.push(s.log.filter(e => e.kind === 'death').length);
      specters.push(s.players.filter(p => p.specter).length);
      reckonings += s.log.filter(e => e.kind === 'reckoning').length;

      // Per-turn activity.
      let cur: { player: number; acted: 'attack' | 'card' | null; specter: boolean } | null = null;
      const close = () => {
        if (!cur) return;
        if (cur.specter) return;
        turns++;
        if (cur.acted === 'attack') attackTurns++; else if (cur.acted === 'card') cardTurns++; else idleTurns++;
      };
      let turnCount = 0;
      for (const e of s.log) {
        if (e.kind === 'turn') { close(); turnCount++; cur = { player: e.player!, acted: null, specter: false }; }
        if (e.kind === 'specter' && e.player !== undefined) {
          if (/unleashes/.test(e.text)) specterPlays++;
          specterTurns++;
          if (cur?.player === e.player) cur.specter = true;
        }
        if (cur && e.player === cur.player && e.kind === 'attack' && e.tag === 'basic') cur.acted = cur.acted ?? 'attack';
        if (cur && e.player === cur.player && e.kind === 'card') cur.acted = cur.acted ?? 'card';
        if (e.kind === 'card' && e.cards) for (const c of e.cards) cardPlays[CONTENT.cards[c - 1].name] = (cardPlays[CONTENT.cards[c - 1].name] ?? 0) + 1;
        if (e.kind === 'instant' && e.cards) for (const c of e.cards) instantDraws[CONTENT.cards[c - 1].name] = (instantDraws[CONTENT.cards[c - 1].name] ?? 0) + 1;
        if (e.kind === 'block' && e.cards) for (const c of e.cards) blockPlays[CONTENT.cards[c - 1].name] = (blockPlays[CONTENT.cards[c - 1].name] ?? 0) + 1;
        if (e.kind === 'drawPrivate' && e.cards) for (const c of e.cards) cardsSeen[CONTENT.cards[c - 1].name] = (cardsSeen[CONTENT.cards[c - 1].name] ?? 0) + 1;
        if (e.kind === 'ability' && / uses /.test(e.text)) { const a = e.text.split(' uses ')[1].replace(/\.$/, ''); abilityUses[a] = (abilityUses[a] ?? 0) + 1; }
        if (e.kind === 'challenge') challenges++;
        if (e.kind === 'claim' && /claim fails/.test(e.text)) failedClaims++;
        if (e.kind === 'gain') { if (/ tile\)/.test(e.text)) gainsTile++; else gainsOther++; }
      }
      close();
      turnsPerGame.push(turnCount);
      if (/defeated every challenger/.test(s.endReason!)) claimantSurvived++;
    }
    const houseLine = Object.entries(wins).sort((a, b) => b[1] - a[1]).map(([h, c]) => `${h} ${pct(c, N)}`).join(', ');
    const seatLine = Array.from({ length: n }, (_, i) => `${i + 1}:${pct(seats[i] ?? 0, N)}`).join(' ');
    lines.push(`\n=== ${n} players (${N} games) ===`,
      `Length: median ${med(rounds)} rounds (avg ${avg(rounds).toFixed(1)}), ~${Math.round(avg(turnsPerGame))} turns per game`,
      `Endings: Throne claim ${pct(claims, N)}, Sudden Death ${pct(sudden, N)}; claim median round ${med(firstWinRound)}`,
      `Challenges per game ${(challenges / N).toFixed(2)}; claims that failed ${(failedClaims / N).toFixed(2)}/game; wins after beating challengers ${pct(claimantSurvived, N)}`,
      `Deaths per game ${avg(deaths).toFixed(1)}; Specters per game ${avg(specters).toFixed(2)}; Reckonings per game ${(reckonings / N).toFixed(2)}`,
      `Turn actions: attack ${pct(attackTurns, turns)}, card ${pct(cardTurns, turns)}, neither ${pct(idleTurns, turns)}`,
      `Specter turns ${specterTurns}, of which mischief played ${pct(specterPlays, specterTurns)}`,
      `House wins: ${houseLine}`,
      `Win by seat order: ${seatLine}`);
  }
  const top = (o: Record<string, number>, k = 8) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k).map(([x, c]) => `${x} ${c}`).join(', ');
  const handNames = CONTENT.cards.filter(c => c.kind === 'hand' && !c.responseOnly).map(c => c.name);
  const playRate = handNames.map(nm => [nm, (cardPlays[nm] ?? 0) / Math.max(1, cardsSeen[nm] ?? 0)] as const).sort((a, b) => a[1] - b[1]);
  lines.push('\n=== Across all games ===',
    `Resource gains from tiles ${pct(gainsTile, gainsTile + gainsOther)}, from cards/events/abilities ${pct(gainsOther, gainsTile + gainsOther)}`,
    `Most played Hand Cards: ${top(cardPlays)}`,
    `Least played when held (plays per draw): ${playRate.slice(0, 10).map(([x, r]) => `${x} ${r.toFixed(2)}`).join(', ')}`,
    `Block/Deflect used: ${top(blockPlays, 9)}`,
    `Abilities used: ${top(abilityUses, 20)}`);
  console.log(lines.join('\n'));
}, 3_600_000);
