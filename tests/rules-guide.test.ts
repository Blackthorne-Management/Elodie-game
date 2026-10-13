import { describe, expect, it } from 'vitest';
import { RULES } from '../src/data/rules';
import { SUDDEN_DEATH_ROUND, THRESHOLDS, TUNING } from '../src/config';
import { CARDS } from '../src/data/cards';

const text = RULES.flatMap(s => s.blocks.flatMap(b => (typeof b === 'string' ? [b] : 'quote' in b ? [b.quote] : 'list' in b ? b.list : b.steps))).join('\n');

describe('rule guide', () => {
  it('has unique section ids and no unfilled numbers', () => {
    expect(new Set(RULES.map(s => s.id)).size).toBe(RULES.length);
    expect(text).not.toMatch(/undefined|NaN|\$\{/);
    expect(text.split('**').length % 2).toBe(1);           // bold markers come in pairs
  });
  it('quotes the numbers the game plays by', () => {
    expect(text).toContain(`round ${SUDDEN_DEATH_ROUND}`);
    expect(text).toContain(`${THRESHOLDS.normal.combined} in total`);
    expect(text).toContain(`${THRESHOLDS.small.combined} in total`);
    expect(text).toContain(`**${TUNING.tileAlone}**`);
  });
  it('names every Instant a Specter cannot pick, and every lasting card', () => {
    const line = text.split('\n').find(l => l.startsWith('**Never damage:**'))!;
    for (const c of CARDS.filter(x => x.noSpecter)) expect(line).toContain(c.name);
    for (const name of ['Hex of Withering', 'Confusion', 'Forced March', 'Sabotage', 'Burn the Village', 'Golden Harvest',
      'Ceasefire', 'Blood Pact', 'Uneasy Truce', 'Dread Banner', 'Marked for Death', 'Plunder', 'Vanishing Act', 'Shield Wall']) {
      expect(text).toContain(name);
    }
  });
});
