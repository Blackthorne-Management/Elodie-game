// The party, the purse and the places: items, party members, shops, the city maps and the realm map
// (engine/rpg.ts runs the rules). Owner decision (Oct 14): gold is what you spend; Influence, Wealth
// and Fear are reputation scores per city and realm-wide; armies are military might.

import { ANISSA_SP_EVERY, ANISSA_SP_SHARE, BAG_LIMIT, LEVELS, STARTING_GOLD, SURGE_COST, XP_PER_BOOK, XP_PER_OBJECTIVE_BY_CHAPTER } from '../config.ts';
import { flagsIn } from '../engine/conditions.ts';
import type { Condition } from '../engine/conditions.ts';
import type { CityDef, ItemDef, MemberDef, RealmPlace, RpgContent, ShopDef } from '../engine/rpg.ts';
import { BOOKS, loreFlag } from './books.ts';
import { ACT1, ACT2, ACT3, ACT4, ACT5, ACT6, ACT7, ACT8, ACT9, ACT10, ACT11, ACT12, EPILOGUE } from './quests.ts';
import { WEAPONS } from './weapons.ts';
import { SECRET_ITEM_LIST } from './secretItems.ts';
import { LATE_PILLAR_RULES } from './sideQuestsLate.ts';
import { WAR_BATTLES } from './warBattles.ts';

/** What the flank's fight pays (the turned route pays it through war.house_stood instead). */
const WAR_FLANK_XP = WAR_BATTLES.harbor_flank_al_doria!.rewards.xp;

const zero = { hp: 0, sp: 0, atk: 0, def: 0, mag: 0, spd: 0 };

