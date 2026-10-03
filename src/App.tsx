import { useGame } from './state/gameStore';
import { GameScreen } from './ui/GameScreen';
import { SetupScreen } from './ui/SetupScreen';

export default function App() {
  const running = useGame(s => s.runner !== null);
  return running ? <GameScreen /> : <SetupScreen />;
}
