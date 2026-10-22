// Kingsmere, Aldermoor's capital, for Chapter 9, The Regent's Keep (docs/quest/reviews/2026-10-22-chapter9-outline.md
// with its second review, built Oct 22). Grey-blue stone and slate under rain, wet flags, heather and black bog beyond
// the wall, the mere a flat grey sheet to the west; violet only on the Crown's people. Places and the conditions the
// scenes share come from src/data/aldermoor.ts.
//
// Five maps: the Heath (the Mere Stair, the heath road, the printing barn, the bog chapel, the Moor Gate), the Market
// Cross (the hub), the Rolls House, the Regent's Keep (the archive, the close, the great hall, the courtroom, the yard
// and the cells) and St. Agatha's. Restartable scenes (Chapter 3's rule): every scene that moves the story has a
// trigger that plays it again until its flag is set.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { ARCHIVE_DONE_TEXT, ARCHIVE_NOT_DONE_TEXT, CATHEDRAL, CLOSE, CROSS, EVE_TEXT, HEATH, KEEP, ROLLS } from '../../src/data/aldermoor.ts';

const FLAG = 'א';
const WALL = 'ב';
const SLATE = 'ג';
const HEATHER = 'ד';
const BOG = 'ה';
const MERE = 'ו';
const ROAD = 'ז';
const HALL = 'ח';
const CARPET = 'ט';
const PILLAR = 'י';
const ARCH = 'כ';
const PEW = 'מ';
const DAIS = 'נ';
const RAIL = 'ס';
const BARS = 'ע';
const CELL = 'פ';
const NAVE = 'צ';
const CHAPEL = 'ר';
const STALL = 'ש';
const SHELF = 'ת';

/** The trial: from the Assize's opening until the Hushed is beaten (the court's people stand; the doors are held). */
const TRIAL = 'story.assize_opened, !story.hushed_beaten';
/** The keep by day: until the Toccata's first chord. */
const DAY = '!story.recital_begun';
/** The keep by night (the Sealbearers' lamps): the postern open, the archive not yet entered. */
const NIGHT = 'story.postern_open, !story.keep_archive_entered';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

function frame(g: Grid, x: number, y: number, w: number, h: number, ch: string): void {
  g.rect(x, y, w, 1, ch).rect(x, y + h - 1, w, 1, ch).rect(x, y, 1, h, ch).rect(x + w - 1, y, 1, h, ch);
}

/** Bayarmaa's grey mare: on the Heath and the square (never the keep, the church or the court). */
function salkhi(name: string, x: number, y: number, facing: string): ObjSpec {
  return npc(name, x, y, facing, { if: 'story.aldermoor_arrived, !act9.complete' });
}

/**
 * The Heath (wild, outdoor; the Mere Stair at its west edge): the landing off the mere where the Zetwal trader ties up;
 * the fishermen's shed and the Crown notice post at the stair's head; the heath road east to the Moor Gate (safe); the
 * printing barn north of the road (Al-3's safehouse, the grey thumbprint on its door, the press in its yard); the bog
 * chapel south of it on a causeway (Al-3's cell); heather and black bog off the road (the ambush layer, `heath`).
 */
