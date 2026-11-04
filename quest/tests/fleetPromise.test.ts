// S-2's promise to Hrafn pays off (Claude's call, Nov 4): at the Muster he holds the envoy to it, and after the Claim
// the Master of the Chairs puts the blockade's cost first on the register; both only for a player who made it.

import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/data/content.ts';

const lines = (scriptId: string) => Object.values(CONTENT.dialogue[scriptId]!.nodes).flatMap((n) => n.lines);
const gated = (scriptId: string, words: string) => lines(scriptId).filter((l) => l.text.includes(words));

describe('the blockade promise (S-2)', () => {
  it('the Muster and the Claim speak of it only when Hrafn took the promise', () => {
    const found = [
      ...CONTENT.dialogue && Object.keys(CONTENT.dialogue).flatMap((id) => gated(id, 'In the Moot you said the Throne pays')),
      ...gated('chamberlain_claim_talk', 'three winters of blockade'),
    ];
    expect(found.length).toBe(2);
    for (const l of found) expect(l.if).toEqual({ flag: 'side.fleet.hrafn' });
  });
});
