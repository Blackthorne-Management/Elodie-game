import { useState } from 'react';
import { BattleScreen } from './screens/BattleScreen';
import { demoBattle } from './state/demoBattle';
import { makeRng } from './engine/rng';

// Milestone 4: the app opens straight into a practice battle.
// A screen switch in the store replaces this once the Dungeon map exists.
export default function App() {
  const [fight, setFight] = useState(() => newFight());
  return <BattleScreen key={fight.id} initial={fight.battle} rng={fight.rng} onFinish={() => setFight(newFight())} />;
}

function newFight() {
  const seed = Date.now() >>> 0;
  const rng = makeRng(seed);
  return { id: seed, rng, battle: demoBattle(rng) };
}
