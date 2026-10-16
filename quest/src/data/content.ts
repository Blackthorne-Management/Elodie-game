// All game content the engine runs, in one object. Node-safe (no Vite-only imports), so the tests,
// the map tools and the smoke test can load it too.

import type { GameContent } from '../engine/content.ts';
import { flagsSetBy } from '../engine/dialogue.ts';
import type { ValidationContext } from '../engine/mapValidation.ts';
import { OBJECT_ART, TILESET } from '../assets.config.ts';
import { CARDS } from './cards.ts';
import { DEBATE_MEDIATE_INFLUENCE } from '../config.ts';
import { localPillar } from '../engine/rpg.ts';
import { DEBATE_DIALOGUES } from './debates.ts';
import { DIALOGUE, DIALOGUE_IDS } from './dialogue.ts';
import { RPG } from './rpg.ts';
import { ENCOUNTERS } from './encounters.ts';
import { MESSAGES } from './messages.ts';
import { NPCS, NPC_IDS } from './npcs.ts';
import { DOORS, OBJECTS } from './objects.ts';
import { SPEAKERS } from './speakers.ts';

export const CONTENT: GameContent = {
  npcs: NPCS,
  dialogue: DIALOGUE,
  speakers: SPEAKERS,
  cards: CARDS,
  messages: MESSAGES,
  objects: OBJECTS,
  doors: DOORS,
  encounters: ENCOUNTERS,
  debates: DEBATE_DIALOGUES,
  debateContext: (flags, def) => ({ influence: localPillar(flags, RPG, 'influence', def.city), mediateNeeds: DEBATE_MEDIATE_INFLUENCE }),
};

/** What the map validator needs to know about the content. */
export function validationContext(): ValidationContext {
  return {
    npcIds: NPC_IDS,
    dialogueIds: [...DIALOGUE_IDS, ...Object.keys(DEBATE_DIALOGUES)],
    objectKinds: [...TILESET.tiles.map((t) => t.name), ...Object.keys(OBJECT_ART)],
    dialogueSets: Object.fromEntries(Object.entries(DIALOGUE).map(([id, d]) => [id, flagsSetBy(d)])),
  };
}
