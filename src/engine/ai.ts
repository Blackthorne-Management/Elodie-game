import type { Battle, Choice } from './battle';
import type { Combatant } from './damage';
import { typeMultiplier } from './typeChart';
import { AI_HEAL_THRESHOLD } from '../config';

// Healers heal when an ally drops below half HP; everyone else uses their
// strongest ready move on the best target (type advantage, then lowest HP).
export function aiChoose(u: Combatant, b: Battle): Choice {
  const ready = u.moves.filter(m => (u.cooldowns[m.id] ?? 0) === 0);
  const allies = b.units.filter(x => x.side === u.side && x.hp > 0);
  const foes = b.units.filter(x => x.side !== u.side && x.hp > 0);

  const healMove = ready.find(m => m.effects.some(e => e.kind === 'heal'));
  if (healMove && allies.some(a => a.hp < a.maxHp * AI_HEAL_THRESHOLD)) return { moveId: healMove.id };

  const rank = { ultimate: 3, skill: 2, basic: 1 };
  const move = [...ready].sort((x, y) => rank[y.slot] - rank[x.slot])[0];
  const target = [...foes].sort((x, y) =>
    typeMultiplier(u.type, y.type) - typeMultiplier(u.type, x.type) || x.hp - y.hp)[0];
  return { moveId: move.id, targetKey: target?.key };
}
