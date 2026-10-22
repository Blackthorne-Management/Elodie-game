// The Old Harbor, west along the shore from the plaza: the fish market, the customs house, the net
// menders and the ferry landing. Exploration for now (owner decision, Oct 15); more to do here when
// Gianna comes home. The Echo is the harbor fifty years ago, when the Crown's ships sat in it.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { BEFORE_NIGHT_TEXT, DAWN_TEXT, HARBOR, MUSTER_HOUSES, NIGHT_TEXT } from '../../src/data/muster.ts';

export function zetwalHarbor(): MapSource {
  const W = 36;
  const H = 18;
  const g = new Grid(W, H, '.');

  // Borders: trees north and east (the door east to the plaza's shore), the sea south and west.
  g.rect(0, 0, W, 1, 'T').rect(W - 1, 0, 1, 10, 'T').set(W - 1, 4, 'D');
  g.rect(0, 11, W, H - 11, '~').rect(0, 3, 2, 8, '~');
  g.rect(2, 9, W - 3, 2, 'n');

  // The harbor road from the plaza, down to the piers.
  g.rect(2, 4, W - 3, 1, ',');
  g.rect(18, 5, 2, 4, ',');

  // The fish market: stalls on the paving.
  g.rect(8, 5, 8, 3, ':');
  g.set(9, 6, 'S').set(10, 6, 'S').set(13, 6, 'S').set(14, 6, 'S');

  // The customs house (no way in yet) and its sign; a net shed.
  g.rect(21, 1, 7, 1, '^').rect(21, 2, 7, 1, '#');
  g.set(24, 3, 'P');
  g.rect(3, 1, 4, 1, '^').rect(3, 2, 4, 1, '#');

  // Piers, boats and the ferry landing (the long pier east).
  g.rect(6, 11, 2, 4, 'k').rect(16, 11, 2, 3, 'k').rect(25, 11, 2, 4, 'k').rect(30, 11, 2, 6, 'k');
  g.set(8, 13, 'c').set(15, 12, 'c').set(27, 14, 'c').set(29, 15, 'c').set(4, 13, 'c');

  // Barrels and crates on the quay, trees.
  g.set(4, 8, 'X').set(5, 8, 'X').set(28, 7, 'X').set(33, 8, 'X');
  for (const [x, y] of [[8, 1], [16, 2], [31, 2], [12, 2]] as const) g.set(x, y, 'T');
  g.rect(29, 1, 2, 1, 'B');

  // The path up to the Iron Market, which the city map shows just above the harbour (owner report, Oct 16).
  g.rect(18, 0, 2, 4, ',');

  const e = g.map({ '.': '"', ',': ';', ':': ';', T: 'Y', B: 'Y', S: 't', X: 'Z', P: ';', '#': '%', n: '"', k: ';', D: 'D' });

  const objects: ObjSpec[] = [
    npc('fishwife', 11, 7, 'down'),
    npc('net_mender', 5, 9, 'down'),
    npc('customs_clerk', 23, 3, 'down'),
    npc('harbor_kid', 20, 8, 'left'),
    npc('old_sailor', 17, 13, 'down'),
    npc('ferry_hand', 31, 12, 'up'),

    { layer: 'doors', name: 'harbor_market', x: 18, y: 0, w: 2, props: { target: 'market_harbor', map: 'zetwal-market', exit: 'down' } },
    { layer: 'doors', name: 'harbor_plaza', x: W - 1, y: 4, props: { target: 'town_harbor', map: 'zetwal-town', exit: 'left' } },
    { layer: 'spawns', name: 'harbor', x: W - 2, y: 4, props: { facing: 'left', era: 'present' } },
    obj('customs_sign', 24, 3, { dialogue: 'customs_sign', era: 'present' }),
    // Chapter 2's end (Oct 17): the Zetwal trader lands Gianna, Anissa and Yari on the long pier, where
    // Grandfather and Grandmother are waiting with the news.
    { layer: 'spawns', name: 'harbor_return', x: 30, y: 13, props: { facing: 'up', era: 'present' } },
    trigger('zetwal_return', 30, 13, { dialogue: 'zetwal_return', flag: 'story.zetwal_return', once: true, onEnter: true, if: 'story.escaped' }),
    // On the pier from Chapter 2's end until the Muster (the Chapter 10 review's 3.6: not for the rest of the game).
    npc('patricio_harbor', 30, 10, 'down', { npc: 'patricio_home', if: 'story.escaped, !story.muster_begun' }),
    npc('anicette_harbor', 31, 10, 'down', { npc: 'anicette_home', if: 'story.escaped, !story.muster_begun' }),
    // Chapter 3 (Oct 21): the trader who brought them home sails for Ardencia (the voyage zetwal_ardencia).
    npc('trader_captain', 31, 14, 'left', { if: 'story.zetwal_return, !story.ardencia_arrived' }),
    ...musterHarbor(),
  ];
  return { id: 'zetwal-harbor', present: g, echo: e, objects };
}

/**
 * The Muster at the Old Harbor (Chapter 10; data/muster.ts places it, the second review's 3.8 re-sites the night): the
 * landing, the houses' hulls at the piers, Jordyn's coaster, the chain across the harbor mouth from dusk, under the
 * point by night the Crown's launch and its consul (and the bought captain, placed, so a reload at night finds him), the
 * signal fire over the trees, and at dawn the fleet in a line inside the lowered chain with the family on the quay.
 */
