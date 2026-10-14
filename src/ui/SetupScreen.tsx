import { UI_ART } from '../assets.config';
import { useState } from 'react';
import type { TwoPlayerMode } from '../engine/houseChoice';
import { TwoPlayerModeField } from './TwoPlayerMode';
import { useGame } from '../state/gameStore';
import { StatsPanel } from './StatsPanel';
import { HowToPlay } from './HowToPlay';
import { RulesGuide } from './RulesGuide';
import { BUILD } from '../state/history';
import type { HouseId } from '../engine/types';
import { CONTENT } from '../data';
import { Emblem } from './play/Figures';
import { HostPanel, JoinPanel } from './OnlineScreens';
import { savedOnline, useOnline } from '../state/onlineStore';

const HOUSE_IDS = Object.keys(CONTENT.houses) as HouseId[];
const stored = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };

export function SetupScreen() {
  const start = useGame(s => s.start);
  const resume = useGame(s => s.resume);
  const hasSave = useGame(s => s.hasSave)();
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('tob-name') ?? ''; } catch { return ''; }
  });
  const [players, setPlayers] = useState(4);
  const [rules, setRules] = useState<null | 'howto' | 'guide'>(null);
  // Houses: the lottery, or (playing solo) pick your own; the bots draw blind from the rest.
  const [picking, setPicking] = useState(() => stored('tob-house-mode') === 'pick');
  const [pick, setPick] = useState<HouseId | null>(() => {
    const h = stored('tob-house') as HouseId | null;
    return h && HOUSE_IDS.includes(h) ? h : null;
  });
  const joinCode = typeof location !== 'undefined' ? (new URLSearchParams(location.search).get('join') ?? '') : '';
  const [mode, setMode] = useState<'solo' | 'host' | 'join'>(joinCode ? 'join' : 'solo');
  const [twoMode, setTwoMode] = useState<TwoPlayerMode>(() => (stored('tob-two-mode') === 'battle' ? 'battle' : 'race'));
  const chooseTwoMode = (m: TwoPlayerMode) => { setTwoMode(m); try { localStorage.setItem('tob-two-mode', m); } catch { /* ignore */ } };
  const resumeOnline = useOnline(s => s.resume);
  const onlineGame = savedOnline();
  const notice = useGame(s => s.notice);
  const dismissNotice = useGame(s => s.dismissNotice);

  function begin() {
    try {
      localStorage.setItem('tob-name', name);
      localStorage.setItem('tob-house-mode', picking ? 'pick' : 'lottery');
      if (pick) localStorage.setItem('tob-house', pick);
    } catch { /* ignore */ }
    start(name, players, picking ? pick : null, twoMode);
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
      {onlineGame && <button type="button" className="big" onClick={() => resumeOnline()}>Return to online game {onlineGame.code}</button>}

      <div className="seg mode-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'solo'} className={mode === 'solo' ? 'on' : ''} onClick={() => setMode('solo')}>Solo</button>
        <button type="button" role="tab" aria-selected={mode === 'host'} className={mode === 'host' ? 'on' : ''} onClick={() => setMode('host')}>Host a game</button>
        <button type="button" role="tab" aria-selected={mode === 'join'} className={mode === 'join' ? 'on' : ''} onClick={() => setMode('join')}>Join a game</button>
      </div>

      <section className="panel-card frame">
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={e => { setName(e.target.value); try { localStorage.setItem('tob-name', e.target.value); } catch { /* ignore */ } }}
            placeholder={mode === 'solo' ? 'Optional: your house name is used' : 'Your name for the table'} maxLength={16} />
        </label>
        {mode === 'host' && <HostPanel name={name} />}
        {mode === 'join' && <JoinPanel name={name} code0={joinCode.toUpperCase()} />}
        {mode === 'solo' && <>
        <div className="field">
          <span>Players (you + {players - 1} bot{players === 2 ? '' : 's'})</span>
          <div className="seg eight">
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <button key={n} type="button" className={players === n ? 'on' : ''} onClick={() => setPlayers(n)}>{n}</button>
            ))}
          </div>
        </div>
        {players === 2 && <TwoPlayerModeField value={twoMode} onChange={chooseTwoMode} />}
        <div className="field">
          <span>Houses</span>
          <div className="seg">
            <button type="button" className={!picking ? 'on' : ''} onClick={() => setPicking(false)}>Lottery</button>
            <button type="button" className={picking ? 'on' : ''} onClick={() => setPicking(true)}>Pick my house</button>
          </div>
        </div>
        {picking && (
          <div className="house-pick" role="radiogroup" aria-label="Your house">
            {HOUSE_IDS.map(h => {
              const d = CONTENT.houses[h];
              return (
                <button key={h} type="button" role="radio" aria-checked={pick === h} className={pick === h ? 'on' : ''} onClick={() => setPick(h)}>
                  <Emblem house={h} size={36} ring />
                  <span><b>{d.name.replace('House ', '')}</b><small>{d.identity}</small></span>
                </button>
              );
            })}
          </div>
        )}
        <p className="muted small">
          {picking
            ? `You pick; the bots draw the other houses blind${players === 2 && twoMode === 'battle' ? ' (in Battle, the die gives the bot a house next to yours: 1–3 anticlockwise, 4–6 clockwise)' : ''}. At a table, picking needs every player to agree, and a dice roll decides who picks first.`
            : 'Houses are drawn blind. Unclaimed house tiles are free for anyone to farm.'}
        </p>
        <button type="button" className="big" disabled={picking && !pick} onClick={begin}>{hasSave ? 'Start a new game' : 'Begin'}</button>
        </>}
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
