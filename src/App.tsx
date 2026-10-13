import { useGame } from './state/gameStore';
import { useOnline } from './state/onlineStore';
import { PlayScreen } from './ui/play/PlayScreen';
import { SetupScreen } from './ui/SetupScreen';
import { Lobby } from './ui/OnlineScreens';

export default function App() {
  const running = useGame(s => s.runner !== null);
  const online = useOnline(s => s.code !== null);
  return running ? <PlayScreen /> : online ? <Lobby /> : <SetupScreen />;
}
