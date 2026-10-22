// Chapter 11, The War of the Harbor (Yucayeque, Xaraguá again): docs/quest/reviews/2026-10-22-chapter11-outline.md with
// every fix of its second review (2026-10-22-chapter11-outline-review.md) and the owner's decision of Oct 22 (on Strike,
// Azzy stays in the party, furious). The maps are tools/maps/xaragua.ts; every tile in a stage direction comes from
// data/war.ts; the fights are data/warBattles.ts.
//
// The owner's rules here: every story moment is acted out on the map (the companies come up the sand, the crew goes down
// the rock, the betrayer walks up the beach, Yari walks down the cellar stairs, Rael walks up the pier, old Benny walks up
// it after him, the wounded are carried in); Anissa is never touched by a foe, never a target and never jokes, and no comic
// line shares a node with hers (Salkhi, Samira's prices, Vikram's breath, Edmund's apologies stay in other nodes:
// tests/war.test.ts checks it). The locked rule, both sides of the Turn: before war.turn_made nothing here says Rael is good
// (the ninth thumbprint's carrier is a walk and a coat; the lookout's sails are a count); after it, the family speaks. The
// signet glows at Rael's public lie on the pier (fx 'signet', the guide's clue) and never in the truth; the Locket and the
// signet together glow as they did in Chapter 3 (fx 'token') when they read the Ash Road Accounts.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { FlagSnapshot } from '../../engine/flags.ts';
import type { StageCue } from '../../engine/stage.ts';
import { VOLLEY } from '../../config.ts';
import { BEACH, CAMP, CANEY, COMPANIES, CONUCO, FLANK_HOUSES, SONG, TIDE_PARTS, TIDE_READY, VILLAGE, type FlankHouse } from '../war.ts';
import { overlay, type MusterOverlay } from './zetwalMuster.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;

function say(speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, ...extra };
}

function nar(text: string, extra: Extra = {}): DialogueLine {
  return { speaker: '', text, ...extra };
}

function act(stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, stage, ...extra };
}

function script(id: string, nodes: Record<string, DialogueNode>, start = 'start'): DialogueScript {
  return { id, start, nodes };
}

function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return script(id, { start: { lines, set } });
}

function at(x: number, y: number): { x: number; y: number } {
  return { x, y };
}

const has = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });

const G = 'gianna';
const A = 'anissa';
const AF = 'anissa_far';
const Y = 'yari';
const Z = 'azzy';
const S = 'samira';
const BY = 'bayarmaa';
const H = 'haru';
const V = 'vikram';
const ED = 'edmund';
const JO = 'jordyn';
const JQ = 'joaquin_muster';
const SK = 'salkhi';
const R = 'rael';
const BO = 'benny_old';
const NA = 'nancy';
const AN = 'anaco';
const TH = 'thorne';
const CL = 'camp_leader';
const FB = 'fisher_boy';
const HR = 'head_runner';
const SG = 'harbor_sergeant';
const HL = 'hale';
const CA = 'caona';
const BN = 'benny';
const PT = 'patricio';

/** The house that sailed to the Crown, or the one that turned. */
const BETRAYED = has('muster.betrayed');
const TRUST = has('war.trust');
const WAR_ON: Condition = has('story.war_begun');
const STRIKE = has('war.strike');

// ---- The whistle (the outline 4.2 with the second review's 3.4): how many volleys before a fight ----------------------

/**
 * The whistle's nodes before a fight (`prefix`): Gianna lifts it, the choice (three at most, and only what the pool has
 * left), the companies answer, and the fight begins. `set` is whatever the last line also sets (Rael's place in the four).
 */
/** Where the companies stand when the whistle goes up (a line each place: the sand, the street, the pier). */
const SAND = 'Down the sand, every company is looking at her.';
const STREET = 'Through the open door, the companies in the street are looking at her.';
const PIER = 'Back along the pier and the shore, every company is looking at her.';

function whistle(prefix: string, battle: string, after: string, set: FlagSnapshot = {}, where: string = SAND): Record<string, DialogueNode> {
  const go = { 'battle.next': battle, 'battle.after': after, ...set };
  const choices: DialogueChoice[] = [];
  const words = ['', 'One volley.', 'Two volleys.', 'Three volleys.', 'Four volleys.'];
  for (let n: number = VOLLEY.cap; n >= 1; n--) {
    choices.push({ text: words[n] ?? `${n} volleys.`, if: { flag: 'war.volleys_left', gte: n }, set: { [`war.volleys.${battle}`]: n }, next: `${prefix}_fire` });
  }
  choices.push({ text: 'Hold your fire.', set: { [`war.volleys.${battle}`]: 0 }, next: `${prefix}_hold` });
  return {
    [`${prefix}_whistle`]: {
      lines: [
        act([{ do: 'face', actor: 'player', facing: 'down' }], '', `Gianna lifts the Marshal's whistle. ${where}`, { fx: 'whistle' }),
        nar('(Volleys left: the fleet\'s Journal note counts them. Three at most before a fight.)'),
      ],
      choices,
    },
    [`${prefix}_fire`]: {
      lines: [
        { if: has('army.free_brasador'), speaker: Z, text: '¡Firmes! ...Fire.' },
        nar('Down the line the companies answer the whistle, one after another.', { fx: 'volley', set: go }),
      ],
    },
    [`${prefix}_hold`]: { lines: [nar('The companies hold their fire.', { set: go })] },
  };
}

// ---- Beat 0: the strait at first light, the landing (xaragua-beach) -----------------------------------------------------

/** The companies landing in file: a column each (the second review's 3.11), a gap where a house is missing. */
function landingFile(): DialogueLine[] {
  return COMPANIES.map((c, i) => {
    const x = BEACH.columns[i]!;
    const [r1, r2, r3] = BEACH.columnRows as readonly number[];
    const from = at(x, 14);
    const cues: StageCue[] =
      c.army === 'free_brasador'
        ? [
            { do: 'enter', actor: `fb_1`, look: 'joaquin_free', from, to: at(x + 1, r1!), facing: 'up', async: true },
            { do: 'enter', actor: `fb_2`, look: c.soldier, from, to: at(x, r2!), facing: 'up', async: true },
            { do: 'enter', actor: `fb_3`, look: c.soldier, from, to: at(x, r3!), facing: 'up', async: true },
            { do: 'walk', actor: 'azzy', to: at(x, r1!), facing: 'up' },
          ]
        : [
            { do: 'enter', actor: `${c.army}_1`, look: c.captain, from, to: at(x, r1!), facing: 'up', async: true },
            { do: 'enter', actor: `${c.army}_2`, look: c.soldier, from, to: at(x, r2!), facing: 'up', async: true },
            { do: 'enter', actor: `${c.army}_3`, look: c.soldier, from, to: at(x, r3!), facing: 'up' },
          ];
    const text =
      c.army === 'free_brasador'
        ? 'Free Brasador comes up the sand behind its captain. Azzy walks to its head; Joaquin falls in at his side.'
        : c.army === 'aldermoor'
          ? 'Jordyn\'s watch lands last and fewest, coats turned inside out, in step.'
          : `${c.name} come up out of the boats in file, and form a column on the sand.`;
    return act(cues, '', text, { if: { flag: `army.${c.army}`, gte: 1 } });
  });
}

/** A house that sailed to the Crown at the Muster: a gap in the line, and Haru says so once. */
const GAP_LINES: DialogueLine[] = FLANK_HOUSES.map((h) => ({
  if: all(has(`muster.betrayer.${h.house}`), has('muster.betrayed')),
  speaker: H,
  text: `Nobody lands for ${{ skarragol: 'the Ironvow', kuroshi: 'the Suzumori', jwaladesh: 'the Agnivansh', al_doria: 'the Dorini' }[h.house]}.`,
}));

const LANDING: DialogueScript = script('war_landing', {
  start: {
    lines: [
      nar('...and down the strait, to the harbor the seventh clause took. Seven navies behind one trader.', { fx: 'fade' }),
      nar('And a fire on the headland that was not there yesterday.'),
      act([{ do: 'look', actor: 'yari' }], Y, 'There. The caney\'s roof. They\'ve put a flag on it.'),
      say(H, 'Eleven hulls across the mouth, and a chain from the big one to the old post at the pier. He\'s learned nothing.'),
      act([{ do: 'face', actor: 'azzy', facing: 'up' }, { do: 'wait', ms: 600 }], '', 'Azzy looks north up the strait, toward Ardencia\'s cliffs, and says nothing.'),
    ],
    next: 'deck',
  },
  deck: {
    lines: [
      say(S, 'A chain costs more than a ship. Somebody is frightened.'),
      say(ED, 'That\'s the Patience. The Regent\'s own. I\'ve been aboard her. The tea is dreadful.'),
      say(BY, 'Then we don\'t go in the front.'),
      say(V, 'My great-grandfather broke a chain once. ...We go round.'),
    ],
    next: 'fire',
  },
  fire: {
    lines: [
      act([{ do: 'face', actor: 'follower', facing: 'up' }, { do: 'look', actor: 'player' }], A, 'Gigi. The fire on the hill. That\'s them, isn\'t it. That\'s the cave.'),
      say(G, 'That\'s them. They saw ours.'),
    ],
    next: 'gun',
  },
  gun: {
    lines: [
      act([{ do: 'sync' }], '', 'On the headland a gun speaks. The shot lands in the water short of the boats.', { fx: 'cannon' }),
      say(Y, 'The marines watch the harbor mouth, not the cliffs. They always did.'),
    ],
    next: 'file',
  },
  file: {
    lines: [...landingFile(), ...GAP_LINES],
    next: 'resistance',
  },
  resistance: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'leader', look: 'camp_leader', from: at(BEACH.gardensRoad.x, BEACH.gardensRoad.y), to: at(BEACH.landing.x + 2, BEACH.landing.y - 1), facing: 'left', run: true, async: true },
          { do: 'enter', actor: 'boy', look: 'fisher_boy', from: at(BEACH.gardensRoad.x + 1, BEACH.gardensRoad.y), to: at(BEACH.landing.x + 3, BEACH.landing.y), facing: 'left', run: true, async: true },
          { do: 'enter', actor: 'healer', look: 'behique', from: at(BEACH.gardensRoad.x, BEACH.gardensRoad.y + 1), to: at(BEACH.healer.x, BEACH.healer.y), facing: 'right', async: true },
          { do: 'enter', actor: 'fisher', look: 'canoe_fisher', from: at(BEACH.gardensRoad.x + 1, BEACH.gardensRoad.y + 1), to: at(BEACH.canoeFisher.x, BEACH.canoeFisher.y), facing: 'right' },
          { do: 'look', actor: 'leader' },
        ],
        FB,
        'Yari!',
      ),
      act([{ do: 'walk', actor: 'yari', to: at(BEACH.landing.x + 1, BEACH.landing.y), facing: 'right', run: true }], CL, 'Envoy. You said you\'d find him. You brought a navy to do it.'),
      say(CL, 'The Crown holds the village and the harbor. Anaco is still under the customs house.'),
      say(CL, 'They moved him twice. He is back in the cellar. The Governor likes to have him near.'),
      say(CL, 'And the gun on the headland covers this beach and the gardens\' road. Nothing of yours goes up to us until it\'s quiet.'),
    ],
    next: 'whistle',
  },
  whistle: {
    lines: [
      say(CL, 'Your grandfather\'s note. The runners say every company on this beach knows it.'),
      act([{ do: 'face', actor: 'player', facing: 'down' }, { do: 'wait', ms: 700 }], '', 'Gianna takes the brass whistle out of her collar, and turns it in her fingers where the columns can see it.'),
      say(CL, 'We\'ll wait for you below the gun. Then up the hill.', { set: { 'story.landed': true } }),
      act(
        [
          { do: 'exit', actor: 'healer', to: at(BEACH.gardensRoad.x, BEACH.gardensRoad.y), async: true },
          { do: 'exit', actor: 'fisher', to: at(BEACH.gardensRoad.x + 1, BEACH.gardensRoad.y), async: true },
          { do: 'exit', actor: 'leader', to: at(BEACH.campLeader.x, BEACH.campLeader.y), async: true },
          { do: 'exit', actor: 'boy', to: at(BEACH.fisherBoy.x, BEACH.fisherBoy.y) },
          { do: 'sync' },
          { do: 'look', actor: 'player' },
        ],
        '',
        'The columns break up along the sand. East, on the headland rock, the gun\'s crew is turning the gun.',
      ),
    ],
  },
});