export function aldermoorHeath(): MapSource {
  const { w: W, h: H } = HEATH;
  const g = new Grid(W, H, HEATHER);
  g.rect(0, 0, HEATH.mereTo + 1, H, MERE);
  const l = HEATH.landing;
  g.rect(l.x, l.y, l.w, l.h, FLAG);
  g.rect(HEATH.boardX, HEATH.roadRows[0], W - HEATH.boardX, 2, ROAD);
  // The fishermen's shed (a roof over three courses of stone), the notice post at the stair's head.
  const s = HEATH.shed;
  g.rect(s.x, s.y - 1, s.w, 1, SLATE).rect(s.x, s.y, s.w, s.h, WALL);
  // The printing barn and its yard; the press in the open.
  const b = HEATH.barn;
  g.rect(b.x, b.y - 1, b.w, 1, SLATE).rect(b.x, b.y, b.w, b.h, WALL);
  const y = HEATH.yard;
  g.rect(y.x, y.y, y.w, y.h, FLAG);
  // The bog chapel (roofless), its causeway from the road, its gap in the north wall.
  const c = HEATH.chapel;
  frame(g, c.x, c.y, c.w, c.h, WALL);
  g.rect(c.x + 1, c.y + 1, c.w - 2, c.h - 2, CHAPEL);
  g.set(HEATH.chapelGap.x, HEATH.chapelGap.y, CHAPEL);
  g.rect(HEATH.causewayX, HEATH.roadRows[1] + 1, 1, HEATH.chapelGap.y - HEATH.roadRows[1] - 1, ROAD);
  // The Moor Gate's two towers either side of the road.
  g.rect(41, 9, 4, 4, WALL).rect(41, 15, 4, 4, WALL);
  g.rect(45, 9, 1, 4, WALL).rect(45, 15, 1, 4, WALL);
  // Black bog in the heather, off the road.
  put(g, BOG, [[8, 3], [9, 3], [12, 6], [26, 4], [27, 4], [33, 8], [37, 3], [38, 3], [10, 20], [11, 20], [15, 24], [19, 18], [34, 21], [35, 21], [39, 25], [6, 25]]);
  const e = g.clone();
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'heath_cross', x: HEATH.gate.x, y: HEATH.gate.y, props: { target: 'cross_heath', map: 'aldermoor-cross', exit: 'left' } },
    { layer: 'spawns', name: 'mere_stair', x: HEATH.stair.x, y: HEATH.stair.y, props: { facing: 'right', era: 'present' } },
    // The landing (beat 0): the trader leaves, the constables at the stair's head, the chapel's veils.
    trigger('heath_arrive', HEATH.stair.x, HEATH.stair.y, { dialogue: 'heath_arrive', flag: 'story.aldermoor_arrived', once: true, onEnter: true, if: 'act8.complete' }),
    // The Moor Gate's Sealbearer (again until he has given the papers back).
    trigger('moor_gate', HEATH.gateStrip, HEATH.roadRows[0], { dialogue: 'moor_gate', if: 'story.aldermoor_arrived, !story.moor_gate' }, 1, 2),
    // Al-3: the cell in the bog chapel (again until it is beaten).
    trigger('bog_chapel', HEATH.chapelStep.x, HEATH.chapelStep.y, { dialogue: 'bog_chapel', if: 'side.purge_list.accepted, !encounter.aldermoor_story.chapel.won' }),
    // The last dawn (beat 8): the dissidents come down the road (on landing; again from the road until it is paid).
    trigger('price_dawn', HEATH.stair.x, HEATH.stair.y, { dialogue: 'ald_price_scene', flag: 'story.price_seen', once: true, onEnter: true, if: 'story.hushed_beaten, !ally.aldermoor_dissidents' }),
    trigger('price_again', HEATH.stair.x + 1, HEATH.landing.y, { dialogue: 'ald_price_scene', if: 'story.hushed_beaten, !ally.aldermoor_dissidents' }, 1, HEATH.landing.h),
    // Home (the end of the chapter): the board at the water's edge (again until it sails).
    trigger('ald_stair_end', HEATH.boardX, HEATH.landing.y, { dialogue: 'ald_stair_end', if: 'ally.aldermoor_dissidents, !act9.complete' }, 1, HEATH.landing.h),
    obj('al_trader_ship', HEATH.boat.x, HEATH.boat.y, { kind: 'trader_ship', solid: true, era: 'present', dialogue: 'al_trader_ship' }, 3, 1),
    obj('notice_post', HEATH.notice.x, HEATH.notice.y, { kind: 'notice_post', solid: true, era: 'present', dialogue: 'notice_post' }),
    obj('heath_milestone', HEATH.milestone.x, HEATH.milestone.y, { kind: 'milestone_al', solid: true, era: 'present', dialogue: 'heath_milestone' }),
    obj('barn_thumb', HEATH.barnDoor.x, HEATH.barnDoor.y, { kind: 'thumbprint_door', solid: true, era: 'present', dialogue: 'barn_thumb' }),
    obj('hand_press', HEATH.press.x, HEATH.press.y, { kind: 'hand_press', solid: true, era: 'present', dialogue: 'hand_press' }, 2, 1),
    obj('drying_sheets', HEATH.sheets.x, HEATH.sheets.y, { kind: 'drying_sheets', solid: true, era: 'present', dialogue: 'drying_sheets' }),
    obj('chapel_lantern', HEATH.chapelGap.x, HEATH.chapelGap.y + 3, { kind: 'chapel_lantern', solid: true, era: 'present', if: '!encounter.aldermoor_story.chapel.won', dialogue: 'chapel_lantern' }),
    npc('printer', HEATH.printer.x, HEATH.printer.y, 'down'),
    ...HEATH.apprentices.map((p, i) => npc(`apprentice_${'ab'[i]}`, p.x, p.y, 'up', { npc: 'apprentice' })),
    ...HEATH.veils.map((p, i) => npc(`chapel_veil_${'ab'[i]}`, p.x, p.y, 'up', { if: '!encounter.aldermoor_story.chapel.won' })),
    npc('chapel_hound', HEATH.hound.x, HEATH.hound.y, 'up', { if: '!encounter.aldermoor_story.chapel.won' }),
    npc('moor_sealbearer', HEATH.gateSealbearer.x, HEATH.gateSealbearer.y, 'down'),
    ...HEATH.escorts.map((p, i) => npc(`escort_${'ab'[i]}`, p.x, p.y, i === 0 ? 'down' : 'up', { npc: 'escort_constable', if: 'story.escort_met, !story.hushed_beaten' })),
        salkhi('salkhi_heath', HEATH.salkhi.x, HEATH.salkhi.y, 'right'),
    // The heather and the bog off the road (the road, the landing, the barn's yard, the causeway and the chapel are safe).
    { layer: 'encounters', name: 'heath_nw', x: 5, y: 1, w: 10, h: 10, props: { table: 'heath', if: 'story.aldermoor_arrived, !story.hushed_beaten' } },
    { layer: 'encounters', name: 'heath_ne', x: 24, y: 1, w: 17, h: 10, props: { table: 'heath', if: 'story.aldermoor_arrived, !story.hushed_beaten' } },
    { layer: 'encounters', name: 'heath_sw', x: 7, y: 17, w: 16, h: 10, props: { table: 'heath', if: 'story.aldermoor_arrived, !story.hushed_beaten' } },
    { layer: 'encounters', name: 'heath_se', x: 32, y: 17, w: 9, h: 10, props: { table: 'heath', if: 'story.aldermoor_arrived, !story.hushed_beaten' } },
  ];
  return { id: 'aldermoor-heath', present: g, echo: e, objects };
}

