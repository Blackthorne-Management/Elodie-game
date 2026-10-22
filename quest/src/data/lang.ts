// The phrasebook glossary (guide 8): every word in another language the quest uses, with a
// translation and whether a native or fluent speaker has checked it. `npm run audit:lang` lists the
// unverified ones.

import arabic from './lang/arabic.json' with { type: 'json' };
import french from './lang/french.json' with { type: 'json' };
import japanese from './lang/japanese.json' with { type: 'json' };
import kreyol from './lang/kreyol.json' with { type: 'json' };
import mongolian from './lang/mongolian.json' with { type: 'json' };
import norse from './lang/norse.json' with { type: 'json' };
import spanish from './lang/spanish.json' with { type: 'json' };
import taino from './lang/taino.json' with { type: 'json' };

export interface GlossaryEntry {
  word: string;
  language: string;
  translation: string;
  verified: boolean;
}

export interface Glossary {
  language: string;
  note?: string;
  entries: GlossaryEntry[];
}

export const GLOSSARIES: readonly Glossary[] = [kreyol as Glossary, taino as Glossary, spanish as Glossary, arabic as Glossary, french as Glossary, mongolian as Glossary, norse as Glossary, japanese as Glossary];
