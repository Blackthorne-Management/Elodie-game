// The eight houses: what each house does in the game (the source of truth for the app, the bots, the online server and
// the printed text). Why each rule is what it is: docs/rules-decisions.md. Lore, culture and name meanings came over from
// the retired draft docs/bloodline-houses.md.
import type { Content, HouseDef } from '../engine/content';
import type { HouseId, Pillar } from '../engine/types';
import { PILLARS } from '../engine/types';
import { cap } from '../engine/game';
import { GRITO_MARKERS } from '../config';

const others = (g: Parameters<NonNullable<HouseDef['abilities'][number]['run']>>[0], id: number) =>
  g.living().filter(o => o.id !== id);

export const HOUSES: Record<HouseId, HouseDef> = {
  brasador: {
    id: 'brasador', name: 'House Brasador', homeland: 'Ardencia',
    identity: 'Fear/aggression', curve: 'Early-favored', tileType: 'war', home: { x: 8, y: 0 },
    lore: 'Ardencia is a land of fire-cracked highlands and old wounds. House Brasador rose from conquistador-warlords who carved out their territory through open conquest. They do not need to be present to be feared; the brand alone is enough.',
    homelandNote: 'a scorched volcanic frontier', culture: 'Spanish-inspired',
    nameMeanings: { 'Sangre Ardiente': 'Burning Blood', 'La Marca': 'The Brand', 'Grito de Guerra': 'War Cry', 'Reinado de Cenizas': 'Reign of Ashes' },
    hp: [3, 3, 3, 3],
    heirs: ['Don Alonso Rodriguez', 'Benny Rodriguez', 'Rael the Ruthless', 'Azriel "Azzy" Rodriguez'],
    passiveName: 'Sangre Ardiente',
    passiveText: ['From Gen III: +1 Fear on kill.', '+1 Fear on kill.'],
    passive: { fearOnKill: level => (level >= 2 ? 1 : 0) },
    // Held as a Legacy (Ancestor's Voice, Song of Coaybay) it works from the start (rules-decisions 87).
    legacyPassive: { text: '+1 Fear on kill.', hooks: { fearOnKill: () => 1 } },
    abilities: [
      {
        id: 'laMarca', name: 'La Marca', gen: 1, limit: 'turn',   // from Gen I (rules-decisions 81)
        text: 'Mark an enemy: your attacks deal +1 damage to them.',
        canUse: (g, p) => others(g, p.id).some(o => o.id !== p.mark),
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => o.id !== p.mark), 'La Marca: brand which rival?');
          if (t) { p.mark = t.id; g.log(`${p.name} brands ${t.name}.`, 'ability', { player: p.id, target: t.id }); }
        },
      },
      {
        id: 'gritoDeGuerra', name: 'Grito de Guerra', gen: 3, limit: 'turn',
        // Two Grito markers (rules-decisions 87): at most GRITO_MARKERS players marked at once.
        text: `Put a Grito marker on a player: they skip their next Fear gain, then the marker comes back. You have ${GRITO_MARKERS} markers; with all of them out, wait for one to come back.`,
        canUse: (g, p) => g.s.effects.filter(e => e.kind === 'noFearGain' && e.by === p.id).length < GRITO_MARKERS &&
          others(g, p.id).some(o => !g.findEffect('noFearGain', o.id, false)),
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => !g.findEffect('noFearGain', o.id, false)), 'Grito de Guerra: silence whose next Fear gain?');
          if (t) g.addEffect('noFearGain', t.id, { at: 'consumed' }, { by: p.id });
        },
      },
      {
        id: 'reinadoDeCenizas', name: 'Reinado de Cenizas', gen: 4, limit: 'game',
        text: 'Once per game: gain Fear equal to your total kills.',
        canUse: (_g, p) => p.kills > 0,
        *run(g, p) { g.gain(p, 'fear', p.kills, 'Reinado de Cenizas'); },
      },
    ],
    mostFearedDownside: gen => gen >= 3,
    downsideText: 'From Gen III, while Brasador has strictly the most Fear, attacks against them deal +1 damage.',
  },

  dorini: {
    id: 'dorini', name: 'House Dorini', homeland: 'Al-Doria',
    identity: 'Wealth/economy', curve: 'Late-favored', tileType: 'trade', home: { x: 17, y: 9 },
    lore: 'Al-Doria is a sprawling entrepôt, half port city and half caravanserai. House Dorini built their power on ledgers and bazaars rather than armies, converting coin into influence or fear when the need arises.',
    homelandNote: 'where Mediterranean sea-trade meets desert caravan routes', culture: 'Mediterranean/Middle-Eastern-inspired',
    nameMeanings: { 'Daftar al-Dorini': 'The Ledger', 'Bazaar al-Dhahab': 'Golden Bazaar' },
    hp: [3, 3, 3, 3],
    heirs: ['Malik Dorini', 'Yusuf Dorini', 'Layla Dorini', 'Samira Dorini'],
    passiveName: 'Baraka Dorini',
    passiveText: ["+1 Wealth when you gain Wealth from a Trade tile. Once in each player's turn, Wealth from anything else brings 1 more.",
      "+2 Wealth from Trade tiles. Once in each player's turn, Wealth from anything else brings 1 more."],
    passive: { tileBonus: (pillar, level) => (pillar === 'wealth' ? level : 0), wealthBonus: () => 1 },
    abilities: [
      {
        id: 'daftar', name: 'Daftar al-Dorini', gen: 2, limit: 'turn',
        text: 'Convert 2 Wealth into 1 Influence or 1 Fear.',
        canUse: (_g, p) => p.res.wealth >= 2,
        *run(g, p) {
          const x = yield* g.choosePillar(p, 'Daftar al-Dorini: convert 2 Wealth into', ['influence', 'fear']);
          if (x) { g.lose(p, 'wealth', 2, 'Daftar al-Dorini'); g.gain(p, x, 1, 'Daftar al-Dorini'); }
        },
      },
      {
        id: 'bazaar', name: 'Bazaar al-Dhahab', gen: 4, limit: 'turn',
        text: 'Spend 3 Wealth: take one extra action this turn (an attack, a Hand Card or a trade offer).',
        canUse: (g, p) => p.res.wealth >= 3 && g.isActive(p),
        *run(g, p) {
          g.lose(p, 'wealth', 3, 'Bazaar al-Dhahab');
          g.s.turn!.actionsAllowed++;
        },
      },
    ],
  },

  ironvow: {
    id: 'ironvow', name: 'House Ironvow', homeland: 'Skarragol',
    identity: 'Mobility/aggression', curve: 'Early-favored', tileType: 'war', home: { x: 14, y: 14 },
    lore: "Skarragol's warbands prize one thing above all else: speed. Their oath-bound clans strike before anyone can organize a response, whether on longship or on horseback.",
    homelandNote: 'born when fjord-raiders who sailed inland met steppe horse-lords who rode outward', culture: 'Fused Nordic/Mongolian-inspired',
    nameMeanings: { 'The Great Raid': 'Warpath' },
    hp: [3, 3, 3, 3],
    heirs: ['Ulfgar Ironvow', 'Sarnai', 'Torvald', 'Bayarmaa'],
    passiveName: "Ironvow's Oath",
    passiveText: ['+1 to your movement roll.', 'Instead of the +1 to movement: your basic attack reaches 2 squares in a straight line.'],
    // From Gen III the reach replaces the extra movement (rules-decisions 78).
    passive: { moveBonus: level => (level >= 2 ? 0 : 1), reach: level => (level >= 2 ? 2 : 1) },
    attackBeforeMove: gen => gen >= 2,
    abilities: [
      {
        id: 'greatRaid', name: 'The Great Raid', gen: 4, limit: 'game',
        text: 'Once per game: take two full turns in a row. Your hand is revealed for both.',
        canUse: (g, p) => g.isActive(p) && !g.s.turn!.extraTurn,
        *run(g, p) {
          p.extraTurn = true;
          g.addEffect('handPublic', p.id, { at: 'consumed' });
          g.reveal(p, 'all', 'The Great Raid');
        },
      },
    ],
    downsideText: 'The Great Raid reveals your hand for the double turn.',
  },

  suzumori: {
    id: 'suzumori', name: 'House Suzumori', homeland: 'Kuroshi',
    identity: 'Information/control', curve: 'Mid-favored', tileType: 'court', home: { x: 9, y: 17 },
    lore: "Kuroshi's power has never come from open strength. House Suzumori built a network of spies and whispers reaching into every court, pulling strings long before anyone realizes the game has turned.",
    homelandNote: 'a fog-veiled island nation', culture: 'Japanese-inspired',
    nameMeanings: { 'Kagemimi': "Shadow's Ear", 'Sasayaki Ha': 'Whispering Blade', 'Ayatsuri': "Marionette's Thread" },
    hp: [3, 3, 3, 3],
    heirs: ['Lord Genzō Suzumori', 'Lady Sayo Suzumori', 'Kaede Suzumori', 'Haru Suzumori'],
    passiveName: 'Kagemimi',
    passiveText: ["View one player's hand once per round.", "View two players' hands per round."],
    passive: { peeksPerRound: level => level },
    passiveAbility: {
      id: 'kagemimi', name: 'Kagemimi', gen: 1, limit: 'round',
      text: "View a player's hand.",
      uses: (g, p) => g.hook(p, 'peeksPerRound'),
      canUse: (g, p) => others(g, p.id).some(o => o.hand.length),
      *run(g, p) {
        const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => o.hand.length), "Kagemimi: whose hand do you hear?");
        if (t) g.reveal(t, [p.id], 'Kagemimi');
      },
    },
    abilities: [
      {
        id: 'sasayakiHa', name: 'Sasayaki Ha', gen: 2, limit: 'turn',
        text: "Look at a player's hand and choose one card for them to discard.",
        canUse: (g, p) => others(g, p.id).some(o => o.hand.length),
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => o.hand.length), 'Sasayaki Ha: whose hand?');
          if (!t) return;
          g.reveal(t, [p.id], 'Sasayaki Ha');
          const c = yield* g.ask(p, 'card', `Choose a card for ${t.name} to discard`, t.hand.map(x => ({ label: g.card(x).name, value: x })));
          g.discardFromHand(t, c);
          g.log(`${t.name} discards ${g.card(c).name}.`, 'discard', { player: t.id, cards: [c] });
        },
      },
      {
        id: 'ayatsuri', name: 'Ayatsuri', gen: 4, limit: 'game',
        text: "Once per game: you choose the direction of a player's next move, and the player their next attack or card names, friendly or hostile.",
        canUse: (g, p) => others(g, p.id).length > 0,
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id), "Ayatsuri: whose strings do you pull?");
          if (t) g.addEffect('redirect', t.id, { at: 'consumed' }, { by: p.id, level: 3 });
        },
      },
    ],
  },

  vaitama: {
    id: 'vaitama', name: 'House Yaguana', homeland: 'Xaraguá',
    identity: 'Adaptive/chaotic', curve: 'Swingy', tileType: 'trade', home: { x: 3, y: 3 },
    lore: "In Xaraguá the dead are never far: the opía, spirits of the departed, walk the island by night, and in the areíto, the great dance of memory, every generation sings the deeds of those before it. House Yaguana's warriors carry the fallen within them, inheriting strength, memory, and secrets from the dead with every generation.",
    homelandNote: 'green Caribbean islands and mountains', culture: 'Taíno-inspired',
    nameMeanings: { 'Guaíza': 'Spirit Face', 'Song of Coaybay': 'Legion of the Dead' },
    hp: [3, 3, 3, 3],
    heirs: ['Cacique Guanín', 'Caona', 'Cacique Anaco', 'Yari'],
    passiveName: 'Voice of the Opía',
    passiveText: [
      "Ancestor's Voice: you start the game with a Legacy, the Gen I passive of a house not at the table (any other house when all eight play), drawn blind. Every heir keeps it.",
      'Your Legacy works at its Gen III strength.',
    ],
    passive: {},
    startsWithLegacy: true,                        // rules-decisions 83 (was: a Legacy on death)
    legacyUpgradeAt: 3,
    keepsOnDeath: gen => gen >= 2,                 // Areíto from Gen II (rules-decisions 75, 83)
    extraPassiveAt: 4,
    abilities: [
      {
        id: 'ancestorsMask', name: 'Guaíza', gen: 2, limit: 'game',
        text: "Once per game: copy another player's passive until your next turn.",
        canUse: (g, p) => others(g, p.id).length > 0,
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id), 'Guaíza: whose spirit-face do you wear?');
          if (!t) return;
          g.addEffect('mask', p.id, { at: 'turnStart', player: p.id }, { house: t.house, level: t.gen >= 3 ? 2 : 1 });
          g.log(`${p.name} wears the face of ${g.house(t).name}: ${g.house(t).passiveName}.`, 'ability', { player: p.id });
        },
      },
    ],
  },

  kaysoley: {
    id: 'kaysoley', name: 'House Kay Soley', homeland: 'Zetwal',
    identity: 'Influence/diplomacy', curve: 'Late-favored', tileType: 'court', home: { x: 14, y: 3 },
    lore: "Zetwal's temple-court claims direct descent from Elodie's forgotten mortal children, marked at birth by a faint sun-shaped birthmark. Every other house either envies or resents them for it.",
    homelandNote: 'a sun-bright coastal nation built around a temple to Elodie', culture: 'Kreyol/Haitian-inspired',
    nameMeanings: { 'Limyè Elodie': "Elodie's Light", 'Sèman Lapè': 'Peace Oath', 'Rit Solèy': 'Rite of the Sun' },
    hp: [3, 3, 3, 3],
    heirs: ['Mother Solange Jean-Philippe', 'Marshal Patricio Jean-Philippe', 'Elodie Limyè', 'Gianna Elise Limyè'],
    passiveName: 'Limyè Elodie',
    passiveText: ['+1 Influence when you gain Influence from a Court tile.', '+2 Influence from Court tiles.'],
    passive: { tileBonus: (pillar, level) => (pillar === 'influence' ? level : 0) },
    claimReduction: gen => (gen >= 3 ? 2 : 1),   // from Gen I (rules-decisions 81)
    abilities: [
      {
        id: 'semanLape', name: 'Sèman Lapè', gen: 2, limit: 'game',
        text: 'Once per game: you and one player cannot attack each other until your next turn starts.',
        canUse: (g, p) => others(g, p.id).length > 0,
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id), 'Sèman Lapè: a truce with whom?');
          if (!t) return;
          // Turn-based, like the truce cards: about one round for every seat (rules-decisions 84, 85).
          g.addEffect('truce', p.id, { at: 'turnStart', player: p.id }, { other: t.id });
          g.log(`${p.name} and ${t.name} swear Sèman Lapè.`, 'truce', { player: p.id, target: t.id });
        },
      },
    ],
  },

  agnivansh: {
    id: 'agnivansh', name: 'House Agnivansh', homeland: 'Jwaladesh',
    identity: 'Aggro/tempo', curve: 'Early-favored', tileType: 'war', home: { x: 3, y: 14 },
    lore: "Jwaladesh's warriors follow the fire-god's doctrine: hesitation is the only true death. House Agnivansh trains for speed above all, trusting that momentum itself is a kind of armor.",
    homelandNote: 'Land of Flame', culture: 'Indian-subcontinent-inspired',
    nameMeanings: { 'Agni ki Shakti': 'Power of Fire', 'Rakt Ki Pyaas': 'Thirst for Blood', 'Ananta Yuddha': 'Endless War' },
    hp: [3, 3, 3, 2],
    heirs: ['Rani Tejaswini', 'Arjun', 'Meera', 'Vikram'],
    passiveName: 'Agni ki Shakti',
    passiveText: ['Your basic attacks deal +1 damage.', 'Also: after your attack lands, you may move 1 space (not in a Challenge).'],
    passive: { basicAttackBonus: () => 1, stepOnLanded: level => (level >= 2 ? 1 : 0) },
    moveOnKill: gen => gen >= 2,
    abilities: [
      {
        id: 'anantaYuddha', name: 'Ananta Yuddha', gen: 4, limit: 'game',
        text: 'Once per game: make up to 3 basic attacks this turn.',
        canUse: g => !!g.s.turn,
        *run(g) { g.s.turn!.attacksAllowed += 2; },
      },
    ],
    downsideText: 'Gen IV drops to 2 Heart Tokens: a glass cannon.',
  },

  stillwater: {
    id: 'stillwater', name: 'House Stillwater', homeland: 'Aldermoor',
    identity: 'Defensive/patient', curve: 'Late-favored', tileType: 'court', home: { x: 0, y: 8 },
    lore: "Aldermoor's old families have weathered centuries of invasion and famine the same way every time: by simply outlasting everyone else.",
    homelandNote: 'a quiet, fog-wrapped moorland', culture: 'English-inspired',
    hp: [3, 3, 3, 3],
    heirs: ['Dame Agatha Stillwater', 'Thomas Stillwater', 'Lady Rosalind Stillwater', 'Edmund Stillwater'],
    passiveName: 'Unbroken',
    passiveText: [
      'Once per heir, an attack that would kill you while you hold 2 or more Heart Tokens leaves you at 1 instead. A Blocked attack does not use it up.',
      "Also, Stillwater's Patience: once per game, cancel a Reckoning bonus used against you.",
    ],
    // rules-decisions 83, 87 (was: Patience at Gen I, a second use at Gen III; Unbroken needed full Heart Tokens)
    passive: { unbroken: () => 1, reckoningCancels: level => (level >= 2 ? 1 : 0) },
    longWatch: gen => gen >= 2,
    abilities: [],
  },
};

// Text for the generation cards (Gen II-IV rules that are not abilities).
export const GEN_NOTES: Partial<Record<HouseId, Partial<Record<1 | 2 | 3 | 4, string>>>> = {
  ironvow: { 2: "Raider's Charge: your basic attack may come before you move." },
  agnivansh: { 2: 'Rakt Ki Pyaas: after landing a kill, move up to 1 space.' },
  stillwater: {
    2: 'The Long Watch: if you take no action on your turn (no attack, Hand Card or trade), gain 1 of any resource.',
  },
  kaysoley: { 1: 'Rit Solèy: you need 1 less combined resource to Claim the Throne (2 less from Gen III).' },
  vaitama: {
    2: 'Areíto: from now on, when your character dies, you lose no resources (a Reckoning against you still takes its bonus).',
    4: 'Song of Coaybay: permanently gain the passive of a bloodline that has become a Specter.',
  },
};

export const pillarLabel = (x: Pillar) => cap(x);
export const ALL_PILLARS = PILLARS;
export type { Content };