// ---- Beat 1: the gun on the headland (stage one) -------------------------------------------------------------------------

const HEADLAND: DialogueScript = script('headland_battery', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:gun_officer' }], 'crown_officer', 'Marines! The beach is the Crown\'s by Charter. Present!'),
      act([{ do: 'look', actor: 'player' }], Y, 'Three of them, and a breastplate.'),
    ],
    next: 'h_whistle',
  },
  ...whistle('h', 'headland_battery', 'headland_after'),
});

const HEADLAND_AFTER: DialogueScript = script('headland_after', {
  start: {
    lines: [
      act(
        [
          { do: 'exit', actor: 'npc:gun_musketeer', to: at(BEACH.crewOut.x, BEACH.crewOut.y), async: true },
          { do: 'exit', actor: 'npc:gun_musketeer_b', to: at(BEACH.crewOut.x + 1, BEACH.crewOut.y), async: true },
          { do: 'exit', actor: 'npc:gun_officer', to: at(BEACH.crewOut.x, BEACH.crewOut.y) },
        ],
        '',
        'The crew go down the rock\'s west foot, and away north over the dunes, at a run.',
      ),
      act([{ do: 'walk', actor: 'edmund', to: at(BEACH.gun.x - 2, BEACH.gun.y + 2), facing: 'up' }], ED, 'Terribly sorry about your gun.'),
    ],
    next: 'turned',
  },
  turned: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(BEACH.canoeFisher.x + 4, 13), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'Anissa goes down to the water\'s edge with Yari, to watch the boats.'),
      nar('Two of the levy put their shoulders to the gun, and turn it to face the harbor mouth.', { set: { 'story.headland_won': true }, stage: [{ do: 'sync' }] }),
      act(
        [
          { do: 'enter', actor: 'sergeant', look: 'zetwal_levy', from: at(14, 14), to: at(BEACH.gun.x - 3, BEACH.gun.y + 2), facing: 'up' },
          { do: 'look', actor: 'sergeant' },
        ],
        SG,
        'Zetwal has a gun on a hill. The council will want a statue.',
      ),
      act([{ do: 'exit', actor: 'sergeant', to: at(14, 14) }, { do: 'look', actor: 'player' }], CL, 'Now it\'s quiet. The gardens\' road goes up off the beach\'s north edge. Come up to the camp.'),
      act([{ do: 'exit', actor: 'npc:camp_leader_beach', to: at(BEACH.gardensRoad.x, BEACH.gardensRoad.y), async: true }, { do: 'exit', actor: 'npc:fisher_boy_beach', to: at(BEACH.gardensRoad.x + 1, BEACH.gardensRoad.y) }], '', 'The camp leader and the boy go up the gardens\' road.'),
    ],
  },
});

// ---- Beat 2: sails behind us (the flank, or the house that stayed) ----------------------------------------------------

/** Who the captain is on the name tag (Chapter 10's speakers). */
const CAPTAIN_SPEAKER: Readonly<Record<string, string>> = { skarragol: 'hrafn', kuroshi: 'muster_retainer', jwaladesh: 'agnivansh_steward', al_doria: 'dorini_admiral' };
/** The captain's house foes' look. */
const HOUSE_FOE_LOOK: Readonly<Record<string, string>> = { skarragol: 'steppe_reaver', kuroshi: 'fog_cutpurse', jwaladesh: 'oil_enforcer', al_doria: 'caravan_raider' };
/** The house's soldiers' look (the turned route's three-quarter company). */
const HOUSE_LOOK: Readonly<Record<string, string>> = { skarragol: 'horn_rider', kuroshi: 'gate_guard_kq', jwaladesh: 'flame_keeper', al_doria: 'dorini_marine' };
/** The captain's line on the sand, in the register Chapter 10 gave him (the outline beat 2). */
const ON_THE_SAND: Readonly<Record<string, string>> = {
  skarragol: 'The Throne pays on the harbor. I have come for the harbor.',
  kuroshi: 'Neutral, envoy. Neutral means I fight whoever is losing.',
  jwaladesh: 'The flame is the Throne\'s. So is the beach, it seems.',
  al_doria: 'The guild sent me to collect.',
};
/** The companion's second defiance (STORY 6.9; the outline 9.4 with the second review's 3.12: earnest, every one). */
const DEFIES: Readonly<Record<string, string>> = {
  skarragol: 'The Moot wrote the first sale down as shameful. I said I\'d write the second. I brought the pen.',
  kuroshi: 'Retainer. I was definitely not a spy. You definitely were. Mother will want the pages, and I will give them to her.',
  jwaladesh: 'Steward. You sold the flame for oil. I\'ll take it back the way Arjun did.',
  al_doria: 'You sold my mother\'s guild and then you came to collect. I\'ll price that. It\'s everything, and it\'s due.',
};
/** On the turned route: the companion to the house's second (the short form). */
const STAND_WHERE: Readonly<Record<string, string>> = {
  skarragol: 'Stand where the standard can see you.',
  kuroshi: 'Stand where the lantern can see you.',
  jwaladesh: 'Stand where the lamp can see you.',
  al_doria: 'Stand where the seal can see you.',
};
/** The Yield, the companion's choice (the outline beat 2). */
const YIELD: Readonly<Record<string, readonly [string, string]>> = {
  skarragol: ['Let the steppe see him walk home.', 'Hold him for the Moot.'],
  kuroshi: ['The files will name you. Enough.', 'Bind him. Mother will read him.'],
  jwaladesh: ['Enough. You\'re out of oil.', 'Walk him to the flame.'],
  al_doria: ['Invoice the guild. It\'s cheaper.', 'Bind him. He pays on time.'],
};
const CHARM_TEXT: Readonly<Record<string, string>> = {
  skarragol: 'Bayarmaa cuts a tassel from the standard he sold, and ties it on herself.',
  kuroshi: 'Haru takes the file seal from the retainer\'s sleeve, and folds it small.',
  jwaladesh: 'Vikram takes the wick-ring off the steward\'s lamp, and puts it on his thumb.',
  al_doria: 'The admiral\'s clerk gives Samira back the guild\'s seal. "Free," he says. She looks at it a long time.',
};

function flankNodes(h: FlankHouse): Record<string, DialogueNode> {
  const k = h.house;
  const from = at(BEACH.hullLanding.x, BEACH.hullLanding.y);
  return {
    [k]: {
      lines: [
        act([{ do: 'look', actor: 'player' }], H, 'Sails. Behind the fleet. Not ours.'),
        say(Y, 'Count them.'),
        act([{ do: 'sync' }, { do: 'wait', ms: 600 }], '', 'A hull comes round the point and grounds at the beach\'s west end, under its house\'s colours.'),
        act(
          [
            { do: 'enter', actor: 'captain', look: h.captainLook, from, to: at(BEACH.captain.x, BEACH.captain.y), facing: 'right', async: true },
            { do: 'enter', actor: 'foe_1', look: HOUSE_FOE_LOOK[k]!, from, to: at(BEACH.houseFoes[0]!.x, BEACH.houseFoes[0]!.y), facing: 'right', async: true },
            { do: 'enter', actor: 'foe_2', look: HOUSE_FOE_LOOK[k]!, from, to: at(BEACH.houseFoes[1]!.x, BEACH.houseFoes[1]!.y), facing: 'right', async: true },
            { do: 'enter', actor: 'veil', look: 'husher', from, to: at(BEACH.husher.x, BEACH.husher.y), facing: 'right' },
            { do: 'look', actor: 'captain' },
          ],
          '',
          'Down its side and up the sand, straight at the party: the captain, two of his house, and a grey veil among them.',
        ),
        say(CAPTAIN_SPEAKER[k]!, ON_THE_SAND[k]!),
      ],
      next: `${k}_defy`,
    },
    [`${k}_defy`]: {
      lines: [
        act([{ do: 'walk', actor: h.companion, to: at(BEACH.companionStep.x, BEACH.companionStep.y), facing: 'left' }, { do: 'look', actor: h.companion }], h.companion, DEFIES[k]!),
        nar('The grey veil is not looking at the companion. It is looking past Gianna, at the back of the line.'),
      ],
      next: `${k}_whistle`,
    },
    ...whistle(k, `harbor_flank_${k}`, 'flank_after', { 'story.flank_fought': true }),
  };
}