const ITEM_LIST: ItemDef[] = [
  // Story items.
  {
    id: 'sun_locket',
    name: 'Sun Locket',
    kind: 'key',
    price: 0,
    text: "Grandfather's locket: half of the token he and Lord Benny made. It hums near the past.",
    showcase: 'story',
    abilities: [
      { name: 'Echo', text: 'Where the air shimmers, step into what that place remembers.' },
      {
        name: 'Anchors',
        text: 'What you change in the past can stay changed in the present.',
        known: { any: [{ flag: 'anchor.night_orders' }, { flag: 'anchor.chain_bridge' }] },
      },
      // Revealed in Ardencia (Chapter 3), when Lord Rael's signet glows beside it.
      { name: 'Two halves of a promise', text: 'Near its other half, the Brasador signet, both halves glow.', known: { flag: 'story.signet_glowed' } },
    ],
  },
  // The Envoy's Papers (Chapter 1, the Hall of the Accord). Since Batch D (Oct 19) the engraver hands the seal to
  // the clerk himself; `elodie_seal` stays so a save made while carrying it still shows it in the bag.
  {
    id: 'elodie_seal',
    name: "Mother's seal",
    kind: 'key',
    price: 0,
    text: "The Head of State's seal: a heavy brass sun, its rays fresh from the engraver's tools. For the Hall clerk.",
  },
  {
    id: 'draft_papers',
    name: 'Envoy papers (unsigned)',
    kind: 'key',
    price: 0,
    text: "Written and sealed by the Hall clerk. They still need the Chancellor's signature.",
  },
  {
    id: 'envoy_papers',
    name: 'Envoy papers',
    kind: 'key',
    price: 0,
    text: "Gianna Limyè, envoy of Kay Soley to Xaraguá: the Head of State's seal and the Chancellor's hand. Keep them dry.",
  },
  // The departure at dawn (Chapter 1, decision C, Oct 19): Grandfather's whistle. No stats; it matters again in
  // Chapter 10, when he musters Zetwal with it.
  {
    id: 'marshal_whistle',
    name: "The Marshal's whistle",
    kind: 'key',
    price: 0,
    text: "Grandfather's brass whistle from the year of the Accord, worn smooth on its cord. Every company in Zetwal knew its note.",
  },
  // Chapter 2: the petroglyph cave is dark (the lamp-oil seller lends one once Thorne has spoken to Gianna).
  {
    id: 'oil_lamp',
    name: 'Oil lamp',
    kind: 'key',
    price: 0,
    text: 'A clay lamp with a cotton wick and a jar of the oil that comes by canoe after dark. Enough light for a cave.',
    showcase: 'story',
  },
  // The occupied city: the healer's medicine for Anaco's fever, from the tree by the gardens' spring.
  {
    id: 'fever_bark',
    name: 'Fever bark',
    kind: 'key',
    price: 0,
    text: 'Strips of bitter bark from the tree by the spring in the cassava gardens. The healer boils it for the cacique\'s fever.',
  },
  // Chapter 2's side quests (Oct 20): the jars for the hill camp, the healer's grove bark, and the bead the hutia took.
  {
    id: 'oil_jars',
    name: 'Oil jars',
    kind: 'key',
    price: 0,
    text: 'Two clay jars of the oil that comes by canoe after dark, stoppered with wax. For the leader of the hill camp.',
  },
  {
    id: 'grove_bark',
    name: 'Grove bark',
    kind: 'key',
    price: 0,
    text: 'Bark from the grove behind the rocks at the hill camp: the old cure for the cacique\'s fever, that the pond tree only holds back.',
  },
  {
    id: 'hutia_bead',
    name: 'Sea-glass bead',
    kind: 'key',
    price: 0,
    text: 'A green sea-glass bead on a cotton thread, from the hutia\'s hollow. It belongs to the small girl in the cassava gardens.',
  },
  // The secret items (docs/quest/design/SECRET-ITEMS.md, owner approved Oct 14), one per capital: the
  // legendary relics, worn in their own slot (owner decision, Oct 15).
  {
    id: 'solange_quill',
    name: "Solange's Quill",
    // Legendary: worn in the relic slot (one per wearer), growing with its wearer's level.
    kind: 'gear',
    slot: 'relic',
    rarity: 'legendary',
    price: 0,
    stats: { mag: 2, sp: 4 },
    growth: { mag: 0.5, sp: 1 },
    skill: 'say_their_names',
    text: 'The quill Mother Solange wrote the first names with. The nib is worn to a slant by her hand.',
    showcase: 'legendary',
    abilities: [
      { name: 'Say Their Names', text: 'Once per battle, every Bound or fallen ally rises with 30% HP, and Anissa gains Calm and Spark.' },
    ],
  },

  // Zetwal food and drink (guide 8: restorative soup in a clay pot).
  { id: 'soup_pot', name: 'Clay-pot soup', kind: 'consumable', price: 30, heals: 40, healTurns: 3, text: 'Squash soup in a clay pot, still warm. Restores 40 HP, a little at a time.' },
  { id: 'akasan', name: 'Akasan', kind: 'consumable', price: 25, restores: 12, text: 'Sweet cornmeal drink, thick enough to stand a spoon in. Restores 12 SP.' },
  // The Iron Market (Oct 15).
  // Grandmother's food for the voyage (Chapter 1's departure at dawn, Oct 19): only she gives it.
  { id: 'anicette_kasav', name: "Grandmother's kasav", kind: 'consumable', price: 15, heals: 30, text: 'Kasav from Grandmother\'s own griddle, wrapped in a banana leaf for the water. Restores 30 HP.' },
  { id: 'kasav', name: 'Kasav', kind: 'consumable', price: 15, heals: 25, text: 'Cassava bread, flat and crisp, with peanut butter. Restores 25 HP.' },
  { id: 'kann', name: 'Cane juice', kind: 'consumable', price: 12, heals: 12, restores: 4, text: 'Sugarcane pressed while you wait. Restores 12 HP and 4 SP.' },
  { id: 'pikliz', name: 'Pikliz', kind: 'consumable', price: 20, restores: 10, text: 'Pickled cabbage and peppers, hot enough to wake the dead. Restores 10 SP.' },
  // The fish stall in the Iron Market (owner decision, Oct 16).
  { id: 'pwason_fri', name: 'Fried snapper', kind: 'consumable', price: 35, heals: 50, text: 'Pwason fri: snapper fried whole, with pikliz on the side. Restores 50 HP.' },
  { id: 'lanbi_fritters', name: 'Conch fritters', kind: 'consumable', price: 30, restores: 15, text: 'Marinad lanbi: conch fritters, crisp and peppery. Restores 15 SP.' },
  { id: 'spiny_lobster', name: 'Spiny lobster', kind: 'consumable', price: 60, heals: 40, restores: 10, text: 'Grilled this minute, bad attitude and all. Restores 40 HP and 10 SP.' },
  // Yucayeque's beach market (Chapter 2; CAPITALS.md 2).
  { id: 'casabe', name: 'Casabe', kind: 'consumable', price: 20, heals: 30, text: 'Cassava bread baked flat on a clay griddle. Keeps for a month at sea. Restores 30 HP.' },
  { id: 'guava', name: 'Guava', kind: 'consumable', price: 10, heals: 15, text: 'Pink inside, sweet and a little sour. Restores 15 HP.' },
  { id: 'fish_stew', name: 'Fish stew', kind: 'consumable', price: 25, heals: 20, healTurns: 3, text: 'Snapper and peppers in a gourd bowl. Restores 20 HP, a little at a time.' },
  { id: 'mango', name: 'Ripe mango', kind: 'consumable', price: 10, heals: 15, text: 'From the plaza stalls. Restores 15 HP.' },
  // The beach market's second stock, once the harbor is Yucayeque's (Chapter 11; Claude's call, Oct 27).
  { id: 'snapper_casabe', name: 'Snapper on casabe', kind: 'consumable', price: 55, heals: 80, text: 'Grilled snapper laid on a round of casabe, the first catch out of a free harbor. Restores 80 HP.' },
  { id: 'soursop_juice', name: 'Soursop juice', kind: 'consumable', price: 40, restores: 20, text: 'Soursop pressed with lime in a gourd, cold from the spring. Restores 20 SP.' },

  // Ardencia (Chapter 3): Cenizal's tavern, and the key item from the treasurer's daughter.
  { id: 'pan_de_ceniza', name: 'Pan de ceniza', kind: 'consumable', price: 25, heals: 35, text: 'Dark bread baked in the ash of the forges. Restores 35 HP.' },
  { id: 'olla', name: 'Olla de Cenizal', kind: 'consumable', price: 40, heals: 60, healTurns: 3, text: 'Beans, pork and peppers from a clay pot. Restores 60 HP, a little at a time.' },
  { id: 'cafe_de_olla', name: 'Café de olla', kind: 'consumable', price: 30, restores: 15, text: 'Coffee with cinnamon and cane sugar, stirred in clay. Restores 15 SP.' },
  {
    id: 'bennys_refusal',
    name: "Benny's Refusal (copy)",
    kind: 'key',
    price: 0,
    text: 'Lord Benny\'s refusal to sign a seventh page, fifty years old. The bankers of Al-Doria, it says, hold the signed copy.',
  },
  // Al-Doria (Chapter 4): the tea seller's stall, and the key items of the vault and the caravan gate.
  { id: 'mint_tea', name: 'Mint tea', kind: 'consumable', price: 35, restores: 20, text: 'Green tea with fresh mint, poured from a height so it foams. Restores 20 SP.' },
  // Ordvik's food tent and horse-trader (Chapter 6).
  { id: 'salted_jerky', name: 'Salted jerky', kind: 'consumable', price: 40, heals: 50, text: 'Dried mutton, salted hard for the winter road. Restores 50 HP.' },
  { id: 'airag', name: 'Airag', kind: 'consumable', price: 35, restores: 16, text: "Fermented mare's milk, sour and fizzing. Restores 16 SP." },
  { id: 'hot_broth', name: 'Hot broth', kind: 'consumable', price: 30, heals: 40, healTurns: 3, text: 'Mutton broth from the food tent, too hot to drink fast. Restores 40 HP, a little at a time.' },
  { id: 'salkhi_treats', name: "Salkhi's treats", kind: 'consumable', price: 10, heals: 1, text: 'Dried apple rings in a felt pouch. Restores 1 HP. Salkhi, watching: "Finally."' },
  // Kirinoura's tea house (Chapter 7).
  { id: 'rice_ball', name: 'Rice ball', kind: 'consumable', price: 45, heals: 60, text: 'Rice pressed round a pickled plum, wrapped in seaweed. Restores 60 HP.' },
  { id: 'green_tea', name: 'Green tea', kind: 'consumable', price: 40, restores: 18, text: 'A bowl of whisked green tea, bitter and bright. Restores 18 SP.' },
  { id: 'miso_broth', name: 'Miso broth', kind: 'consumable', price: 35, heals: 45, healTurns: 3, text: 'Miso and spring onion, too hot to drink fast. Restores 45 HP, a little at a time.' },
  // Agnipur's milk-and-bread stall (Chapter 8).
  { id: 'spiced_milk', name: 'Spiced milk', kind: 'consumable', price: 40, restores: 18, text: 'Hot milk with cardamom and a thread of saffron. Restores 18 SP.' },
  { id: 'flatbread', name: 'Flatbread', kind: 'consumable', price: 40, heals: 50, text: 'Flatbread from the stall\'s clay oven, still blistered. Restores 50 HP.' },
  // Kingsmere's pie shop (Chapter 9).
  { id: 'meat_pie', name: 'Meat pie', kind: 'consumable', price: 55, heals: 80, text: 'A raised pie, steak and onion, the crust dark with egg. Restores 80 HP.' },
  { id: 'kingsmere_tea', name: 'Kingsmere tea', kind: 'consumable', price: 45, restores: 20, text: 'Black tea, strong enough to stand a spoon in, with milk. Restores 20 SP.' },
  { id: 'scones', name: 'Scones', kind: 'consumable', price: 35, heals: 40, text: 'Two scones, a little burnt, with butter. Restores 40 HP.' },
  { id: 'lentil_stew', name: 'Lentil stew', kind: 'consumable', price: 35, heals: 40, healTurns: 3, text: 'Yellow lentils and cumin, too hot to eat fast. Restores 40 HP, a little at a time.' },
  { id: 'dates', name: 'Dates', kind: 'consumable', price: 30, heals: 45, text: 'Medjool dates from the oases past the Desert Edge. Restores 45 HP.' },
  { id: 'tagine', name: 'Lamb tagine', kind: 'consumable', price: 55, heals: 80, healTurns: 3, text: 'Lamb, apricots and almonds under a clay cone. Restores 80 HP, a little at a time.' },
  {
    id: 'brasador_coin',
    name: "Yari's fare coin",
    kind: 'key',
    price: 0,
    text: 'A Brasador coin from the resistance\'s oil money, given to Yari for the fare. The trader would not take it: "Not Crown, not ours."',
  },
  {
    id: 'benny_half_sheet',
    name: "Benny's half-sheet",
    kind: 'key',
    price: 0,
    text: 'From the witness\'s chest in the Dorini vault, in young Benny\'s hand: "I will not put my name to this page. B. Rodriguez."',
  },
  {
    id: 'dorini_pass',
    name: 'Dorini caravan pass',
    kind: 'key',
    price: 0,
    text: 'The Merchant-Prince\'s seal on a caravan pass. A Dorini caravan is not stopped at the eight gates of Eightgate.',
  },
  {
    id: 'petition',
    name: "Xaraguá's Petition of Breach",
    kind: 'key',
    price: 0,
    text: "Copies in Cacique Anaco's hand, carried by his daughter: the petition the Hall received forty-nine years ago and never heard.",
  },
  // Chapter 6, Ordvik: the stolen standard, the Crown's purse from the thief's tent, Ironvow's token for the
  // chamberlain's chair (Se-5 stage 2) and Torvald's sealed letter to Kuroshi.
  {
    id: 'ironvow_standard',
    name: 'The Ironvow standard',
    kind: 'key',
    price: 0,
    text: 'A pole of black ash with nine horse-tails bound under a slate-grey disc. The Ironvow swear on it, or not at all.',
  },
  {
    id: 'crown_purse',
    name: "The Crown's purse",
    kind: 'key',
    price: 0,
    text: "Three hundred in Throne gold from Grimvald's tent, and a voucher: \"for the recovery of a sacred object, payable on the council's vote.\"",
  },
  {
    id: 'token_ironvow',
    name: 'Ironvow token',
    kind: 'key',
    price: 0,
    text: "A braid cut from the standard's horse-tail by Torvald himself: \"For the chamberlain's chair, when there is a Claim. Ironvow sits.\"",
  },
  {
    id: 'torvald_letter',
    name: "Torvald's letter",
    kind: 'key',
    price: 0,
    text: 'A sealed horn-case for Kaede Suzumori of Kuroshi, from the chieftain of the Ironvow. Kuroshi speaks to those Skarragol has spoken for.',
  },
  // Chapter 7, Kirinoura: the spy ledger out of the stacks (K-2), Kayla's glyph card, Haru's lantern and Kayla's crane
  // (Anissa's), the Fog Files from under the floor stone, and Suzumori's token for the chamberlain's chair.
  {
    id: 'spy_ledger',
    name: 'The Suzumori spy ledger',
    kind: 'key',
    price: 0,
    text: 'A thick ledger bound in grey, out of the sealed stacks: the Ash Wars, as Kirinoura\'s informants counted them. Kayla will want it back.',
  },
  {
    id: 'kayla_glyphs',
    name: "Kayla's glyph card",
    kind: 'key',
    price: 0,
    text: 'A paper card in Kayla\'s small hand: Lady Sayo\'s house glyphs, crane and pine and the rest. "You will need these where you are going. I did not say where."',
  },
  {
    id: 'haru_lantern',
    name: "Haru's lantern",
    kind: 'key',
    price: 0,
    text: 'A folding paper lantern, unlit. Haru gave it to Anissa at the maze gate: "Hold this. It makes you harder to lose." She is holding it.',
  },
  {
    id: 'kayla_crane',
    name: "Titi Kayla's crane",
    kind: 'key',
    price: 0,
    text: 'A paper crane Kayla folded while she listened, pushed across the desk to Anissa. "It keeps my hands from writing things down."',
  },
  {
    id: 'fog_files',
    name: 'The Fog Files',
    kind: 'key',
    price: 0,
    text: 'A lacquer box from under the file house floor: The Buyer\'s Mark, a Crown list with every name cut away, and The Ledger of Outflows, in cipher.',
  },
  {
    id: 'token_suzumori',
    name: 'Suzumori token',
    kind: 'key',
    price: 0,
    text: 'A paper crane folded from the margin of the turned Neutrality Order, the Suzumori seal pressed into its wing. "For the chamberlain\'s chair. Suzumori sits."',
  },
  // Chapter 8, Agnipur: the runners' relay lamp (carried, J-2), Dhanraj's ledger of advances, Agnivansh's token for the
  // chamberlain's chair, and Titi Aiyana's mirror (Anissa's, after the roofs).
  {
    id: 'relay_lamp',
    name: "The runners' lamp",
    kind: 'key',
    price: 0,
    text: 'A brass lamp on a pole, lit at the runners\' hearth. Harbor to temple before it gutters. Not the main street.',
  },
  {
    id: 'dhanraj_ledger',
    name: "Dhanraj's Ledger of Advances",
    kind: 'key',
    price: 0,
    text: 'Every jar in Agnipur\'s harbor, bought with advances from the Throne\'s purchasing office, Kingsmere. "Hold until the Court signs for the chain."',
  },
  {
    id: 'token_agnivansh',
    name: 'Agnivansh token',
    kind: 'key',
    price: 0,
    text: 'A small brass lamp, lit from the Court\'s flame by Meera herself. "For the chamberlain\'s chair. Agnivansh sits, and burns."',
  },
  {
    id: 'aiyana_disc',
    name: "Titi Aiyana's mirror",
    kind: 'key',
    price: 0,
    text: 'A polished bronze disc the size of a plate, from Aiyana\'s apron. Anissa held the last of the light in it. She is keeping it.',
  },
  // Chapter 9, Kingsmere: Edmund's hat (Anissa's), the recital bill (Anissa's), the papers from the archive, the purge
  // list (Al-3), the Crown Chronicle (Al-2).
  { id: 'edmund_hat', name: "Edmund's hat", kind: 'key', price: 0, text: 'A good grey hat, a little wet. "Hats get hit here. People don\'t, as a rule." Anissa is keeping it.' },
  { id: 'recital_bill', name: "Uncle Sebastian's recital", kind: 'key', price: 0, text: 'The bill from the notice post: the Agatha Toccata, by the Regent\'s command. Anissa turned every page on the beat. She counted.' },
  { id: 'crown_pact', name: "The Crown's Pact With Ardencia", kind: 'key', price: 0, text: 'To the Lord of Ardencia, the Throne at the Regent\'s pleasure, and the harbor dues of Xaraguá for ten years. Paid, in full.' },
  { id: 'ash_road_accounts', name: 'The Ash Road Accounts', kind: 'key', price: 0, text: 'Columns of figures leaving Ardencia\'s treasury into accounts marked with a cipher and a road. Haru has no key for it yet.' },
  { id: 'thomas_record', name: "Thomas Stillwater's Record", kind: 'key', price: 0, text: 'The Seventh Clause in the Crown\'s words. In the margin: Xaraguá was never asked. T.S. At the foot: Written at a quarter to three, by the tower bell.' },
  { id: 'crown_chronicle', name: 'The Crown Chronicle', kind: 'key', price: 0, text: 'The Crown\'s account of the Ash Wars, the third of four. On the fly-leaf: Written to order. The true count is in Kirinoura. T.S.' },
  // Chapter 10, the Muster: the smugglers' ledger (Z-6; the exposed route's second piece) and the Dorini seal.
  { id: 'smugglers_ledger', name: "The smugglers' ledger", kind: 'key', price: 0, text: 'A carter\'s ledger from the mangroves: muskets "for the Muster\'s friends", night after night, under a closed hand. A house\'s sigil is drawn in the last margin.' },
  { id: 'token_dorini', name: 'The Dorini seal', kind: 'key', price: 0, text: 'A green seal from the admiral\'s ledger, for the chamberlain\'s chair: the Dorini will sit at a Claim. "The guild sits when the guild is paid."' },
  // Chapter 11, the War of the Harbor: Xaraguá's seat token (Se-5: a carved paddle, given by Anaco to Yari to Gianna), and
  // the charm the betrayer's house leaves on the sand for the companion who defied it a second time (STORY 6.9's stat boost).
  { id: 'token_xaragua', name: 'The carved paddle', kind: 'key', price: 0, text: 'A canoe paddle no longer than a hand, carved with the three names of the first oath. For the Yaguana chair. "Mine to carry. Yours to set down."' },
  { id: 'purge_list', name: 'The Purge List', kind: 'key', price: 0, text: 'Names and streets, "quiet" beside each, by the Hushed\'s word. On its cover, a grey thumbprint and three words: Warn them first.' },
  // Gear (owner decision, Oct 15): staffs for mages, bows for archers, blades for warriors; anyone may
  // wear any armour, but robes suit mages (magic, SP), leather archers (speed, attack) and heavy armour
  // warriors (defence, HP, slower). Rarity sets the colour behind the picture and how good it is:
  // common and uncommon give stats, rare and epic add a special, legendary are the secret items.
  // Each has a set level (worn below it, half its bonus counts); legendary grow with their wearer.

  // Weapons: every "X of Y" (data/weapons.ts).
  ...WEAPONS,

  // Robes (suit mages).
  { id: 'archivist_robe', name: "Archivist's robe", kind: 'gear', slot: 'armor', armor: 'robe', level: 1, price: 60, stats: { def: 1, sp: 4, mag: 1 }, text: 'Blue with gold trim, ink on both cuffs.' },
  { id: 'temple_robe', level: 4, rarity: 'uncommon', name: 'Temple robe', kind: 'gear', slot: 'armor', armor: 'robe', price: 220, stats: { def: 2, sp: 8, mag: 2 }, text: "White and gold, the robe of the Gaze's keepers. It smells of lamp oil." },
  // Leather (suits archers).
  { id: 'woven_tunic', name: 'Woven tunic', kind: 'gear', slot: 'armor', armor: 'leather', level: 1, price: 60, stats: { def: 2, hp: 4, spd: 1 }, text: 'Green cotton, woven tight on a Xaraguá loom, leather at the shoulders.' },
  { id: 'padded_vest', level: 3, rarity: 'uncommon', name: 'Padded vest', kind: 'gear', slot: 'armor', armor: 'leather', price: 140, stats: { def: 4, hp: 6, spd: 1, atk: 1 }, text: 'Quilted cotton over leather. Light enough to run in.' },
  // Heavy armour (suits warriors).
  { id: 'officer_coat', name: "Officer's coat", kind: 'gear', slot: 'armor', armor: 'heavy', level: 1, price: 150, stats: { def: 5, hp: 10 }, text: 'Red wool and gold buttons over a mail lining, heavy as a promise.' },
  { id: 'blackened_plate', level: 10, rarity: 'uncommon', name: 'Blackened plate', kind: 'gear', slot: 'armor', armor: 'heavy', price: 620, stats: { def: 12, hp: 20, spd: -1 }, text: 'Brasador plate, blackened in the forge so it never shines on a night march.' },
  { id: 'cinder_coat', level: 9, rarity: 'uncommon', name: 'Cinder coat', kind: 'gear', slot: 'armor', armor: 'leather', price: 380, stats: { def: 6, hp: 10, spd: 2 }, text: 'Oiled black leather over quilting. The sparks of the forge roll off it.' },
  { id: 'ember_robe', level: 9, rarity: 'uncommon', name: 'Ember robe', kind: 'gear', slot: 'armor', armor: 'robe', price: 360, stats: { def: 4, sp: 12, mag: 3 }, text: 'Red wool with a black hem, the robe of the Biblioteca Vieja\'s readers.' },
  // Al-Doria's tier (Chapter 4: the shops stock tiers 8 and 12).
  { id: 'merchant_robe', level: 12, rarity: 'uncommon', name: "Merchant's robe", kind: 'gear', slot: 'armor', armor: 'robe', price: 640, stats: { def: 6, sp: 16, mag: 4 }, text: 'Cream silk under a green sash, a slip-book pocket in the sleeve.' },
  { id: 'desert_leathers', level: 12, rarity: 'uncommon', name: 'Desert leathers', kind: 'gear', slot: 'armor', armor: 'leather', price: 600, stats: { def: 8, hp: 14, spd: 3 }, text: 'Sand-coloured leather over cotton, cool by day, warm by night.' },
  { id: 'gilded_mail', level: 12, rarity: 'uncommon', name: 'Gilded mail', kind: 'gear', slot: 'armor', armor: 'heavy', price: 820, stats: { def: 15, hp: 26, spd: -1 }, text: 'Guild mail with brass at the collar. The caravan guards wear it under their robes.' },
  // Eightgate's tier (Chapter 5: the Envoys' Outfitter stocks tier 16; a Throne city's prices).
  { id: 'keeper_robe', level: 16, rarity: 'uncommon', name: "Keeper's robe", kind: 'gear', slot: 'armor', armor: 'robe', price: 600, stats: { def: 8, sp: 20, mag: 5 }, text: 'Plain grey wool, cut for an archivist who never leaves the stacks. Warm in a cold Hall.' },
  { id: 'envoy_leathers', level: 16, rarity: 'uncommon', name: "Envoy's leathers", kind: 'gear', slot: 'armor', armor: 'leather', price: 650, stats: { def: 10, hp: 18, spd: 3 }, text: 'Riding leathers for an envoy on the roads between the gates, violet piping at the cuff.' },
  { id: 'warden_coat', level: 16, rarity: 'uncommon', name: "Warden's coat", kind: 'gear', slot: 'armor', armor: 'heavy', price: 700, stats: { def: 18, hp: 30, spd: -1 }, text: 'Mail under grey wool, the coat the Seat\'s gate wardens wore before there were Sealbearers.' },
  // Ordvik's tier (Chapter 6: the furrier stocks tier 16; Bayarmaa's riding coat is her own).
  { id: 'braided_cloak', level: 15, rarity: 'uncommon', name: 'Braided riding coat', kind: 'gear', slot: 'armor', armor: 'leather', price: 560, stats: { def: 9, hp: 14, spd: 2 }, text: 'Grey felt over leather, the hem braided so it never catches on a saddle.' },
  { id: 'fur_mantle', level: 16, rarity: 'uncommon', name: 'Fur mantle', kind: 'gear', slot: 'armor', armor: 'heavy', price: 720, stats: { def: 17, hp: 32, spd: -1 }, text: 'Wolf fur over a mail shirt. On the plateau nobody asks whose wolf.' },
  { id: 'felt_robe', level: 16, rarity: 'uncommon', name: "Skald's felt robe", kind: 'gear', slot: 'armor', armor: 'robe', price: 620, stats: { def: 8, sp: 22, mag: 5 }, text: 'Thick blue-grey felt with tally marks stitched down the sleeve, one for every saga its owner knows.' },
  // Kirinoura's tier (Chapter 7): Haru's own travelling kimono (tier 16), and the armourer's tier-20 lacquer, sold
  // honestly at half its bonus until the party reaches it.
  { id: 'grey_kimono', level: 16, rarity: 'uncommon', name: 'Grey travelling kimono', kind: 'gear', slot: 'armor', armor: 'leather', price: 600, stats: { def: 9, hp: 12, spd: 3 }, text: 'Plain grey over a quilted vest, with more pockets than a kimono should have.' },
  { id: 'lacquered_armour', level: 20, rarity: 'uncommon', name: 'Lacquered armour', kind: 'gear', slot: 'armor', armor: 'leather', price: 800, stats: { def: 12, hp: 18, spd: 2 }, text: 'Black lacquered plates laced with violet cord. Light, and loud in the fog.' },
  // Agnipur's tier (Chapter 8): Vikram's own saffron duelling coat (tier 20), and the swordsmith's scale (tier 24).
  { id: 'saffron_coat', level: 20, rarity: 'uncommon', name: 'Saffron duelling coat', kind: 'gear', slot: 'armor', armor: 'leather', price: 780, stats: { def: 11, hp: 16, spd: 2 }, text: 'Saffron silk over a quilted vest, cut for a man who fights before breakfast.' },
  { id: 'scale_armour', level: 24, rarity: 'uncommon', name: 'Scale armour', kind: 'gear', slot: 'armor', armor: 'heavy', price: 1000, stats: { def: 18, hp: 30, spd: -1 }, text: 'Brass scales on oiled leather. It rings like a temple when you walk.' },
  // Kingsmere's tier (Chapter 9): Edmund's own greatcoat (tier 20), and the outfitter's oilcloth coat (tier 24).
  { id: 'stillwater_greatcoat', level: 20, rarity: 'uncommon', name: 'Stillwater greatcoat', kind: 'gear', slot: 'armor', armor: 'heavy', price: 820, stats: { def: 14, hp: 24, spd: -1 }, text: 'A long grey greatcoat with a mail lining. It has been apologised in, many times.' },
  // Pòdlimyè at the Muster (Chapter 10): the Harbor forge's robe for an archivist at war (tier 24).
  { id: 'muster_robe', level: 24, rarity: 'uncommon', name: 'Indigo campaign robe', kind: 'gear', slot: 'armor', armor: 'robe', price: 900, stats: { def: 11, sp: 26, mag: 7 }, text: 'Zetwal indigo over a quilted lining, cut short for climbing gangways. Tati Coco would have something to say about the hem.' },
  // Yucayeque's bow-maker once the harbor is taken (Chapter 11; Claude's call, Oct 27): cotton for the canoes (tier 24).
  { id: 'harbor_cotton', level: 24, rarity: 'uncommon', name: 'Harbor cotton', kind: 'gear', slot: 'armor', armor: 'leather', price: 950, stats: { def: 16, hp: 26, spd: 3 }, text: 'Yaguana cotton quilted three times for the canoes, with a teal border. It dries before you reach the beach.' },
  { id: 'oilcloth_coat', level: 24, rarity: 'uncommon', name: 'Oilcloth coat', kind: 'gear', slot: 'armor', armor: 'leather', price: 1000, stats: { def: 17, hp: 28, spd: 1 }, text: 'Kingsmere\'s answer to the weather: waxed cloth over quilting. Nothing gets in, eventually.' },
  { id: 'iron_cuirass', level: 4, rarity: 'uncommon', name: 'Iron cuirass', kind: 'gear', slot: 'armor', armor: 'heavy', price: 300, stats: { def: 8, hp: 14, spd: -1 }, text: 'Plates over padding. Slows you down; stops what you cannot dodge.' },

  // Charms (anyone).
  // Yucayeque: the carver's charms and the bow-maker's cotton (Chapter 2).
  { id: 'shell_beads', name: 'Shell beads', kind: 'gear', slot: 'charm', level: 2, price: 90, stats: { spd: 2, hp: 3 }, text: 'A string of white and pink shell beads. They click softly when you run.' },
  {
    id: 'carved_charm', level: 3, rarity: 'uncommon', name: 'Carved charm', kind: 'gear', slot: 'charm', price: 150, stats: { def: 2, mag: 1 },
    text: 'A small face carved in dark wood, worn on a cotton cord. The carver says it watches your back.',
  },
  { id: 'cotton_tunic', level: 4, rarity: 'uncommon', name: 'Cotton tunic', kind: 'gear', slot: 'armor', armor: 'leather', price: 230, stats: { def: 4, hp: 8, spd: 2 }, text: 'Thick Yaguana cotton, quilted twice, with a teal border. Light, cool and hard to cut.' },
  { id: 'iron_ring', name: 'Iron ring', kind: 'gear', slot: 'charm', level: 8, rarity: 'uncommon', price: 260, stats: { atk: 3, def: 2 }, text: 'A plain Brasador ring, hammered thick. For luck, they say, and for punching.' },
  { id: 'ember_ring', name: 'Ember ring', kind: 'gear', slot: 'charm', level: 10, rarity: 'rare', price: 480, stats: { mag: 3, sp: 6 }, special: { kind: 'spRegen', value: 4, text: '+4% SP each turn.' }, text: 'A ring with a chip of forge-glass that never quite cools. +4% SP each turn in battle.' },
  { id: 'brass_scale_charm', name: 'Brass-scale charm', kind: 'gear', slot: 'charm', level: 11, rarity: 'uncommon', price: 420, stats: { mag: 3, spd: 2 }, text: 'A moneychanger\'s tiny scale on a cord. It weighs nothing, and you weigh everything.' },
  { id: 'sand_amulet', name: 'Sand amulet', kind: 'gear', slot: 'charm', level: 12, rarity: 'uncommon', price: 380, stats: { def: 3, hp: 10 }, text: 'Blue glass and silver against the evil eye, and against the desert sun.' },
  // Chapter 2's side quest rewards (Oct 20): the fisher's net float, and the button from the hutia's hoard.
  { id: 'net_float_charm', name: 'Net-float charm', kind: 'gear', slot: 'charm', level: 4, rarity: 'uncommon', price: 120, stats: { spd: 2, hp: 3 }, text: 'A carved gourd float from a Yucayeque net, on a knotted cord. The fisher tied the knot himself.' },
  {
    id: 'brass_button_charm', level: 3, rarity: 'rare', name: 'Brass button charm', kind: 'gear', slot: 'charm', price: 110, stats: { hp: 4 },
    special: { kind: 'crit', value: 3, text: '+3% critical chance.' },
    text: 'A Crown marine\'s brass button from the hutia\'s hoard, polished by a hutia\'s paws. Lucky, Yari says, for everyone but the marine.',
  },
  { id: 'sealed_satchel_charm', name: 'Sealed-satchel charm', kind: 'gear', slot: 'charm', level: 15, rarity: 'uncommon', price: 450, stats: { mag: 4, sp: 8, def: 1 }, text: 'A courier\'s tiny brass satchel on a chain, sealed shut. Nobody knows what is in it. Nobody asks.' },
  { id: 'round_shield_charm', name: 'Round-shield charm', kind: 'gear', slot: 'charm', level: 16, rarity: 'uncommon', price: 450, stats: { def: 4, hp: 8 }, text: 'A hand-sized wooden shield boss on a thong. Rap it twice for luck before a crossing.' },
  { id: 'horse_tack_charm', name: 'Horse-tack charm', kind: 'gear', slot: 'charm', level: 15, rarity: 'uncommon', price: 300, stats: { spd: 4, atk: 1 }, text: 'A bronze bridle ring, worn smooth. Whoever wears it rides first.' },
  { id: 'silk_mask_charm', name: 'Silk mask charm', kind: 'gear', slot: 'charm', level: 20, rarity: 'uncommon', price: 400, stats: { spd: 4, def: 2 }, text: 'A little silk fox mask on a cord, from the paper-maker. Nobody remembers who wore it.' },
  // Agnipur (Chapter 8): the runners' beads (J-2's reward: the fallback for fire skills +15%, as stats) and the bead
  // seller's brass lamp charm.
  { id: 'flame_bead_bracelet', name: 'Flame-bead bracelet', kind: 'gear', slot: 'charm', level: 20, rarity: 'uncommon', price: 400, stats: { mag: 4, atk: 2 }, text: 'Red glass beads on a runner\'s cord, each with a fleck of gold in it. Fire likes them.' },
  { id: 'brass_lamp_charm', name: 'Brass lamp charm', kind: 'gear', slot: 'charm', level: 20, rarity: 'uncommon', price: 300, stats: { def: 3, hp: 10 }, text: 'A thumb-sized brass lamp on a cord, empty. The bead seller swears it keeps the heat off.' },
  // Kingsmere (Chapter 9): the jeweller's law-seal brooch and steel ring (the brooch's quirk is cut: stats and text), and
  // the Almoner's brooch from the Assize (Calm is not built: stats).
  { id: 'law_seal_brooch', name: 'Law-seal brooch', kind: 'gear', slot: 'charm', level: 22, rarity: 'uncommon', price: 350, stats: { def: 3, hp: 8 }, text: 'A silver brooch with the Witness\'s seal. Kingsmere lawyers wear it to court. Thieves dislike it.' },
  { id: 'steel_ring', name: 'Plain steel ring', kind: 'gear', slot: 'charm', level: 22, rarity: 'uncommon', price: 320, stats: { atk: 3, def: 3 }, text: 'A plain steel ring, very well made. The jeweller says plain is the hardest thing to make.' },
  { id: 'charity_brooch', name: "The Crown's charity", kind: 'gear', slot: 'charm', level: 24, rarity: 'uncommon', price: 500, stats: { def: 4, mag: 4 }, text: 'The Almoner\'s brooch: the Crown\'s charities, a small closed hand in silver. Taken in the Assize.' },
  // Yucayeque's carver once the harbor is taken (Chapter 11; Claude's call, Oct 27): his gun for the fleet's children.
  { id: 'carved_cannon_charm', name: 'Carved cannon', kind: 'gear', slot: 'charm', level: 26, rarity: 'uncommon', price: 480, stats: { atk: 3, spd: 3 }, text: 'A thumb-sized cannon in dark wood, on a cotton cord. It points out to sea, the carver says, and always will.' },
  { id: 'tassel_charm', name: 'Tassel of the standard', kind: 'gear', slot: 'charm', level: 26, rarity: 'uncommon', price: 500, stats: { atk: 4, hp: 6 }, text: 'A horse-tail tassel cut from the Ironvow standard Hrafn sold. Bayarmaa tied it on herself.' },
  { id: 'paper_seal_charm', name: 'Paper seal', kind: 'gear', slot: 'charm', level: 26, rarity: 'uncommon', price: 500, stats: { mag: 4, spd: 2 }, text: 'A Suzumori file seal, folded small. Haru says it is definitely not a spy\'s.' },
  { id: 'wick_ring', name: 'Wick-ring', kind: 'gear', slot: 'charm', level: 26, rarity: 'uncommon', price: 500, stats: { atk: 4, sp: 4 }, text: 'A brass ring from the steward\'s lamp, where the wick went. Vikram wears it on his thumb.' },
  // The Claim (Chapter 12): the Regent's chain of office, left on the dais's step (tier 28; the outline section 5).
  { id: 'chain_of_office', name: 'Chain of office', kind: 'gear', slot: 'charm', level: 28, rarity: 'uncommon', price: 600, stats: { def: 6, mag: 4 }, text: 'The Lord Regent\'s chain of office, left on the dais\'s step. It weighs what it weighed on him.' },
  // Volume One (Se-1, closed in Chapter 12): Grandmother's missing book, from Mother's shelf, with Mother's margins.
  { id: 'volume_one', name: 'Ash Wars Gossip, Volume One', kind: 'key', price: 0, text: 'Grandmother lent it to Mother twenty years ago. Mother has written in the margins, which Grandmother will not forgive.' },
  { id: 'clerk_seal_charm', name: "Clerk's seal", kind: 'gear', slot: 'charm', level: 26, rarity: 'uncommon', price: 500, stats: { mag: 4, def: 2 }, text: 'The Merchant-Prince\'s clerk\'s seal, given back. Samira says it is the first thing the guild ever gave her for free.' },
  { id: 'sea_glass_charm', name: 'Sea-glass charm', kind: 'gear', slot: 'charm', level: 1, price: 70, stats: { spd: 2 }, text: 'Green sea glass on a cord. Light on the neck, quick on the feet.' },
  { id: 'boar_tusk', name: 'Boar-tusk charm', kind: 'gear', slot: 'charm', level: 1, rarity: 'uncommon', price: 60, stats: { atk: 2, hp: 4 }, text: 'A tusk from the cane-field boar, on a cord. A story to tell.' },
  {
    id: 'sun_charm', level: 2, rarity: 'rare', name: 'Sun-stitched charm', kind: 'gear', slot: 'charm', price: 90, stats: { hp: 8, def: 1 },
    special: { kind: 'regen', value: 4, text: 'Heals 4% of max HP each turn in battle.' },
    skill: 'warm_thread',
    text: 'A cloth charm stitched with a sun. In battle it heals a little each turn.', showcase: 'reward',
  },
  // The secret items built Oct 27 (the Nightingale Key, the Unbroken Wick, the Patient Hour) and their quests' key items.
  ...SECRET_ITEM_LIST,
];

