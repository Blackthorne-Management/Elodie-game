// The opening keeps you on the story (owner decision, Oct 16): every exit from the plaza is closed until
// Mother has left; then only home opens; everything opens when the war room memory is done. At a closed
// door Anissa says why, and Gianna stays where she is.

import { describe, expect, it } from 'vitest';
import type { GameLogic } from '../src/engine/game.ts';
import { stepFrom } from '../src/engine/grid.ts';
import type { Door } from '../src/engine/tiledMap.ts';
import type { Dir } from '../src/engine/types.ts';
import { newGameSim } from '../tools/sim-setup.ts';

const BACK: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

/** Stand on the tile a door lets you out onto and walk back into it. */
function bump(logic: GameLogic, door: Door): { through: boolean; line: string | null } {
  logic.state.player.pos = stepFrom(door.pos, door.exit);
  const step = logic.tryStep(BACK[door.exit]);
  if (step.ok) return { through: true, line: null };
  expect(step.reason).toBe('door_closed');
  if (step.ok || step.reason !== 'door_closed') return { through: false, line: null };
  logic.closedDoor(step.door);
  const view = logic.view();
  const line = view.kind === 'end' ? null : `${view.speaker?.name ?? ''}: ${view.text}`;
  while (logic.mode === 'dialogue') logic.advance();
  expect(logic.state.player.pos).toEqual(stepFrom(door.pos, door.exit));
  return { through: false, line };
}

function plaza(flags: string[] = []): GameLogic {
  const logic = newGameSim().logic;
  while (logic.mode === 'dialogue') logic.advance(); // the festival's opening scene
  for (const f of flags) logic.state.flags.set(f, true);
  expect(logic.map.id).toBe('zetwal-town');
  return logic;
}

const doorsOf = (logic: GameLogic) => logic.map.doors;

describe('the opening', () => {
  it('closes every way out of the plaza until Mother has left, and Anissa says to see her first', () => {
    const logic = plaza();
    expect(doorsOf(logic)).toHaveLength(6);
    for (const door of doorsOf(logic)) {
      const r = bump(logic, door);
      expect(r.through, door.id).toBe(false);
      expect(r.line).toMatch(/Anissa.*see Mother before she leaves/);
    }
  });

  it('then opens only the way home, and Anissa says to see Grandmother first', () => {
    const logic = plaza(['story.festival_intro', 'story.heard_speech', 'story.elodie_left']);
    for (const door of doorsOf(logic)) {
      const r = bump(logic, door);
      if (door.id === 'town_house') expect(r.through, door.id).toBe(true);
      else {
        expect(r.through, door.id).toBe(false);
        expect(r.line).toMatch(/Grandmother's waiting for us at home/);
      }
    }
  });

  it('with the Locket but before the war room, Anissa points at the study', () => {
    const logic = plaza(['story.heard_speech', 'story.elodie_left', 'item.sun_locket']);
    const market = doorsOf(logic).find((d) => d.id === 'town_market')!;
    expect(bump(logic, market).line).toMatch(/the study remembers/);
  });

  it('opens everything once the war room memory is done', () => {
    const logic = plaza(['story.heard_speech', 'story.elodie_left', 'item.sun_locket', 'story.warroom_echo']);
    for (const door of doorsOf(logic)) expect(bump(logic, door).through, door.id).toBe(true);
  });
});
