// Bab al-Dhahab, the capital of Al-Doria (House Dorini), for Chapter 4, The Ledger (the outline's section 3 with its
// review, built Oct 21). Half port, half caravanserai: sandstone under green domes, zellige tiles, lanterns over
// covered lanes, nothing like Cenizal's red stone. The quay of the Gate of Gold (the Crown's crates under the
// Charter's seal), the Grand Bazaar and the souk square (the hub: Samira's stall, the three stalls of A-1, the cloth
// merchants' row where Coralie buys dyes, the dry fountain, the debate, the water-carrier's door, the Majlis at its
// head, the guild hall's green door, the House of Ledgers), the Majlis inside, the House of Ledgers, the guild vault
// under the hall (its antechamber's Echo: the vault being built, Yusuf's ledger and the locksmith; the strongroom's
// twelve boxes; the witness's niche behind the sun lock: review 3.4), and the caravan gate with the Desert Edge
// beyond it (the cistern head and its Echo: A-3).
//
// Restartable scenes (Chapter 3's rule): every scene that moves the story has a step trigger that plays it again
// until its flag is set (the walk-up, the audience, the cloth row, the door at dusk, the vault, the caravan).

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { INVOICE_FLAGS, SAFFRON, SAFFRON_FLAGS, SAKK, SAKK_FLAGS } from '../../src/data/aldoria.ts';

const SAND = 'б';
const SAND_WALL = 'Б';
const DOME = 'г';
const ZELLIGE = 'д';
const DUNE = 'ж';
const PALM = 'Ж';
const ARCADE = 'з';
const AWNING = 'и';
const CARPETS = 'й';
const COINS = 'л';
const WEIGHTS = 'Л';
const VAULT_FLOOR = 'п';
const VAULT_WALL = 'П';
const STRONGBOX = 'ф';
const DRY_LINE = 'ц';
const WATER_LINE = 'Ц';
const CAMEL = 'ч';
const CRATE = 'ш';
const HULL = 'Ш';
const PAVED = 'ы';
const SLUICE = 'э';
const TENT = 'ю';
const LANTERN = 'я';
const BANNER = 'Э';
const SPICE = 'Я';
const CLOTH = 'Ю';
const ROAD = ',';

/** Samira's three things are done (A-1, the debate, A-3): dusk. The same condition as the guild hall's door. */
export const DUSK = 'side.appraise.done, side.sweet_water.done, debate.aldoria_bargain.settled';
/** The bazaar by day: before dusk (it stays night from dusk until the caravan's first light: review 3.9). */
const DAY = '!side.appraise.done|!side.sweet_water.done|!debate.aldoria_bargain.settled';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

/** A building: a green dome over sandstone walls (a grey door goes in the front unless one is given). */
function house(g: Grid, x: number, y: number, w: number, h = 3): void {
  g.rect(x, y, w, 1, DOME).rect(x, y + 1, w, h - 1, SAND_WALL);
}

/**
 * The quay of the Gate of Gold: the trader's pier (the landing), the Crown merchantman at its gangway with the trade
 * factor and a Dorini customs clerk, porters carrying the Charter's crates to the Dorini warehouse (a crowd), the
 * price-board crier, and the quay gate up into the bazaar, with its clerk.
 */
