// NPC definitions. Maps place NPCs by id (the `npc` property on an object in the `npcs` layer).

export interface NpcDef {
  id: string;
  /** Sprite key in assets.config.ts NPC_SPRITES. */
  look: string;
  /** Dialogue id in data/dialogue.ts. */
  dialogue: string;
}

export const NPCS: Readonly<Record<string, NpcDef>> = {
  villager: { id: 'villager', look: 'villager', dialogue: 'villager_talk' },
  keeper: { id: 'keeper', look: 'keeper', dialogue: 'keeper_talk' },
  fisher: { id: 'fisher', look: 'fisher', dialogue: 'fisher_talk' },
};

export const NPC_IDS: readonly string[] = Object.keys(NPCS);
