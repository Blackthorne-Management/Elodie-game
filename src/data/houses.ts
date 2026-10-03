// The eight houses (docs/bloodline-houses.md, with docs/rules-decisions.md for the gaps).
import type { Content, HouseDef } from '../engine/content';
import type { HouseId, Pillar } from '../engine/types';
import { PILLARS } from '../engine/types';
import { cap } from '../engine/game';

const others = (g: Parameters<NonNullable<HouseDef['abilities'][number]['run']>>[0], id: number) =>
  g.living().filter(o => o.id !== id);

export const HOUSES: Record<HouseId, HouseDef> = {
  brasador: {
    id: 'brasador', name: 'House Brasador', homeland: 'Ardencia', culture: 'Spanish-inspired',
    identity: 'Fear/aggression', curve: 'Early-favored', tileType: 'war', home: { x: 8, y: 0 },
    lore: 'Ardencia is a land of fire-cracked highlands and old wounds. House Brasador rose from conquistador-warlords who carved out their territory through open conquest. They do not need to be present to be feared; the brand alone is enough.',
    hp: [3, 3, 3, 3],
    passiveName: 'Sangre Ardiente',
    passiveText: ['+1 Fear on kill.', '+2 Fear on kill.'],
    passive: { fearOnKill: level => (level >= 2 ? 2 : 1) },
    abilities: [
      {
        id: 'laMarca', name: 'La Marca', gen: 2, limit: 'turn',
        text: 'Mark an enemy: your attacks deal +1 damage to them.',
        canUse: (g, p) => others(g, p.id).some(o => o.id !== p.mark),
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => o.id !== p.mark), 'La Marca: brand which rival?');
          if (t) { p.mark = t.id; g.log(`${p.name} brands ${t.name}.`, 'ability', { player: p.id, target: t.id }); }
        },
      },
      {
        id: 'gritoDeGuerra', name: 'Grito de Guerra', gen: 3, limit: 'turn',
        text: 'Target player skips their next Fear gain.',
        canUse: (g, p) => others(g, p.id).some(o => !g.findEffect('noFearGain', o.id, false)),
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => !g.findEffect('noFearGain', o.id, false)), 'War Cry: silence whose next Fear gain?');
          if (t) g.addEffect('noFearGain', t.id, { at: 'consumed' }, { by: p.id });
        },
      },
      {
        id: 'reinadoDeCenizas', name: 'Reinado de Cenizas', gen: 4, limit: 'game',
        text: 'Once per game: gain Fear equal to your total kills.',
        canUse: (_g, p) => p.kills > 0,
        *run(g, p) { g.gain(p, 'fear', p.kills, 'Reign of Ashes'); },
      },
    ],
    mostFearedDownside: gen => gen >= 3,
    downsideText: 'From Gen III, while Brasador has the most Fear, attacks against them deal +1 damage.',
  },

  dorini: {
    id: 'dorini', name: 'House Dorini', homeland: 'Al-Doria', culture: 'Mediterranean/Middle-Eastern-inspired',
    identity: 'Wealth/economy', curve: 'Late-favored', tileType: 'trade', home: { x: 17, y: 9 },
    lore: 'Al-Doria is a sprawling entrepôt, half port city and half caravanserai. House Dorini built their power on ledgers and bazaars rather than armies, converting coin into influence or fear when the need arises.',
    hp: [3, 3, 3, 3],
    passiveName: 'Baraka Dorini',
    passiveText: ['+1 Wealth when you gain Wealth from a Trade tile.', '+2 Wealth from Trade tiles.'],
    passive: { tileBonus: (pillar, level) => (pillar === 'wealth' ? level : 0) },
    abilities: [
      {
        id: 'daftar', name: 'Daftar al-Dorini', gen: 2, limit: 'turn',
        text: 'Convert 2 Wealth into 1 Influence or 1 Fear.',
        canUse: (_g, p) => p.res.wealth >= 2,
        *run(g, p) {
          const x = yield* g.choosePillar(p, 'The Ledger: convert 2 Wealth into', ['influence', 'fear']);
          if (x) { g.lose(p, 'wealth', 2, 'The Ledger'); g.gain(p, x, 1, 'The Ledger'); }
        },
      },
      {
        id: 'bazaar', name: 'Bazaar al-Dhahab', gen: 4, limit: 'turn',
        text: 'Spend 5 Wealth: take one extra action this turn (an attack or a Hand Card).',
        canUse: (g, p) => p.res.wealth >= 5 && g.isActive(p),
        *run(g, p) {
          g.lose(p, 'wealth', 5, 'Golden Bazaar');
          g.s.turn!.actionsAllowed++;
        },
      },
    ],
  },

  ironvow: {
    id: 'ironvow', name: 'House Ironvow', homeland: 'Skarragol', culture: 'Fused Nordic/Mongolian-inspired',
    identity: 'Mobility/aggression', curve: 'Early-favored', tileType: 'war', home: { x: 14, y: 14 },
    lore: "Skarragol's warbands prize one thing above all else: speed. Their oath-bound clans strike before anyone can organize a response, whether on longship or on horseback.",
    hp: [3, 3, 3, 3],
    passiveName: "Ironvow's Oath",
    passiveText: ['+1 to your movement roll.', 'Also: your basic attack reaches 2 squares in a straight line.'],
    passive: { moveBonus: () => 1, reach: level => (level >= 2 ? 2 : 1) },
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
    id: 'suzumori', name: 'House Suzumori', homeland: 'Kuroshi', culture: 'Japanese-inspired',
    identity: 'Information/control', curve: 'Mid-favored', tileType: 'court', home: { x: 9, y: 17 },
    lore: "Kuroshi's power has never come from open strength. House Suzumori built a network of spies and whispers reaching into every court, pulling strings long before anyone realizes the game has turned.",
    hp: [3, 3, 3, 3],
    passiveName: 'Kagemimi',
    passiveText: ["View one player's hand once per round.", "View two players' hands per round."],
    passive: { peeksPerRound: level => level },
    passiveAbility: {
      id: 'kagemimi', name: 'Kagemimi', gen: 1, limit: 'round',
      text: "View a player's hand.",
      uses: (g, p) => g.hook(p, 'peeksPerRound'),
      canUse: (g, p) => others(g, p.id).some(o => o.hand.length),
      *run(g, p) {
        const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => o.hand.length), "Shadow's Ear: whose hand do you hear?");
        if (t) g.reveal(t, [p.id], "Shadow's Ear");
      },
    },
    abilities: [
      {
        id: 'sasayakiHa', name: 'Sasayaki Ha', gen: 2, limit: 'turn',
        text: 'Force a player to discard one card of your choice.',
        canUse: (g, p) => others(g, p.id).some(o => o.hand.length),
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id).filter(o => o.hand.length), 'Whispering Blade: whose hand?');
          if (!t) return;
          const c = yield* g.ask(p, 'card', `Choose a card for ${t.name} to discard`, t.hand.map(x => ({ label: g.card(x).name, value: x })));
          g.discardFromHand(t, c);
          g.log(`${t.name} discards ${g.card(c).name}.`, 'discard', { player: t.id, cards: [c] });
        },
      },
      {
        id: 'ayatsuri', name: 'Ayatsuri', gen: 4, limit: 'game',
        text: "Once per game: you choose the direction of a player's next move and the target of their next attack or targeted card.",
        canUse: (g, p) => others(g, p.id).length > 0,
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id), "Marionette's Thread: whose strings do you pull?");
          if (t) g.addEffect('redirect', t.id, { at: 'consumed' }, { by: p.id, level: 3 });
        },
      },
    ],
  },

  vaitama: {
    id: 'vaitama', name: "House Vai'tama", homeland: "Moa'olani", culture: 'Native-islander-inspired',
    identity: 'Adaptive/chaotic', curve: 'Swingy', tileType: 'trade', home: { x: 3, y: 3 },
    lore: "Moa'olani's people believe the drowned ancestors never fully leave. House Vai'tama's warriors carry the fallen within them, inheriting strength, memory, and secrets from the dead with every generation.",
    hp: [3, 3, 3, 3],
    passiveName: "Tahu'ora",
    passiveText: ['On death, your heir inherits a Legacy from any fallen bloodline.', 'On death, draw 2 Legacies and pick one.'],
    passive: {},
    legacyOnDeath: true,
    legacyDrawTwoAt: 3,
    extraPassiveAt: 4,
    abilities: [
      {
        id: 'ancestorsMask', name: "Ancestor's Mask", gen: 2, limit: 'game',
        text: "Once per game: copy another player's passive until your next turn.",
        canUse: (g, p) => others(g, p.id).length > 0,
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id), 'Borrowed Face: whose passive do you wear?');
          if (!t) return;
          g.addEffect('mask', p.id, { at: 'turnStart', player: p.id }, { house: t.house, level: t.gen >= 3 ? 2 : 1 });
          g.log(`${p.name} wears the face of ${g.house(t).name}: ${g.house(t).passiveName}.`, 'ability', { player: p.id });
        },
      },
    ],
  },

  kaysoley: {
    id: 'kaysoley', name: 'House Kay Soley', homeland: 'Zetwal', culture: 'Kreyol/Haitian-inspired',
    identity: 'Influence/diplomacy', curve: 'Late-favored', tileType: 'court', home: { x: 14, y: 3 },
    lore: "Zetwal's temple-court claims direct descent from Elodie's forgotten mortal children, marked at birth by a faint sun-shaped birthmark. Every other house either envies or resents them for it.",
    hp: [3, 3, 3, 3],
    passiveName: 'Limyè Elodie',
    passiveText: ['+1 Influence when you gain Influence from a Court tile.', '+2 Influence from Court tiles.'],
    passive: { tileBonus: (pillar, level) => (pillar === 'influence' ? level : 0) },
    claimReduction: gen => (gen >= 4 ? 2 : 0),
    abilities: [
      {
        id: 'semanLape', name: 'Sèman Lapè', gen: 2, limit: 'game',
        text: 'Once per game: you and one player cannot attack each other for 2 rounds.',
        canUse: (g, p) => others(g, p.id).length > 0,
        *run(g, p) {
          const t = yield* g.choosePlayer(p, others(g, p.id), 'Peace Oath: with whom?');
          if (!t) return;
          g.addEffect('truce', p.id, { at: 'roundEnd', round: g.s.round + 1 }, { other: t.id });
          g.log(`${p.name} and ${t.name} swear the Peace Oath.`, 'truce', { player: p.id, target: t.id });
        },
      },
    ],
  },

  agnivansh: {
    id: 'agnivansh', name: 'House Agnivansh', homeland: 'Jwaladesh', culture: 'Indian-subcontinent-inspired',
    identity: 'Aggro/tempo', curve: 'Early-favored', tileType: 'war', home: { x: 3, y: 14 },
    lore: "Jwaladesh's warriors follow the fire-god's doctrine: hesitation is the only true death. House Agnivansh trains for speed above all, trusting that momentum itself is a kind of armor.",
    hp: [3, 3, 3, 2],
    passiveName: 'Agni ki Shakti',
    passiveText: ['Your basic attacks deal +1 damage.', 'Also: +1 Fear whenever your attack lands.'],
    passive: { basicAttackBonus: () => 1, fearOnLanded: level => (level >= 2 ? 1 : 0) },
    halfMoveOnKill: gen => gen >= 2,
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
    id: 'stillwater', name: 'House Stillwater', homeland: 'Aldermoor', culture: 'English-inspired',
    identity: 'Defensive/patient', curve: 'Late-favored', tileType: 'court', home: { x: 0, y: 8 },
    lore: "Aldermoor's old families have weathered centuries of invasion and famine the same way every time: by simply outlasting everyone else.",
    hp: [3, 3, 3, 4],
    passiveName: "Stillwater's Patience",
    passiveText: ['Once per game, cancel a Reckoning bonus used against you.', 'One more use (two in total).'],
    passive: { reckoningCancels: level => level },
    longWatch: gen => gen >= 2,
    abilities: [],
  },
};

// Text for the generation cards (Gen II-IV rules that are not abilities).
export const GEN_NOTES: Partial<Record<HouseId, Partial<Record<2 | 3 | 4, string>>>> = {
  ironvow: { 2: "Raider's Charge: your basic attack may come before you move." },
  agnivansh: { 2: 'Rakt Ki Pyaas: after landing a kill, move up to half a d6 roll (rounded up).' },
  stillwater: {
    2: 'The Long Watch: if you take no aggressive action on your turn, gain 1 of any resource.',
    4: "Aldermoor's Vigil: Gen IV has 4 Heart Tokens.",
  },
  kaysoley: { 4: 'Rit Solèy: you need 2 less combined resources to Claim the Throne.' },
  vaitama: { 4: 'Tide of Ancestors: permanently gain the passive of a bloodline that has become a Specter.' },
};

export const pillarLabel = (x: Pillar) => cap(x);
export const ALL_PILLARS = PILLARS;
export type { Content };
