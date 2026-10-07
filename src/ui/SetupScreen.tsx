import { UI_ART } from '../assets.config';
import { useState } from 'react';
import { useGame } from '../state/gameStore';
import { StatsPanel } from './StatsPanel';
import { HowToPlay } from './HowToPlay';
import { RulesGuide } from './RulesGuide';
import { BUILD } from '../state/history';

export function SetupScreen() {
  const start = useGame(s => s.start);
  const resume = useGame(s => s.resume);
  const hasSave = useGame(s => s.hasSave)();
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('tob-name') ?? ''; } catch { return ''; }
  });
  const [players, setPlayers] = useState(4);
  const [rules, setRules] = useState<null | 'howto' | 'guide'>(null);
  const notice = useGame(s => s.notice);
  const dismissNotice = useGame(s => s.dismissNotice);

  function begin() {
    try { localStorage.setItem('tob-name', name); } catch { /* ignore */ }
    start(name, players);
  }

  return (
    <main className="setup">
      {UI_ART.logo
        ? <h1 className="logo-art"><img src={UI_ART.logo} alt="Bloodlines: The Race to Elodie's Grace" /></h1>
        : (
          <h1 className="logo-type">
            <span className="setup-crest" aria-hidden><img src={UI_ART.crown} alt="" /></span>
            <span className="logo-name">Bloodlines</span>
            <span className="logo-sub">The Race to Elodie's Grace</span>
          </h1>
        )}
      <p className="tagline">Eight houses. One throne. Every death makes your bloodline stronger.</p>

      {notice && <button type="button" className="notice" onClick={dismissNotice}>{notice} <span aria-hidden>✕</span></button>}
      {hasSave && <button type="button" className="big" onClick={() => resume()}>Continue your game</button>}

      <section className="panel-card frame">
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Optional: your house name is used" maxLength={16} />
        </label>
        <div className="field">
          <span>Players (you + {players - 1} bot{players === 2 ? '' : 's'})</span>
          <div className="seg eight">
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <button key={n} type="button" className={players === n ? 'on' : ''} onClick={() => setPlayers(n)}>{n}</button>
            ))}
          </div>
        </div>
        <p className="muted small">Houses are drawn by lottery. Unclaimed house tiles are free for anyone to farm.</p>
        <button type="button" className="big" onClick={begin}>{hasSave ? 'Start a new game' : 'Begin'}</button>
      </section>

      <StatsPanel />

      <div className="setup-rules">
        <button type="button" className="act2 gold" onClick={() => setRules('howto')}>How to play</button>
        <button type="button" className="act2" onClick={() => setRules('guide')}>Full rule guide</button>
      </div>
      {rules === 'howto' && <HowToPlay onClose={() => setRules(null)} onGuide={() => setRules('guide')} />}
      {rules === 'guide' && <RulesGuide onClose={() => setRules(null)} />}
      <p className="muted small">Build {BUILD}</p>
    </main>
  );
}
