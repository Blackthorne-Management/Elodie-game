// All game content the engine runs, in one object. Node-safe (no Vite-only imports), so the tests,
// the map tools and the smoke test can load it too.

import type { GameContent } from '../engine/content.ts';
import { flagsSetBy } from '../engine/dialogue.ts';
import type { ValidationContext } from '../engine/mapValidation.ts';
import { OBJECT_ART, TILESET } from '../assets.config.ts';
import { CARDS } from './cards.ts';
import { DEBATE_MEDIATE_INFLUENCE } from '../config.ts';
import { globalPillar, localPillar, type Pillar } from '../engine/rpg.ts';
import { stabilityTick } from '../engine/stability.ts';
import type { FlagReader } from '../engine/flags.ts';
import { STABILITY_HOUSES } from './claim.ts';
import { musterTick } from '../engine/ally.ts';
import { warTick } from '../engine/war.ts';
import { DEBATE_DIALOGUES } from './debates.ts';
import { DIALOGUE, DIALOGUE_IDS } from './dialogue.ts';
import { RPG } from './rpg.ts';
import { RHYTHMS } from './rhythms.ts';
import { ENCOUNTERS } from './encounters.ts';
import { MESSAGES } from './messages.ts';
import { NPCS, NPC_IDS } from './npcs.ts';
import { DOORS, OBJECTS } from './objects.ts';
import { SPEAKERS } from './speakers.ts';
import { SCREENS } from './kuroshi.ts';
import { cashCoupon, reactSecrets, stepSecrets } from './secrets.ts';

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
  rhythms: RHYTHMS,
  rotors: { [SCREENS.id]: SCREENS },
  debateContext: (flags, def) => ({ influence: localPillar(flags, RPG, 'influence', def.city), mediateNeeds: DEBATE_MEDIATE_INFLUENCE }),
  afterDialogue: (flags) => {
    musterTick(flags, RPG);
    warTick(flags);
    // Chapter 12: once the Hearing's verdict is given, the Accord's Stability and the ending (engine/stability.ts).
    stabilityTick(flags, STABILITY_HOUSES);
  },
  // The secret items' puzzles (data/secrets.ts): the jars, the tower clock, the singing floor.
  react: reactSecrets,
  onStep: stepSecrets,
  // The Sakk of Yusuf (Chapter 4): Samira's coupon, once a chapter, at a shop.
  beforeShop: cashCoupon,
  formatText,
  // The Hearing (the Epilogue) fills the Throne Hall: only what still has something to say keeps its marker there, not
  // every chair and door seen or not (the Nov 1 playtest's 12; Claude's call, Nov 1).
  quietMarkers: (mapId, flags) => mapId === 'seat-hall' && !!flags.get('story.hearing_called'),
  // Puzzle controls worked again and again (a weight hung and taken off, a mirror turned, a screen pushed): each use
  // changes a flag, so without this every one sparkled for good (the Nov 1 playtest's 16: about ten in the guild vault).
  // A set shows one sparkle until any of it is first used, then none (Claude's call, Nov 4).
  controlSet: (dialogueId) => CONTROL_SETS.find(([re]) => re.test(dialogueId))?.[1],
};

/** The puzzle controls' sets, by their dialogue: a pattern and the set's name. */
const CONTROL_SETS: readonly (readonly [RegExp, string])[] = [
  [/^vault_weight_\d+$/, 'vault_weights'],
  [/^forge_gate_[abc]$/, 'forge_gates'],
  [/^roof_mirror_\d+$/, 'roof_mirrors'],
  [/^screen_push_\d+$/, 'file_screens'],
  [/^marsh_post_\d+$/, 'marsh_posts'],
  [/^cabinet_\d+$/, 'keep_cabinets'],
  [/^tower_winder$/, 'tower_winder'],
];

/**
 * The names a line may read from the save as it is shown (Chapter 12): the realm's three pillars at the Master of the Chairs'
 * count, and the Accord's Stability in the Journal after the verdict.
 */
function formatText(text: string, flags: FlagReader): string {
  // `{v:<flag>}`: a flag's value as it stands (the jars, the clock's face; data/secrets.ts).
  text = text.replace(/\{v:([a-z0-9_.]+)\}/g, (whole: string, name: string) => {
    const v = flags.get(name);
    return typeof v === 'number' || (typeof v === 'string' && v) ? String(v) : whole;
  });
  return text.replace(/\{(realm\.(influence|wealth|fear)|stability\.score)\}/g, (whole: string, name: string, pillar?: string) => {
    if (pillar) {
      const keys = 'snapshot' in flags && typeof flags.snapshot === 'function' ? Object.keys((flags as { snapshot: () => object }).snapshot()) : [];
      return String(globalPillar(flags, RPG, pillar as Pillar, keys));
    }
    const v = flags.get(name);
    return typeof v === 'number' ? String(v) : whole;
  });
}

/** What the map validator needs to know about the content. */
export function validationContext(): ValidationContext {
  return {
    npcIds: NPC_IDS,
    dialogueIds: [...DIALOGUE_IDS, ...Object.keys(DEBATE_DIALOGUES)],
    objectKinds: [...TILESET.tiles.map((t) => t.name), ...Object.keys(OBJECT_ART)],
    dialogueSets: Object.fromEntries(Object.entries(DIALOGUE).map(([id, d]) => [id, flagsSetBy(d)])),
  };
}