const FLANK: DialogueScript = script('harbor_flank', {
  start: {
    lines: [],
    next: [{ if: has('muster.turned'), to: 'turned' }, ...FLANK_HOUSES.map((h) => ({ if: all(BETRAYED, has(`muster.betrayer.${h.house}`)), to: h.house })), { to: 'quiet' }],
  },
  ...Object.fromEntries(FLANK_HOUSES.flatMap((h) => Object.entries(flankNodes(h)))),
  turned: {
    lines: [
      act([{ do: 'look', actor: 'player' }], H, 'No sails behind the fleet. I counted twice.'),
      nar('Up the sand from the boats, with three quarters of a company behind them: the house that stayed.'),
    ],
    next: FLANK_HOUSES.map((h) => ({ if: has(`muster.betrayer.${h.house}`), to: `${h.house}_stood` })),
  },
  ...Object.fromEntries(
    FLANK_HOUSES.map((h) => [
      `${h.house}_stood`,
      {
        lines: [
          act(
            [
              { do: 'enter', actor: 'second', look: h.secondLook, from: at(10, 14), to: at(BEACH.captain.x + 1, BEACH.captain.y), facing: 'right', async: true },
              { do: 'enter', actor: 'stood_1', look: HOUSE_LOOK[h.house]!, from: at(9, 14), to: at(BEACH.captain.x, BEACH.captain.y - 1), facing: 'right', async: true },
              { do: 'enter', actor: 'stood_2', look: HOUSE_LOOK[h.house]!, from: at(11, 14), to: at(BEACH.captain.x, BEACH.captain.y + 1), facing: 'right' },
              { do: 'look', actor: 'second' },
            ],
            h.second,
            'We sailed with the envoy. The captain is in a Hall with a lock on it. Tell us where to stand.',
          ),
          act([{ do: 'walk', actor: h.companion, to: at(BEACH.companionStep.x, BEACH.companionStep.y), facing: 'left' }], h.companion, STAND_WHERE[h.house]!),
          act(
            [{ do: 'exit', actor: 'second', to: at(10, 14), async: true }, { do: 'exit', actor: 'stood_1', to: at(9, 14), async: true }, { do: 'exit', actor: 'stood_2', to: at(11, 14) }, { do: 'look', actor: 'player' }],
            '',
            'They go to their place in the line on the sand, and stand in it.',
            { set: { 'war.flank_done': true, 'war.house_stood': true } },
          ),
        ],
      },
    ]),
  ),
  quiet: { lines: [nar('The fleet rides at anchor off the sand. Nothing behind it.', { set: { 'war.flank_done': true } })] },
});

/** The captain again, after a lost fight (his placement on the sand). */
const FLANK_AGAIN: DialogueScript = script('flank_again', {
  start: {
    lines: [],
    next: FLANK_HOUSES.map((h) => ({ if: has(`muster.betrayer.${h.house}`), to: h.house })),
  },
  ...Object.fromEntries(
    FLANK_HOUSES.flatMap((h) =>
      Object.entries({
        [h.house]: {
          lines: [say(CAPTAIN_SPEAKER[h.house]!, 'Again, envoy? The Throne pays by the hour.'), say(h.companion, DEFIES[h.house]!)],
          next: `${h.house}_whistle`,
        },
        ...whistle(h.house, `harbor_flank_${h.house}`, 'flank_after'),
      }),
    ),
  ),
});

function flankAfterNodes(h: FlankHouse): Record<string, DialogueNode> {
  const k = h.house;
  const cap = `npc:${h.captainNpc}`;
  const [spare, bind] = YIELD[k]!;
  return {
    [k]: {
      lines: [
        act(
          [
            { do: 'place', actor: 'veil', look: 'husher', at: at(BEACH.husher.x, BEACH.husher.y), facing: 'down' },
            { do: 'exit', actor: 'veil', to: at(BEACH.husher.x - 1, 15) },
          ],
          '',
          'The grey veil walks backwards into the sea, and is gone.',
        ),
        act([{ do: 'look', actor: cap }], '', 'The captain is on the sand. The two of his house who came with him stand where they are, and do not move.'),
      ],
      choices: [
        { text: spare, set: { 'choice.flank_spared': true }, next: `${k}_spared` },
        { text: bind, set: { 'choice.flank_bound': true }, next: `${k}_bound` },
      ],
    },
    [`${k}_spared`]: { lines: [say(h.companion, spare)], next: `${k}_taken` },
    [`${k}_bound`]: { lines: [say(h.companion, bind)], next: `${k}_taken` },
    [`${k}_taken`]: {
      lines: [
        act([{ do: 'walk', actor: 'follower', to: at(BEACH.healer.x, BEACH.healer.y + 1), facing: 'up' }], '', 'Anissa goes down the sand to the healer, where the boats are.'),
        act(
          [
            { do: 'enter', actor: 'jordyn_f', look: 'jordyn_free', from: at(24, 11), to: at(BEACH.captain.x + 1, BEACH.captain.y - 1), facing: 'left', async: true },
            { do: 'enter', actor: 'watch_f1', look: 'watch_inside_out', from: at(24, 12), to: at(BEACH.captain.x, BEACH.captain.y - 1), facing: 'down', async: true },
            { do: 'enter', actor: 'watch_f2', look: 'watch_inside_out', from: at(24, 10), to: at(BEACH.captain.x, BEACH.captain.y + 1), facing: 'up' },
            { do: 'look', actor: 'jordyn_f' },
          ],
          JO,
          'Under arrest for the Crown\'s gold on a free beach. Same words as last time; I only have the one set.',
        ),
        act(
          [
            { do: 'exit', actor: cap, to: at(BEACH.hullLanding.x, BEACH.hullLanding.y), async: true },
            { do: 'exit', actor: 'watch_f1', to: at(BEACH.hullLanding.x, BEACH.hullLanding.y), async: true },
            { do: 'exit', actor: 'watch_f2', to: at(BEACH.hullLanding.x + 1, BEACH.hullLanding.y), async: true },
            { do: 'exit', actor: 'jordyn_f', to: at(BEACH.hullLanding.x + 1, BEACH.hullLanding.y) },
          ],
          '',
          'The watch walk him down to the boats between them, by the book.',
        ),
        nar(CHARM_TEXT[k]!, { set: { [`item.${h.charm}`]: 1 } }),
        act([{ do: 'sync' }, { do: 'look', actor: 'player' }], '', 'His hull is empty on the sand. The house\'s soldiers who came in it go and stand with the rest.', { set: { 'war.flank_done': true } }),
      ],
    },
  };
}

const FLANK_AFTER: DialogueScript = script('flank_after', {
  start: { lines: [], next: FLANK_HOUSES.map((h) => ({ if: has(`muster.betrayer.${h.house}`), to: h.house })) },
  ...Object.fromEntries(FLANK_HOUSES.flatMap((h) => Object.entries(flankAfterNodes(h)))),
});

// ---- Beat 3: the hill camp, the plan --------------------------------------------------------------------------------------

const CAMP_SCENE: DialogueScript = script('war_camp', {
  start: {
    lines: [
      nar('The hill camp is the resistance\'s again. The elders at the fire, the healer with a row of hamacas slung for the wounded to come.', { fx: 'fade' }),
      nar('The head runner on the rock with a conch. The fisher\'s boy beside him with a tally stick. And at the gate, seven violet coats.'),
      act([{ do: 'look', actor: 'npc:jordyn_war' }], JO, 'I keep the law where I stand. Today I stand on a hill.'),
    ],
    next: 'plan',
  },
  plan: {
    lines: [
      act([{ do: 'look', actor: 'npc:camp_leader_war' }], CL, 'Forty marines and a Governor hold the village. Eleven ships and the Patience hold the harbor. The chain holds the mouth.'),
      say(CL, 'We go down at the lowest tide, at dusk. The canoes come under the pier from the sea cave while you come down the mountain.'),
      say(CL, 'Until then: the canoes need powder, the ships need counting again, and the elders must agree what the harbor is for.'),
      act([{ do: 'look', actor: 'player' }], Y, 'Everything is the tide here.', { set: { 'story.camp_plan': true } }),
    ],
  },
});

const CAMP_LEADER: DialogueScript = script('camp_leader_war_talk', {
  start: {
    lines: [],
    next: [
      { if: all(has('side.harbors_lie.counted'), not('side.harbors_lie.done')), to: 'count' },
      { if: has('story.tide_called'), to: 'dusk' },
      { to: 'plan' },
    ],
  },
  count: {
    lines: [
      say(FB, 'Eleven, and four black ones off the point!'),
      say(CL, 'Eleven and four. Then the canoes go for the Patience, not the pier.', { set: { 'side.harbors_lie.done': true } }),
    ],
  },
  plan: { lines: [say(CL, 'Powder for the canoes, the ships counted, and the elders agreed. Then the conch.')] },
  dusk: { lines: [say(CL, 'Down the mountain, envoy. The tide does not wait for anyone.')] },
});

const BEACH_LEADER: DialogueScript = simple('camp_leader_beach_talk', [say(CL, 'The gun first, envoy. Then up the hill.')]);
const BEACH_BOY: DialogueScript = simple('fisher_boy_beach_talk', [say(FB, 'I counted your ships! Six. And a gap.')]);

/** The head runner on the rock: the gate (the outline section 6), worded from the flags; then the conch. */
const HEAD_RUNNER: DialogueScript = script('war_head_runner', {
  start: { lines: [], next: [{ if: TIDE_READY, to: 'ready' }, { to: 'waiting' }] },
  waiting: {
    lines: [...TIDE_PARTS.map((p) => ({ if: not(p.flag), speaker: HR, text: p.left })), say(A, 'Your Quests page, Gigi.')],
  },
  ready: {
    lines: [
      say(HR, 'Say the word, cacica.'),
      act([{ do: 'look', actor: 'yari' }], Y, 'Blow it.'),
      act([{ do: 'look', actor: 'npc:head_runner_war' }], '', 'The head runner puts the conch to his mouth. It sounds down the mountain, to the point, and to the bay.', { fx: 'conch' }),
      act(
        [
          { do: 'exit', actor: 'npc:canoe_fisher_war', to: at(CAMP.gate.x, CAMP.gate.y + 2), async: true },
          { do: 'enter', actor: 'scout_1', look: 'camp_scout', from: at(CAMP.jars.x, CAMP.jars.y), to: at(CAMP.gate.x - 1, CAMP.gate.y + 2), async: true },
          { do: 'enter', actor: 'scout_2', look: 'camp_scout', from: at(CAMP.jars.x + 1, CAMP.jars.y), to: at(CAMP.gate.x, CAMP.gate.y + 2) },
        ],
        '',
        'The canoe fisher and two scouts go down off the camp\'s south edge with the powder jars, for the sea cave.',
      ),
      nar('The companies file off the hill after them. The sun is on the sea.', { fx: 'fade', set: { 'story.tide_called': true } }),
    ],
  },
});

