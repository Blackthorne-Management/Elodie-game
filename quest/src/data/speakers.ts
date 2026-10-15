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
  echo_cane_worker: s('echo_cane_worker', 'Cane worker'),
  echo_guard: s('echo_guard', 'Guard'),
  echo_builder: s('echo_builder', 'Builder'),
  echo_lampwright: s('echo_lampwright', 'Lampwright'),

  // The new Zetwal sections: the Temple Archive, the Hall of the Accord, the Cane Road.
  archivist: s('archivist', 'Senior archivist'),
  smith: s('smith', 'Smith'),
  charm_seller: s('charm_seller', 'Charm seller'),
  grocer: s('grocer', 'Market vendor'),
  hall_clerk: s('hall_clerk', 'Hall clerk', 'clerk'),
  // Accord Square, the Hall of the Accord inside, the Iron Market rebuilt.
  honor_guard: s('honor_guard', 'Honor guard'),
  gazette_crier: s('gazette_crier', 'Gazette crier'),
  petitioner: s('petitioner', 'Petitioner'),
  protester: s('protester', 'Protester'),
  courier_rider: s('courier_rider', 'Courier rider'),
  nursemaid: s('nursemaid', 'Nursemaid'),
  hall_page: s('hall_page', 'Page'),
  hall_steward: s('hall_steward', 'Steward'),
  throne_usher: s('throne_usher', 'Usher of the throne room'),
  council_speaker: s('council_speaker', 'Speaker of the Council'),
  elder_dove: s('elder_dove', 'Senior elder'),
  elder_hawk: s('elder_hawk', 'Harbor councillor'),
  crown_consul: s('crown_consul', "The Crown's consul"),
  chancellor: s('chancellor', 'Chancellor'),
  seal_keeper: s('seal_keeper', 'Keeper of the Seal'),
  chief_courier: s('chief_courier', 'Chief courier'),
  treasurer: s('treasurer', 'Treasurer'),
  scribe: s('scribe', 'Scribe'),
  produce_seller: s('produce_seller', 'Produce seller'),
  spice_seller: s('spice_seller', 'Spice seller'),
  cloth_merchant: s('cloth_merchant', 'Cloth merchant'),
  fishmonger: s('fishmonger', 'Fishmonger', 'fishwife'),
  goat_herder: s('goat_herder', 'Goat herder'),
  lottery_seller: s('lottery_seller', 'Lottery seller'),
  porter: s('porter', 'Porter'),
  pickpocket: s('pickpocket', 'Quick-handed boy'),
  market_shopper: s('market_shopper', 'Shopper'),
  // The Iron Market, the Old Harbor and Solèy Heights.
  hall_guard: s('hall_guard', 'Hall guard', 'town_guard'),
  engraver: s('engraver', 'Engraver'),
  ironmonger: s('ironmonger', 'Ironmonger'),
  letter_writer: s('letter_writer', 'Letter writer'),
  foreign_envoy: s('foreign_envoy', 'Foreign envoy'),
  market_kid: s('market_kid', 'Market girl'),
  fishwife: s('fishwife', 'Fish seller'),
  net_mender: s('net_mender', 'Net mender'),
  customs_clerk: s('customs_clerk', 'Customs clerk', 'clerk'),
  harbor_kid: s('harbor_kid', 'Harbor boy', 'festival_kid'),
  old_sailor: s('old_sailor', 'Old sailor'),
  ferry_hand: s('ferry_hand', 'Ferry hand', 'ferryman'),
  gardener: s('gardener', 'Gardener'),
  poet: s('poet', 'Poet'),
  porch_widow: s('porch_widow', 'Widow on the porch'),
  lookout_keeper: s('lookout_keeper', 'Lookout keeper'),
  cane_cutter: s('cane_cutter', 'Cane cutter'),
  road_watcher: s('road_watcher', 'Veiled woman', 'quiet_crown_f_brown'),

  // Every lore book reads under its own title.
  ...BOOK_SPEAKERS,
};