export const ITEMS: Readonly<Record<string, ItemDef>> = Object.fromEntries(ITEM_LIST.map((i) => [i.id, i]));

/**
 * The companion of the house that sailed to the Crown leads the flank on the Canoe Beach (Chapter 11; STORY 6.9, the second
 * defiance; the second review's 3.13: from the gun taken until the flank is done, so not the headland's fight).
 */
function flankLeads(house: string): Condition {
  return { all: [{ flag: `muster.betrayer.${house}` }, { flag: 'muster.betrayed' }, { flag: 'story.headland_won' }, { notFlag: 'war.flank_done' }] };
}

export const MEMBERS: readonly MemberDef[] = [
  {
    id: 'gianna', name: 'Gianna', role: 'Archivist-Mage', house: 'Kay Soley', portrait: 'gianna', era: 'present', class: 'mage', anissaBond: true,
    passives: [
      {
        name: "Anissa's Light",
        text: `Every ${ANISSA_SP_EVERY} of Gianna's turns in battle, Anissa's light restores ${Math.round(ANISSA_SP_SHARE * 100)}% of her SP.`,
        known: { flag: 'party.anissa' },
      },
      { name: 'Spark and Surge', text: `Each action gives Anissa a Spark (Guard gives 2). At ${SURGE_COST}, Gianna can Surge: her next blow or spell hits half again as hard.`, known: { flag: 'party.anissa' } },
      { name: 'Archivist\'s thrift', text: 'Her skills cost a quarter less SP.' },
    ],
    base: { hp: 42, sp: 30, atk: 6, def: 6, mag: 14, spd: 9 }, growth: { hp: 5, sp: 4, atk: 1, def: 1, mag: 2, spd: 1 },
    start: { weapon: 'archivist_staff', armor: 'archivist_robe' },
  },
  {
    id: 'anissa', name: 'Anissa', role: 'Surge (support)', house: 'Kay Soley', portrait: 'anissa', era: 'present', support: true,
    joins: { flag: 'party.anissa' }, base: zero, growth: zero,
  },
  {
    id: 'yari', name: 'Yari', role: 'Archer', house: 'Yaguana', portrait: 'yari', era: 'present', class: 'archer',
    passives: [
      { name: 'Voice of the Opía', text: 'When any fighter falls, her next shot hits a fifth harder (up to three times).' },
      { name: 'The hutia', text: 'After a win, a 1 in 8 chance her hutia steals something shiny.' },
    ],
    // She hides in the petroglyph cave while the Crown holds Yucayeque (every marine knows her face). In Eightgate she
    // stays at Coco's workshop while the sisters go into the Archive as seamstresses (story.party_split, Chapter 5). At the
    // Hearing and the afternoon after it (Chapter 12) every companion stands behind a chair, out of the line
    // (story.hall_seated: tools/maps/seat.ts places them; it is cleared at the end).
    joins: { all: [{ flag: 'story.yari_asked' }, { notFlag: 'story.yari_hidden' }, { notFlag: 'story.party_split' }, { notFlag: 'story.hall_seated' }] },
    base: { hp: 50, sp: 16, atk: 12, def: 7, mag: 6, spd: 13 }, growth: { hp: 6, sp: 2, atk: 2, def: 1, mag: 1, spd: 2 },
    start: { weapon: 'yaguana_bow', armor: 'woven_tunic' },
  },
  {
    id: 'patricio', name: 'Patricio', role: 'Warden', house: 'Kay Soley', portrait: 'patricio', look: 'patricio_young', era: 'echo', class: 'warrior',
    passives: [{ name: 'Hold the line', text: 'When he Guards, the allies behind him take a fifth less damage too.' }],
    base: { hp: 70, sp: 10, atk: 13, def: 12, mag: 3, spd: 7 }, growth: { hp: 8, sp: 1, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'marshal_cutlass', armor: 'officer_coat' },
  },
  // The companions to come (fighters as data, Oct 20; COMBAT.md 2 and 9): each is this entry, their skills in
  // data/battles.ts and a placeholder look (assets.config.ts NPC_SPRITES; a painted battle/<look>.png replaces the
  // walk sheet in battle). Azzy joins in Ardencia (Chapter 3, the forge); Samira in Al-Doria (Chapter 4, the guild
  // vault, before Qasim's fight: party.samira).
  {
    id: 'azzy', name: 'Azzy', role: 'Blade-Knight', house: 'Brasador', portrait: 'azzy', era: 'present', class: 'warrior',
    passives: [
      { name: 'Sangre Ardiente', text: 'Each foe he fells this battle: +5% ATK (up to +25%).', effect: { kind: 'atkPerFell', share: 0.05, max: 0.25 } },
    ],
    // Away at Coco's workshop while the sisters are her seamstresses (Chapter 5: story.party_split).
    joins: { all: [{ flag: 'party.azzy' }, { notFlag: 'story.party_split' }, { notFlag: 'story.hall_seated' }] },
    base: { hp: 60, sp: 14, atk: 14, def: 10, mag: 4, spd: 9 }, growth: { hp: 7, sp: 2, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'steel_saber', armor: 'officer_coat' },
  },
  {
    id: 'samira', name: 'Samira', role: 'Alchemist', house: 'Dorini', portrait: 'samira', era: 'present', class: 'mage', spellbook: false,
    passives: [
      { name: 'Baraka Dorini', text: 'Gold from battles won with her: +10%.', effect: { kind: 'battleGold', share: 0.1 } },
      { name: 'Daftar al-Dorini', text: 'She pays in gold for what she needs; the realm\'s Wealth makes each coin go further (+1% a point, up to +30%).' },
    ],
    joins: { all: [{ flag: 'party.samira' }, { notFlag: 'story.party_split' }, { notFlag: 'story.hall_seated' }] },
    leads: flankLeads('al_doria'),
    base: { hp: 44, sp: 28, atk: 7, def: 6, mag: 12, spd: 11 }, growth: { hp: 5, sp: 3, atk: 1, def: 1, mag: 2, spd: 1 },
    start: { weapon: 'driftwood_staff_of_focus', armor: 'archivist_robe' },
  },
  // Bayarmaa of the Ironvow (Chapter 6; COMBAT 9.4, the outline section 9 with its review's 3.9 and 3.11): she joins at
  // the Moot under the envoy's bond (party.bayarmaa) and leads in her own chapter, so the player plays the Raider in it;
  // after the chapter the roster's order holds (Samira before her) and Swap brings her in. The fastest in the party.
  {
    id: 'bayarmaa', name: 'Bayarmaa', role: 'Raider', house: 'Ironvow', portrait: 'bayarmaa', era: 'present', class: 'warrior',
    passives: [
      { name: "Ironvow's Oath", text: 'Her opening time is always the lowest in the party: she rides first.', effect: { kind: 'opensFirst' } },
      { name: 'Salkhi', text: 'Her grey mare fights beside her: Hoofbeat is the mare\'s kick.' },
    ],
    joins: { all: [{ flag: 'party.bayarmaa' }, { notFlag: 'story.hall_seated' }] },
    leads: { any: [{ all: [{ flag: 'party.bayarmaa' }, { notFlag: 'act6.complete' }] }, flankLeads('skarragol')] },
    base: { hp: 56, sp: 16, atk: 13, def: 8, mag: 4, spd: 15 }, growth: { hp: 6, sp: 2, atk: 2, def: 1, mag: 0, spd: 2 },
    start: { weapon: 'steppe_sabre_of_swiftness', armor: 'braided_cloak' },
  },
  // Haru Suzumori (Chapter 7; COMBAT 9.5, the outline section 9.1 with its review's 3.6 and 3.10): he joins at the Hall at
  // the lantern hour (party.haru), before the maze, and leads in his own chapter like Bayarmaa in hers (no third
  // "placed before" entry: after the chapter the roster's order holds and Swap brings him in). The fastest in the
  // party; Kagemimi finds out the Paper Fox among his decoys.
  {
    id: 'haru', name: 'Haru', role: 'Shadow agent', house: 'Suzumori', portrait: 'haru', era: 'present', class: 'warrior',
    passives: [{ name: 'Definitely not a spy', text: 'He listens before he moves: Kagemimi tells a foe\'s next move, and finds out a disguise.' }],
    joins: { all: [{ flag: 'party.haru' }, { notFlag: 'story.hall_seated' }] },
    leads: { any: [{ all: [{ flag: 'party.haru' }, { notFlag: 'act7.complete' }] }, flankLeads('kuroshi')] },
    base: { hp: 44, sp: 22, atk: 11, def: 7, mag: 9, spd: 16 }, growth: { hp: 5, sp: 3, atk: 2, def: 1, mag: 1, spd: 2 },
    start: { weapon: 'paper_knife_of_swiftness', armor: 'grey_kimono' },
  },
  // Vikram of the Agnivansh (Chapter 8; COMBAT 9.7, the outline section 9.1 with its review's 3.8 and 3.9): he joins at
  // the flame, when he tears the curtain and defies the priests (party.vikram), before the boss, and leads in his own
  // chapter like Bayarmaa and Haru in theirs. The hardest hitter after Azzy, the second fastest, the lowest DEF: a glass
  // cannon. Agni ki Shakti (skills cost 1 SP less) and Rakt Ki Pyaas (a felling blow, and his next turn at once) are real.
  {
    id: 'vikram', name: 'Vikram', role: 'Fire duelist', house: 'Agnivansh', portrait: 'vikram', era: 'present', class: 'warrior',
    passives: [
      { name: 'Agni ki Shakti', text: 'The power of fire: his skills cost 1 SP less (never under 1).', effect: { kind: 'spLess', sp: 1 } },
      { name: 'Rakt Ki Pyaas', text: 'When his blow fells a foe, his next turn comes at once.', effect: { kind: 'turnOnFell' } },
      { name: 'Out of breath', text: 'After every battle. It changes nothing in the fight. He says so.' },
    ],
    joins: { all: [{ flag: 'party.vikram' }, { notFlag: 'story.hall_seated' }] },
    leads: { any: [{ all: [{ flag: 'party.vikram' }, { notFlag: 'act8.complete' }] }, flankLeads('jwaladesh')] },
    base: { hp: 40, sp: 20, atk: 15, def: 5, mag: 8, spd: 15 }, growth: { hp: 4, sp: 3, atk: 3, def: 1, mag: 1, spd: 2 },
    start: { weapon: 'agnipur_talwar_of_force', armor: 'saffron_coat' },
  },
  // Edmund Stillwater (Chapter 9; COMBAT 9.8, the outline section 9.1 with its second review): he joins at the pie shop,
  // as a fighter, before the keep (party.edmund), defies the Regent in the court, and leads in his own chapter like
  // Bayarmaa, Haru and Vikram in theirs. The Guardian: the most HP and DEF of anyone, the slowest. Aldermoor's Vigil
  // (+10% HP) is folded into his base; The Long Watch and Stillwater's Patience are after the release (their text).
  {
    id: 'edmund', name: 'Edmund', role: 'Guardian', house: 'Stillwater', portrait: 'edmund', era: 'present', class: 'warrior',
    passives: [
      { name: "Aldermoor's Vigil", text: 'His HP is a tenth higher than it would be (in his base).' },
      { name: 'The Long Watch', text: 'After the release: each turn he holds back, his DEF grows a little.' },
      { name: "Stillwater's Patience", text: 'After the release: once a battle, he cancels a foe\'s boast.' },
      { name: 'Terribly sorry', text: 'He apologises to every foe before he hits them. He means it.' },
    ],
    joins: { all: [{ flag: 'party.edmund' }, { notFlag: 'story.hall_seated' }] },
    leads: { all: [{ flag: 'party.edmund' }, { notFlag: 'act9.complete' }] },
    base: { hp: 58, sp: 18, atk: 11, def: 12, mag: 5, spd: 8 }, growth: { hp: 7, sp: 2, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'pattern_sword_of_guarding', armor: 'stillwater_greatcoat' },
  },
  // Rael, Lord of Ardencia, beside Gianna for one fight (Chapter 11, the Trust route; the outline 4.3 with the second
  // review's 3.8): never a roster member. He is in the party only while party.rael holds (the Turn's line before the
  // flagship fight sets it; its after-scene and a loss, BattleDef.onLoss, clear it) and a fight is on (fight.return, set as
  // a fight starts and cleared as it ends), so the Status page and the gear screen never show him. His son's kit; no
  // Anissa bond; no gear but his own (in his base).
  {
    id: 'rael', name: 'Rael', role: 'Lord of Ardencia (beside you)', house: 'Brasador', portrait: 'rael', look: 'rael', era: 'present', class: 'warrior',
    passives: [{ name: 'Sangre Ardiente', text: 'Each foe he fells this battle: +5% ATK (up to +25%).', effect: { kind: 'atkPerFell', share: 0.05, max: 0.25 } }],
    joins: { all: [{ flag: 'party.rael' }, { flag: 'fight.return' }, { notFlag: 'story.harbor_taken' }] },
    leads: { flag: 'party.rael' },
    base: { hp: 92, sp: 18, atk: 30, def: 26, mag: 5, spd: 11 }, growth: { hp: 8, sp: 2, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'steel_saber', armor: 'officer_coat' },
  },
  // Young Lord Benny joins the Echo party once Azzy has joined (STORY.md: the design's rule), at the end of Chapter 3
  // (story.benny_joined). Chapter 4 has no Echo battle (the plan review's rule): his first Echo there is a walk, at
  // Yusuf's desk; his first fight in the Echo comes in a later chapter.
  {
    id: 'benny', name: 'Benny', role: 'Lord of Ardencia', house: 'Brasador', portrait: 'benny', look: 'benny_young', era: 'echo', class: 'warrior',
    passives: [{ name: 'The iron promise', text: 'He kept the oath, whatever it cost: his La Marca is a weapon move, ready every third turn.' }],
    joins: { flag: 'story.benny_joined' },
    base: { hp: 66, sp: 12, atk: 14, def: 11, mag: 4, spd: 8 }, growth: { hp: 7, sp: 1, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'steel_saber', armor: 'officer_coat' },
  },
  // Caona joins the Echo party at the areíto of the first oath (STORY.md Chapter 2, beat 5).
  {
    id: 'caona', name: 'Caona', role: 'Scout', house: 'Yaguana', portrait: 'caona', era: 'echo', class: 'archer',
    passives: [{ name: 'Every road', text: 'Her scouts found every road for the revolution: she always acts first in the opening turn.' }],
    joins: { flag: 'story.caona_joined' },
    base: { hp: 56, sp: 14, atk: 13, def: 8, mag: 6, spd: 15 }, growth: { hp: 6, sp: 2, atk: 2, def: 1, mag: 1, spd: 2 },
    start: { weapon: 'yaguana_bow', armor: 'woven_tunic' },
  },
];

