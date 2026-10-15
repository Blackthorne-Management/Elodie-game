// NPC definitions. Maps place NPCs by id (the `npc` property on an object in the `npcs` layer).

import type { NpcDef } from '../engine/content.ts';

export type { NpcDef };

/** An NPC: id, look (assets.config.ts NPC_SPRITES), the name label, and the dialogue (default `<id>_talk`). */
const n = (id: string, look: string, name: string, dialogue = `${id}_talk`): NpcDef => ({ id, look, name, dialogue });

export const NPCS: Readonly<Record<string, NpcDef>> = {
  // Test village (Phase 1).
  villager: n('villager', 'villager', 'Villager'),
  keeper: n('keeper', 'keeper', 'Temple Keeper'),
  fisher: n('fisher', 'fisher', 'Fisher'),

  // Zetwal.
  elodie: n('elodie', 'elodie', 'Elodie Limyè, Mother'),
  anicette: n('anicette', 'anicette', 'Grandmother Anicette'),
  patricio_old: n('patricio_old', 'patricio_old', 'Marshal Patricio, Grandfather'),
  yari: n('yari', 'yari', 'Yari'),
  gaze_keeper: n('gaze_keeper', 'gaze_keeper', 'Gaze keeper'),
  soup_vendor: n('soup_vendor', 'soup_vendor', 'Soup vendor'),
  recruiter_a: n('recruiter_a', 'quiet_crown_m_brown', 'Hooded stranger'),
  recruiter_b: n('recruiter_b', 'quiet_crown_f_tan', 'Hooded stranger'),
  town_guard: n('town_guard', 'town_guard', 'Town guard'),
  festival_kid: n('festival_kid', 'festival_kid', 'Small boy'),
  elder: n('elder', 'elder', 'Old neighbor'),
  ferryman: n('ferryman', 'ferryman', 'Ferryman'),
  pilgrim: n('pilgrim', 'pilgrim', 'Pilgrim'),
  acolyte: n('acolyte', 'acolyte', 'Acolyte'),
  temple_porter: n('temple_porter', 'acolyte', 'Temple porter'),
  archivist: n('archivist', 'archivist', 'Senior archivist'),
  // Vendors (data/rpg.ts SHOPS): their greeting, then the shop.
  smith: { ...n('smith', 'smith', 'Smith'), shop: 'zetwal_forge' },
  charm_seller: { ...n('charm_seller', 'charm_seller', 'Charm seller'), shop: 'zetwal_charms' },
  grocer: { ...n('grocer', 'grocer', 'Market vendor'), shop: 'zetwal_market' },
  hall_clerk: n('hall_clerk', 'clerk', 'Hall clerk'),
  // The Iron Market, the Old Harbor and Solèy Heights (owner decision, Oct 15).
  hall_guard: n('hall_guard', 'town_guard', 'Hall guard'),
  engraver: n('engraver', 'engraver', 'Engraver'),
  ironmonger: n('ironmonger', 'ironmonger', 'Ironmonger'),
  letter_writer: n('letter_writer', 'letter_writer', 'Letter writer'),
  foreign_envoy: n('foreign_envoy', 'foreign_envoy', 'Foreign envoy'),
  market_kid: n('market_kid', 'market_kid', 'Market girl'),
  fishwife: n('fishwife', 'fishwife', 'Fish seller'),
  net_mender: n('net_mender', 'net_mender', 'Net mender'),
  customs_clerk: n('customs_clerk', 'clerk', 'Customs clerk'),
  harbor_kid: n('harbor_kid', 'festival_kid', 'Harbor boy'),
  old_sailor: n('old_sailor', 'old_sailor', 'Old sailor'),
  ferry_hand: n('ferry_hand', 'ferryman', 'Ferry hand'),
  gardener: n('gardener', 'gardener', 'Gardener'),
  poet: n('poet', 'poet', 'Poet'),
  porch_widow: n('porch_widow', 'porch_widow', 'Widow on the porch'),
  lookout_keeper: n('lookout_keeper', 'lookout_keeper', 'Lookout keeper'),
  cane_cutter: n('cane_cutter', 'cane_cutter', 'Cane cutter'),
  road_watcher: n('road_watcher', 'quiet_crown_f_brown', 'Veiled woman'),
  mourner: n('mourner', 'mourner', 'Mourner'),
  fisher_island: n('fisher_island', 'ferryman', 'Fisher'),
  echo_soldier: n('echo_soldier', 'echo_soldier', 'Soldier'),
  echo_cook: n('echo_cook', 'echo_cook', 'Camp cook'),
  echo_scout: n('echo_scout', 'echo_soldier', 'Scout'),
  echo_sentry: n('echo_sentry', 'echo_soldier', 'Sentry'),
  echo_drummer: n('echo_drummer', 'echo_drummer', 'Drummer'),
  echo_aide: n('echo_aide', 'echo_aide', 'Aide'),
  echo_messenger: n('echo_messenger', 'echo_messenger', 'Messenger'),
  echo_guard: n('echo_guard', 'echo_soldier', 'Guard'),
  echo_builder: n('echo_builder', 'echo_builder', 'Builder'),
  echo_lampwright: n('echo_lampwright', 'echo_builder', 'Lampwright'),
  echo_cane_worker: n('echo_cane_worker', 'echo_cane_worker', 'Cane worker'),
};

export const NPC_IDS: readonly string[] = Object.keys(NPCS);
