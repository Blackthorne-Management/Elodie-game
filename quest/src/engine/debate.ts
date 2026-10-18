// Street debates (guide 7.2; owner approved Oct 16): two people of different faiths argue in public, and
// the player can Listen, Join (three rounds, answering each claim with an Appeal: Scripture, Reason when a
// lore book backs it, or Compassion), Mediate (with enough Influence in the city) or Provoke. Each debate
// is data (data/debates.ts); this builds the conversation for it from the flags at the moment the player
// walks up, and pays each outcome's reward once (settleDebates). Concord, the realm's harmony score, lives
// in the `concord` flag. Pure TypeScript; tests/debate.test.ts plays every outcome.

import { CONCORD_START, DEBATE_LISTEN_INFLUENCE, DEBATE_REWARDS, DEBATE_ROUNDS_TO_WIN } from '../config.ts';
import { evaluate, type Condition } from './conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from './dialogue.ts';
import type { FlagReader, FlagStore } from './flags.ts';

export type Appeal = 'scripture' | 'reason' | 'compassion';
export const APPEALS: readonly Appeal[] = ['scripture', 'reason', 'compassion'];
export const APPEAL_NAMES: Record<Appeal, string> = { scripture: 'Scripture', reason: 'Reason', compassion: 'Compassion' };

/** How well an answer lands: 2 wins the round, 1 splits the crowd, 0 loses it. */
export type Strength = 0 | 1 | 2;

export interface DebateAnswer {
  /** The choice, after the Appeal's name (at most 24 characters: a choice fits 36). */
  short: string;
  /** What Gianna says. */
  text: string;
  strength: Strength;
}

export interface DebateRound {
  /** The opponent's claim. */
  claim: string;
  answers: Record<Appeal, DebateAnswer>;
}

export interface DebateDef {
  id: string;
  /** The city whose Influence and Fear the debate moves. */
  city: string;
  /** The question argued, shown on the menu. */
  question: string;
  /** The speaker on the player's side and the opponent (speaker ids). */
  ally: string;
  opponent: string;
  /** Join, Mediate and Provoke wait for this (until then only the argument is heard in passing). */
  opensIf?: Condition;
  /** Heard in passing before the debate opens. */
  passing: readonly DialogueLine[];
  listen: readonly DialogueLine[];
  rounds: readonly DebateRound[];
  /** Reason is offered only when one of these lore flags is set (a book read that backs it up). */
  reasonNeeds: readonly string[];
  /** The crowd after each round, by the answer's strength. */
  crowd: Readonly<Record<Strength, string>>;
  won: readonly DialogueLine[];
  lost: readonly DialogueLine[];
  mediate: readonly DialogueLine[];
  provoke: readonly DialogueLine[];
  /** Once won or mediated, the two move on to this. */
  after: readonly DialogueLine[];
}

export type DebateOutcome = 'won' | 'mediated' | 'provoked';

/**
 * `joined`: Gianna argued all three rounds, won or lost (owner decision, Oct 18: Chapter 1's debate must be taken
 * part in before Yari sails; a lost debate counts as taking part).
 */
export const debateFlag = (id: string, what: 'listened' | 'joined' | DebateOutcome) => `debate.${id}.${what}`;
const paidFlag = (id: string, what: 'listened' | DebateOutcome) => `debate.${id}.paid.${what}`;

/** The realm's Concord (0 to 100). */
export function concord(flags: FlagReader): number {
  const v = flags.get('concord');
  return typeof v === 'number' ? v : CONCORD_START;
}

/** Whether the debate is settled (won or mediated): the two move on. */
export function debateResolved(flags: FlagReader, def: DebateDef): boolean {
  return isSet(flags, debateFlag(def.id, 'won')) || isSet(flags, debateFlag(def.id, 'mediated'));
}

function isSet(flags: FlagReader, name: string): boolean {
  const v = flags.get(name);
  return v !== undefined && v !== false && v !== 0 && v !== '';
}

export interface DebateContext {
  /** The player's Influence in the debate's city now. */
  influence: number;
  /** Influence needed to Mediate. */
  mediateNeeds: number;
}

