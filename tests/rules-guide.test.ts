import { describe, expect, it } from 'vitest';
import { RULES } from '../src/data/rules';
import { SUDDEN_DEATH_ROUND, THRESHOLDS, TUNING } from '../src/config';

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
});
