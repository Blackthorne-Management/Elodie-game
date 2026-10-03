import { useGame } from './state/store';
import { BattleScreen } from './screens/BattleScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TeamScreen } from './screens/TeamScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TabBar } from './components/TabBar';
import { floorInfo } from './engine/floors';

const KIND = { normal: '', miniBoss: ' · Mini-boss', regionBoss: ' · Region boss' } as const;

// No router: the store holds the current screen.
export default function App() {
  const screen = useGame(s => s.screen);
  const go = useGame(s => s.go);
  const fight = useGame(s => s.fight);
  const finishFight = useGame(s => s.finishFight);
  const fast = useGame(s => s.save.settings.battleSpeed === 2);
  const update = useGame(s => s.update);

  if (screen === 'battle' && fight) {
    return (
      <BattleScreen
        key={fight.id}
        initial={fight.battle}
        rng={fight.rng}
        title={`Floor ${fight.floor}${KIND[floorInfo(fight.floor).kind]}`}
        initialFast={fast}
        onSpeedChange={f => update(s => ({ ...s, settings: { ...s.settings, battleSpeed: f ? 2 : 1 } }))}
        onFinish={finishFight}
      />
    );
  }

  return (
    <div className="app">
      <main className="content">
        {screen === 'team' ? <TeamScreen /> : screen === 'settings' ? <SettingsScreen /> : <HomeScreen />}
      </main>
      <TabBar screen={screen} go={go} />
    </div>
  );
}
