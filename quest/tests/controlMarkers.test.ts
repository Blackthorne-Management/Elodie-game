// Puzzle controls' sparkles (the Nov 1 playtest, ch1-4 finding 16: about ten sparkles in the guild vault, because a
// weight hung and taken off is "news" every time). A set of controls shows one sparkle until any of it is used, then
// none (data/content.ts controlSet; Claude's call, Nov 4). Things that are not controls keep the usual rule.

import { describe, expect, it } from 'vitest';
import { seenFlag } from '../src/engine/game.ts';
import { loadMaps, newGameSim } from '../tools/sim-setup.ts';

const maps = loadMaps();

/** The vault once the memory has said the price (before it the weights do not sparkle: the review's 13, below). */
function vault() {
  const sim = newGameSim(maps, 'aldoria-vault', 'stair');
  sim.logic.state.flags.set('story.vault_echo', true);
  return sim.logic;
}

const weights = (ids: string[]) => ids.filter((id) => /^obj:weight_\d+(_hung)?$/.test(id));

describe('puzzle controls: one sparkle for the set, until it is first used', () => {
  it('the vault: one weight sparkles before any is used, not five', () => {
    const logic = vault();
    const ids = logic.markers().map((m) => m.id);
    expect(weights(ids)).toHaveLength(1);
    // The rest of the vault (the page, the pan, the door) keeps its own sparkles.
    expect(ids).toContain('obj:ledger_page');
  });

  it('once any weight has been used, no weight sparkles, though each is still "news"', () => {
    const logic = vault();
    logic.state.flags.set(seenFlag('aldoria-vault', 'weight_4'), true);
    expect(weights(logic.markers().map((m) => m.id))).toHaveLength(0);
    expect(logic.hasNews('vault_weight_1')).toBe(true);
  });
});

// The Nov 7 review's 13: six sparkles at the vault's door. A puzzle's later steps wait for the earlier one
// (data/content.ts markAfter; Claude's call, Nov 10).
describe("a puzzle's later steps sparkle once the step before them is done", () => {
  const ids = (logic: ReturnType<typeof vault>) => logic.markers().map((m) => m.id).filter((id) => id.startsWith('obj:')).sort();

  it('the vault at its start: only the ledger page, the first thing needed', () => {
    const logic = newGameSim(maps, 'aldoria-vault', 'stair').logic;
    expect(ids(logic)).toEqual(['obj:ledger_page']);
  });

  it('after the memory: the pan, the door and one weight; after the door: the strongroom; after the sun: the chest', () => {
    const logic = newGameSim(maps, 'aldoria-vault', 'stair').logic;
    const flags = logic.state.flags;
    flags.set('story.vault_echo', true);
    expect(ids(logic)).toEqual(['obj:balance_door', 'obj:balance_pan', 'obj:ledger_page', 'obj:weight_1']);
    flags.set('story.vault_outer', true);
    expect(ids(logic)).toEqual(expect.arrayContaining(['obj:box_seven', 'obj:sun_lock', 'obj:vault_boxes']));
    expect(ids(logic)).not.toContain('obj:witness_chest');
    flags.set('story.vault_inner', true);
    expect(ids(logic)).toContain('obj:witness_chest');
  });
});