function musterHarbor(): ObjSpec[] {
  const h = HARBOR;
  const shipIf = (house?: string) => `story.muster_begun, !story.betrayal_seen${house ? `, !muster.gone.${house}` : ''}`;
  const houseOf = (ship: string) => MUSTER_HOUSES.find((m) => m.ship === ship)?.house;
  return [
    trigger('muster_landing', h.landing.x, h.landing.y, { dialogue: 'muster_landing', flag: 'story.muster_begun', once: true, onEnter: true, if: 'act9.complete' }),
    // Night: the quay's head (a line across the road and the quay west of the fish market), again until it is seen.
    trigger('night_quay', h.quayStrip.x, h.quayStrip.y, { dialogue: 'night_quay', if: NIGHT_TEXT }, h.quayStrip.w, h.quayStrip.h),
    // Dawn: the tide, at the long pier.
    trigger('muster_tide', h.tide.x, h.tide.y, { dialogue: 'muster_tide', if: DAWN_TEXT }, h.tide.w, h.tide.h),
    // The hulls by day, at the piers (a house's goes when its company sails to the Crown), and at dawn in a line.
    ...Object.entries(h.ships).map(([ship, at]) => obj(`${ship}_pier`, at.x, at.y, { kind: ship, solid: true, era: 'present', if: shipIf(houseOf(ship)) }, 3, 1)),
    ...Object.entries(h.dawnShips).map(([ship, at]) => {
      const house = houseOf(ship);
      return obj(`${ship}_dawn`, at.x, at.y, { kind: ship, solid: true, era: 'present', if: `${DAWN_TEXT}${house ? `, !muster.gone.${house}` : ''}` }, 3, 1);
    }),
    obj('jordyn_coaster', h.coaster.x, h.coaster.y, { kind: 'jordyn_coaster', solid: true, era: 'present', if: 'story.watch_landed, !story.betrayal_seen' }, 2, 1),
    // The harbor chain across the harbor mouth: raised at dusk (heard from the plaza), lowered at dawn.
    obj('muster_chain', h.chain.x, h.chain.y, { kind: 'harbor_chain', era: 'present', if: 'story.chain_raised, !story.betrayal_seen' }, h.chain.w, h.chain.h),
    // Under the point, outside the chain: the Crown's launch, lights out, and its consul with a strongbox.
    obj('muster_launch', h.launch.x, h.launch.y, { kind: 'crown_launch', solid: true, era: 'present', if: `${NIGHT_TEXT}, !muster.launch_gone` }, 2, 1),
    npc('consul_night', h.consul.x, h.consul.y, 'right', { if: `${NIGHT_TEXT}, !muster.launch_gone` }),
    obj('consul_strongbox', h.strongbox.x, h.strongbox.y, { kind: 'consul_strongbox', solid: true, era: 'present', if: `${NIGHT_TEXT}, !muster.strongbox_open` }),
    obj('strongbox_open', h.strongbox.x, h.strongbox.y, { kind: 'strongbox_open', solid: true, era: 'present', if: `${NIGHT_TEXT}, muster.strongbox_open` }),
    // The captain's satchel on the quay, the closed hand on its flap (the second review's 3.10: revealed, shown).
    obj('closed_hand_satchel', h.satchel.x, h.satchel.y, { kind: 'closed_hand_satchel', solid: true, era: 'present', if: `${NIGHT_TEXT}, story.betrayer_walked` }),
    // The evidence laid on the quay (the exposed route).
    obj('laid_evidence', h.laid.x, h.laid.y, { kind: 'laid_evidence', solid: true, era: 'present', if: 'muster.evidence_laid, !story.betrayal_seen' }),
    // The bought captain, placed by night (the walk is a picture; a reload finds him here), until he is taken or gone.
    ...MUSTER_HOUSES.map((m) => npc(`quay_${m.house}`, h.captain.x, h.captain.y, 'left', { npc: `${m.captain}_quay`, if: `${NIGHT_TEXT}, muster.betrayer.${m.house}, !muster.captain_gone` })),
    // The signal fire on Solèy Heights, lit as the night ends (seen over the trees).
    obj('signal_fire_far', h.fire.x, h.fire.y, { kind: 'signal_fire', era: 'present', if: 'story.betrayal_seen' }),
    // By day: old Patricio on the quay after the landing (until the blessing), the trader, who will not sail without a fleet.
    npc('patricio_quay', h.patricio.x, h.patricio.y, 'down', { npc: 'patricio_muster', if: 'story.pier_met, !story.blessing' }),
    npc('trader_muster', h.trader.x, h.trader.y, 'left', { if: 'story.muster_begun, !act10.complete' }),
    // Dawn: the family on the quay to see them off; Jordyn and Joaquin with their companies.
    npc('patricio_dawn', h.patricio.x, h.patricio.y, 'down', { npc: 'patricio_muster', if: DAWN_TEXT }),
    npc('anicette_dawn', h.anicette.x, h.anicette.y, 'down', { npc: 'anicette_muster', if: DAWN_TEXT }),
    npc('rahel_dawn', h.rahel.x, h.rahel.y, 'down', { npc: 'rahel', if: DAWN_TEXT }),
    npc('patricia_dawn', h.patricia.x, h.patricia.y, 'down', { npc: 'patricia', if: DAWN_TEXT }),
    npc('jordyn_dawn', h.jordyn.x, h.jordyn.y, 'down', { npc: 'jordyn_muster', if: DAWN_TEXT }),
    npc('joaquin_dawn', h.joaquin.x, h.joaquin.y, 'down', { npc: 'joaquin_muster', if: DAWN_TEXT }),
    // The camps' people by day at the harbor: the net menders making cartridge bags (their lines), nothing placed.
    { layer: 'crowds', name: 'harbor_muster', x: 9, y: 9, w: 14, h: 2, props: { count: '4', looks: 'dorini_marine,horn_rider,zetwal_levy,gate_guard_kq', if: BEFORE_NIGHT_TEXT } },
  ];
}
