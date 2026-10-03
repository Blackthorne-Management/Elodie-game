import type { Screen } from '../state/store';

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: 'home', label: 'Climb', icon: 'M12 3 L21 20 H3 Z' },
  { id: 'team', label: 'Team', icon: 'M8 11 A3.5 3.5 0 1 1 8 4 A3.5 3.5 0 1 1 8 11 Z M16 11 A3.5 3.5 0 1 1 16 4 A3.5 3.5 0 1 1 16 11 Z M2 20 Q8 12 14 20 Z M10 20 Q16 12 22 20 Z' },
  { id: 'settings', label: 'Settings', icon: 'M12 8 A4 4 0 1 1 12 16 A4 4 0 1 1 12 8 Z M11 2 H13 V6 H11 Z M11 18 H13 V22 H11 Z M2 11 H6 V13 H2 Z M18 11 H22 V13 H18 Z' },
];

export function TabBar({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return (
    <nav className="tabbar">
      {TABS.map(t => (
        <button key={t.id} type="button" className={screen === t.id ? 'active' : ''} onClick={() => go(t.id)}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d={t.icon} fill="currentColor" /></svg>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