/**
 * The Market Cross (the hub, outdoor): a wet grey square round a stone cross; at its head St. Agatha's west front, the
 * close's gate and the keep's gatehouse; the Rolls House on the east; the pie shop, the jeweller and the outfitter on
 * the west; tea shops with steamed windows; constables at the corners; the debate corner by the cross.
 */
export function aldermoorCross(): MapSource {
  const { w: W, h: H } = CROSS;
  const g = new Grid(W, H, WALL);
  // Roofs over the buildings round the square (their fronts are the walls on the square's edge).
  g.rect(0, 0, W, 1, SLATE);
  g.rect(0, 6, 4, 1, SLATE).rect(38, 6, 4, 1, SLATE);
  const sq = CROSS.square;
  g.rect(sq.x, sq.y, sq.w, sq.h, FLAG);
  g.rect(19, sq.y + sq.h, 4, H - sq.y - sq.h, ROAD);
  // The close's gate between the church and the keep (a wall without a roof), and the doors on the square.
  g.rect(13, 1, 2, 5, WALL);
  g.set(CROSS.cathedral.x, CROSS.cathedral.y, 'D');
  g.set(CROSS.keep.x, CROSS.keep.y, 'D');
  g.set(CROSS.closeGate.x, CROSS.closeGate.y, 'D');
  g.set(CROSS.rolls.x, CROSS.rolls.y, 'D');
  // The stalls behind the vendors on the west side.
  put(g, STALL, [[CROSS.pieSeller.x - 1, CROSS.pieSeller.y], [CROSS.jeweller.x - 1, CROSS.jeweller.y], [CROSS.outfitter.x - 1, CROSS.outfitter.y]]);
  const e = g.clone();
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'cross_heath', x: CROSS.south.x, y: CROSS.south.y, props: { target: 'heath_cross', map: 'aldermoor-heath', exit: 'up' } },
    { layer: 'doors', name: 'cross_keep', x: CROSS.keep.x, y: CROSS.keep.y, props: { target: 'keep_cross', map: 'aldermoor-keep', exit: 'down' } },
    { layer: 'doors', name: 'cross_cathedral', x: CROSS.cathedral.x, y: CROSS.cathedral.y, props: { target: 'cathedral_west', map: 'aldermoor-cathedral', exit: 'down', if: 'story.jordyn_offer', closed: 'cathedral_rehearsal' } },
    { layer: 'doors', name: 'cross_close', x: CROSS.closeGate.x, y: CROSS.closeGate.y, props: { target: 'close_gate', map: 'aldermoor-close', exit: 'down', if: 'story.jordyn_line', closed: 'close_gate_shut' } },
    { layer: 'doors', name: 'cross_rolls', x: CROSS.rolls.x, y: CROSS.rolls.y, props: { target: 'rolls_out', map: 'aldermoor-rolls', exit: 'left' } },
    { layer: 'spawns', name: 'cross', x: 20, y: 27, props: { facing: 'up', era: 'present' } },
    // The lady in grey crosses the square as the party comes in (beat 1).
    trigger('cross_arrive', 20, 27, { dialogue: 'cross_arrive', flag: 'story.almoner_seen', once: true, onEnter: true, if: 'story.moor_gate' }),
    // The press-gang at the pie shop, and Edmund (again until he has joined).
    trigger('press_gang', CROSS.pressFrom, CROSS.pressRow, { dialogue: 'press_gang', if: 'story.moor_gate, !story.edmund_met' }, CROSS.pressTo - CROSS.pressFrom + 1, 1),
    // The eve: the court walks to St. Agatha's, and the Almoner turns back at its door.
    trigger('court_walk', CROSS.courtWalk.x, CROSS.courtWalk.y, { dialogue: 'court_walk', flag: 'story.court_walked', once: true, if: EVE_TEXT }, CROSS.courtWalk.w, CROSS.courtWalk.h),
    obj('market_cross', CROSS.cross.x, CROSS.cross.y, { kind: 'market_cross', solid: true, era: 'present', dialogue: 'market_cross' }, 2, 2),
    obj('al_board', CROSS.board.x, CROSS.board.y, { kind: 'sign', solid: true, era: 'present', dialogue: 'al_board' }),
    obj('pie_door', CROSS.pieDoor.x, CROSS.pieDoor.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'family_pie' }),
    obj('tea_door', CROSS.teaDoor.x, CROSS.teaDoor.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'family_tea' }),
    obj('constable_door', CROSS.constableDoor.x, CROSS.constableDoor.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'family_constable' }),
    obj('tea_shop', CROSS.teaShop.x, CROSS.teaShop.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'tea_shop' }),
    npc('pie_seller', CROSS.pieSeller.x, CROSS.pieSeller.y, 'right'),
    npc('al_jeweller', CROSS.jeweller.x, CROSS.jeweller.y, 'right'),
    npc('al_outfitter', CROSS.outfitter.x, CROSS.outfitter.y, 'right'),
    npc('debate_hierarch', CROSS.hierarch.x, CROSS.hierarch.y, 'left'),
    npc('debate_exile', CROSS.exile.x, CROSS.exile.y, 'left'),
    ...CROSS.constables.map((p, i) => npc(`cross_constable_${'ab'[i]}`, p.x, p.y, 'down', { npc: 'cross_constable' })),
    salkhi('salkhi_cross', CROSS.salkhi.x, CROSS.salkhi.y, 'left'),
  ];
  return { id: 'aldermoor-cross', present: g, echo: e, objects };
}

