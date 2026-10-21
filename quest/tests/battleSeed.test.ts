// Battle dice from the save (plan review 3.5): a fight's seed is its id and how many times it has been started on
// this save, so the same save replays the same fight (the browser test, the simulator) and each new try, a retry
// after Game Over included, rolls new dice. The battle scene no longer reads the clock.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BATTLES, ENEMIES, SKILL_BOOK, battleDef } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty, battleSeed, battleTriesFlag, startBattleSeed, type BattleDef, type BattleEvent } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { grudgeFor, recordLoss } from '../src/engine/gameOver.ts';
import { seedFrom } from '../src/engine/rng.ts';
import { QUEST_ROOT } from '../tools/sim-setup.ts';

const boarFight = BATTLES.intro_boar!;

function save(): FlagStore {
  const f = new FlagStore();
  f.set('party.anissa', true);
  f.set('xp.shared', 300);
  return f;
}

/** A whole fight from a save, the way the battle scene starts it, with a plain policy: Attack the first foe. */
function play(flags: FlagStore, def: BattleDef): BattleEvent[] {
  const seed = startBattleSeed(flags, def);
  const enemies = def.enemies.map((id) => ENEMIES[id]!);
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), enemies, [], { seed, grudge: grudgeFor(flags, def) });
  const events = b.start();
  for (let i = 0; i < 200 && !b.outcome; i++) {
    const foe = b.enemies.find((e) => !e.down)!;
    events.push(...b.act({ kind: 'attack', target: foe.key }));
  }
  return events;
}

describe('battle dice come from the save', () => {
  it('the seed is the fight and its try: the same save gives the same seed, a new try a new one', () => {
    const f = save();
    const first = battleSeed(f, boarFight);
    expect(battleSeed(f, boarFight)).toBe(first);
    expect(first).toBe(seedFrom('intro_boar#0'));
    expect(startBattleSeed(f, boarFight)).toBe(first);
    expect(f.get(battleTriesFlag(boarFight))).toBe(1);
    expect(battleSeed(f, boarFight)).not.toBe(first);
    expect(battleSeed(save(), BATTLES.pier_marines!)).not.toBe(first);
  });

  it('a random ambush counts its tries by group, so meeting the same group again rolls new dice', () => {
    const def = battleDef('encounter:mountain_path/marines')!;
    expect(def).toBeDefined();
    expect(battleTriesFlag(def)).toBe('battle.tries.mountain_path.marines');
    const f = save();
    const a = startBattleSeed(f, def);
    const b = startBattleSeed(f, def);
    expect(a).not.toBe(b);
  });

  it('two players on the same save see the same fight, blow for blow', () => {
    expect(play(save(), boarFight)).toEqual(play(save(), boarFight));
  });

  it("Game Over keeps its retry: the next try has the Grudge and new dice; the one after a reload of the same save replays", () => {
    const f = save();
    const before = new FlagStore();
    before.load(f.snapshot());
    const firstTry = play(f, boarFight);
    recordLoss(f, boarFight);
    expect(grudgeFor(f, boarFight)).toBeGreaterThan(0);
    const secondTry = play(f, boarFight);
    expect(secondTry).not.toEqual(firstTry);
    // Closing the app before the fight was saved: the save from before replays the first try exactly.
    expect(play(before, boarFight)).toEqual(firstTry);
  });

  it('the battle scene takes its seed from the save, not the clock', () => {
    const scene = readFileSync(join(QUEST_ROOT, 'src/scenes/BattleScene.ts'), 'utf8');
    expect(scene).not.toMatch(/Date\.now|Math\.random/);
    expect(scene).toMatch(/startBattleSeed\(/);
  });
});
