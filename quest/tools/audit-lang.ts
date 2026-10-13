// Phrasebook audit (guide Section 9, check 5): lists every glossary entry not yet checked by a
// native or fluent speaker. `npm run audit:lang`. Informational: it always exits 0.

import { GLOSSARIES } from '../src/data/lang.ts';

const pending = GLOSSARIES.flatMap((g) => g.entries.filter((e) => !e.verified));
if (pending.length === 0) console.log('Every phrasebook entry is verified.');
else {
  console.log(`${pending.length} phrasebook entr${pending.length === 1 ? 'y needs' : 'ies need'} checking by a fluent speaker:`);
  for (const e of pending) console.log(`  - [${e.language}] ${e.word}: ${e.translation}`);
}