export function aldoriaQuay(): MapSource {
  const W = 32;
  const H = 20;
  const g = new Grid(W, H, SAND);
  g.rect(0, 0, W, 1, SAND_WALL).rect(0, 0, 1, 15, SAND_WALL).rect(W - 1, 0, 1, 15, SAND_WALL);
  g.rect(15, 0, 2, 1, SAND);
  // The sea, the trader's pier (west) and the Crown merchantman at its gangway (east).
  g.rect(0, 15, W, 5, '~');
  g.rect(6, 15, 2, 3, 'k');
  g.rect(18, 16, 11, 3, HULL).rect(22, 15, 1, 1, 'k');
  // The Dorini warehouse (west) and the customs house (east).
  house(g, 2, 2, 9, 4);
  house(g, 21, 2, 9, 4);
  put(g, BANNER, [[14, 0], [17, 0]]);
  // The Charter's crates, by the warehouse and by the ship; lanterns.
  put(g, CRATE, [[11, 7], [12, 7], [11, 8], [19, 12], [20, 12]]);
  put(g, LANTERN, [[4, 13], [27, 13], [13, 2], [18, 2]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'quay_bazaar', x: 15, y: 0, w: 2, props: { target: 'bazaar_quay', map: 'aldoria-bazaar', exit: 'down', if: 'story.quay_passed', closed: 'quay_gate' } },
    // The trader puts the party ashore at the end of its pier (the voyage's travel.next).
    { layer: 'spawns', name: 'landing', x: 7, y: 14, props: { facing: 'up', era: 'present' } },
    trigger('quay_arrive', 7, 14, { dialogue: 'quay_arrive', flag: 'story.aldoria_arrived', once: true, onEnter: true }),
    // Unrest, shown: Yari walks to the crates (once, as the party crosses the quay).
    trigger('quay_crates', 9, 6, { dialogue: 'quay_crates', flag: 'story.quay_crates', once: true, if: '!story.quay_passed' }, 1, 9),
    // The gate: its clerk reads the envoy's papers (again until he has: walking into the gate asks him).
    trigger('quay_gate_step', 15, 2, { dialogue: 'quay_gate', if: '!story.quay_passed' }, 2, 1),
    npc('gate_clerk', 14, 1, 'down'),
    npc('crown_factor', 23, 14, 'left'),
    npc('dorini_customs', 21, 14, 'right'),
    npc('price_crier', 9, 11, 'right'),
    npc('quay_porter', 13, 9, 'left'),
    obj('charter_crates', 19, 12, { dialogue: 'charter_crates', era: 'present' }, 2, 1),
    obj('crown_ship', 18, 16, { dialogue: 'crown_ship', era: 'present' }, 11, 1),
    obj('quay_trader_boat', 6, 17, { dialogue: 'quay_trader_boat', era: 'present' }, 2, 1),
    { layer: 'crowds', name: 'quay_porters', x: 12, y: 9, w: 9, h: 3, props: { count: '4', looks: 'porter,aldoria_trader' } },
    // A-5 Invoice for the Crown (built Oct 27): down on the quay after the Merchant-Prince's word, Samira has one last invoice.
    trigger('invoice_offer', 15, 1, { dialogue: 'invoice_offer', flag: 'side.invoice.offered', once: true, onEnter: true, if: `story.layla_pass, !${INVOICE_FLAGS.accepted}, !story.caravan_dawn` }),
  ];
  return { id: 'aldoria-quay', present: g, echo: g.clone(), objects };
}

/**
 * The Grand Bazaar and the souk square (the hub). North: the Majlis at the head of the square; north-west, the House
 * of Ledgers. West of the square, the guild hall's green door (its doorman on a stool by day, gone at dusk). The
 * square: zellige round the dry fountain (it runs once the cistern gate is pinned: A-3), the children on its rim, the
 * contract-priest and the merchant arguing beside it. East: the water-carrier's door with the grey thumbprint, and
 * the lane to the caravan gate. South: the moneychangers' row with Samira's stall at its end, the three stalls of
 * A-1, the cloth merchants' row (Coralie), the tea seller, the amulet seller and the armourer; the way down to the quay.
 */