export const SHOPS: Readonly<Record<string, ShopDef>> = {
  zetwal_forge: { id: 'zetwal_forge', name: 'Harbor forge', city: 'zetwal', stock: ['sunwood_staff', 'ironwood_bow', 'steel_saber', 'padded_vest', 'iron_cuirass', 'temple_robe', 'lantern_staff', 'goldband_bow'] },
  // At the Muster (Chapter 10; the second review's 3.6: a shop has no condition, so a second smith placement sells it): the
  // tier-24 pieces for every class, and the old stock shown honestly beside them.
  zetwal_forge_muster: {
    id: 'zetwal_forge_muster',
    name: 'Harbor forge',
    city: 'zetwal',
    stock: ['kingsmere_blade_of_force', 'flame_talwar_of_force', 'muster_robe', 'oilcloth_coat', 'scale_armour', 'steel_ring', 'sunwood_staff', 'ironwood_bow', 'steel_saber', 'iron_cuirass'],
  },
  zetwal_charms: { id: 'zetwal_charms', name: 'Charm stand', city: 'zetwal', stock: ['sun_charm', 'sea_glass_charm'] },
  zetwal_market: { id: 'zetwal_market', name: 'Market stand', city: 'zetwal', stock: ['soup_pot', 'akasan', 'mango'] },
  // The Iron Market (Oct 15).
  zetwal_produce: { id: 'zetwal_produce', name: 'Produce row', city: 'zetwal', stock: ['mango', 'kasav', 'kann'] },
  zetwal_spices: { id: 'zetwal_spices', name: 'Spice row', city: 'zetwal', stock: ['pikliz', 'akasan'] },
  zetwal_fish: { id: 'zetwal_fish', name: 'Fish stall', city: 'zetwal', stock: ['pwason_fri', 'lanbi_fritters', 'spiny_lobster'] },
  // Yucayeque (Chapter 2): the beach market.
  xaragua_food: { greeting: 'Guatiao! What will it be?', id: 'xaragua_food', name: 'Cassava-bread stall', city: 'xaragua', stock: ['casabe', 'guava', 'fish_stew'] },
  xaragua_carver: { greeting: 'Guatiao! What will it be?', id: 'xaragua_carver', name: "Carver's mat", city: 'xaragua', stock: ['shell_beads', 'carved_charm'] },
  xaragua_bows: { greeting: 'Guatiao! What will it be?', id: 'xaragua_bows', name: "Bow-maker's stall", city: 'xaragua', stock: ['ironwood_bow', 'cotton_tunic'] },
  // Once the harbor is Yucayeque's (Chapter 11, story.harbor_taken; Claude's call, Oct 27: a shop has no condition, so the
  // market's three come back to the burned stalls as second placements selling these): the free harbor's first catch,
  // the carver's cannon (tier 26) and the bow-maker's cotton (tier 24), with the old stock beside them. No tier-28 piece
  // (the outline section 5: Hale's axe is the war's one; Eightgate's outfitter stocks the rest).
  xaragua_food_free: { greeting: 'Guatiao! The harbor is ours. Eat!', id: 'xaragua_food_free', name: 'Cassava-bread stall', city: 'xaragua', stock: ['snapper_casabe', 'soursop_juice', 'casabe', 'fish_stew', 'guava'] },
  xaragua_carver_free: { greeting: 'Guatiao. Mind the soot on the mat.', id: 'xaragua_carver_free', name: "Carver's mat", city: 'xaragua', stock: ['carved_cannon_charm', 'carved_charm', 'shell_beads'] },
  xaragua_bows_free: { greeting: 'Guatiao! Cotton for the canoes.', id: 'xaragua_bows_free', name: "Bow-maker's stall", city: 'xaragua', stock: ['harbor_cotton', 'cotton_tunic', 'ironwood_bow'] },
  zetwal_cloth: { id: 'zetwal_cloth', name: 'Cloth row', city: 'zetwal', stock: ['woven_tunic', 'temple_robe'] },
  // Cenizal (Chapter 3): the smith, the ring-maker and the tavern in the Upper Town; the Free Brasador
  // quartermaster at the camp sells the smith's armour, for a party that could not buy it before noon (review 3.7).
  ardencia_forge: { id: 'ardencia_forge', name: 'Brasador smithy', city: 'ardencia', stock: ['blackened_plate', 'cinder_coat', 'ember_robe', 'steel_saber', 'iron_cuirass'] },
  ardencia_rings: { id: 'ardencia_rings', name: "Ring-maker's stall", city: 'ardencia', stock: ['iron_ring', 'ember_ring'] },
  ardencia_tavern: { id: 'ardencia_tavern', name: 'Tavern', city: 'ardencia', stock: ['pan_de_ceniza', 'olla', 'cafe_de_olla'] },
  // Bab al-Dhahab (Chapter 4): the tea seller, the armourer and the amulet seller in the bazaar's lanes.
  aldoria_tea: { greeting: 'Ahlan wa sahlan! Tea first, then business.', id: 'aldoria_tea', name: "Tea seller's stall", city: 'al_doria', stock: ['mint_tea', 'dates', 'tagine'] },
  aldoria_armourer: {
    greeting: 'Tfaddal. Guild steel, desert leather.',
    id: 'aldoria_armourer',
    name: "Armourer's stall",
    city: 'al_doria',
    stock: ['tideglass_staff_of_tide', 'cacique_bow_of_thunder', 'starfall_staff_of_stars', 'moonshell_bow_of_moon', 'gilded_mail', 'desert_leathers', 'merchant_robe'],
  },
  aldoria_amulets: { greeting: 'Ahlan. Against the eye, against the sun.', id: 'aldoria_amulets', name: "Amulet seller's stall", city: 'al_doria', stock: ['brass_scale_charm', 'sand_amulet', 'ember_ring'] },
  ardencia_camp: { id: 'ardencia_camp', name: 'Free Brasador stores', city: 'ardencia', stock: ['blackened_plate', 'cinder_coat', 'iron_ring', 'pan_de_ceniza'] },
  // Eightgate (Chapter 5): the Concourse market (one thing from every capital reached) and the Envoys' Outfitter (tier 16).
  seat_market: { greeting: 'Good day to you, traveller.', id: 'seat_market', name: 'Concourse market', city: 'seat', stock: ['soup_pot', 'casabe', 'pan_de_ceniza', 'dates', 'mint_tea'] },
  seat_outfitter: { greeting: 'Madam. Do come in.', id: 'seat_outfitter', name: "Envoys' Outfitter", city: 'seat', stock: ['keeper_robe', 'envoy_leathers', 'warden_coat', 'sealed_satchel_charm'] },
  // Ordvik (Chapter 6): the food tent, the furrier (tier 16) and the horse-trader at the fair; the Moot's plunder store
  // sells the furrier's stock (Claude's call: shops have one price list, so not dearer, only nearer).
  ordvik_food: { greeting: 'Sain baina uu? Broth, jerky, airag.', id: 'ordvik_food', name: 'Food tent', city: 'skarragol', stock: ['salted_jerky', 'airag', 'hot_broth'] },
  ordvik_furrier: { greeting: 'Heill! Fur for the plateau.', id: 'ordvik_furrier', name: 'Furrier', city: 'skarragol', stock: ['braided_cloak', 'fur_mantle', 'felt_robe', 'round_shield_charm', 'steppe_sabre_of_force'] },
  ordvik_horses: { greeting: 'Bayarlalaa. Tack, rings, treats.', id: 'ordvik_horses', name: "Horse-trader's corral", city: 'skarragol', stock: ['horse_tack_charm', 'salkhi_treats'] },
  plunder_store: { greeting: 'Heill. Raided fair and square.', id: 'plunder_store', name: 'Plunder store', city: 'skarragol', stock: ['fur_mantle', 'felt_robe', 'round_shield_charm', 'steppe_sabre_of_guarding'] },
  // Kirinoura (Chapter 7): the tea house, the paper-maker and the armourer on the east bank (tier 20, and Ordvik's
  // tier-16 pieces for a party that skipped the furrier).
  kirinoura_tea: { greeting: 'Irasshaimase! Rice balls, green tea, miso.', id: 'kirinoura_tea', name: 'Tea house', city: 'kuroshi', stock: ['rice_ball', 'green_tea', 'miso_broth'] },
  kirinoura_paper: { greeting: 'Irasshaimase. Paper, silk, and quiet.', id: 'kirinoura_paper', name: 'Paper-maker', city: 'kuroshi', stock: ['silk_mask_charm'] },
  kirinoura_armourer: { greeting: 'Irasshaimase. Lacquer and steel.', id: 'kirinoura_armourer', name: 'Armourer', city: 'kuroshi', stock: ['lacquered_armour', 'kirinoura_tanto_of_force', 'braided_cloak', 'fur_mantle'] },
  // Agnipur (Chapter 8): the milk-and-bread stall, the bead seller and the swordsmith in the Lamp Bazaar (tier 24, shown
  // honestly at half bonus, and Kirinoura's tier-20 pieces for a party that skipped the armourer).
  agnipur_milk: { greeting: 'Namaste! Spiced milk, flatbread, lentil stew.', id: 'agnipur_milk', name: 'Milk-and-bread stall', city: 'jwaladesh', stock: ['spiced_milk', 'flatbread', 'lentil_stew'] },
  agnipur_beads: { greeting: 'Namaste. Charms for the heat.', id: 'agnipur_beads', name: 'Bead seller', city: 'jwaladesh', stock: ['brass_lamp_charm'] },
  agnipur_swords: { greeting: 'Namaste. Talwars and scale.', id: 'agnipur_swords', name: 'Swordsmith', city: 'jwaladesh', stock: ['flame_talwar_of_force', 'scale_armour', 'lacquered_armour', 'kirinoura_tanto_of_force'] },
  // Kingsmere (Chapter 9): the pie shop, the jeweller and the outfitter on the Market Cross (tier 24 shown honestly at
  // half bonus, and Agnipur's tier-20 pieces for a party that skipped the swordsmith).
  kingsmere_pies: { greeting: 'Afternoon. Mind the rain.', id: 'kingsmere_pies', name: 'Pie shop', city: 'aldermoor', stock: ['meat_pie', 'kingsmere_tea', 'scones'] },
  kingsmere_jeweller: { greeting: 'Good day, madam.', id: 'kingsmere_jeweller', name: 'Jeweller', city: 'aldermoor', stock: ['law_seal_brooch', 'steel_ring'] },
  kingsmere_outfitter: { greeting: 'How may I help?', id: 'kingsmere_outfitter', name: 'Outfitter', city: 'aldermoor', stock: ['kingsmere_blade_of_force', 'oilcloth_coat', 'scale_armour', 'agnipur_talwar_of_force', 'saffron_coat'] },
};

