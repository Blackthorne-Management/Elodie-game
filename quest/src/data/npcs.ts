// NPC definitions. Maps place NPCs by id (the `npc` property on an object in the `npcs` layer).

import type { NpcDef } from '../engine/content.ts';

export type { NpcDef };

const n = (id: string, look: string = id, dialogue = `${id}_talk`): NpcDef => ({ id, look, dialogue });

export const NPCS: Readonly<Record<string, NpcDef>> = {
  // Test village (Phase 1).
  villager: n('villager', 'villager', 'villager_talk'),
  keeper: n('keeper', 'keeper', 'keeper_talk'),
  fisher: n('fisher', 'fisher', 'fisher_talk'),

  // Zetwal.
  elodie: n('elodie'),
  anicette: n('anicette'),
  patricio_old: n('patricio_old'),
  yari: n('yari'),
  gaze_keeper: n('gaze_keeper'),
  soup_vendor: n('soup_vendor'),
  recruiter_a: n('recruiter_a', 'recruiter'),
  recruiter_b: n('recruiter_b', 'recruiter'),
  town_guard: n('town_guard'),
  festival_kid: n('festival_kid'),
  elder: n('elder'),
  ferryman: n('ferryman'),
  pilgrim: n('pilgrim'),
  acolyte: n('acolyte'),
  temple_porter: n('temple_porter', 'acolyte'),
  mourner: n('mourner'),
  fisher_island: n('fisher_island', 'ferryman'),
  echo_soldier: n('echo_soldier', 'echo_soldier'),
  echo_cook: n('echo_cook'),
  echo_scout: n('echo_scout', 'echo_soldier'),
  echo_sentry: n('echo_sentry', 'echo_soldier'),
  echo_drummer: n('echo_drummer', 'echo_cook'),
  echo_aide: n('echo_aide'),
  echo_messenger: n('echo_messenger'),
  echo_guard: n('echo_guard', 'echo_soldier'),
  echo_builder: n('echo_builder'),
  echo_lampwright: n('echo_lampwright', 'echo_builder'),
};

export const NPC_IDS: readonly string[] = Object.keys(NPCS);