export function aldoriaBazaar(): MapSource {
  const W = 44;
  const H = 32;
  const g = new Grid(W, H, SAND);
  g.rect(0, 0, W, 1, SAND_WALL).rect(0, 0, 1, H, SAND_WALL).rect(W - 1, 0, 1, H, SAND_WALL).rect(0, H - 1, W, 1, SAND_WALL);
  // The ways out: down to the quay (south), the caravan lane (east).
  g.rect(21, H - 1, 2, 1, SAND).rect(W - 1, 14, 1, 2, SAND);
  // The Majlis at the head of the square, its door; the House of Ledgers (north-west).
  house(g, 16, 1, 13, 5);
  g.set(22, 5, 'D');
  put(g, BANNER, [[19, 5], [25, 5]]);
  house(g, 2, 1, 8, 4);
  g.set(5, 4, 'D');
  // The guild hall (west of the square) and its green door, facing the square.
  house(g, 2, 8, 9, 5);
  g.set(10, 11, 'D');
  // The water-carrier's house (east of the square): her door is shut; she stands in it.
  house(g, 33, 8, 8, 4);
  g.set(36, 11, '@');
  house(g, 33, 2, 8, 4);
  // The souk square: zellige round the dry fountain (drawn), lanterns at its corners, arcades along its sides.
  g.rect(13, 7, 19, 12, ZELLIGE);
  g.set(22, 13, PAVED);
  put(g, LANTERN, [[13, 7], [31, 7], [13, 18], [31, 18]]);
  put(g, ARCADE, [[13, 10], [13, 15], [31, 10], [31, 15]]);
  // The south lanes: the moneychangers' row (Samira's stall last), A-1's three stalls, the cloth merchants' row,
  // the tea seller, the armourer and the amulet seller.
  g.rect(2, 21, 9, 1, COINS);
  g.set(11, 21, COINS);
  g.set(15, 21, COINS).set(18, 21, CARPETS).set(21, 21, WEIGHTS);
  g.rect(25, 21, 6, 1, CLOTH);
  g.set(33, 21, AWNING).set(36, 21, SPICE).set(39, 21, AWNING);
  house(g, 2, 27, 8, 3);
  house(g, 30, 27, 11, 3);
  put(g, LANTERN, [[13, 24], [30, 24]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'bazaar_quay', x: 21, y: H - 1, w: 2, props: { target: 'quay_bazaar', map: 'aldoria-quay', exit: 'up' } },
    { layer: 'doors', name: 'bazaar_desert', x: W - 1, y: 14, h: 2, props: { target: 'desert_bazaar', map: 'aldoria-desert', exit: 'left' } },
    { layer: 'doors', name: 'bazaar_majlis', x: 22, y: 5, props: { target: 'majlis_out', map: 'aldoria-majlis', exit: 'down' } },
    { layer: 'doors', name: 'bazaar_ledgers', x: 5, y: 4, props: { target: 'ledgers_out', map: 'aldoria-ledgers', exit: 'down' } },
    { layer: 'doors', name: 'bazaar_vault', x: 10, y: 11, props: { target: 'vault_stair', map: 'aldoria-vault', exit: 'right', if: 'story.vault_entered', closed: 'guild_door' } },
    { layer: 'spawns', name: 'square', x: 22, y: 16, props: { facing: 'up', era: 'present' } },
    // Up from the quay, Samira walks up to the Locket (again until she has: the party never misses her).
    trigger('samira_walkup', 20, 28, { dialogue: 'samira_walkup', if: 'story.quay_passed, !story.samira_met' }, 4, 2),
    // Coralie in the cloth merchants' row (FAMILY.md): met on the way along the stalls, once A-1 is in hand.
    trigger('coralie_meet', 13, 22, { dialogue: 'coralie_meet', if: 'side.appraise.accepted, !story.coralie_met' }, 22, 3),
    // The fountain runs (A-3): the children run to it, and the water-carrier comes to her door.
    trigger('fountain_runs', 20, 15, { dialogue: 'fountain_runs', if: 'anchor.cistern_pin, !side.sweet_water.done' }, 5, 1),
    // Samira: at her stall from the walk-up until dusk; at the guild hall's door at dusk (the ready check).
    // Outside the Majlis after the refusal, Samira is waiting on the steps (she walked up while they were inside).
    trigger('samira_steps', 20, 7, { dialogue: 'samira_steps', if: 'story.vault_refused, !story.samira_steps' }, 5, 1),
    npc('samira_stall_early', 11, 22, 'down', { npc: 'samira', if: 'story.samira_met, !story.vault_refused' }),
    npc('samira_stall', 11, 22, 'down', { npc: 'samira', if: `story.samira_steps, !story.vault_entered, ${DAY}` }),
    npc('samira_door', 12, 10, 'down', { npc: 'samira', if: `${DUSK}, !story.vault_entered` }),
    npc('guild_doorman', 11, 12, 'right', { if: DAY }),
    npc('old_moneychanger', 4, 22, 'down'),
    npc('moneychanger', 8, 22, 'down'),
    // A-1: the three stallholders, each beside the stall with a fake on it.
    npc('coin_seller', 14, 22, 'down'),
    npc('carpet_seller', 17, 22, 'down'),
    npc('weights_seller', 20, 22, 'down'),
    npc('coralie', 28, 22, 'down', { if: 'story.coralie_met, !story.coralie_left' }),
    npc('cloth_seller', 26, 22, 'down'),
    npc('tea_seller', 36, 22, 'down'),
    npc('armourer', 33, 22, 'down'),
    npc('amulet_seller', 39, 22, 'down'),
    // The square: the debate by the fountain; the children on its rim (asleep at dusk); the contract board.
    npc('debate_priest', 18, 13, 'right', { if: '!story.caravan_dawn' }),
    npc('debate_merchant', 20, 13, 'left', { if: '!story.caravan_dawn' }),
    npc('fountain_child_a', 21, 14, 'up'),
    npc('fountain_child_b', 23, 14, 'up'),
    npc('water_carrier', 36, 12, 'down'),
    npc('bazaar_crier', 27, 17, 'left'),
    npc('bazaar_guard', 23, 6, 'down'),
    obj('dry_fountain_al', 22, 13, { kind: 'fountain_dry', solid: true, era: 'present', if: '!anchor.cistern_pin', dialogue: 'dry_fountain_al' }),
    obj('running_fountain', 22, 13, { kind: 'fountain', solid: true, era: 'present', if: 'anchor.cistern_pin', dialogue: 'running_fountain' }),
    obj('carrier_door', 36, 11, { dialogue: 'carrier_door', era: 'present' }),
    obj('contract_board', 13, 9, { kind: 'sign', solid: true, era: 'present', dialogue: 'contract_board' }),
    obj('coin_stall', 15, 21, { dialogue: 'coin_stall', era: 'present' }),
    obj('carpet_stall', 18, 21, { dialogue: 'carpet_stall', era: 'present' }),
    obj('weights_stall', 21, 21, { dialogue: 'weights_stall', era: 'present' }),
    obj('samira_scale', 11, 21, { dialogue: 'samira_scale', era: 'present' }),
    obj('majlis_banner', 19, 5, { dialogue: 'majlis_banner', era: 'present' }),
    { layer: 'crowds', name: 'bazaar_day', x: 3, y: 24, w: 38, h: 3, props: { count: '9', looks: 'aldoria_trader,aldoria_trader_f,porter,market_kid', if: DAY } },
    { layer: 'crowds', name: 'square_day', x: 24, y: 9, w: 6, h: 8, props: { count: '4', looks: 'aldoria_trader,aldoria_trader_f', if: DAY } },
    // A-4 The Uncashed Note (secret, built Oct 27): the price board by the moneychangers' row, and the war-time bazaar in
    // front of it: young Yusuf at his counting table, his new box seven (the anchor), four stalls each short of one thing.
    obj('bazaar_prices', SAKK.board.x, SAKK.board.y, { kind: 'price_board', solid: true, era: 'present', dialogue: 'bazaar_prices' }),
    { layer: 'echo_zones', name: 'counting_echo', x: SAKK.zone.x, y: SAKK.zone.y, w: SAKK.zone.w, h: SAKK.zone.h, props: { if: `item.sun_locket, ${SAKK_FLAGS.accepted}`, onEcho: 'counting_echo' } },
    npc('yusuf_bazaar', SAKK.yusuf.x, SAKK.yusuf.y, 'down', { era: 'echo' }),
    npc('war_dates', SAKK.dates.x, SAKK.dates.y, 'down', { era: 'echo' }),
    npc('war_salt', SAKK.salt.x, SAKK.salt.y, 'down', { era: 'echo' }),
    npc('war_peppers', SAKK.peppers.x, SAKK.peppers.y, 'down', { era: 'echo' }),
    npc('war_indigo', SAKK.indigo.x, SAKK.indigo.y, 'down', { era: 'echo' }),
    obj('yusuf_box', SAKK.box.x, SAKK.box.y, { kind: 'strongbox', solid: true, era: 'echo', dialogue: 'yusuf_box' }),
    { layer: 'anchors', name: 'sakk_anchor', x: SAKK.box.x, y: SAKK.box.y, props: { object: 'yusuf_box', flag: SAKK_FLAGS.anchor } },
  ];
  return { id: 'aldoria-bazaar', present: g, echo: g.clone(), objects };
}