const ELDER_UNDECIDED: DialogueScript = script('elder_undecided_war_talk', {
  start: { lines: [], next: [{ if: has('debate.xaragua_harbor.settled'), to: 'settled' }, { to: 'listening' }] },
  listening: { lines: [say('elder_undecided', 'I am listening to both of them, envoy. I have been listening for fifty years.')] },
  settled: { lines: [say('elder_undecided', 'We know what we are taking it for. That is more than the Crown ever did.')] },
});

/** The healer asks Anissa, not Gianna, to hold the lamp (the outline beat 4; earnest, nobody else in the node). */
const HEALER: DialogueScript = script('healer_war_talk', {
  start: { lines: [], next: [{ if: has('story.lamp_promised'), to: 'again' }, { to: 'ask' }] },
  ask: {
    lines: [
      act([{ do: 'face', actor: 'follower', facing: 'player' }], 'behique', 'Little one. When the wounded come, I\'ll need a lamp held at the hamacas. You held it at the cave mouth. I remember.'),
      say(A, 'I\'ll hold it.', { set: { 'story.lamp_promised': true } }),
    ],
  },
  again: { lines: [say('behique', 'Clean cloth, boiled water, and the lamp. That is a hospital.')] },
});

const JORDYN_CAMP: DialogueScript = script('jordyn_war_talk', {
  start: { lines: [], next: [{ if: has('story.harbor_taken'), to: 'after' }, { if: has('story.tide_called'), to: 'dusk' }, { to: 'day' }] },
  day: { lines: [say(JO, 'Seven of us on the gate. The watch keeps the law where it stands.')] },
  dusk: { lines: [say(JO, 'The east trail is ours. Nobody comes up behind you that the law doesn\'t know.')] },
  after: { lines: [say(JO, 'Two arrests in one day and neither of them by the book I trained on. I am learning a new book.')] },
});

const SALKHI: DialogueScript = simple('salkhi_war_talk', [say(SK, 'A mountain. After a ship. I was promised grass.')]);

// ---- Beat 4: The Ninth Thumbprint (the outline 7.1; the second review's 3.7 and 3.16) ----------------------------------

const LAMP_OIL: DialogueScript = script('thumbprint_lamp_oil', {
  start: {
    lines: [],
    next: [
      { if: has('side.ninth_thumbprint.done'), to: 'done' },
      { if: has('side.ninth_thumbprint.accepted'), to: 'again' },
      { if: has('story.camp_reached'), to: 'ask' },
      { to: 'done' },
    ],
  },
  ask: {
    lines: [
      say('lamp_oil_seller', 'The canoes have no powder. The jars that come to the cave mouth on new-moon nights are oil, not powder.'),
      say('lamp_oil_seller', 'Tonight is a new moon, and the lowest tide. Still never met him.'),
      say('lamp_oil_seller', 'But the last jars came with a note. "For the harbor. When they come."', { set: { 'side.ninth_thumbprint.accepted': true } }),
      nar('(The petroglyph cave is under the cassava gardens, down the Mountain Path.)'),
    ],
  },
  again: { lines: [say('lamp_oil_seller', 'The cave mouth, in the gardens. Look at the wax.')] },
  done: { lines: [say('lamp_oil_seller', 'Torches and casabe. The war won\'t feed you.')] },
});

const CARRIER: DialogueScript = script('thumbprint_carrier', {
  start: {
    lines: [
      act(
        [
          { do: 'place', actor: 'carrier', look: 'free_brasador', at: at(CONUCO.caveMouth.x, CONUCO.caveMouth.y), facing: 'down' },
          { do: 'look', actor: 'carrier' },
          { do: 'wait', ms: 700 },
          { do: 'exit', actor: 'carrier', to: at(CONUCO.carrierOut.x, CONUCO.carrierOut.y) },
          { do: 'look', actor: 'player' },
        ],
        '',
        'A man in a black coat, sash torn off, comes out of the cave and walks east through the gardens. He does not run, or look back.',
      ),
    ],
    next: 'walk',
  },
  walk: {
    lines: [
      act([{ do: 'face', actor: 'follower', facing: 'player' }], A, 'He walked like the ones on the strand, Gigi. The black coats.'),
      say(Z, '...A lot of people walk like that.'),
    ],
  },
});

const JARS: DialogueScript = script('thumbprint_jars', {
  start: {
    lines: [
      nar('A row of jars at the antechamber\'s edge that were not here before. Not oil: powder, each sealed with wax.'),
      nar('And in the wax of every jar, a grey thumbprint.'),
      say(H, 'The ninth door.'),
      say(G, 'We carry them up. Carefully.', { set: { 'side.ninth_thumbprint.jars': true } }),
    ],
  },
});

const PICKET: DialogueScript = script('thumbprint_picket', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:war_picket' }], 'crown_officer', 'Those jars. In the Regent\'s name, put them down.'),
      act([{ do: 'look', actor: 'player' }], BY, 'Best blades up front.', { set: { 'battle.next': 'thumbprint_picket', 'battle.after': 'picket_after' } }),
    ],
  },
});

const PICKET_AFTER: DialogueScript = simple('picket_after', [nar('The picket runs for the village, and leaves its powder horns in the cassava.')], { 'side.ninth_thumbprint.picket': true });

const CANOE_FISHER: DialogueScript = script('war_canoe_fisher', {
  start: {
    lines: [],
    next: [
      { if: all(has('side.ninth_thumbprint.jars'), has('encounter.war_story.picket.won'), not('side.ninth_thumbprint.done')), to: 'powder' },
      { if: has('side.ninth_thumbprint.done'), to: 'ready' },
      { to: 'waiting' },
    ],
  },
  powder: {
    lines: [
      act([{ do: 'look', actor: 'npc:canoe_fisher_war' }], 'canoe_fisher', 'Powder. Then the canoes go under the pier tonight, and not just alongside it.', { set: { 'side.ninth_thumbprint.done': true } }),
      act([{ do: 'sync' }], '', 'He stacks the jars by the camp\'s south edge, each one turned so the thumbprint faces out.'),
    ],
  },
  ready: { lines: [say('canoe_fisher', 'Powder in the canoes. Now we wait for the conch.')] },
  waiting: { lines: [say('canoe_fisher', 'Canoes we have. What goes in them, we don\'t.')] },
});

// ---- Beat 4: Harbors Lie (the outline 7.2) -----------------------------------------------------------------------------------

const BOY: DialogueScript = script('harbors_lie_boy', {
  start: {
    lines: [],
    next: [
      { if: has('side.harbors_lie.done'), to: 'done' },
      { if: has('side.harbors_lie.counted'), to: 'tell' },
      { if: has('story.camp_reached'), to: 'ask' },
      { to: 'done' },
    ],
  },
  ask: {
    lines: [
      say(FB, 'Forty-two marines. Eleven ships. But the camp leader says count them again from the top, because harbors lie.'),
      say(FB, 'The lookout\'s over the sea. Come on!', { set: { 'side.harbors_lie.accepted': true } }),
      act([{ do: 'exit', actor: 'npc:fisher_boy_war', to: at(CAMP.gate.x, CAMP.gate.y + 2), run: true }], '', 'He is off down the mountain before anyone can say yes.'),
    ],
  },
  tell: { lines: [say(FB, 'Tell the camp leader! Eleven and four!')] },
  done: { lines: [say(FB, 'I counted them all. Twice. From the top.')] },
});

const COUNT: DialogueScript = script('harbors_lie_count', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:fisher_boy_lookout' }], FB, 'From here you can see the whole harbor. Watch.'),
      say(FB, 'Three at anchor by the pier. Seven across the mouth. The big one in the middle with the violet rag is the Patience.'),
      say(FB, 'That\'s eleven.'),
      say(FB, 'And those.'),
    ],
    next: 'sails',
  },
  sails: {
    lines: [
      say(FB, 'Black sails. Off the point. Four. They\'re not Crown and they\'re not yours.'),
      act([{ do: 'face', actor: 'azzy', facing: 'up' }, { do: 'wait', ms: 800 }], Z, '...Ardencia.'),
      say(G, 'He came for the Regent\'s harbor. Of course he did.', { set: { 'side.harbors_lie.counted': true } }),
      act([{ do: 'exit', actor: 'npc:fisher_boy_lookout', to: at(26, 12), run: true }, { do: 'look', actor: 'player' }], '', 'The boy runs back up the trail to tell the camp.'),
    ],
  },
});

// ---- Beat 5: the village by dusk ---------------------------------------------------------------------------------------------

const VILLAGE_DUSK: DialogueScript = script('war_village', {
  start: {
    lines: [
      nar('The Harbor Village by dusk. Crown banners on the houses, marines at the trails, three ships at anchor.', { fx: 'fade' }),
      nar('Out in the mouth the Patience rides on her cable, and her chain runs to the old post at the pier\'s sea end.'),
      act(
        [
          { do: 'enter', actor: 'col_1', look: 'zetwal_levy', from: at(0, 15), to: at(VILLAGE.yard[0]!.x, VILLAGE.yard[0]!.y + 4), facing: 'right', async: true },
          { do: 'enter', actor: 'col_2', look: 'free_brasador', from: at(0, 16), to: at(VILLAGE.yard[1]!.x, VILLAGE.yard[1]!.y + 4), facing: 'right', async: true },
          { do: 'enter', actor: 'col_3', look: 'horn_rider', from: at(0, 15), to: at(VILLAGE.yard[2]!.x, VILLAGE.yard[2]!.y + 4), facing: 'right' },
          { do: 'exit', actor: 'col_1', to: at(VILLAGE.yard[0]!.x, VILLAGE.yard[0]!.y), async: true },
          { do: 'exit', actor: 'col_2', to: at(VILLAGE.yard[1]!.x, VILLAGE.yard[1]!.y), async: true },
          { do: 'exit', actor: 'col_3', to: at(VILLAGE.yard[2]!.x, VILLAGE.yard[2]!.y) },
        ],
        '',
        'The companies come in behind the party along the gardens\' trail, and spread through the house rings.',
      ),
      act(
        [
          { do: 'enter', actor: 'jordyn_v', look: 'jordyn_free', from: at(0, 16), to: at(VILLAGE.jordyn.x, VILLAGE.jordyn.y), facing: 'left' },
          { do: 'look', actor: 'player' },
          { do: 'sync' },
        ],
        JO,
        'East trail. Nobody comes up it behind you.',
      ),
      say(Y, 'The customs house. The cellar\'s under it.'),
    ],
  },
});

