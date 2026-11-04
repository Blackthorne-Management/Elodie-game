// Puzzle controls' sparkles (the Nov 1 playtest, ch1-4 finding 16: about ten sparkles in the guild vault, because a
// weight hung and taken off is "news" every time). A set of controls shows one sparkle until any of it is used, then
// none (data/content.ts controlSet; Claude's call, Nov 4). Things that are not controls keep the usual rule.

import { describe, expect, it } from 'vitest';
import { seenFlag } from '../src/engine/game.ts';
import { loadMaps, newGameSim } from '../tools/sim-setup.ts';

const maps = loadMaps();

function vault() {
  const sim = newGameSim(maps, 'aldoria-vault', 'stair');
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