/** The Rolls House (the Crown's public library, interior): two shelves of the Crown's books, the keeper of the rolls. */
export function aldermoorRolls(): MapSource {
  const { w: W, h: H } = ROLLS;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, ARCH);
  g.rect(2, 1, 4, 1, SHELF).rect(9, 1, 4, 1, SHELF).rect(16, 1, 4, 1, SHELF);
  put(g, SHELF, [[1, 6], [1, 7], [20, 9], [20, 10]]);
  g.set(ROLLS.door.x, ROLLS.door.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'rolls_out', x: ROLLS.door.x, y: ROLLS.door.y, props: { target: 'cross_rolls', map: 'aldermoor-cross', exit: 'up' } },
    { layer: 'spawns', name: 'rolls', x: 10, y: 11, props: { facing: 'up', era: 'present' } },
    obj('ald_rolls_a', 2, 1, { dialogue: 'shelf.ald_rolls_a', era: 'present' }, 4, 1),
    obj('ald_rolls_b', 9, 1, { dialogue: 'shelf.ald_rolls_b', era: 'present' }, 4, 1),
    obj('ald_rolls_c', 16, 1, { dialogue: 'rolls_closed_shelf', era: 'present' }, 4, 1),
    npc('rolls_keeper', ROLLS.keeper.x, ROLLS.keeper.y, 'left'),
  ];
  return { id: 'aldermoor-rolls', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Regent's Keep (the seat of government, interior, 40 x 30): the archive (the cabinets by regnal year, the gallery
 * desk, the Ash Wars shelf before the loose panel; its filing floor is the Echo zone of the first revisiting); the close
 * (an outdoor pocket between the keep and St. Agatha's: the bell post, the postern, the vestry door, the gate to the
 * square); the great hall (the Regent's dais, the council, the watch's station; the Sealbearers' lamps by night); the
 * courtroom (the bench, the clerk's table, the oath-block, the dock, whose floor is the ratification's Echo zone, the
 * gallery); the yard and the keep's gate; the cells.
 */
export function aldermoorKeep(): MapSource {
  const { w: W, h: H } = KEEP;
  const g = new Grid(W, H, WALL);
  const a = KEEP.archive;
  g.rect(a.x, a.y, a.w, a.h, ARCH);
  const hall = KEEP.hall;
  g.rect(hall.x, hall.y, hall.w, hall.h, HALL);
  g.rect(19, 9, 3, 7, CARPET);
  g.rect(19, 8, 3, 1, DAIS);
  // The pillars (the dark row behind them, along the north wall, is the way round at night).
  for (const x of [3, 7, 11, 15, 25, 29, 33, 37]) g.set(x, 8, PILLAR);
  // The archive's door, the postern and the passage to the yard: floor under their objects.
  g.set(KEEP.archiveDoor.x, KEEP.archiveDoor.y, ARCH);
  g.set(KEEP.postern.x, KEEP.postern.y, 'D');
  g.rect(KEEP.passage.x, KEEP.passage.y, 2, 1, HALL);
  g.set(KEEP.courtDoor.x, KEEP.courtDoor.y, HALL);
  // The courtroom: the bench, the dock's rail, the gallery's pews.
  const ct = KEEP.court;
  g.rect(ct.x, ct.y, ct.w, ct.h, HALL);
  const bn = KEEP.bench;
  g.rect(bn.x, bn.y, bn.w, bn.h, DAIS);
  const d = KEEP.dock;
  g.rect(d.x - 1, d.y, 1, d.h, RAIL).rect(d.x + d.w, d.y, 1, d.h, RAIL).rect(d.x - 1, d.y + d.h, d.w + 2, 1, RAIL);
  g.rect(2, 27, 12, 1, PEW);
  // The yard and the keep's gate.
  const yd = KEEP.yard;
  g.rect(yd.x, yd.y, yd.w, yd.h, FLAG);
  g.set(KEEP.gate.x, KEEP.gate.y, 'D');
  // The cells: one cell behind bars, the corridor before it.
  const cl = KEEP.cell;
  g.rect(27, 17, 12, 12, WALL);
  g.rect(cl.x, cl.y, cl.w, cl.h, CELL);
  g.rect(cl.x - 1, cl.y + cl.h, cl.w + 2, 1, BARS);
  g.rect(27, 25, 12, 3, CELL);
  // Fifty years ago: no Ash Wars shelf (the wars were twenty-five years ago); the rest as it is.
  const e = g.clone();
  const z = KEEP.zone;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'keep_cross', x: KEEP.gate.x, y: KEEP.gate.y, props: { target: 'cross_keep', map: 'aldermoor-cross', exit: 'up', if: '!story.caught|story.hushed_beaten', closed: 'keep_gate_held' } },
    { layer: 'doors', name: 'keep_postern', x: KEEP.postern.x, y: KEEP.postern.y, props: { target: 'close_postern', map: 'aldermoor-close', exit: 'down', if: 'story.postern_open, !story.caught', closed: 'postern' } },
    { layer: 'spawns', name: 'keep_yard', x: 21, y: 27, props: { facing: 'up', era: 'present' } },
    { layer: 'spawns', name: 'postern', x: KEEP.postern.x + 2, y: KEEP.postern.y + 1, props: { facing: 'left', era: 'present' } },
    { layer: 'spawns', name: 'archive_in', x: KEEP.archiveIn.x, y: KEEP.archiveIn.y, props: { facing: 'up', era: 'present' } },
    { layer: 'spawns', name: 'cells', x: KEEP.cellSpawn.x, y: KEEP.cellSpawn.y, props: { facing: 'down', era: 'present' } },
    { layer: 'spawns', name: 'dock', x: KEEP.dockSpawn.x, y: KEEP.dockSpawn.y, props: { facing: 'up', era: 'present' } },
    // The Regent's answer (beat 2): the hall from the yard's passage (again until he has refused).
    trigger('regent_audience', 18, KEEP.audienceRow, { dialogue: 'regent_audience', if: 'story.edmund_met, !story.regent_refused' }, 6, 1),
    // The keep by night (beat 5): the Sealbearers' lamps send the party back to the postern.
    ...KEEP.sightlines.map((s, i) => trigger(`sightline_${i + 1}`, s.x, s.y, { dialogue: 'sightline', if: NIGHT }, s.w, s.h)),
    // Out of the archive: not yet (back inside) until the three things are in hand; then caught (beat 6).
    trigger('archive_not_yet', KEEP.archiveDoor.x, KEEP.archiveDoor.y + 1, { dialogue: 'archive_not_yet', if: `story.keep_archive_entered, !story.caught, ${ARCHIVE_NOT_DONE_TEXT}` }),
    trigger('caught', KEEP.archiveDoor.x, KEEP.archiveDoor.y + 1, { dialogue: 'caught', if: `story.keep_archive_entered, !story.caught, ${ARCHIVE_DONE_TEXT}` }),
    // The cells (the night; a save here wakes to the same night).
    trigger('cells_night', KEEP.cellSpawn.x, KEEP.cellSpawn.y, { dialogue: 'cells_night', flag: 'story.cells_night', once: true, onEnter: true, if: 'story.caught, !story.assize_opened' }),
    // The Assize (beat 7): the charge as the party is brought into the dock; the Hushed again from the dock after a loss.
    trigger('assize_open', KEEP.dockSpawn.x, KEEP.dockSpawn.y, { dialogue: 'assize_open', flag: 'story.assize_opened', once: true, onEnter: true, if: 'story.assize_dawn' }),
    trigger('hushed_again', KEEP.dock.x, KEEP.dock.y - 1, { dialogue: 'hushed_again', if: 'story.record_read, !encounter.aldermoor_story.hushed.won' }, KEEP.dock.w, 1),
    // Back after the Hushed's fall, if the court's ruling was left before it ended (a save between the fight and the tide).
    trigger('assize_after_again', KEEP.dock.x, KEEP.dock.y - 1, { dialogue: 'assize_after', if: 'encounter.aldermoor_story.hushed.won, !story.hushed_beaten' }, KEEP.dock.w, 1),
    // The archive (present): the cabinets, the gallery desk, the Ash Wars shelf before the loose panel.
    ...KEEP.cabinets.map((p, i) => obj(`cabinet_${i + 1}`, p.x, p.y, { kind: 'cabinet', solid: true, era: 'present', dialogue: `cabinet_${i + 1}` })),
    obj('gallery_desk', KEEP.desk.x, KEEP.desk.y, { kind: 'gallery_desk', solid: true, era: 'present', dialogue: 'gallery_desk' }, 2, 1),
    obj('ash_shelf', KEEP.ashShelf.x, KEEP.ashShelf.y, { kind: 'ash_shelf', solid: true, era: 'present', if: '!side.crown_chronicle.accepted', dialogue: 'ash_shelf' }),
    obj('ash_shelf_moved', KEEP.ashShelf.x + 1, KEEP.ashShelf.y, { kind: 'ash_shelf', solid: true, era: 'present', if: 'side.crown_chronicle.accepted', dialogue: 'ash_shelf' }),
    obj('archive_panel', KEEP.panel.x, KEEP.panel.y, { kind: 'panel_loose', solid: true, era: 'present', if: '!anchor.thomas_record', dialogue: 'archive_panel' }),
    obj('archive_panel_open', KEEP.panel.x, KEEP.panel.y, { kind: 'panel_open', solid: true, era: 'present', if: 'anchor.thomas_record', dialogue: 'archive_panel' }),
    // Fifty years ago (the first revisiting): Thomas at the gallery desk, the panel that Patricio leans on.
    obj('echo_panel', KEEP.panel.x, KEEP.panel.y, { kind: 'panel_loose', solid: true, era: 'echo', dialogue: 'echo_panel' }),
    obj('echo_desk', KEEP.desk.x, KEEP.desk.y, { kind: 'gallery_desk', solid: true, era: 'echo', dialogue: 'echo_desk' }, 2, 1),
    { layer: 'anchors', name: 'thomas_record_anchor', x: KEEP.panel.x, y: KEEP.panel.y, props: { object: 'echo_panel', flag: 'anchor.thomas_record' } },
    { layer: 'echo_zones', name: 'filing_floor', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, story.keep_archive_entered', onEcho: 'thomas_echo' } },
    npc('echo_thomas_clerk', KEEP.thomas.x, KEEP.thomas.y, 'left', { npc: 'echo_thomas_clerk', era: 'echo' }),
    // The archive's iron door (sealed by day, by night Edmund breaks the family's seal), the postern, the courtroom doors.
    obj('archive_door', KEEP.archiveDoor.x, KEEP.archiveDoor.y, { kind: 'archive_door', solid: true, era: 'present', if: '!story.keep_archive_entered', dialogue: 'archive_door' }),
    obj('court_doors', KEEP.courtDoor.x, KEEP.courtDoor.y, { kind: 'court_doors', solid: true, era: 'present', if: '!story.caught', dialogue: 'court_doors' }),
    obj('clock_door', KEEP.clockDoor.x, KEEP.clockDoor.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'clock_door' }),
    obj('almoner_office', KEEP.officeDoor.x, KEEP.officeDoor.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'almoner_office' }),
    obj('post_office', KEEP.postOffice.x, KEEP.postOffice.y, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'post_office' }),
    obj('ald_keep_books', 12, 10, { kind: 'al_shelf', solid: true, dialogue: 'shelf.ald_keep_books', era: 'present' }, 2, 1),
    obj('evidence_table', KEEP.table.x, KEEP.table.y, { kind: 'evidence_table', solid: true, era: 'present', dialogue: 'evidence_table' }, 3, 1),
    obj('oath_block', KEEP.oath.x, KEEP.oath.y, { kind: 'oath_stone', solid: true, era: 'present', dialogue: 'oath_block' }),
    obj('cell_bench', KEEP.cellBench.x, KEEP.cellBench.y, { kind: 'cell_bench', solid: true, era: 'present', dialogue: 'cell_bench' }, 2, 1),
    // The dock's floor (the ratification: the roll read over an empty dock; information, no anchor).
    { layer: 'echo_zones', name: 'dock_floor', x: KEEP.dock.x, y: KEEP.dock.y, w: KEEP.dock.w, h: KEEP.dock.h, props: { if: `item.sun_locket, ${TRIAL}, !story.record_read`, onEcho: 'ratification_echo', onReturn: 'ratification_return' } },
    // The hall by day: the Regent on his dais with the Almoner behind him, the council, the chamberlain, the watch.
    npc('regent_hall', KEEP.regent.x, KEEP.regent.y, 'down', { npc: 'al_regent', if: `story.aldermoor_arrived, ${DAY}` }),
    npc('almoner_hall', KEEP.almoner.x, KEEP.almoner.y, 'down', { npc: 'almoner', if: DAY }),
    npc('magistrate', KEEP.council[0]!.x, KEEP.council[0]!.y, 'left', { if: DAY }),
    npc('keep_steward', KEEP.council[1]!.x, KEEP.council[1]!.y, 'left', { if: DAY }),
    npc('witness_bishop', KEEP.council[2]!.x, KEEP.council[2]!.y, 'left', { if: DAY }),
    npc('rosalind', KEEP.council[3]!.x, KEEP.council[3]!.y, 'left', { if: DAY }),
    npc('al_chamberlain', KEEP.chamberlain.x, KEEP.chamberlain.y, 'right', { if: DAY }),
    npc('jordyn_hall', KEEP.jordyn.x, KEEP.jordyn.y, 'left', { npc: 'jordyn', if: DAY }),
    npc('archive_sealbearer', KEEP.archiveSealbearer.x, KEEP.archiveSealbearer.y, 'down', { npc: 'keep_sealbearer', if: DAY }),
    ...KEEP.nightSealbearers.map((p, i) => npc(`night_sealbearer_${'ab'[i]}`, p.x, p.y, i === 0 ? 'left' : 'right', { if: 'story.postern_open, !story.caught' })),
    // The Assize: the court as it sits, the watch at the doors, the city in the gallery.
    npc('regent_court', KEEP.courtRegent.x, KEEP.courtRegent.y, 'down', { npc: 'al_regent', if: TRIAL }),
    ...KEEP.courtSealbearers.map((p, i) => npc(`court_sealbearer_${'ab'[i]}`, p.x, p.y, 'down', { npc: 'keep_sealbearer', if: TRIAL })),
    npc('assize_clerk', KEEP.clerk.x, KEEP.clerk.y, 'down', { if: 'story.caught' }),
    npc('almoner_court', KEEP.witnessAlmoner.x, KEEP.witnessAlmoner.y, 'right', { npc: 'almoner', if: `${TRIAL}, !story.hushed_revealed` }),
    npc('rosalind_court', KEEP.courtRosalind.x, KEEP.courtRosalind.y, 'left', { npc: 'rosalind', if: TRIAL }),
    npc('magistrate_court', KEEP.courtMagistrate.x, KEEP.courtMagistrate.y, 'left', { npc: 'magistrate', if: TRIAL }),
    npc('jordyn_court', KEEP.courtJordyn.x, KEEP.courtJordyn.y, 'left', { npc: 'jordyn', if: TRIAL }),
    npc('court_watch', KEEP.courtDoorWatch.x, KEEP.courtDoorWatch.y, 'down', { if: TRIAL }),
    npc('sebastian_court', KEEP.gallery[0]!.x, KEEP.gallery[0]!.y, 'up', { npc: 'sebastian', if: TRIAL }),
    npc('pie_boy_court', KEEP.gallery[1]!.x, KEEP.gallery[1]!.y, 'up', { npc: 'pie_boy', if: TRIAL }),
    npc('printer_court', KEEP.gallery[2]!.x, KEEP.gallery[2]!.y, 'up', { npc: 'printer_gallery', if: TRIAL }),
    npc('clockmaker_court', KEEP.gallery[3]!.x, KEEP.gallery[3]!.y, 'up', { npc: 'clockmaker', if: TRIAL }),
    npc('exile_court', KEEP.gallery[4]!.x, KEEP.gallery[4]!.y, 'up', { npc: 'gaze_exile_gallery', if: TRIAL }),
    // The cells: the sorry constable outside the bars.
    npc('sorry_constable', 33, 26, 'up', { if: 'story.caught, !story.assize_opened' }),
  ];
  return { id: 'aldermoor-keep', present: g, echo: e, objects, interior: true };
}