// ---- Stage two: Governor Thorne (the customs house; the second review's 3.10 and 3.14) -----------------------------------

const THORNE: DialogueScript = script('customs_thorne', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:thorne_war' }], TH, 'Miss Limyè. You said you\'d come back with the Accord. I see a navy. Which clause is that?'),
      say(G, 'The oath that came before it. Three names, Governor. Her great-grandmother\'s is the first.'),
      say(TH, 'The Charter stands. Marines!'),
    ],
    next: 't_whistle',
  },
  ...whistle('t', 'customs_thorne', 'thorne_after', {}, STREET),
});

const THORNE_AFTER: DialogueScript = script('thorne_after', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:thorne_war' }], '', 'Thorne is on the floor by his desk, the Charter under his hand.'),
      say(TH, 'Well. Do it, then.'),
    ],
    choices: [
      { text: 'Send him home on the Patience.', set: { 'choice.thorne_spared': true }, next: 'spared' },
      { text: 'Chain him in his own cellar.', set: { 'choice.thorne_broken': true }, next: 'broken' },
    ],
  },
  spared: { lines: [say(G, 'Send him home to Aldermoor. On the Patience, if she\'ll have him.')], next: 'taken' },
  broken: { lines: [say(G, 'Chain him in his own cellar. He knows the way.')], next: 'taken' },
  taken: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'jordyn_c', look: 'jordyn_free', from: at(8, 11), to: at(9, 4), facing: 'right', async: true },
          { do: 'enter', actor: 'watch_c', look: 'watch_inside_out', from: at(8, 11), to: at(11, 4), facing: 'left' },
        ],
        TH,
        'The Charter stands, Miss Limyè. It is written.',
      ),
      say(G, 'So is the oath. We\'ll see which one the Throne reads.'),
      act(
        [
          { do: 'exit', actor: 'npc:thorne_war', to: at(8, 11), async: true },
          { do: 'exit', actor: 'jordyn_c', to: at(8, 11), async: true },
          { do: 'exit', actor: 'watch_c', to: at(8, 11) },
        ],
        '',
        'Jordyn\'s watch walk him out between them, by the book.',
        { set: { 'story.thorne_taken': true } },
      ),
      act([{ do: 'look', actor: 'yari' }], Y, 'The cellar.'),
    ],
  },
});

// ---- Beat 6: Anaco (Yari's beat) ------------------------------------------------------------------------------------------------

const CELLAR: DialogueScript = script('war_cellar', {
  start: {
    lines: [
      act([{ do: 'walk', actor: 'yari', to: at(6, 3), facing: 'up' }, { do: 'look', actor: 'yari' }], '', 'Yari goes down the stairs ahead of everyone. Anaco is on the bed, the irons on its post.'),
      say(Y, 'Father.'),
      act([{ do: 'look', actor: 'npc:anaco_cellar' }], AN, 'You argued.'),
      say(Y, 'I came back. With every friend Caona ever had. And some she never met.'),
    ],
    next: 'stair',
  },
  stair: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'sgt_1', look: 'zetwal_levy', from: at(6, 8), to: at(4, 7), facing: 'up', async: true },
          { do: 'enter', actor: 'sgt_2', look: 'free_brasador', from: at(6, 8), to: at(5, 7), facing: 'up', async: true },
          { do: 'enter', actor: 'sgt_3', look: 'horn_rider', from: at(6, 8), to: at(8, 7), facing: 'up' },
        ],
        '',
        'At the stair\'s foot the companies\' sergeants stand in a line, and say nothing.',
      ),
      say(AN, '...So I see.'),
      act([{ do: 'face', actor: 'npc:anaco_cellar', facing: 'player' }], AN, 'Envoy\'s daughter. You used it.'),
      act(
        [{ do: 'walk', actor: 'npc:anaco_cellar', to: at(6, 4), facing: 'down' }, { do: 'walk', actor: 'yari', to: at(7, 4), facing: 'down' }],
        '',
        'He stands, slowly, on Yari\'s arm.',
        { set: { 'story.anaco_freed': true, 'ally.xaragua': true, 'stability.xaragua_freed': true } },
      ),
      nar('Word comes down the stairs from the healer: clear the Song House. They will be carried in before the night is out.'),
      act([{ do: 'look', actor: 'player' }], H, 'The pier. The chain is still across the mouth.'),
    ],
  },
});

const ANACO_CELLAR: DialogueScript = simple('anaco_cellar_talk', [say(AN, 'My daughter is on the stairs. I hear her.')]);

// ---- Stage three: Caona's stand and the chain post (the Echo battle and M-XAR-3) --------------------------------------------

const PIER_GUARD: DialogueScript = simple('pier_guard_war_talk', [
  say('crown_marine', 'The pier\'s held, envoy. The Patience has her guns on it.'),
  nar('Out in the mouth, a gun port on the Patience swings open.', { fx: 'cannon' }),
]);

const CAPSTAN: DialogueScript = script('capstan_present', {
  start: {
    lines: [],
    next: [{ if: has('story.chain_dropped'), to: 'spun' }, { if: has('anchor.chain_post'), to: 'pinless' }, { to: 'pinned' }],
  },
  pinned: { lines: [nar('The old chain post\'s capstan, rusted solid, its pawl pinned with a fat iron pin. The Crown\'s chain is made fast to it.')] },
  pinless: { lines: [nar('The pawl\'s pin hole is empty. Has been for a long time. The Crown made fast to it anyway.')] },
  spun: { lines: [nar('The capstan has spun itself loose. The chain is in the harbor.')] },
});

const PIER_ECHO_ENTER: DialogueScript = script('pier_echo_enter', {
  start: {
    lines: [],
    next: [{ if: has('encounter.war_story.caona.won'), to: 'after' }, { to: 'stand' }],
  },
  stand: {
    lines: [
      nar('The same pier fifty years ago, by day, under the old sails. The Crown\'s longboats are coming in.'),
      say(AF, 'I\'m holding the door, Gigi. Hold the pier.'),
      act([{ do: 'look', actor: 'npc:echo_caona_pier' }], CA, 'Marshal. Hold the pier with me. Your companies form on the shore behind us, or they form in the water.'),
      act([{ do: 'look', actor: 'npc:echo_benny_pier' }], BN, 'Forming. Mostly.', { set: { 'battle.next': 'caona_stand', 'battle.after': 'caona_after' } }),
    ],
  },
  after: { lines: [], next: [{ if: not('anchor.chain_post'), to: 'pin' }, { to: 'done' }] },
  pin: { lines: [say(CA, 'The capstan, Marshal. Before they come back.')] },
  done: { lines: [say(CA, 'Good.')] },
});

const CAONA_AFTER: DialogueScript = script('caona_after', {
  start: {
    lines: [
      nar('The marines wade back to the longboats. Nobody is left on the boards but the three of them.'),
      act([{ do: 'look', actor: 'npc:echo_caona_pier' }], CA, 'They\'ll chain the mouth next time they come, Marshal. Everyone does.'),
      say(CA, 'Make it so it won\'t hold.'),
      act([{ do: 'look', actor: 'player' }], '', '(At the pier\'s sea end, on its own pile: the chain post\'s new capstan.)'),
    ],
  },
});

const PIN_ECHO: DialogueScript = script('chain_pin_echo', {
  start: {
    lines: [],
    next: [{ if: has('anchor.chain_post'), to: 'done' }, { if: has('encounter.war_story.caona.won'), to: 'pin' }, { to: 'early' }],
  },
  early: { lines: [nar('A new capstan on its pile, the pawl pinned with a fat iron pin. The longboats are still coming.')] },
  pin: {
    lines: [nar('The chain post\'s capstan: a new pawl, and a fat iron pin through it. Nothing will turn it while the pin is in.')],
    choices: [{ text: 'Pull the pawl\'s pin.', next: 'pull' }, { text: 'Leave it.' }],
  },
  pull: {
    lines: [
      nar('Patricio works the pin out of the pawl, and drops it in the harbor.', { set: { 'anchor.chain_post': true } }),
      say(PT, 'Fifty years from now somebody will wonder why their chain won\'t hold.'),
      say(CA, 'Good.'),
    ],
  },
  done: { lines: [nar('The pawl\'s pin hole is empty. The pin is at the bottom of the harbor.')] },
});

const PIER_ECHO_RETURN: DialogueScript = script('pier_echo_return', {
  start: {
    lines: [],
    next: [
      { if: all(has('anchor.chain_post'), not('story.chain_dropped')), to: 'chain' },
      { if: has('story.chain_dropped'), to: 'quiet' },
      { to: 'not_yet' },
    ],
  },
  not_yet: { lines: [say(A, 'The chain\'s still tight, Gigi.')] },
  quiet: { lines: [nar('The chain is in the harbor. The mouth is open.')] },
  chain: {
    lines: [
      nar('Back on the pier, by dusk. Out in the mouth the Patience swings on her cable, and the chain comes taut.'),
      nar('The old post\'s capstan spins. The chain runs out, link by link, into the harbor.', { fx: 'chain' }),
      say(H, 'The whole mouth. Somebody on the Patience just felt that.'),
      act(
        [
          { do: 'exit', actor: 'npc:pier_guard_war', to: at(30, 18), async: true },
          { do: 'exit', actor: 'npc:pier_guard_war_b', to: at(31, 18) },
        ],
        '',
        'The marines at the pier\'s end look at the water where the chain was, and go.',
      ),
      act([{ do: 'sync' }], '', 'Round the headland, now the mouth is open, come the fleet\'s own hulls. From under the pier\'s piles, the canoes.', { set: { 'story.chain_dropped': true } }),
      { if: has('choice.thorne_spared'), speaker: '', text: 'Jordyn\'s watch walk Thorne down to a ship\'s boat for the Patience. He does not look back.' },
      say(SG, 'The pier\'s ours to the water, envoy.'),
    ],
  },
});

