import { useGame } from './state/gameStore';
import { useOnline } from './state/onlineStore';
import { PlayScreen } from './ui/play/PlayScreen';
import { SetupScreen } from './ui/SetupScreen';
import { Lobby } from './ui/OnlineScreens';
import { useEffect } from 'react';
import { audio } from './audio/player';

export default function App() {
  const running = useGame(s => s.runner !== null);
  const online = useOnline(s => s.code !== null);
  // The title music on the menus; the play screen picks its own.
  useEffect(() => { if (!running) audio.music('title'); }, [running]);
  return running ? <PlayScreen /> : online ? <Lobby /> : <SetupScreen />;
}
