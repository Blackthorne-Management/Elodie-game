// All game content the engine runs, in one object. Node-safe (no Vite-only imports), so the tests,
// the map tools and the smoke test can load it too.

import type { GameContent } from '../engine/content.ts';
import { flagsSetBy } from '../engine/dialogue.ts';
import type { ValidationContext } from '../engine/mapValidation.ts';
import { TILESET } from '../assets.config.ts';
import { CARDS } from './cards.ts';
import { DIALOGUE, DIALOGUE_IDS } from './dialogue.ts';
import { MESSAGES } from './messages.ts';
import { NPCS, NPC_IDS } from './npcs.ts';
import { SPEAKERS } from './speakers.ts';

export const CONTENT: GameContent = {
  npcs: NPCS,
  dialogue: DIALOGUE,
  speakers: SPEAKERS,
  cards: CARDS,
  messages: MESSAGES,
};

/** What the map validator needs to know about the content. */
export function validationContext(): ValidationContext {
  return {
    npcIds: NPC_IDS,
    dialogueIds: DIALOGUE_IDS,
    objectKinds: TILESET.tiles.map((t) => t.name),
    dialogueSets: Object.fromEntries(Object.entries(DIALOGUE).map(([id, d]) => [id, flagsSetBy(d)])),
  };
}