const ECHO_CAONA: DialogueScript = simple('echo_caona_pier_talk', [say(CA, 'Hold the pier, Marshal.')]);
const ECHO_BENNY: DialogueScript = simple('echo_benny_pier_talk', [say(BN, 'My company forms where you tell it to. I said mostly.')]);

// ---- Beat 8: the Harbor Turn (the second review's 3.1: the threat legible, the signet's lie, then the choice) ------------------

const TURN: DialogueScript = script('harbor_turn', {
  start: {
    lines: [
      nar('Through the open mouth, round the north point, come black and crimson sails.', { set: { 'war.sails_in': true }, stage: [{ do: 'sync' }] }),
      nar('Two of the Crown\'s ships dip their flags as the sails come through their line.'),
      say('crown_marine', 'Ardencia! The Lord of Ardencia, for the Crown!'),
      act(
        [
          { do: 'enter', actor: 'rael_t', look: 'rael', from: at(VILLAGE.vanguard[2]!.x, VILLAGE.vanguard[2]!.y), to: at(VILLAGE.pierEnd.x, VILLAGE.pierEnd.y), facing: 'up', async: true },
          { do: 'place', actor: 'rivera_t', look: 'rivera', at: at(VILLAGE.vanguard[0]!.x, VILLAGE.vanguard[0]!.y), facing: 'up' },
          { do: 'place', actor: 'jaime_t', look: 'jaime', at: at(VILLAGE.vanguard[1]!.x, VILLAGE.vanguard[1]!.y), facing: 'up' },
          { do: 'place', actor: 'halb_t', look: 'brasador_halberdier', at: at(VILLAGE.vanguard[2]!.x, VILLAGE.vanguard[2]!.y), facing: 'up' },
          { do: 'look', actor: 'rael_t' },
          { do: 'wait', ms: 900 },
        ],
        '',
        'A longboat puts in at the pier\'s end. Up the boards, with his vanguard behind him, comes Rael.',
      ),
      act([{ do: 'walk', actor: 'azzy', to: at(VILLAGE.turnStep.x + 1, VILLAGE.turnStep.y), facing: 'down' }, { do: 'face', actor: 'follower', facing: 'down' }], '', 'Azzy steps out of the line, to Gianna\'s side, and faces down the pier.'),
      act([{ do: 'look', actor: 'rael_t' }], R, 'Envoy. Ardencia stands with the Crown. Stand aside, and nobody on this pier is hurt.', { fx: 'signet' }),
    ],
    next: 'ring',
  },
  ring: {
    lines: [act([{ do: 'look', actor: 'player' }], A, 'Gigi. His ring.')],
    next: 'choose',
  },
  choose: {
    lines: [say(Z, 'Gianna. Whatever you say, I\'m beside you.')],
    choices: [
      { text: 'Hold the pier.', set: { 'war.trust': true, 'war.turn_made': true, 'stability.harbor_trust': true }, next: 'trust' },
      { text: 'Strike first.', set: { 'war.strike': true, 'war.turn_made': true, 'stability.harbor_strike': true }, next: 'strike' },
    ],
  },
  strike: {
    lines: [
      say(R, '...So. Your mother said you would.'),
      act(
        [
          { do: 'walk', actor: 'rivera_t', to: at(VILLAGE.pierEnd.x + 1, VILLAGE.pierEnd.y), facing: 'up', async: true },
          { do: 'walk', actor: 'jaime_t', to: at(VILLAGE.pierEnd.x, VILLAGE.pierEnd.y + 1), facing: 'up' },
        ],
        R,
        'Rivera. Jaime. Bind them. I will not raise a hand to her.',
      ),
      say(SG, 'Not on the pier, envoy. Not with you in the line. The companies won\'t fire.', { set: { 'battle.next': 'pier_rael', 'battle.after': 'rael_strike_after' } }),
    ],
  },
  trust: {
    lines: [
      act([{ do: 'face', actor: 'rael_t', facing: 'down' }], R, 'Rivera. Jaime. The Patience. Bind what you can. Sink nothing with people in it.'),
      act(
        [
          { do: 'exit', actor: 'rivera_t', to: at(VILLAGE.longboat.x, VILLAGE.longboat.y), async: true },
          { do: 'exit', actor: 'jaime_t', to: at(VILLAGE.longboat.x, VILLAGE.longboat.y), async: true },
          { do: 'exit', actor: 'halb_t', to: at(VILLAGE.longboat.x, VILLAGE.longboat.y) },
        ],
        '',
        'They go back down into the longboat. On the headland the fleet\'s gun speaks, and the canoes come out from under the piles.',
        { fx: 'cannon' },
      ),
      nar('The Patience cannot run with Ardencia across her bow, so she fights. Her boats come to the pier\'s end.'),
      act(
        [
          { do: 'walk', actor: 'rael_t', to: at(VILLAGE.pierEnd.x + 1, VILLAGE.pierEnd.y - 1), facing: 'down' },
          { do: 'enter', actor: 'hale_t', look: 'hale', from: at(VILLAGE.vanguard[2]!.x, VILLAGE.vanguard[2]!.y), to: at(VILLAGE.pierEnd.x, VILLAGE.pierEnd.y), facing: 'up' },
          { do: 'look', actor: 'hale_t' },
        ],
        HL,
        'The Lord Regent\'s compliments. He will not come up the pier himself. He sends me.',
      ),
      act([{ do: 'face', actor: 'rael_t', facing: 'down' }], R, 'Then I will stand here.'),
    ],
    next: 'hale_whistle',
  },
  ...whistle('hale', 'flagship_hale', 'hale_after', { 'party.rael': true }, PIER),
});

const HALE_AGAIN: DialogueScript = script('hale_again', {
  start: {
    lines: [act([{ do: 'look', actor: 'npc:hale_pier' }], HL, 'Again, envoy? The Regent is a patient man. I am less so.'), say(R, 'I am still here.')],
    next: 'hale_whistle',
  },
  ...whistle('hale', 'flagship_hale', 'hale_after', { 'party.rael': true }, PIER),
});

const RAEL_AGAIN: DialogueScript = simple('rael_again', [
  act([{ do: 'look', actor: 'npc:rael_pier' }], R, 'Again, then.'),
  say(SG, 'The companies won\'t fire, envoy. Not on him, with you in the line.', { set: { 'battle.next': 'pier_rael', 'battle.after': 'rael_strike_after' } }),
]);

const HALE_AFTER: DialogueScript = script('hale_after', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:hale_pier' }], HL, 'The Regent will hear of this.', { set: { 'party.rael': false } }),
      act([{ do: 'place', actor: 'rael_h', look: 'rael', at: at(VILLAGE.pierEnd.x + 1, VILLAGE.pierEnd.y - 1), facing: 'down' }], R, 'He is watching it.'),
      act([{ do: 'exit', actor: 'npc:hale_pier', to: at(VILLAGE.longboat.x, VILLAGE.longboat.y) }], '', 'Hale goes down into his boat, and the boat goes out to the Patience.'),
      act([{ do: 'look', actor: 'player' }], '', 'The Patience cuts her cable. Under every sail she has, she turns for the open sea, and Eightgate.', { set: { 'story.harbor_won': true, 'story.harbor_taken': true, 'stability.fleet_struck': true } }),
      act([{ do: 'sync' }], '', 'The rest of the Crown\'s fleet strikes its colours. The harbor is Yucayeque\'s.'),
      act([{ do: 'exit', actor: 'rael_h', to: at(VILLAGE.pierEnd.x, VILLAGE.pierEnd.y) }], '', 'Rael walks down to the pier\'s end, and waits there, with his hands behind his back.'),
    ],
  },
});

/** Strike's end (the second review's 3.5): his army breaks, he kneels to a Throne and not to a watch, the war still closes. */
const RAEL_STRIKE_AFTER: DialogueScript = script('rael_strike_after', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:rael_pier' }], '', 'Rael is on one knee on the boards. His guards have stepped back. He has not drawn on her once.'),
      nar('Out in the mouth the black sails turn away. The headland gun does not fire.'),
      act([{ do: 'look', actor: 'player' }], '', 'The Patience and the whole Crown fleet go out through the open mouth, intact, for Eightgate.', { set: { 'story.fleet_escaped': true, 'stability.fleet_escaped': true } }),
      act([{ do: 'sync' }, { do: 'face', actor: 'azzy', facing: 'player' }], Z, 'You had him. You had him and you had them, and you chose to fight him.'),
    ],
    next: 'cords',
  },
  cords: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'jordyn_r', look: 'jordyn_free', from: at(VILLAGE.pierFoot.x, VILLAGE.pierFoot.y), to: at(VILLAGE.pierEnd.x + 1, VILLAGE.pierEnd.y - 1), facing: 'down' },
          { do: 'look', actor: 'jordyn_r' },
        ],
        '',
        'Jordyn comes down the pier with the cords in her hands.',
      ),
      say(R, 'To a Throne. Not to a watch.'),
      say(G, 'Then at Eightgate.'),
      act([{ do: 'wait', ms: 900 }, { do: 'exit', actor: 'jordyn_r', to: at(VILLAGE.pierFoot.x, VILLAGE.pierFoot.y) }], '', 'Jordyn lowers the cords, and goes back up the pier.', { set: { 'story.harbor_taken': true } }),
      act([{ do: 'face', actor: 'azzy', facing: 'up' }, { do: 'look', actor: 'player' }], '', 'Azzy turns his back on his father, and stays where he is: beside her.'),
    ],
  },
});

// ---- Beat 9: the truth (the second review's 3.2: the signet plain all through; the halves together glow at the ledger) ------