/**
 * The close (outdoor, its own map: Claude's call, so the arrow and the doors see it apart from the hall): wet
 * flagstones between the keep's north wall and St. Agatha's south wall, the bell post, the gate to the square, the
 * vestry door into the church, and the postern into the keep's hall (unbarred for the length of the loud piece).
 */
export function aldermoorClose(): MapSource {
  const { w: W, h: H } = CLOSE;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, FLAG);
  g.set(CLOSE.gate.x, CLOSE.gate.y, 'D');
  g.set(CLOSE.vestry.x, CLOSE.vestry.y, 'D');
  g.set(CLOSE.postern.x, CLOSE.postern.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'close_gate', x: CLOSE.gate.x, y: CLOSE.gate.y, props: { target: 'cross_close', map: 'aldermoor-cross', exit: 'left' } },
    { layer: 'doors', name: 'close_vestry', x: CLOSE.vestry.x, y: CLOSE.vestry.y, props: { target: 'cathedral_vestry', map: 'aldermoor-cathedral', exit: 'down', if: 'story.jordyn_offer, !story.caught', closed: 'vestry_locked' } },
    { layer: 'doors', name: 'close_postern', x: CLOSE.postern.x, y: CLOSE.postern.y, props: { target: 'keep_postern', map: 'aldermoor-keep', exit: 'up', if: 'story.postern_open, !story.caught', closed: 'postern' } },
    { layer: 'spawns', name: 'close', x: CLOSE.offerStrip + 1, y: CLOSE.gate.y + 1, props: { facing: 'left', era: 'present' } },
    // The close after the bell (beat 2b): Jordyn's offer (again until it is made).
    trigger('close_offer', CLOSE.offerStrip, 1, { dialogue: 'close_offer', if: 'story.jordyn_line, !story.jordyn_offer' }, 1, H - 2),
    obj('bell_post', CLOSE.bell.x, CLOSE.bell.y, { kind: 'bell_post', solid: true, era: 'present', dialogue: 'bell_post' }),
  ];
  return { id: 'aldermoor-close', present: g, echo: g.clone(), objects };
}

