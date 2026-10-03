import { useRef } from 'react';
import { useGame } from '../state/store';
import { floorInfo, regionStart } from '../engine/floors';
import { sparksForFloor } from '../engine/rewards';
import { REGION_NAMES } from '../data/regions';
import { BOSSES } from '../data/bosses';
import { CurrencyBar } from '../components/CurrencyBar';
import { FLOORS_PER_REGION } from '../config';

const KIND_LABEL = { normal: '', miniBoss: 'Mini-boss', regionBoss: 'Region boss' } as const;

export function HomeScreen() {
  const save = useGame(s => s.save);
  const update = useGame(s => s.update);
  const startFloor = useGame(s => s.startFloor);
  const toast = useGame(s => s.toast);
  const dismissToast = useGame(s => s.dismissToast);
  const taps = useRef<number[]>([]);

  const next = save.highestFloor + 1;
  const info = floorInfo(next);
  const start = regionStart(next);
  const floors = Array.from({ length: FLOORS_PER_REGION }, (_, i) => start + i);
  const boss = BOSSES.find(b => b.region === info.region);
  const bossName = info.kind === 'regionBoss' ? (boss?.name ?? 'a Great Skyling') : null;

  // Hidden debug menu: tap the title 5 times within 2 seconds.
  function titleTap() {
    const now = Date.now();
    taps.current = [...taps.current.filter(t => now - t < 2000), now];
    if (taps.current.length < 5) return;
    taps.current = [];
    const answer = prompt('Debug: type a floor to jump to, or "sparks" for +5000 Sparks');
    if (!answer) return;
    if (answer.trim() === 'sparks') update(s => ({ ...s, currency: { ...s.currency, sparks: s.currency.sparks + 5000 } }));
    else if (Number(answer) >= 1) update(s => ({ ...s, highestFloor: Math.floor(Number(answer)) - 1 }));
  }

  return (
    <div className="page">
      <h1 className="title" onClick={titleTap}>Elodie, Keeper of Skies</h1>
      <CurrencyBar />

      {toast && (
        <button type="button" className="toast" onClick={dismissToast}>
          {toast}
          <span className="toast-x" aria-label="Dismiss">×</span>
        </button>
      )}

      <section className="region" style={{ background: `var(--${info.region === 'eye' ? 'eclipse' : info.region})` }}>
        <div className="region-act">{info.endless ? 'Endless Storm' : `Act ${info.act}`}</div>
        <h2>{REGION_NAMES[info.region]}</h2>
      </section>

      <div className="floors">
        {floors.map(f => {
          const fi = floorInfo(f);
          const cleared = f <= save.highestFloor;
          const isNext = f === next;
          return (
            <button
              key={f}
              type="button"
              className={`floor ${fi.kind} ${cleared ? 'cleared' : ''} ${isNext ? 'next' : ''}`}
              disabled={!cleared && !isNext}
              onClick={() => startFloor(f)}
              aria-label={`Floor ${f}${KIND_LABEL[fi.kind] ? `, ${KIND_LABEL[fi.kind]}` : ''}${cleared ? ', cleared' : ''}`}
            >
              {fi.kind === 'regionBoss' ? '★' : fi.kind === 'miniBoss' ? '◆' : f}
            </button>
          );
        })}
      </div>
      <p className="hint">Tap a cleared floor to replay it for half the Sparks.</p>

      <button type="button" className="big climb" onClick={() => startFloor(next)}>
        <span>Climb to floor {next}</span>
        <small>
          {bossName ? `Boss: ${bossName}` : KIND_LABEL[info.kind] || `Enemies level ${info.enemyLevel}`}
          {' · '}+{sparksForFloor(next)} Sparks
        </small>
      </button>
    </div>
  );
}