const TRUTH: DialogueScript = script('harbor_truth', {
  start: {
    lines: [
      nar('The pier by lamplight. Rael stands with his hands behind his back. On his hand, the signet is a plain ring.'),
      { if: STRIKE, speaker: R, text: 'I would have told you on the pier if you had let me. You did not. That is my doing too; I taught you not to.' },
      say(R, 'Your mother and I married twenty-five years ago, in the year I was given the name you know me by.'),
      say(R, 'A man with that name has enemies who hunt children. Two daughters of two houses are a claim to a Throne.'),
      say(R, 'So you were Limyè, and I was the man who sold Xaraguá.'),
      say(G, 'Mother said one true thing at Eightgate.'),
      say(R, 'She said it to me too. She was right.'),
    ],
    next: 'ring',
  },
  ring: {
    lines: [
      act([{ do: 'face', actor: 'follower', facing: 'player' }], A, 'Gigi. It isn\'t lighting. It lit when he said he stood with the Crown. On the pier, and in the hall. It isn\'t lighting now.'),
      say(G, '...I see it.'),
    ],
    next: 'crown',
  },
  crown: {
    lines: [
      say(R, 'The Throne believes it bought me with the harbor\'s gold and a chair for my blood. I let it.'),
      say(R, 'A man the Crown has bought is shown its ledgers.'),
      say(R, 'Ask the lamp-oil seller who she has never met. Ask your Titi Amanda who pays for the flour. Nine doors, Gianna.'),
      say(R, 'The Quiet Crown. I founded it, long ago, as a way for frightened people to be useful. Its cells do not know me.'),
      say(R, 'They were bent anyway. Against your sister. By the Regent\'s almoner. My design did that.'),
      say(R, 'That is mine to answer for, and I will answer for it where it can be written down.'),
      say(R, 'My father kept his oath and it cost him everything. I wanted to know what would happen if someone kept the goal instead.'),
    ],
    choices: [
      { text: 'You tested us.', set: { 'choice.truth_answer': 'tested' }, next: 'tested' },
      { text: 'You lied to us for twenty years.', set: { 'choice.truth_answer': 'lied' }, next: 'lied' },
    ],
  },
  tested: {
    lines: [
      say(G, 'You tested us.'),
      say(R, 'Yes. Your mother told me I should never have. She was right. I needed to know you would stand in front of her. You did.'),
    ],
    next: 'azzy',
  },
  lied: {
    lines: [say(G, 'You lied to us for twenty years.'), say(R, 'Yes. That one is not staged. Nothing I say tonight makes it smaller.')],
    next: 'azzy',
  },
  azzy: {
    lines: [
      { if: TRUST, speaker: R, text: 'You have your grandfather\'s hands and your mother\'s patience. Neither is a reason to disobey.' },
      { if: TRUST, speaker: Z, text: 'Titi Aiyana said the hands. I disobeyed you.' },
      { if: TRUST, speaker: R, text: 'Yes.' },
      { if: STRIKE, speaker: '', text: 'Azzy says nothing to his father at all. He looks at the harbor.', stage: [{ do: 'face', actor: 'azzy', facing: 'down' }] },
    ],
    next: 'ledger',
  },
  ledger: {
    lines: [
      act([{ do: 'walk', actor: 'haru', to: at(VILLAGE.turnStep.x + 1, VILLAGE.turnStep.y + 1), facing: 'down' }], '', 'Haru lays the coded pages of the Ash Road Accounts on the pier\'s rail.'),
      say(R, 'The key is the thing you are wearing. Two halves.'),
      nar('Gianna sets the Sun Locket on the page. He sets the signet beside it. Both halves glow, as they did in the hall.', { fx: 'token' }),
      say(H, 'Oil at the cave. Bread in the Lower Town. Water in Bab al-Dhahab. Grain under the plateau. Paper and lanterns in the marsh.'),
      say(H, 'A bakery in Pòdlimyè with no debt book. Oil for a wick in Agnipur. A list that warned them first. Powder for this harbor.'),
      say(R, 'Eight you opened. The bakery is at your mother\'s end of the plaza; you walked past it at the festival.', {
        set: { 'clue.ash_road_read': true, 'belief.rael_traitor': false, 'belief.rael_truth': true },
      }),
    ],
    next: 'benny',
  },
  benny: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'benny_p', look: 'benny_old', from: at(VILLAGE.vanguard[2]!.x, VILLAGE.vanguard[2]!.y), to: at(VILLAGE.pierEnd.x + 1, VILLAGE.pierEnd.y), facing: 'up', async: true },
          { do: 'enter', actor: 'nancy_p', look: 'nancy', from: at(VILLAGE.vanguard[1]!.x, VILLAGE.vanguard[1]!.y), to: at(VILLAGE.pierEnd.x + 1, VILLAGE.pierEnd.y + 1), facing: 'up' },
          { do: 'look', actor: 'benny_p' },
        ],
        '',
        'A second longboat puts in. Up the pier, slowly: old Benny on a cane, Nancy on his arm, two Ardencian surgeons with a stretcher.',
      ),
      say(R, 'I brought my father where I meant to stand. He asked to come. He always asks.'),
      act([{ do: 'walk', actor: 'benny_p', to: at(VILLAGE.pierEnd.x + 1, VILLAGE.turnStep.y + 2), facing: 'left' }, { do: 'wait', ms: 900 }], '', 'Benny stops beside his son, and says nothing to him. Then he goes on, to Gianna.'),
      { if: TRUST, speaker: BO, text: 'The Locket. I said I made the other half for a lord who did not deserve one yet. I did not say which lord.' },
      { if: STRIKE, speaker: BO, text: 'He told me you might. He said to come anyway. Somebody has to carry the ones he bound.' },
    ],
    next: 'nancy',
  },
  nancy: {
    lines: [
      act([{ do: 'walk', actor: 'nancy_p', to: at(VILLAGE.turnStep.x, VILLAGE.turnStep.y + 2), facing: 'up' }], NA, 'Child. There are hurt people on this island and a lamp to hold. Show me where.'),
      say(A, 'The Song House. I\'ll hold it.'),
      act(
        [
          { do: 'exit', actor: 'nancy_p', to: at(VILLAGE.pierFoot.x, VILLAGE.pierFoot.y), async: true },
          { do: 'walk', actor: 'follower', to: at(VILLAGE.pierFoot.x + 1, VILLAGE.pierFoot.y), facing: 'up' },
          { do: 'exit', actor: 'benny_p', to: at(VILLAGE.pierFoot.x, VILLAGE.pierFoot.y) },
        ],
        '',
        'Nancy takes Anissa\'s hand, and they go up the pier together, old Benny behind. The surgeons go on to the wounded.',
      ),
    ],
  },
});

// ---- Beat 9: the Song House (the shelter) ---------------------------------------------------------------------------------

const SONG_SCENE: DialogueScript = script('war_song', {
  start: {
    lines: [
      act([{ do: 'sync' }], '', 'The Song House. Hamacas slung between the song-keepers\' posts, and the wounded of every company carried in.', { fx: 'fade' }),
      act(
        [
          { do: 'enter', actor: 'stretcher_1', look: 'wounded_soldier', from: at(SONG.door.x, SONG.door.y), to: at(SONG.hamacas[0]!.x + 1, SONG.hamacas[0]!.y), facing: 'left' },
          { do: 'enter', actor: 'stretcher_2', look: 'wounded_soldier', from: at(SONG.door.x, SONG.door.y), to: at(SONG.hamacas[2]!.x - 1, SONG.hamacas[2]!.y), facing: 'right' },
        ],
        '',
        'They are carried in two at a time, and laid in the hamacas.',
      ),
      act(
        [{ do: 'enter', actor: 'benny_s', look: 'benny_old', from: at(SONG.door.x, SONG.door.y), to: at(SONG.benny.x, SONG.benny.y), facing: 'up' }, { do: 'look', actor: 'benny_s' }],
        BO,
        'Forty. I count. It is what I do at the end of a thing.',
      ),
      say(BO, 'My son. He was always his own. He never explained himself to me either.'),
    ],
    next: 'lamp',
  },
  lamp: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'nancy_s', look: 'nancy', from: at(SONG.door.x, SONG.door.y), to: at(SONG.nancy.x, SONG.nancy.y), facing: 'right', async: true },
          { do: 'walk', actor: 'follower', to: at(SONG.lamp.x, SONG.lamp.y), facing: 'left' },
          { do: 'look', actor: 'player' },
        ],
        '',
        'Nancy goes among the hamacas with the healer. At the end of the row Anissa holds the lamp, the only light but the door\'s.',
      ),
      act(
        [{ do: 'enter', actor: 'jordyn_s', look: 'jordyn_free', from: at(SONG.door.x, SONG.door.y), to: at(SONG.lamp.x - 1, SONG.lamp.y + 1), facing: 'up' }],
        JO,
        'You held a door in a keep and a rail on a ship. Hold the lamp.',
      ),
      say(A, 'I\'m holding it.'),
    ],
    next: 'count',
  },
  count: {
    lines: [
      act(
        [{ do: 'enter', actor: 'joaquin_s', look: 'joaquin_free', from: at(SONG.door.x, SONG.door.y), to: at(SONG.arrive.x - 1, SONG.arrive.y - 1), facing: 'up' }, { do: 'walk', actor: 'azzy', to: at(SONG.arrive.x + 1, SONG.arrive.y - 1), facing: 'up' }],
        JQ,
        'Nobody from the wall. I gave an order once; I\'d rather count them now.',
      ),
      act([{ do: 'look', actor: 'npc:song_keeper' }], 'song_keeper', 'The songs can wait. The house was built for this as much as for them.'),
      act(
        [
          { do: 'exit', actor: 'joaquin_s', to: at(SONG.door.x, SONG.door.y), async: true },
          { do: 'exit', actor: 'jordyn_s', to: at(SONG.door.x, SONG.door.y) },
          { do: 'sync' },
        ],
        NA,
        'Gianna. Zelia will want to hear that you ate something. I\'ll tell her you did.',
        { set: { 'story.wounded_sheltered': true } },
      ),
    ],
  },
});

const BENNY_SONG: DialogueScript = simple('benny_war_talk', [say(BO, 'Forty-one. One of them walked in on his own. I count him twice.')]);
const NANCY_SONG: DialogueScript = simple('nancy_war_talk', [say(NA, 'Clean water, Gianna, and somebody to sit with each of them. The rest is noise.')]);

// ---- Beat 10: the Regent's retreat (the caney at night; the card) ---------------------------------------------------------