/**
 * City maps (engine/cityMap.ts): outdoor sections placed on one grid at `at` (tiles), so the city
 * map shows their real shape; indoor sections appear as buildings at their doors.
 */
export const CITIES: Readonly<Record<string, CityDef>> = {
  zetwal: {
    id: 'zetwal',
    // The capital of the island nation of Zetwal (owner decision, Oct 14): Kreyol "Port of Light", one
    // word the way Port-de-Paix is Pòdepè (pò = port). A fluent speaker checks it (Nov 18).
    name: 'Pòdlimyè',
    house: 'Kay Soley',
    // The plaza in the middle with Accord Square and the Hall of the Accord at its head (owner decision,
    // Oct 15: the seat of the state central); the Iron Market west, the Old Harbor along the shore
    // south-west, Solèy Heights up the hill west of the square (at least five outdoor areas, buildings
    // aside); the Temple Island across the water to the north-east (the Chain
    // Bridge); the Cane Road straight out of the east gate.
    sections: [
      { map: 'zetwal-town', name: 'Festival Plaza', at: { x: 0, y: 9 } },
      { map: 'zetwal-temple', name: 'Temple Island', at: { x: 44, y: -4 } },
      { map: 'zetwal-road', name: 'The Cane Road', at: { x: 40, y: 16 } },
      { map: 'zetwal-market', name: 'The Iron Market', at: { x: -36, y: 4 } },
      { map: 'zetwal-harbor', name: 'The Old Harbor', at: { x: -36, y: 28 } },
      { map: 'zetwal-heights', name: 'Solèy Heights', at: { x: -29, y: -16 } },
      { map: 'zetwal-square', name: 'Accord Square', at: { x: 1, y: -13 } },
      { map: 'zetwal-house', name: 'Limyè house' },
      { map: 'zetwal-hall', name: 'Hall of the Accord' },
      { map: 'zetwal-archive', name: 'Temple Archive' },
    ],
  },
  // Chapter 2 (maps built Oct 16; CAPITALS.md 2). The Harbor Village by the sea, the Areíto Plaza above it
  // with the Caney of Anaco at its head, the Canoe Beach east, the cassava gardens west, and the Mountain
  // Path climbing from the gardens to the hill camp above it.
  xaragua: {
    id: 'xaragua',
    name: 'Yucayeque',
    house: 'Yaguana',
    sections: [
      { map: 'xaragua-village', name: 'Harbor Village', at: { x: 0, y: 0 } },
      { map: 'xaragua-plaza', name: 'Areíto Plaza', at: { x: 7, y: -22 } },
      { map: 'xaragua-beach', name: 'Canoe Beach', at: { x: 44, y: 8 } },
      { map: 'xaragua-conuco', name: 'Cassava gardens', at: { x: -32, y: 6 } },
      { map: 'xaragua-mountain', name: 'Mountain Path', at: { x: -46, y: -22 } },
      { map: 'xaragua-camp', name: 'Hill camp', at: { x: -48, y: -42 } },
      { map: 'xaragua-caney', name: 'Caney of Anaco' },
      { map: 'xaragua-song', name: 'Song House' },
      { map: 'xaragua-customs', name: 'Crown Customs House' },
      { map: 'xaragua-cave', name: 'Petroglyph cave' },
      { map: 'xaragua-record', name: 'Record house' },
    ],
  },
  // Chapter 3 (built Oct 21; CAPITALS.md 4): the Upper Town and its duel court in the middle, the Lower Town west,
  // the Cinder Flats and the sea road below the walls (south), the strand camp west along the shore.
  ardencia: {
    id: 'ardencia',
    name: 'Cenizal',
    house: 'Brasador',
    sections: [
      { map: 'ardencia-town', name: 'Upper Town', at: { x: 0, y: 0 } },
      { map: 'ardencia-lower', name: 'Lower Town', at: { x: -33, y: 10 } },
      { map: 'ardencia-flats', name: 'The Cinder Flats', at: { x: 0, y: 29 } },
      { map: 'ardencia-camp', name: 'Strand camp', at: { x: -25, y: 41 } },
      { map: 'ardencia-alcazar', name: 'The Alcázar' },
      { map: 'ardencia-library', name: 'La Biblioteca Vieja' },
    ],
  },
  // Chapter 4 (built Oct 21; CAPITALS.md 3): the Grand Bazaar and the souk square in the middle, the quay of the Gate
  // of Gold below it (south), the caravan gate and the Desert Edge east.
  al_doria: {
    id: 'al_doria',
    name: 'Bab al-Dhahab',
    house: 'Dorini',
    sections: [
      { map: 'aldoria-bazaar', name: 'The Grand Bazaar', at: { x: 0, y: 0 } },
      { map: 'aldoria-quay', name: 'The Gate of Gold', at: { x: 6, y: 32 } },
      { map: 'aldoria-desert', name: 'The Desert Edge', at: { x: 44, y: 2 } },
      { map: 'aldoria-majlis', name: 'The Majlis' },
      { map: 'aldoria-ledgers', name: 'The House of Ledgers' },
      { map: 'aldoria-vault', name: 'The guild vault' },
    ],
  },
  // Chapter 5 (built Oct 22; CAPITALS.md 5 with the outline's two additions): the Eight Gates Concourse in the middle,
  // the Gold Gate's yard east, the Envoys' Quarter south, the Crossroads Fields beyond the yard.
  seat: {
    id: 'seat',
    name: 'Eightgate',
    house: 'Open to all houses',
    sections: [
      { map: 'seat-concourse', name: 'The Eight Gates Concourse', at: { x: 0, y: 0 } },
      { map: 'seat-gateyard', name: "The Gold Gate's yard", at: { x: 48, y: 7 } },
      { map: 'seat-quarter', name: "The Envoys' Quarter", at: { x: 11, y: 34 } },
      { map: 'seat-fields', name: 'The Crossroads Fields', at: { x: 48, y: 27 } },
      { map: 'seat-hall', name: 'The Throne Hall' },
      { map: 'seat-archive', name: 'The Throne Archive' },
      { map: 'seat-workshop', name: "Coco's workshop" },
      // Chapter 12: Zetwal's rooms at the Seat, in the Crown's wing of the Quarter.
      { map: 'seat-rooms', name: "Mother's rooms" },
    ],
  },
  // Chapter 6 (built Oct 22; CAPITALS.md 6 with the outline's quay): the Horse-Fair in the middle with the Moot Tent in
  // its field, the Winter Plateau east of its gate, the Longship Quay up the lane north, the fjord north-east.
  skarragol: {
    id: 'skarragol',
    name: 'Ordvik',
    house: 'Ironvow',
    sections: [
      { map: 'skarragol-fair', name: 'The Horse-Fair', at: { x: 0, y: 0 } },
      { map: 'skarragol-plateau', name: 'The Winter Plateau', at: { x: 46, y: 0 } },
      { map: 'skarragol-quay', name: 'The Longship Quay', at: { x: 0, y: -14 } },
      { map: 'skarragol-fjord', name: 'The Frozen Fjord', at: { x: 36, y: -34 } },
      { map: 'skarragol-moot', name: 'The Great Moot Tent' },
      { map: 'skarragol-saga', name: 'The Saga Tent' },
    ],
  },
  // Chapter 7 (built Oct 22; CAPITALS.md 7 with the outline's pier and maze, and the file house as its own room): the
  // Lantern Quarter in the middle, the pier down its stair, the fog maze north, the Fog Marsh east.
  kuroshi: {
    id: 'kuroshi',
    name: 'Kirinoura',
    house: 'Suzumori',
    sections: [
      { map: 'kuroshi-quarter', name: 'The Lantern Quarter', at: { x: 0, y: 0 } },
      { map: 'kuroshi-pier', name: 'The Lantern Pier', at: { x: 0, y: 30 } },
      { map: 'kuroshi-fogmaze', name: 'The fog maze' },
      { map: 'kuroshi-marsh', name: 'The Fog Marsh', at: { x: 42, y: -12 } },
      { map: 'kuroshi-library', name: 'The Lantern Library' },
      { map: 'kuroshi-hall', name: 'The Hall of Screens' },
      { map: 'kuroshi-filehouse', name: 'The file house' },
      { map: 'kuroshi-sayo-house', name: "Lady Sayo's House" },
    ],
  },
  // Chapter 8 (built Oct 22; CAPITALS.md 8 with the outline's six maps): the Lamp Bazaar in the middle with the Court of
  // the Flame at its head, the Harbor Chain down the stair, the Salt Flats east of the salt gate; the roofs, the library
  // and the Court as buildings at their doors.
  jwaladesh: {
    id: 'jwaladesh',
    name: 'Agnipur',
    house: 'Agnivansh',
    sections: [
      { map: 'jwaladesh-bazaar', name: 'The Lamp Bazaar', at: { x: 0, y: 0 } },
      { map: 'jwaladesh-harbor', name: 'The Harbor Chain', at: { x: 5, y: 30 } },
      { map: 'jwaladesh-saltflats', name: 'The Salt Flats', at: { x: 44, y: 1 } },
      { map: 'jwaladesh-rooftops', name: 'The roofs' },
      { map: 'jwaladesh-library', name: 'The Palm-Leaf Library' },
      { map: 'jwaladesh-court', name: 'The Court of the Flame' },
    ],
  },
  // Chapter 9 (built Oct 22; CAPITALS.md 9 with the outline's five maps): the Market Cross in the middle with the keep and
  // St. Agatha's at its head, the Heath beyond the Moor Gate to the south-west; the Rolls House, the keep and the church
  // as buildings at their doors.
  aldermoor: {
    id: 'aldermoor',
    name: 'Kingsmere',
    house: 'Stillwater',
    sections: [
      { map: 'aldermoor-cross', name: 'The Market Cross', at: { x: 26, y: 0 } },
      { map: 'aldermoor-heath', name: 'The Heath', at: { x: 0, y: 30 } },
      { map: 'aldermoor-rolls', name: 'The Rolls House' },
      { map: 'aldermoor-keep', name: "The Regent's Keep" },
      { map: 'aldermoor-close', name: 'The close', at: { x: 30, y: -8 } },
      { map: 'aldermoor-cathedral', name: "St. Agatha's" },
      { map: 'aldermoor-townhouse', name: "Lady Rosalind's house" },
    ],
  },
};

