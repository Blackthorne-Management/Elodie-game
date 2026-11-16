// Which sound a game event makes, and which music fits the moment. Pure: no Web Audio, so it is unit tested.
// Only events the player may see reach here (the play screen filters hidden ones first), so no sound gives away a
// rival's hidden hand.
import type { LogEvent } from '../engine/types';
import type { SfxId } from './sfx';

export type MusicId = 'title' | 'realm' | 'stakes' | 'throne' | 'victory' | 'defeat' | 'sudden';

export function sfxFor(e: LogEvent, me: number, suddenDeathRound: number): SfxId | null {
  switch (e.kind) {
    case 'roll': return /rolls a/.test(e.text) ? 'dice' : null;
    case 'move': return 'step';
    case 'card': case 'reveal': return 'card';
    case 'instant': return 'instant';
    case 'damage': return 'hit';
    case 'block': case 'blocked': return 'block';
    case 'death': return 'death';
    case 'succession': return 'rise';
    case 'gain': return /Wealth/.test(e.text) ? 'wealth' : /Fear/.test(e.text) ? 'fear' : 'influence';
    case 'loss': return 'loss';
    case 'claim': return 'claim';
    case 'challenge': return 'challenge';
    case 'reckoning': return 'fear';
    case 'turn': return e.player === me ? 'chime' : null;
    // The last round before Sudden Death begins: the bell tolls.
    case 'round': return Number(/Round (\d+)/.exec(e.text)?.[1]) === suddenDeathRound ? 'toll' : null;
    case 'win': return /^Sudden Death/.test(e.text) ? 'toll' : 'win';
    default: return null;
  }
}

export interface MusicMoment {
  over: boolean;
  iWon: boolean;
  round: number;
  throne: boolean;          // a claim or its challenges are being fought
  anyoneEligible: boolean;  // someone could claim the Throne now
}
// Calm early on; rising stakes from round 10 or once anyone could claim; the Throne theme for a claim; an ending.
export const STAKES_ROUND = 10;
export function musicFor(m: MusicMoment): MusicId {
  if (m.over) return m.iWon ? 'victory' : 'defeat';
  if (m.throne) return 'throne';
  if (m.round >= STAKES_ROUND || m.anyoneEligible) return 'stakes';
  return 'realm';
}
