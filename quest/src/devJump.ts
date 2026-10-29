// The owner's test shortcut `?at=<marker>` (Oct 29), dev server only: a new game played headlessly along the scripted
// route (routes/zetwal-act1.json) up to that marker, every fight won as the battle scene would end it, then handed to
// the browser exactly there (in the middle of a scene, if the marker is). Loaded only by main.ts on the dev server.

import route from '../routes/zetwal-act1.json';
import { battleDef } from './data/battles.ts';
import { CONTENT } from './data/content.ts';
import { RPG } from './data/rpg.ts';
import { battleItems, settleBattle, type Battle } from './engine/battle.ts';
import { GameLogic } from './engine/game.ts';
import { recordLoss } from './engine/gameOver.ts';
import { markShown, pendingShowcases } from './engine/showcase.ts';
import { Sim, parseRoute } from './engine/sim.ts';
import { newGame } from './engine/state.ts';
import type { GameMap } from './engine/tiledMap.ts';

/** Every marker of the route, in order (the names `?at=` takes). */
export function routeMarkers(): string[] {
  return parseRoute(route as string[]).flatMap((item) => (item.kind === 'mark' ? [item.name] : []));
}

/** The game logic at `marker`, or null when the route has no such marker. */
export function playTo(maps: Record<string, GameMap>, marker: string, start: { map: string; spawn: string }): GameLogic | null {
  const items = parseRoute(route as string[]);
  const end = items.findIndex((item) => item.kind === 'mark' && item.name === marker);
  if (end < 0) return null;
  const sim = new Sim(new GameLogic(maps, CONTENT, newGame(maps[start.map]!, start.spawn)));
  // Fights end as won (or, for one meant to be lost, as lost), as tools/sim-setup.ts winBattles plays them.
  sim.onBattle = (id) => {
    const def = battleDef(id);
    if (!def) throw new Error(`No battle "${id}"`);
    const flags = sim.logic.state.flags;
    if (def.meantToLose) {
      recordLoss(flags, def);
      return sim.logic.battleOver(false, def.meantToLose.scene);
    }
    const won = { def, items: battleItems(flags, RPG), outcome: 'won', goldSpent: 0, party: [] } as unknown as Battle;
    settleBattle(flags, RPG, won);
    return sim.logic.battleOver(true);
  };
  if (sim.logic.enterMap().some((e) => e.kind === 'dialogue')) sim.cursor = 0;
  sim.run(items.slice(0, end));
  // A player reaching this point has seen every item popup on the way.
  for (const shown of pendingShowcases(sim.logic.state.flags, RPG)) markShown(sim.logic.state.flags, shown.id);
  return sim.logic;
}