/** The realm around Eightgate, as on the board (Ardencia north, then clockwise); shapes in data/realmMap.ts. */
export const REALM: readonly RealmPlace[] = [
  // The realm's neutral city, where every house may come and none may draw steel (so they say). The
  // old seat of the realm stands at its heart; whether Elodie blessed it is argued (data/books.ts).
  { id: 'seat', name: 'Eightgate', house: 'Open to all houses', city: 'seat' },
  { id: 'ardencia', name: 'Ardencia', house: 'Brasador', city: 'ardencia' },
  { id: 'zetwal', name: 'Zetwal', house: 'Kay Soley', city: 'zetwal' },
  { id: 'al_doria', name: 'Al-Doria', house: 'Dorini', city: 'al_doria' },
  { id: 'skarragol', name: 'Skarragol', house: 'Ironvow', city: 'skarragol' },
  { id: 'kuroshi', name: 'Kuroshi', house: 'Suzumori', city: 'kuroshi' },
  { id: 'jwaladesh', name: 'Jwaladesh', house: 'Agnivansh', city: 'jwaladesh' },
  { id: 'aldermoor', name: 'Aldermoor', house: 'Stillwater', city: 'aldermoor' },
  { id: 'xaragua', name: 'Xaraguá', house: 'Yaguana', city: 'xaragua' },
];

