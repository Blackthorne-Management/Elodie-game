// Run with `npm run print` (and every print:* script): writes the card, house and rule text to print/.data.json for
// scripts/print-*.cjs, which lay the art, overlays, symbols and text out as print-ready files. Skipped in the normal
// test run.
import { expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { CARDS } from '../src/data/cards';
import { GEN_NOTES, HOUSES } from '../src/data/houses';
import { CATEGORY_ART, HOUSE_ART, PORTRAIT_CROP, PRINT_ART } from '../src/assets.config';
import { GRITO_MARKERS, SUDDEN_DEATH_ROUND } from '../src/config';
import { RULES, RULE_PARTS } from '../src/data/rules';
import { cardTiming } from '../src/ui/cardKind';

declare const process: { env: Record<string, string | undefined> };

it.skipIf(!process.env.PRINT)('export card and house text', () => {
  const data = {
    suddenDeathRound: SUDDEN_DEATH_ROUND,
    gritoMarkers: GRITO_MARKERS,
    printArt: PRINT_ART,
    portraitCrop: PORTRAIT_CROP,
    ruleParts: RULE_PARTS,
    rules: RULES,
    cards: CARDS.map(c => ({
      id: c.id, name: c.name, kind: c.elodie ? 'elodie' : c.kind, category: c.category, text: c.text, flavor: c.flavor ?? '',
      icon: CATEGORY_ART[c.category]?.icon ?? '',
      when: cardTiming(c), reaction: !!c.reaction, targets: !!c.targets,
    })),
    houses: Object.values(HOUSES).map(h => ({
      id: h.id, name: h.name, heirs: h.heirs, homeland: h.homeland, hp: h.hp, passiveName: h.passiveName, passiveText: h.passiveText,
      downsideText: h.downsideText ?? '', notes: GEN_NOTES[h.id] ?? {},
      abilities: h.abilities.map(a => ({ id: a.id, gen: a.gen, name: a.name, text: a.text, limit: a.limit })),
      // The Legacy card's text (rules-decisions 87: Brasador's reads differently when another house holds it).
      legacyText: h.legacyPassive?.text ?? h.passiveText[0], identity: h.identity, lore: h.lore,
      passiveAbility: h.passiveAbility ? { gen: h.passiveAbility.gen, name: h.passiveAbility.name, text: h.passiveAbility.text, limit: h.passiveAbility.limit } : null,
      color: HOUSE_ART[h.id].color, initial: HOUSE_ART[h.id].initial, home: h.home, tileType: h.tileType,
    })),
  };
  mkdirSync('print', { recursive: true });
  writeFileSync('print/.data.json', JSON.stringify(data, null, 1));
});

// The print scripts read these from the rule text; if a rewording breaks one, fail here rather than in a print run.
it('the rule text the print files read is still there', () => {
  const ref = RULES.find(r => r.part === 'reference');
  expect(ref?.blocks.some(b => typeof b === 'object' && 'steps' in b)).toBe(true);           // player boards: the turn
  expect(ref?.blocks.some(b => typeof b === 'string' && /^Free/.test(b))).toBe(true);        // player boards: free extras
  const lists = RULES.flatMap(r => r.blocks).flatMap(b => (typeof b === 'object' && 'list' in b ? b.list : []));
  expect(lists.some(s => /^\*\*The score pad:\*\*/.test(s))).toBe(true);                    // score pad footnote
  expect(lists.some(s => /^For \*\*2 to 8/.test(s))).toBe(true);                            // rulebook back cover
  expect(Object.values(HOUSES).filter(h => /\bLegacy\b/.test(h.passiveText[0]))).toHaveLength(1); // Legacy cards' holder
});
