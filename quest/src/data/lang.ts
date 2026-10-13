// The phrasebook glossary (guide 8): every word in another language the quest uses, with a
// translation and whether a native or fluent speaker has checked it. `npm run audit:lang` lists the
// unverified ones.

import kreyol from './lang/kreyol.json' with { type: 'json' };

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

export const GLOSSARIES: readonly Glossary[] = [kreyol as Glossary];