/**
 * St. Agatha's (the Witness's great church of Kingsmere, interior): the nave and its pews, the oath-stone, the organ
 * loft with the great organ across the east end (Sebastian at the console), the vestry door to the close, the west door.
 */
export function aldermoorCathedral(): MapSource {
  const { w: W, h: H } = CATHEDRAL;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, NAVE);
  const o = CATHEDRAL.organ;
  g.rect(o.x - 1, o.y + o.h, o.w + 2, 2, DAIS);
  for (const y of [9, 11, 13]) g.rect(2, y, 8, 1, PEW).rect(15, y, 8, 1, PEW);
  g.set(CATHEDRAL.west.x, CATHEDRAL.west.y, 'D');
  g.set(CATHEDRAL.vestry.x, CATHEDRAL.vestry.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'cathedral_west', x: CATHEDRAL.west.x, y: CATHEDRAL.west.y, props: { target: 'cross_cathedral', map: 'aldermoor-cross', exit: 'up' } },
    { layer: 'doors', name: 'cathedral_vestry', x: CATHEDRAL.vestry.x, y: CATHEDRAL.vestry.y, props: { target: 'close_vestry', map: 'aldermoor-close', exit: 'left', if: 'story.jordyn_offer, !story.caught', closed: 'vestry_locked' } },
    { layer: 'spawns', name: 'cathedral', x: 12, y: 15, props: { facing: 'up', era: 'present' } },
    // Sebastian comes down from the loft (beat 3; again until they have met).
    trigger('sebastian_meet', 11, CATHEDRAL.sceneRow, { dialogue: 'sebastian_meet', if: 'story.jordyn_offer, !story.sebastian_met' }, 4, 1),
    // The Toccata (beat 5): the nave full, the first chord, the vestry (again until it has begun).
    trigger('recital', 11, CATHEDRAL.sceneRow, { dialogue: 'recital', if: EVE_TEXT }, 4, 1),
    obj('great_organ', o.x, o.y, { kind: 'great_organ', solid: true, era: 'present', dialogue: 'great_organ' }, o.w, o.h),
    obj('organ_console', CATHEDRAL.console.x, CATHEDRAL.console.y, { kind: 'organ_console', solid: true, era: 'present', dialogue: 'organ_console' }),
    obj('agatha_oath_stone', CATHEDRAL.oathStone.x, CATHEDRAL.oathStone.y, { kind: 'oath_stone', solid: true, era: 'present', dialogue: 'agatha_oath_stone' }, 2, 1),
    npc('sebastian', CATHEDRAL.sebastian.x, CATHEDRAL.sebastian.y, 'down', { if: `story.jordyn_offer, !story.recital_begun` }),
    npc('verger', CATHEDRAL.verger.x, CATHEDRAL.verger.y, 'left'),
  ];
  return { id: 'aldermoor-cathedral', present: g, echo: g.clone(), objects, interior: true };
}

export const ALDERMOOR_SOURCES: readonly (() => MapSource)[] = [aldermoorHeath, aldermoorCross, aldermoorRolls, aldermoorKeep, aldermoorClose, aldermoorCathedral];