const CANEY_SCENE: DialogueScript = script('war_caney', {
  start: {
    lines: [
      nar('The caney at night. The Crown\'s banner is gone from the doors. Anaco is in his duho, the elders in their circle.', { fx: 'fade' }),
      act([{ do: 'look', actor: 'npc:anaco_free' }], AN, 'The harbor stays with the people who fish it.'),
      say(AN, 'The Regent has gone home to his Throne. Someone must go and stand on it.'),
      { if: has('debate.xaragua_harbor.mediated'), speaker: AN, text: 'The elders agreed before I was out of my irons. That has never happened.' },
      { if: not('debate.xaragua_harbor.mediated'), speaker: AN, text: 'The elders agreed after. That is more usual.' },
    ],
    next: 'paddle',
  },
  paddle: {
    lines: [
      act([{ do: 'walk', actor: 'yari', to: at(CANEY.yari.x, CANEY.yari.y), facing: 'up' }], Y, 'Eightgate. We read the oath beside the Charter, in front of the chair.'),
      nar('Anaco gives Yari a canoe paddle no longer than a hand, carved with the three names of the first oath.'),
      act([{ do: 'walk', actor: 'yari', to: at(CANEY.doors.x, CANEY.doors.y - 2), facing: 'down' }, { do: 'face', actor: 'player', facing: 'up' }], Y, 'Mine to carry. Yours to set down.', {
        set: { 'item.token_xaragua': true, 'story.regent_retreated': true },
      }),
    ],
    next: [{ if: TRUST, to: 'trust' }, { to: 'strike' }],
  },
  trust: {
    lines: [
      act(
        [{ do: 'enter', actor: 'rael_c', look: 'rael', from: at(CANEY.doors.x, CANEY.doors.y + 2), to: at(CANEY.doors.x + 1, CANEY.doors.y + 1), facing: 'up' }, { do: 'look', actor: 'rael_c' }],
        R,
        'I will be at Eightgate. Not beside you. The Throne has a Hearing for men like me, or it will have one.',
      ),
      act([{ do: 'exit', actor: 'rael_c', to: at(CANEY.doors.x, CANEY.doors.y + 2) }], '', 'He goes out, and does not wait to be answered.'),
    ],
    next: 'end',
  },
  strike: {
    lines: [
      act(
        [{ do: 'enter', actor: 'benny_c', look: 'benny_old', from: at(CANEY.doors.x, CANEY.doors.y + 2), to: at(CANEY.doors.x + 1, CANEY.doors.y + 1), facing: 'up' }, { do: 'look', actor: 'benny_c' }],
        BO,
        'He went north. He left me. He said you would need a witness more than he needed a father.',
      ),
    ],
    next: 'end',
  },
  end: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(CANEY.doors.x, CANEY.doors.y + 1), facing: 'up' }, { do: 'look', actor: 'player' }], A, 'I held it.'),
      nar('Out over the harbor the fleet\'s lamps are lit, every one of them on a free mooring.', {
        fx: 'fade',
        set: { 'act11.complete': true, 'travel.next': 'seat-concourse/ardencia_gate' },
      }),
    ],
  },
});

// ---- Closed ways and the turned gun --------------------------------------------------------------------------------------

const VILLAGE_HELD: DialogueScript = script('village_held', {
  start: { lines: [], next: [{ if: has('story.camp_reached'), to: 'dusk' }, { to: 'held' }] },
  held: { lines: [say(Y, 'The trail\'s held, Gigi. Marines at every turn. Not by day.')] },
  dusk: { lines: [say(Y, 'Not yet. We go down at the lowest tide, with the conch. Everything is the tide here.')] },
});
// The hill road: round behind the village under the cane, out of the Crown's sight, between the beach and the gardens. It is
// a long walk, not a door (the menu's city map joins only doors that stand side by side; Claude's call).
const HILL_ROAD_NORTH: DialogueScript = script('hill_road_north', {
  start: { lines: [], next: [{ if: not('story.headland_won'), to: 'gun' }, { to: 'ask' }] },
  gun: { lines: [say(CL, 'Not up the road with that gun on the headland. Nothing of yours goes up until it\'s quiet.')] },
  ask: {
    lines: [nar("The gardens' road climbs off the sand into the cane, round behind the village and out of the Crown's sight.")],
    choices: [{ text: 'Take the gardens\' road.', next: 'go' }, { text: 'Stay on the beach.' }],
  },
  go: { lines: [nar('Up through the cane, bent low, the village roofs below on the left.', { fx: 'fade', set: { 'travel.next': 'xaragua-conuco/hill_road_in', 'story.hill_road_taken': true } })] },
});
const HILL_ROAD_SOUTH: DialogueScript = script('hill_road_south', {
  start: {
    lines: [nar("The gardens' road drops east into the cane, round behind the village to the Canoe Beach.")],
    choices: [{ text: 'Go down to the beach.', next: 'go' }, { text: 'Stay in the gardens.' }],
  },
  go: { lines: [nar('Down through the cane to the sand, the village roofs below on the right.', { fx: 'fade', set: { 'travel.next': 'xaragua-beach/hill_road_in' } })] },
});
const GUN_TURNED: DialogueScript = simple('field_gun_turned', [nar('The field gun, turned on its carriage to face the harbor mouth. Two of the levy sit by it with the match.')]);

// ---- The people who stand on the maps: companies, the resistance, the war's placements, and Xaraguá's own -------------------

const PEOPLE: DialogueScript[] = [
  simple('war_levy_talk', [say('levy', 'The Harbor councillor said bring it home. We\'re bringing it.')]),
  simple('war_free_brasador_talk', [say('free_brasador', 'Our captain\'s with the envoy. Where she stands.')]),
  simple('war_ironvow_talk', [say('horn_rider', 'Sand. The horses hate it. The horses are on the ship.')]),
  simple('war_dorini_talk', [say('dorini_marine', 'The admiral\'s gone. The invoice stays. We\'re here on the second.')]),
  simple('war_agnivansh_talk', [say('flame_keeper', 'The lamp is lit on the ship. It stays lit until we are home.')]),
  simple('war_suzumori_talk', [say('gate_guard_kq', 'We count, envoy. It is what we are for.')]),
  simple('war_watch_talk', [say('watch_turned', 'The captain says the law goes where she goes. So do we.')]),
  simple('gun_crew_talk', [say('crown_officer', 'Present!')]),
  simple('elder_charter_free_talk', [say('elder_charter', 'I said sign and live. I would rather have lived this way. I will say so at the next council.')]),
  simple('elder_resist_free_talk', [say('elder_resist', 'Seven navies, and not one of them asked us to sign anything. Remember that, envoy.')]),
  simple('elder_undecided_free_talk', [say('elder_undecided', 'Fifty years of listening. Tonight I spoke. It was easier than I thought.')]),
  simple('anaco_free_talk', [say(AN, 'Someone must go and stand on it.')]),
  simple('joaquin_war_talk', [say(JQ, 'Free Brasador counts its own. Nobody from the wall.')]),
];

// ---- Chapter 11 overlays on Xaraguá's own people (while the war is on, then once the harbor is taken) ------------------------

const FREE: Condition = has('story.harbor_taken');
const one = (id: string, speaker: string, text: string, when: Condition = WAR_ON): MusterOverlay => ({ id, nodes: { m_start: { lines: [say(speaker, text)] } }, when });

const OVERLAYS: readonly MusterOverlay[] = [
  one('song_keeper_talk', 'song_keeper', 'The songs can wait a night. The house can hold the hurt as well as the old.'),
  one('song_apprentice_talk', 'song_apprentice', 'We are clearing the floor for hamacas. The keeper says the songs will not mind.'),
  one('hill_runner_talk', 'hill_runner', 'Conch from the point, runner to the bay. Today we run the whole island.'),
  one('occ_marine_curfew_talk', 'crown_marine', 'Seven navies on the beach. Nobody tells us anything. Go away, envoy.'),
  one('occ_marine_trail_talk', 'crown_musketeer', 'The Governor says hold the trail. The Governor is not on the trail.'),
  one('occ_marine_plaza_talk', 'crown_marine', 'The caney is closed. By order. Whose order is a matter for tomorrow.'),
  one('crown_captain_talk', 'crown_captain', 'I hold the caney for the Crown. I have been told to hold it. Nobody has told me why.'),
  one('occ_marine_caney_talk', 'crown_marine', 'Nobody in or out of the caney. That was this morning\'s order.'),
  one('casabe_baker_talk', 'casabe_baker', 'The stalls burned. The griddle didn\'t. Casabe for the fleet!', FREE),
  one('carver_talk', 'carver', 'I carved a gun for the fleet\'s children. It points out to sea.', FREE),
  one('bow_maker_talk', 'bow_maker', 'Bows for the canoes, cotton for the wounded. Everything is for the harbor today.', FREE),
];

export const WAR_OVERLAYS: readonly MusterOverlay[] = OVERLAYS;
export { overlay };

/** Every Chapter 11 conversation of its own (the overlays are applied over the built ones in data/dialogue.ts). */
export const WAR_DIALOGUE: readonly DialogueScript[] = [
  LANDING,
  HEADLAND,
  HEADLAND_AFTER,
  FLANK,
  FLANK_AGAIN,
  FLANK_AFTER,
  CAMP_SCENE,
  CAMP_LEADER,
  BEACH_LEADER,
  BEACH_BOY,
  HEAD_RUNNER,
  ELDER_UNDECIDED,
  HEALER,
  JORDYN_CAMP,
  SALKHI,
  LAMP_OIL,
  CARRIER,
  JARS,
  PICKET,
  PICKET_AFTER,
  CANOE_FISHER,
  BOY,
  COUNT,
  VILLAGE_DUSK,
  THORNE,
  THORNE_AFTER,
  CELLAR,
  ANACO_CELLAR,
  PIER_GUARD,
  CAPSTAN,
  PIER_ECHO_ENTER,
  CAONA_AFTER,
  PIN_ECHO,
  PIER_ECHO_RETURN,
  ECHO_CAONA,
  ECHO_BENNY,
  TURN,
  HALE_AGAIN,
  RAEL_AGAIN,
  HALE_AFTER,
  RAEL_STRIKE_AFTER,
  TRUTH,
  SONG_SCENE,
  BENNY_SONG,
  NANCY_SONG,
  CANEY_SCENE,
  VILLAGE_HELD,
  HILL_ROAD_NORTH,
  HILL_ROAD_SOUTH,
  GUN_TURNED,
  ...PEOPLE,
];

export { ON_THE_SAND, DEFIES };