/**
 * The Merchant-Prince's Majlis: the long hall of arches to the divan (Layla, the guild council, Qasim at her right
 * hand, the chief scribe), the council chamber (west), the archive of contracts (east: two books), its guards.
 */
export function aldoriaMajlis(): MapSource {
  const W = 30;
  const H = 22;
  const g = new Grid(W, H, SAND_WALL);
  // The long hall: marble, the carpet to the divan, the arches.
  g.rect(9, 2, 12, 19, '(').rect(14, 4, 2, 17, ')');
  g.rect(10, 2, 10, 2, '{').set(14, 2, ']');
  g.set(14, H - 1, 'D');
  put(g, '[', [[10, 6], [19, 6], [10, 11], [19, 11], [10, 16], [19, 16]]);
  // The council chamber (west) and the archive of contracts (east).
  g.rect(1, 3, 7, 8, '(').rect(8, 6, 1, 2, '(').rect(2, 4, 5, 1, '+');
  g.rect(22, 3, 7, 8, '(').rect(21, 6, 1, 2, '(').rect(23, 3, 4, 1, 'h');
  put(g, '*', [[9, 19], [20, 19]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'majlis_out', x: 14, y: H - 1, props: { target: 'bazaar_majlis', map: 'aldoria-bazaar', exit: 'up' } },
    { layer: 'spawns', name: 'hall', x: 14, y: 19, props: { facing: 'up', era: 'present' } },
    // Coming in: the Crown's factor walks out past the party; the guild master argues at the council door.
    trigger('majlis_enter', 14, 19, { dialogue: 'majlis_enter', flag: 'story.majlis_seen', once: true, onEnter: true, if: '!story.vault_refused' }),
    // The audience at the divan (again until it is done).
    trigger('majlis_audience', 11, 7, { dialogue: 'majlis_audience', if: 'story.samira_met, !story.vault_refused' }, 8, 1),
    npc('layla', 14, 3, 'down'),
    npc('qasim_divan', 16, 3, 'down', { npc: 'qasim', if: '!story.vault_entered' }),
    npc('chief_scribe', 12, 4, 'down', { if: '!story.layla_pass' }),
    npc('council_elder_a', 11, 3, 'down', { npc: 'council_elder' }),
    npc('council_elder_b', 18, 3, 'down', { npc: 'council_elder' }),
    npc('majlis_treasurer', 7, 7, 'right'),
    npc('no_crown_master', 4, 7, 'right'),
    npc('contract_scribe', 25, 6, 'up'),
    npc('majlis_guard_a', 12, 19, 'right', { npc: 'majlis_guard' }),
    npc('majlis_guard_b', 17, 19, 'left', { npc: 'majlis_guard' }),
    obj('majlis_contracts', 23, 3, { dialogue: 'shelf.majlis_contracts', era: 'present' }, 4, 1),
    obj('merchant_seat', 14, 2, { dialogue: 'merchant_seat', era: 'present' }),
  ];
  return { id: 'aldoria-majlis', present: g, echo: g.clone(), objects, interior: true };
}

