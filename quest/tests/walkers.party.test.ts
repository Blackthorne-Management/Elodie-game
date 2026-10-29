// Who walks the map behind Gianna (owner, Oct 29): Anissa and Azzy, and one companion, the newest member, then Yari
// again from Chapter 10 (engine/rpg.ts walkingCompanion).

import { describe, expect, it } from 'vitest';
import { WALKING_COMPANIONS } from '../src/config.ts';
import { RPG } from '../src/data/rpg.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { partyMembers, walkingCompanion } from '../src/engine/rpg.ts';

const flagsFor = (...set: string[]) => {
  const f = new FlagStore();
  for (const k of set) f.set(k, true);
  return f;
};
// The flag that brings each member in (data/rpg.ts MEMBERS joins).
const joinFlag = (id: string): string[] => [id === 'yari' ? 'story.yari_asked' : `party.${id}`];

describe('the walking companion', () => {
  it('is nobody before anyone but Anissa has joined', () => {
    expect(walkingCompanion(flagsFor('party.anissa'), RPG, WALKING_COMPANIONS)).toBe(null);
  });

  it('is the newest member, then Yari again once Chapter 9 is done', () => {
    const order = WALKING_COMPANIONS;
    const set: string[] = ['party.anissa', 'party.azzy'];
    for (const id of order) {
      set.push(...joinFlag(id));
      const f = flagsFor(...set);
      expect(partyMembers(f, RPG, 'present').some((m) => m.id === id), `${id} joins`).toBe(true);
      expect(walkingCompanion(f, RPG, order), id).toBe(id);
    }
    expect(walkingCompanion(flagsFor(...set, 'act9.complete'), RPG, order)).toBe('yari');
  });
});
