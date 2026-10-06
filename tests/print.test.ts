// Run with `npm run print`: writes the card and house text to print/.data.json for scripts/print-cards.cjs,
// which lays the art, overlay, symbol and text out as print-ready card fronts. Skipped in the normal test run.
import { it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { CARDS } from '../src/data/cards';
import { HOUSES } from '../src/data/houses';
import { CATEGORY_ART, HOUSE_ART } from '../src/assets.config';
import { cardTiming } from '../src/ui/cardKind';

declare const process: { env: Record<string, string | undefined> };

it.skipIf(!process.env.PRINT)('export card and house text', () => {
  const data = {
    cards: CARDS.map(c => ({
      id: c.id, name: c.name, kind: c.elodie ? 'elodie' : c.kind, category: c.category, text: c.text, flavor: c.flavor ?? '',
      icon: CATEGORY_ART[c.category]?.icon ?? '',
      when: cardTiming(c),
    })),
    houses: Object.values(HOUSES).map(h => ({
      id: h.id, name: h.name, homeland: h.homeland, hp: h.hp, passiveName: h.passiveName, passiveText: h.passiveText,
      downsideText: h.downsideText ?? '', abilities: h.abilities.map(a => ({ gen: a.gen, name: a.name, text: a.text })),
      color: HOUSE_ART[h.id].color, initial: HOUSE_ART[h.id].initial,
    })),
  };
  mkdirSync('print', { recursive: true });
  writeFileSync('print/.data.json', JSON.stringify(data, null, 1));
});