/** The House of Ledgers: a domed reading room, six ledgers chained to three lecterns, and their keeper. */
export function aldoriaLedgers(): MapSource {
  const W = 20;
  const H = 12;
  const g = new Grid(W, H, 'o');
  g.rect(0, 0, W, 1, SAND_WALL).rect(0, H - 1, W, 1, SAND_WALL).rect(0, 0, 1, H, SAND_WALL).rect(W - 1, 0, 1, H, SAND_WALL);
  g.set(9, H - 1, 'D');
  g.rect(2, 1, 4, 1, 'h').rect(8, 1, 4, 1, 'h').rect(14, 1, 4, 1, 'h');
  g.rect(7, 4, 6, 5, 'u');
  put(g, 'a', [[3, 6], [4, 6], [15, 6], [16, 6]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'ledgers_out', x: 9, y: H - 1, props: { target: 'bazaar_ledgers', map: 'aldoria-bazaar', exit: 'up' } },
    { layer: 'spawns', name: 'ledgers', x: 9, y: H - 3, props: { facing: 'up', era: 'present' } },
    obj('ledgers_trade', 2, 1, { dialogue: 'shelf.ledgers_trade', era: 'present' }, 4, 1),
    obj('ledgers_law', 8, 1, { dialogue: 'shelf.ledgers_law', era: 'present' }, 4, 1),
    obj('ledgers_city', 14, 1, { dialogue: 'shelf.ledgers_city', era: 'present' }, 4, 1),
    npc('ledger_keeper', 15, 8, 'left'),
  ];
  return { id: 'aldoria-ledgers', present: g, echo: g.clone(), objects, interior: true };
}

/** The weights on the vault's balance door, by value (PUZZLES.md SIG-ALD): their x on the rack. */
export const VAULT_WEIGHTS = { 1: 6, 2: 7, 4: 8, 8: 9, 16: 10 } as const;

/**
 * The guild vault under the guild hall (SIG-ALD; review 3.4 and 3.6). The stair down from the green door; the
 * antechamber with the balance door (its pan, the five brass weights on a rack, the chained ledger page smudged past
 * reading) and, over its floor, the Echo of the vault being built (Yusuf's desk, his clerk, the locksmith fitting
 * the witness's niche; Caona and Benny with Patricio). Past the balance door, the strongroom the guild uses every
 * day (twelve numbered iron boxes); at its far end, the witness's niche behind the sun lock (only the Dorini copy of
 * the Accord is in it, so no guildsman has ever opened it): Qasim's arena.
 */
