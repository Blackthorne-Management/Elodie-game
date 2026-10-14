// Speakers shown on the dialogue name tag. Story names are the owner-approved ones (guide 5.3 and the
// Phase 2 brief); everyone else is named by role only.

import type { Speaker } from '../engine/dialogue.ts';
import { BOOK_SPEAKERS } from './books.ts';

const s = (id: string, name: string, portrait: string = id): Speaker => ({ id, name, portrait });

export const SPEAKERS: Readonly<Record<string, Speaker>> = {
  // Test village (Phase 1).
  villager: s('villager', 'Villager'),
  keeper: s('keeper', 'Temple Keeper'),
  fisher: s('fisher', 'Fisher'),
  sign: s('sign', 'Sign'),

  // The family.
  gianna: s('gianna', 'Gianna'),
  anissa: s('anissa', 'Anissa'),
  anissa_far: s('anissa_far', 'Anissa (at the door)', 'anissa'),
  elodie: s('elodie', 'Elodie'),
  anicette: s('anicette', 'Anicette'),
  patricio: s('patricio', 'Patricio'),
  patricio_old: s('patricio_old', 'Patricio'),
  yari: s('yari', 'Yari'),
  azzy: s('azzy', 'Azzy'),

  // Zetwal, the present.
  gaze_keeper: s('gaze_keeper', 'Gaze keeper'),
  soup_vendor: s('soup_vendor', 'Soup vendor'),
  recruiter_a: s('recruiter_a', 'Hooded stranger', 'quiet_crown_m_brown'),
  recruiter_b: s('recruiter_b', 'Hooded stranger', 'quiet_crown_f_tan'),
  town_guard: s('town_guard', 'Town guard'),
  festival_kid: s('festival_kid', 'Small boy'),
  elder: s('elder', 'Old neighbor'),
  ferryman: s('ferryman', 'Ferryman'),
  pilgrim: s('pilgrim', 'Pilgrim'),
  acolyte: s('acolyte', 'Acolyte'),
  temple_porter: s('temple_porter', 'Temple porter'),
  mourner: s('mourner', 'Mourner'),
  fisher_island: s('fisher_island', 'Fisher'),

  // Zetwal, the Echo (fifty years ago).
  echo_soldier: s('echo_soldier', 'Soldier'),
  echo_cook: s('echo_cook', 'Camp cook'),
  echo_scout: s('echo_scout', 'Scout'),
  echo_sentry: s('echo_sentry', 'Sentry'),
  echo_drummer: s('echo_drummer', 'Drummer'),
  echo_aide: s('echo_aide', 'Aide'),
  echo_messenger: s('echo_messenger', 'Messenger'),
  echo_guard: s('echo_guard', 'Guard'),
  echo_builder: s('echo_builder', 'Builder'),
  echo_lampwright: s('echo_lampwright', 'Lampwright'),

  // The new Zetwal sections: the Temple Archive, the Hall of the Accord, the Cane Road.
  archivist: s('archivist', 'Senior archivist'),
  smith: s('smith', 'Smith'),
  charm_seller: s('charm_seller', 'Charm seller'),
  grocer: s('grocer', 'Market vendor'),
  hall_clerk: s('hall_clerk', 'Hall clerk', 'clerk'),
  cane_cutter: s('cane_cutter', 'Cane cutter'),
  road_watcher: s('road_watcher', 'Veiled woman', 'quiet_crown_f_brown'),

  // Every lore book reads under its own title.
  ...BOOK_SPEAKERS,
};