/** The conversation for a debate as things stand (built each time the player walks up). */
export function debateScript(def: DebateDef, flags: FlagReader, ctx: DebateContext): DialogueScript {
  const nodes: Record<string, DialogueNode> = {};
  const id = `debate:${def.id}`;
  const nar = (text: string): DialogueLine => ({ speaker: '', text });

  if (debateResolved(flags, def)) return { id, start: 'after', nodes: { after: { lines: [...def.after] } } };
  if (def.opensIf && !evaluate(def.opensIf, flags)) return { id, start: 'passing', nodes: { passing: { lines: [...def.passing] } } };

  const canReason = def.reasonNeeds.some((f) => isSet(flags, f));
  const canMediate = ctx.influence >= ctx.mediateNeeds;
  const menu: DialogueChoice[] = [
    { text: 'Listen', next: 'listen' },
    { text: 'Join the debate', next: 'r0_0' },
    canMediate
      ? { text: 'Mediate', next: 'mediate' }
      : { text: `Mediate (needs Influence ${ctx.mediateNeeds} here)`, next: 'cannot_mediate' },
    { text: 'Provoke the crowd', next: 'provoke' },
    { text: 'Walk on' },
  ];
  nodes.menu = { lines: [nar(`A crowd has gathered. The question: ${def.question}`)], choices: menu };
  nodes.listen = { lines: [...def.listen], set: { [debateFlag(def.id, 'listened')]: true } };
  nodes.cannot_mediate = { lines: [nar(`(They will not hear a mediator yet. Influence in this city: ${ctx.influence} of ${ctx.mediateNeeds}.)`)], next: 'menu' };
  nodes.mediate = { lines: [...def.mediate], set: { [debateFlag(def.id, 'mediated')]: true } };
  nodes.provoke = { lines: [...def.provoke], set: { [debateFlag(def.id, 'provoked')]: true } };

  // Rounds: node r<i>_<wins so far>; an answer goes to a<i>_<appeal>_<wins>, then on to the next round.
  const last = def.rounds.length;
  for (let i = 0; i < last; i++) {
    const round = def.rounds[i]!;
    for (let wins = 0; wins <= i; wins++) {
      const choices = APPEALS.filter((a) => a !== 'reason' || canReason).map((a) => ({
        text: `${APPEAL_NAMES[a]}: ${round.answers[a].short}`,
        next: `a${i}_${a}_${wins}`,
      }));
      nodes[`r${i}_${wins}`] = {
        lines: [nar(`Round ${i + 1} of ${last}.`), { speaker: def.opponent, text: round.claim }],
        choices,
      };
      for (const a of APPEALS) {
        const ans = round.answers[a];
        const now = wins + (ans.strength === 2 ? 1 : 0);
        nodes[`a${i}_${a}_${wins}`] = {
          lines: [{ speaker: 'gianna', text: ans.text }, nar(def.crowd[ans.strength])],
          next: i + 1 < last ? `r${i + 1}_${now}` : now >= DEBATE_ROUNDS_TO_WIN ? 'won' : 'lost',
        };
      }
    }
  }
  nodes.won = { lines: [...def.won], set: { [debateFlag(def.id, 'won')]: true, [debateFlag(def.id, 'joined')]: true } };
  nodes.lost = { lines: [...def.lost], set: { [debateFlag(def.id, 'joined')]: true } };
  return { id, start: 'menu', nodes };
}

export interface DebatePayment {
  debate: DebateDef;
  outcome: 'listened' | DebateOutcome;
  text: string;
}

/**
 * Pay each outcome reached and not yet paid (once each): Listening the first time, a win, a mediation, a
 * provocation. `addPillar` adds to a pillar in a city; `addXp` gives the party XP.
 */
export function settleDebates(
  flags: FlagStore,
  debates: readonly DebateDef[],
  addPillar: (pillar: 'influence' | 'fear', city: string, n: number) => void,
  addXp: (n: number) => void,
): DebatePayment[] {
  const out: DebatePayment[] = [];
  for (const def of debates) {
    if (flags.isSet(debateFlag(def.id, 'listened')) && !flags.isSet(paidFlag(def.id, 'listened'))) {
      flags.set(paidFlag(def.id, 'listened'), true);
      addPillar('influence', def.city, DEBATE_LISTEN_INFLUENCE);
      out.push({ debate: def, outcome: 'listened', text: `+${DEBATE_LISTEN_INFLUENCE} Influence` });
    }
    for (const outcome of ['won', 'mediated', 'provoked'] as const) {
      if (!flags.isSet(debateFlag(def.id, outcome)) || flags.isSet(paidFlag(def.id, outcome))) continue;
      flags.set(paidFlag(def.id, outcome), true);
      const r = DEBATE_REWARDS[outcome];
      const bits: string[] = [];
      if (r.influence) {
        addPillar('influence', def.city, r.influence);
        bits.push(`+${r.influence} Influence`);
      }
      if (r.fear) {
        addPillar('fear', def.city, r.fear);
        bits.push(`+${r.fear} Fear`);
      }
      if (r.xp) {
        addXp(r.xp);
        bits.push(`+${r.xp} XP`);
      }
      if (r.concord) {
        flags.set('concord', Math.max(0, Math.min(100, concord(flags) + r.concord)));
        bits.push(`Concord ${r.concord > 0 ? '+' : ''}${r.concord}`);
      }
      out.push({ debate: def, outcome, text: bits.join(', ') });
    }
  }
  return out;
}