export function aldoriaVault(): MapSource {
  const W = 26;
  const H = 14;
  const g = new Grid(W, H, VAULT_WALL);
  // The stair down, and the antechamber.
  g.rect(3, 1, 3, 3, VAULT_FLOOR).set(4, 0, 'D');
  g.rect(2, 4, 11, 8, VAULT_FLOOR);
  // The balance door's doorway (its door is a puzzle object), and the strongroom with its twelve boxes.
  g.rect(13, 7, 1, 2, VAULT_FLOOR);
  g.rect(14, 4, 8, 8, VAULT_FLOOR);
  g.rect(15, 4, 6, 1, STRONGBOX).rect(15, 11, 6, 1, STRONGBOX);
  // The witness's niche behind the sun lock (a puzzle object in the gap), its chest.
  g.set(22, 7, VAULT_FLOOR).rect(23, 6, 2, 3, VAULT_FLOOR);
  // Fifty years ago: no boxes yet, Yusuf's desk in the antechamber, a ditch where the niche's lock is being set.
  const e = g.clone();
  e.rect(15, 4, 6, 1, VAULT_FLOOR).rect(15, 11, 6, 1, VAULT_FLOOR);
  e.set(10, 5, '$').set(11, 5, '$');

  const weight = (n: keyof typeof VAULT_WEIGHTS): ObjSpec[] => {
    const x = VAULT_WEIGHTS[n];
    return [
      obj(`weight_${n}`, x, 11, { kind: 'weight_hook', solid: true, era: 'present', if: `!puzzle.vault.w${n}`, dialogue: `vault_weight_${n}` }),
      obj(`weight_${n}_hung`, x, 11, { kind: 'weight_hung', solid: true, era: 'present', if: `puzzle.vault.w${n}`, dialogue: `vault_weight_${n}` }),
    ];
  };

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'vault_stair', x: 4, y: 0, props: { target: 'bazaar_vault', map: 'aldoria-bazaar', exit: 'down' } },
    { layer: 'spawns', name: 'stair', x: 4, y: 2, props: { facing: 'down', era: 'present' } },
    // Down the stair at dusk: Samira lights the lamps (again until the party has been down).
    trigger('vault_arrive', 4, 1, { dialogue: 'vault_arrive', flag: 'story.vault_lamps', once: true, onEnter: true }),
    npc('samira_vault', 3, 5, 'right', { npc: 'samira', if: '!party.samira' }),
    // The antechamber in the present: the page, the pan, the weights, the balance door.
    obj('ledger_page', 8, 5, { kind: 'lectern', solid: true, era: 'present', dialogue: 'ledger_page' }),
    obj('balance_pan', 12, 5, { kind: 'balance', solid: true, era: 'present', dialogue: 'balance_pan' }),
    ...weight(1),
    ...weight(2),
    ...weight(4),
    ...weight(8),
    ...weight(16),
    obj('balance_door', 13, 7, { kind: 'balance_door', solid: true, era: 'present', if: '!story.vault_outer', dialogue: 'balance_door' }, 1, 2),
    {
      layer: 'echo_zones',
      name: 'vault_echo',
      x: 3,
      y: 7,
      w: 9,
      h: 3,
      props: { if: 'story.vault_entered', onEcho: 'vault_echo_enter', onReturn: 'vault_echo_return' },
    },
    // Fifty years ago: Yusuf at his desk with his clerk; Caona and Benny with Patricio; the locksmith at the niche.
    npc('echo_yusuf', 10, 6, 'down', { era: 'echo' }),
    npc('echo_ledger_clerk', 12, 6, 'down', { era: 'echo' }),
    npc('caona_vault', 3, 10, 'right', { npc: 'caona_echo', era: 'echo' }),
    npc('benny_vault', 4, 10, 'right', { npc: 'benny_echo', era: 'echo' }),
    npc('echo_locksmith', 21, 6, 'down', { era: 'echo' }),
    obj('sun_lock_blank', 22, 7, { kind: 'sun_lock', solid: true, era: 'echo', dialogue: 'sun_lock_blank' }),
    { layer: 'anchors', name: 'sun_lock_anchor', x: 22, y: 7, props: { object: 'sun_lock_blank', flag: 'anchor.vault_sunlock' } },
    // The strongroom in the present: box 7 (A-4's hook, after the release), the sun lock, the witness's chest.
    obj('box_seven', 15, 11, { dialogue: 'box_seven', era: 'present', if: `!${SAKK_FLAGS.anchor}` }),
    obj('box_seven_full', 15, 11, { dialogue: 'box_seven', era: 'present', if: SAKK_FLAGS.anchor }),
    obj('vault_boxes', 16, 4, { dialogue: 'vault_boxes', era: 'present' }, 5, 1),
    obj('sun_lock', 22, 7, { kind: 'sun_lock', solid: true, era: 'present', if: '!anchor.vault_sunlock', dialogue: 'sun_lock' }),
    obj('sun_lock_open', 22, 7, { kind: 'sun_lock_cut', solid: true, era: 'present', if: 'anchor.vault_sunlock, !story.vault_inner', dialogue: 'sun_lock' }),
    obj('witness_chest', 24, 7, { kind: 'sealed_chest', solid: true, era: 'present', dialogue: 'witness_chest' }),
    // Qasim's blades on the stair: the way back in after a Game Over (talk to the blade at the stair's foot).
    npc('stair_blade', 5, 3, 'down', { if: 'story.qasim_came, !encounter.aldoria_story.qasim.won' }),
    // After the fight: Layla comes down (again until her word is given).
    trigger('layla_resume', 14, 5, { dialogue: 'layla_descends', if: 'encounter.aldoria_story.qasim.won, !story.layla_pass' }, 8, 6),
  ];
  return { id: 'aldoria-vault', present: g, echo: e, objects, interior: true };
}