export const RPG: RpgContent = {
  items: ITEMS,
  classWeapons: { mage: ['staff'], archer: ['bow'], warrior: ['blade'] },
  members: MEMBERS,
  shops: SHOPS,
  cities: CITIES,
  realm: REALM,
  // Each lore book read in a city: +1 Influence there (guide 6.3: library lore earns Influence).
  pillarRules: [
    { pillar: 'influence', city: 'zetwal', flags: BOOKS.filter((b) => b.id.startsWith('zetwal_')).map((b) => loreFlag(b.id)), each: 1 },
    { pillar: 'influence', city: 'xaragua', flags: BOOKS.filter((b) => b.id.startsWith('xaragua_')).map((b) => loreFlag(b.id)), each: 1 },
    { pillar: 'influence', city: 'ardencia', flags: BOOKS.filter((b) => b.id.startsWith('ardencia_')).map((b) => loreFlag(b.id)), each: 1 },
    { pillar: 'influence', city: 'al_doria', flags: BOOKS.filter((b) => b.id.startsWith('aldoria_')).map((b) => loreFlag(b.id)), each: 1 },
    { pillar: 'influence', city: 'seat', flags: BOOKS.filter((b) => b.id.startsWith('seat_')).map((b) => loreFlag(b.id)), each: 1 },
    { pillar: 'influence', city: 'skarragol', flags: BOOKS.filter((b) => b.id.startsWith('skarragol_')).map((b) => loreFlag(b.id)), each: 1 },
    // Ordvik's price (Wealth 10; outline beat 8, its review 3.6): what the party lays on the council table, each a flag.
    { pillar: 'wealth', city: 'skarragol', flags: ['choice.crown_purse_given', 'choice.jarl_paid'], each: 3 },
    { pillar: 'wealth', city: 'skarragol', flags: ['story.samira_letter'], each: 1 },
    // Influence and Fear at Ordvik: an unseen approach, Grimvald brought to the Moot, Azzy's answer to his mother's people.
    { pillar: 'influence', city: 'skarragol', flags: ['story.herd_unseen', 'choice.grimvald_spared', 'side.grandson.shared'], each: 1 },
    { pillar: 'influence', city: 'skarragol', flags: ['side.grandson.polite'], each: 2 },
    { pillar: 'fear', city: 'skarragol', flags: ['side.grandson.bout_won'], each: 2 },
    { pillar: 'fear', city: 'skarragol', flags: ['choice.grimvald_broken'], each: 1 },
    { pillar: 'influence', city: 'kuroshi', flags: BOOKS.filter((b) => b.id.startsWith('kuroshi_')).map((b) => loreFlag(b.id)), each: 1 },
    // Kirinoura's price (Influence 10; outline beat 9 with its review's 3.10): only what is laid on the dais counts as
    // paid, and the petition and Samira's offer are choices, so Suzumori can be the least-paid house.
    { pillar: 'influence', city: 'kuroshi', flags: ['story.price_receipts'], each: 2 },
    { pillar: 'influence', city: 'kuroshi', flags: ['choice.petition_signed', 'choice.samira_names', 'choice.fox_spared'], each: 1 },
    { pillar: 'fear', city: 'kuroshi', flags: ['choice.fox_broken'], each: 1 },
    { pillar: 'influence', city: 'jwaladesh', flags: BOOKS.filter((b) => b.id.startsWith('jwaladesh_')).map((b) => loreFlag(b.id)), each: 1 },
    // Agnipur's price (Wealth 8; outline beat 8 with its review's 3.4): only what is laid at the altar's foot counts, and
    // the store and the strongbox are choices, so the floor is 4 (J-2 +1, J-3 +2, the jars the city carried up +1) and
    // Agnivansh can be the least-paid house; a player who signs the store over and gives the advances pays 10.
    { pillar: 'wealth', city: 'jwaladesh', flags: ['choice.dhanraj_spared'], each: 3 },
    { pillar: 'wealth', city: 'jwaladesh', flags: ['choice.dhanraj_broken'], each: 1 },
    { pillar: 'wealth', city: 'jwaladesh', flags: ['choice.advances_given'], each: 4 },
    { pillar: 'influence', city: 'jwaladesh', flags: ['choice.petition_jwa_signed', 'choice.dhanraj_spared', 'story.crane_accepted'], each: 1 },
    { pillar: 'fear', city: 'jwaladesh', flags: ['choice.dhanraj_broken'], each: 1 },
    { pillar: 'influence', city: 'aldermoor', flags: BOOKS.filter((b) => b.id.startsWith('aldermoor_')).map((b) => loreFlag(b.id)), each: 1 },
    // Kingsmere's price (Fear 8; outline beat 8 with its second review's 3.7, option (a)): Al-3's +3 (its reward), the
    // Hushed beaten +1 (the boss), Jordyn's company +1, the Hushed shown to the city +1. Floor 5, so the Muster has a
    // number to work with; the court's own fall and the published list are not counted twice.
    { pillar: 'fear', city: 'aldermoor', flags: ['story.hushed_beaten', 'story.jordyn_defected', 'choice.hushed_broken'], each: 1 },
    { pillar: 'influence', city: 'aldermoor', flags: ['choice.hushed_tried', 'story.edmund_defied'], each: 1 },
    // The Muster (Chapter 10): Z-6's crew spared (+1 Influence) or walked up the road (+2 Fear), the design's "by Yield";
    // the contract board's count of the soldiers (+1 Influence).
    { pillar: 'influence', city: 'zetwal', flags: ['choice.crew_spared', 'muster.counted'], each: 1 },
    { pillar: 'fear', city: 'zetwal', flags: ['choice.crew_broken'], each: 2 },
    // The contract boards' dispatches (Chapters 10 to 12, Oct 27): the Speaker's dispatch to the Temple island, salt to the
    // hill camp, the Compact's roll to the north gate (+1 Influence each where it is delivered); and the Quill's Chapter 10
    // bonus (SECRET-ITEMS.md 1: Yari sees the Yaguana name kept on Zetwal's stones, +2 Influence in Xaraguá).
    { pillar: 'influence', city: 'zetwal', flags: ['muster.dispatch_done'], each: 1 },
    { pillar: 'influence', city: 'xaragua', flags: ['war.salt_done'], each: 1 },
    { pillar: 'influence', city: 'xaragua', flags: ['muster.quill_stone'], each: 2 },
    { pillar: 'influence', city: 'seat', flags: ['claim.dispatch_done'], each: 1 },
    // The side quests built Oct 27 whose pillar follows an answer (J-1's Fear or Influence).
    ...LATE_PILLAR_RULES,
  ],
  startingGold: STARTING_GOLD,
  bagLimit: BAG_LIMIT,
  // XP from the story's steps and the books read (fights pay their own, data/battles.ts).
  xpRules: [
    // A Journal step pays by its chapter (XP_PER_OBJECTIVE_BY_CHAPTER).
    ...[ACT1, ACT2, ACT3, ACT4, ACT5, ACT6, ACT7, ACT8, ACT9, ACT10, ACT11, ACT12, EPILOGUE].map((act, i) => ({
      flags: act.objectives.filter((o) => !o.noXp).flatMap((o) => flagsIn(o.done)),
      each: XP_PER_OBJECTIVE_BY_CHAPTER[Math.min(i, XP_PER_OBJECTIVE_BY_CHAPTER.length - 1)]!,
    })),
    { flags: BOOKS.map((b) => loreFlag(b.id)), each: XP_PER_BOOK },
    // Chapter 11: on the turned route the house that stayed pays what the flank's fight pays on the betrayed one (the outline
    // section 5: an exposed Muster is not a level behind a betrayed one).
    { flags: ['war.house_stood'], each: WAR_FLANK_XP },
  ],
  levels: LEVELS,
};
