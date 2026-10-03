import { useGame } from './state/gameStore';
import { PlayScreen } from './ui/play/PlayScreen';
import { SetupScreen } from './ui/SetupScreen';

export default function App() {
  const running = useGame(s => s.runner !== null);
  return running ? <PlayScreen /> : <SetupScreen />;
}