/**
 * The caravan gate and the Desert Edge (the wild section). West, inside the walls: the gate yard where caravans form
 * (the caravan master, the camels, the spice merchant's stall for A-2 later). Through the gate: the caravan road
 * into the dunes (the road is safe; the dunes either side are wild, from the party's arrival), and north at the foot
 * of the hills the cistern head: the guild's iron sluice bending the qanat into its own tanks, and the old gate to
 * the city line, rusted shut (its Echo, the week the vault was built: the gate open, Patricio's engineer about to
 * take it off for the iron; pinned open, an anchor, the city line runs again).
 */
export function aldoriaDesert(): MapSource {
  const W = 44;
  const H = 26;
  const g = new Grid(W, H, DUNE);
  // The gate yard inside the walls, the city wall and the caravan gate.
  g.rect(0, 0, 12, H, SAND).rect(0, 0, 12, 1, SAND_WALL).rect(0, H - 1, 12, 1, SAND_WALL).rect(0, 0, 1, H, SAND_WALL);
  g.rect(0, 12, 1, 2, SAND);
  g.rect(11, 0, 1, H, SAND_WALL).rect(11, 12, 1, 2, SAND);
  put(g, TENT, [[2, 3], [5, 3]]);
  put(g, CAMEL, [[3, 18], [5, 18], [7, 18]]);
  g.set(2, 7, SPICE).set(3, 7, SPICE);
  put(g, LANTERN, [[10, 10], [10, 15]]);
  // The caravan road east, then north to the cistern head.
  g.rect(12, 12, 20, 2, ROAD).rect(30, 6, 2, 6, ROAD);
  // The cistern head: the guild's sluice and tanks (east), the old gate (a puzzle object) and the dry city line west.
  g.rect(34, 1, 7, 3, WATER_LINE).rect(33, 4, 2, 1, SLUICE).rect(32, 1, 1, 4, 'C');
  g.rect(14, 4, 17, 1, DRY_LINE);
  g.rect(12, 0, 32, 1, 'C').rect(12, 1, 2, 4, 'C');
  put(g, PALM, [[16, 8], [24, 7], [38, 10], [20, 18], [33, 20], [40, 16], [15, 22], [27, 23]]);
  // Fifty years ago: the city line runs, and the guild has no sluice yet.
  const e = g.clone();
  e.rect(14, 4, 17, 1, WATER_LINE).rect(33, 4, 2, 1, DUNE);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'desert_bazaar', x: 0, y: 12, h: 2, props: { target: 'bazaar_desert', map: 'aldoria-bazaar', exit: 'right' } },
    { layer: 'spawns', name: 'gate_yard', x: 6, y: 12, props: { facing: 'right', era: 'present' } },
    npc('caravan_master', 8, 9, 'down', { if: '!story.caravan_dawn' }),
    npc('caravan_guard', 10, 11, 'left'),
    npc('spice_merchant', 2, 8, 'right'),
    // At first light (after Layla's word): the purse, the coin, the caravan (again until the chapter ends).
    trigger('caravan_dawn', 2, 11, { dialogue: 'caravan_dawn', if: 'story.layla_pass, !act4.complete' }, 3, 4),
    // The cistern head (A-3): the old gate rusted shut in the present; open and loose in the memory (the anchor).
    obj('old_gate_rusted', 31, 5, { kind: 'old_gate', solid: true, era: 'present', if: '!anchor.cistern_pin', dialogue: 'old_gate_rusted' }),
    obj('old_gate_pinned', 31, 5, { kind: 'old_gate_open', solid: true, era: 'present', if: 'anchor.cistern_pin', dialogue: 'old_gate_pinned' }),
    obj('city_line_running', 14, 4, { kind: 'channel_water', walkable: true, era: 'present', if: 'anchor.cistern_pin' }, 17, 1),
    obj('guild_sluice', 33, 4, { dialogue: 'guild_sluice', era: 'present' }, 2, 1),
    obj('cistern_gate', 31, 5, { kind: 'old_gate_open', solid: true, era: 'echo', dialogue: 'cistern_gate' }),
    { layer: 'anchors', name: 'cistern_pin_anchor', x: 31, y: 5, props: { object: 'cistern_gate', flag: 'anchor.cistern_pin' } },
    {
      layer: 'echo_zones',
      name: 'cistern_echo',
      x: 28,
      y: 6,
      w: 2,
      h: 4,
      props: { if: 'side.sweet_water.carrier', onEcho: 'cistern_echo_enter', onReturn: 'cistern_echo_return' },
    },
    npc('echo_engineer', 32, 6, 'left', { era: 'echo' }),
    // The cistern head the first time: the air shimmers over the old gate.
    trigger('cistern_arrive', 30, 6, { dialogue: 'cistern_arrive', flag: 'story.cistern_seen', once: true, if: 'side.sweet_water.carrier' }, 2, 1),
    // A-2 The Missing Saffron (built Oct 27): the camel tracks off the road, and the raiders' camp in the far dunes.
    ...SAFFRON.tracks.map((t, i) => obj(`saffron_tracks_${i + 1}`, t.x, t.y, { kind: 'camel_tracks', walkable: true, era: 'present', if: SAFFRON_FLAGS.asked })),
    // Walking onto the tracks reads them (once).
    ...SAFFRON.tracks.map((t, i) => trigger(`saffron_tracks_read_${i + 1}`, t.x, t.y, { dialogue: 'saffron_tracks', if: `${SAFFRON_FLAGS.asked}, !${SAFFRON_FLAGS.tracks}` })),
    ...SAFFRON.raiders.map((r, i) => npc(`saffron_raider_${i + 1}`, r.x, r.y, i === 0 ? 'down' : 'left', { if: `${SAFFRON_FLAGS.tracks}, !${SAFFRON_FLAGS.freed}` })),
    npc('saffron_nephew', SAFFRON.nephew.x, SAFFRON.nephew.y, 'left', { if: `${SAFFRON_FLAGS.tracks}, !${SAFFRON_FLAGS.freed}` }),
    obj('saffron_camels', SAFFRON.camels.x, SAFFRON.camels.y, { kind: 'camel', solid: true, era: 'present', if: `${SAFFRON_FLAGS.tracks}, !${SAFFRON_FLAGS.freed}`, dialogue: 'saffron_camels' }, 2, 1),
    npc('saffron_nephew_home', SAFFRON.merchant.x + 1, SAFFRON.merchant.y + 1, 'up', { npc: 'saffron_nephew', if: SAFFRON_FLAGS.freed }),
    { layer: 'encounters', name: 'dunes_north', x: 14, y: 6, w: 14, h: 5, props: { table: 'desert_edge', if: 'story.aldoria_arrived' } },
    { layer: 'encounters', name: 'dunes_south', x: 13, y: 15, w: 30, h: 10, props: { table: 'desert_edge', if: 'story.aldoria_arrived' } },
    { layer: 'encounters', name: 'dunes_east', x: 33, y: 6, w: 10, h: 9, props: { table: 'desert_edge', if: 'story.aldoria_arrived' } },
  ];
  return { id: 'aldoria-desert', present: g, echo: e, objects };
}

export const ALDORIA_SOURCES: readonly (() => MapSource)[] = [aldoriaQuay, aldoriaBazaar, aldoriaMajlis, aldoriaLedgers, aldoriaVault, aldoriaDesert];
