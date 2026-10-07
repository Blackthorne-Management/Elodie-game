// How to play: a slideshow to flip through, ending with the way into the full rule guide.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { HouseId } from '../engine/types';
import { PILLARS } from '../engine/types';
import { CONTENT } from '../data';
import { OPENING, SUDDEN_DEATH_ROUND, THRESHOLDS, TUNING } from '../config';
import { BOARD_ART, CATEGORY_ART, HOWTO_ART, PILLAR_ART, UI_ART } from '../assets.config';
import { CardFrame } from './CardFrame';
import { Emblem } from './play/Figures';
import { Rich } from './RulesGuide';

const HOUSE_IDS = Object.keys(CONTENT.houses) as HouseId[];
const card = (id: number) => CONTENT.cards.find(c => c.id === id)!;
const ELODIE = CONTENT.cards.find(c => c.elodie)!;

// --- the pictures

function BoardPic() {
  return (
    <div className="ht-board">
      {BOARD_ART.image ? <img src={BOARD_ART.image} alt="" /> : <div className="ht-board-plain" />}
      <span className="ht-throne-glow" />
    </div>
  );
}

function HousesPic() {
  return (
    <div className="ht-ring">
      <img className="ht-ring-crown" src={UI_ART.crown} alt="" />
      {HOUSE_IDS.map((h, i) => {
        const a = (i / HOUSE_IDS.length) * 2 * Math.PI - Math.PI / 2;
        return <span key={h} style={{ left: `${50 + 38 * Math.cos(a)}%`, top: `${50 + 38 * Math.sin(a)}%` }}><Emblem house={h} size={48} ring /></span>;
      })}
    </div>
  );
}

function MovePic() {
  const C = 34, W = 7, H = 5;
  const path = [[1, 3], [2, 3], [3, 3], [3, 2], [4, 2]];
  const pts = path.map(([x, y]) => `${x * C + C / 2},${y * C + C / 2}`).join(' ');
  return (
    <div className="ht-move">
      <svg viewBox={`0 0 ${W * C} ${H * C}`} aria-hidden>
        {Array.from({ length: W * H }, (_, i) => (
          <rect key={i} x={(i % W) * C} y={Math.floor(i / W) * C} width={C} height={C} fill={(i + Math.floor(i / W)) % 2 ? '#2a2230' : '#231c28'} stroke="#00000055" />
        ))}
        <polyline points={pts} fill="none" stroke="#f3d27a" strokeWidth="4" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" />
        {path.slice(1).map(([x, y], i) => <text key={i} x={x * C + C - 6} y={y * C + 12} fontSize="10" fill="#f3d27a" textAnchor="end">{i + 1}</text>)}
        <circle cx={path[0][0] * C + C / 2} cy={path[0][1] * C + C / 2} r="11" fill="#b03a2e" stroke="#f3d27a" strokeWidth="2.5" />
        <circle cx={4 * C + C / 2} cy={2 * C + C / 2} r="10" fill="none" stroke="#f3d27a" strokeWidth="2" opacity=".7" />
      </svg>
      <span className="ht-die"><img src={UI_ART.actions.roll} alt="" /></span>
    </div>
  );
}

function ResourcesPic() {
  return (
    <div className="ht-pillars">
      {PILLARS.map(x => (
        <span key={x}><img src={PILLAR_ART[x].icon} alt="" /><b>{PILLAR_ART[x].label}</b>
          <small>{x === 'influence' ? 'Court' : x === 'fear' ? 'War' : 'Trade'} tiles</small></span>
      ))}
      <p className="ht-yield"><b>+{TUNING.tileAlone}</b> alone · <b>+{TUNING.tileShared}</b> shared</p>
    </div>
  );
}

function ActionPic() {
  const acts: [string, string][] = [[UI_ART.actions.attack, 'Attack'], [UI_ART.actions.card, 'Play a card'], [UI_ART.actions.trade, 'Offer a trade']];
  return (
    <div className="ht-acts">
      {acts.map(([icon, label], i) => (
        <span key={label} className="ht-act"><img src={icon} alt="" /><b>{label}</b>{i < 2 && <i>or</i>}</span>
      ))}
    </div>
  );
}

function CombatPic() {
  return (
    <div className="ht-fight">
      <span className="ht-fighter"><Emblem house="brasador" size={64} ring /><small>♥♥♥</small></span>
      <span className="ht-clash"><img src={UI_ART.actions.attack} alt="" /><b>3 damage</b></span>
      <span className="ht-fighter"><Emblem house="stillwater" size={64} ring /><small>♥♥<s>♥</s></small></span>
    </div>
  );
}

function CardsPic() {
  return (
    <div className="ht-fan">
      {[card(1), ELODIE, card(121)].map((c, i) => (
        <div key={c.id} className="ht-fan-card" style={{ ['--r' as string]: `${(i - 1) * 9}deg`, ['--x' as string]: `${(i - 1) * 62}%` }}><CardFrame card={c} /></div>
      ))}
    </div>
  );
}

function HeirsPic() {
  return (
    <div className="ht-gens">
      {['I', 'II', 'III', 'IV'].map((g, i) => (
        <span key={g} className="ht-gen-step"><b>{g}</b>{i < 3 && <i>›</i>}</span>
      ))}
      <p><img src={CATEGORY_ART['Ranged / Cursed'].icon} alt="" /> Grudge → Reckoning</p>
    </div>
  );
}

function SpecterPic() {
  return (
    <div className="ht-specter">
      <span className="ht-ghost"><Emblem house="suzumori" size={84} /></span>
      <span className="ht-discard">{[0, 1, 2].map(i => <i key={i} style={{ ['--i' as string]: i }} />)}</span>
    </div>
  );
}

function ThronePic() {
  const n = THRESHOLDS.normal, s = THRESHOLDS.small;
  return (
    <div className="ht-claim">
      <img src={UI_ART.crown} alt="" />
      <div className="ht-need">
        <span><b>{n.combined}</b> total<small>{n.minEach}+ in each pillar · 4–8 players</small></span>
        <span><b>{s.combined}</b> total<small>{s.minEach}+ in each · 2–3 players</small></span>
      </div>
    </div>
  );
}

function SuddenPic() {
  return (
    <div className="ht-sudden">
      <img src={UI_ART.actions.end} alt="" />
      <span><small>Round</small><b>{SUDDEN_DEATH_ROUND}</b></span>
    </div>
  );
}

function EndPic() {
  return UI_ART.logo ? <img className="ht-logo" src={UI_ART.logo} alt="Bloodlines: The Race to Elodie's Grace" /> : <img className="ht-logo" src={UI_ART.crown} alt="" />;
}

// --- the slides

interface Slide { id: string; title: string; pic: () => ReactNode; text: string[] }
const truce = OPENING.truceRounds === 1 ? 'the first round' : `the first ${OPENING.truceRounds} rounds`;
const SLIDES: Slide[] = [
  { id: 'welcome', title: "Elodie's Throne", pic: BoardPic, text: [
    'Eight houses race across the realm for the Throne at its heart.',
    'Gather **Influence**, **Fear** and **Wealth**, then stand on the Throne and **claim it**.'] },
  { id: 'houses', title: 'Your Bloodline', pic: HousesPic, text: [
    'Your house is drawn **by lottery**. Each has its own powers, which grow with every generation.',
    'You don\'t play one hero but a family: when you fall, **your heir rises stronger**.'] },
  { id: 'move', title: 'Roll and Move', pic: MovePic, text: [
    'Roll the die and move **up to** that many squares: up, down, left or right, turning as you like.',
    '**No diagonal steps.** You may stop early or stay put.'] },
  { id: 'resources', title: 'Gather Resources', pic: ResourcesPic, text: [
    `Stop on a house tile to gain its resource: **${TUNING.tileAlone}** if you're alone there, **${TUNING.tileShared}** if shared.`,
    '**Never from your own tile**, and never from the tile you scored from last.'] },
  { id: 'action', title: 'Then One Action', pic: ActionPic, text: [
    'Attack a rival beside you, **or** play a Hand Card, **or** offer a rival a 1-for-1 resource trade they may refuse.',
    'Then draw back up to **3 cards**. House abilities are free extras.'] },
  { id: 'combat', title: 'Combat', pic: CombatPic, text: [
    '**Damage equals your Heart Tokens**, so a wounded fighter hits weaker. Attacking ends your turn.',
    `No attacks during ${truce}, none onto or off the Throne, and new heirs are safe for their first turn.`] },
  { id: 'cards', title: 'The Deck', pic: CardsPic, text: [
    '**Hand Cards** are held (up to 3). **Instants** resolve the moment they\'re drawn; ten are **Elodie** herself.',
    '**Reactions** are played on a rival\'s turn, at the moment printed on them: cancel a move, a card, a trade…'] },
  { id: 'heirs', title: 'Death Makes You Stronger', pic: HeirsPic, text: [
    'When you fall, you lose half of one pool and your **heir rises** at home with every power so far, plus a new one.',
    'Your family holds a **Grudge** against your killer. Kill them back for a **Reckoning**: steal 1.'] },
  { id: 'specter', title: 'The Specter', pic: SpecterPic, text: [
    'When Gen IV falls, your bloodline ends, but you haunt the game as a **Specter**.',
    'Once a round, replay an Instant from the discard pile at any rival. Mischief only: **never damage**.'] },
  { id: 'throne', title: 'Claim the Throne', pic: ThronePic, text: [
    'With enough resources **and** some of every pillar, stand on the Throne and **claim** it.',
    'Every other eligible rival may **challenge**: you fight each in turn. Survive them all and you win.'] },
  { id: 'sudden', title: 'Sudden Death', pic: SuddenPic, text: [
    `If no one has won by the end of **round ${SUDDEN_DEATH_ROUND}**, the highest combined total wins.`,
    'Ties go to the highest pillar, then kills, then Reckonings, then a duel.'] },
  { id: 'ready', title: 'You\'re Ready', pic: EndPic, text: [
    'That\'s the heart of it. The full rule guide covers every rule, every house and all 126 cards.'] },
];

export function HowToPlay({ onClose, onGuide }: { onClose: () => void; onGuide: () => void }) {
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const last = SLIDES.length - 1;
  const go = (n: number) => setI(Math.max(0, Math.min(last, n)));

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI(n => Math.min(last, n + 1));
      if (e.key === 'ArrowLeft') setI(n => Math.max(0, n - 1));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [last, onClose]);

  return (
    <div className="ht" role="dialog" aria-label="How to play">
      <div className="ht-bar">
        <span className="ht-count">{i + 1} / {SLIDES.length}</span>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="ht-viewport"
        onPointerDown={e => { start.current = { x: e.clientX, y: e.clientY }; }}
        onPointerMove={e => { if (start.current) setDrag(e.clientX - start.current.x); }}
        onPointerUp={e => {
          if (!start.current) return;
          const dx = e.clientX - start.current.x, dy = e.clientY - start.current.y;
          start.current = null;
          setDrag(0);
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => { start.current = null; setDrag(0); }}>
        <div className="ht-track" style={{ transform: `translateX(calc(${-i * 100}% + ${drag}px))`, transition: drag ? 'none' : undefined }}>
          {SLIDES.map((s, n) => (
            <section key={s.id} className="ht-slide" aria-hidden={n !== i}>
              <div className="ht-pic frame">{HOWTO_ART[s.id] ? <img className="ht-photo" src={HOWTO_ART[s.id]} alt="" /> : <s.pic />}</div>
              <h2>{s.title}</h2>
              {s.text.map((t, k) => <p key={k}><Rich text={t} /></p>)}
              {s.id === 'ready' && (
                <div className="ht-final">
                  <button type="button" className="big" onClick={onGuide} tabIndex={n === i ? 0 : -1}>Read the full rule guide</button>
                  <button type="button" className="act2" onClick={onClose} tabIndex={n === i ? 0 : -1}>Back to the game</button>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
      <div className="ht-nav">
        <button type="button" className="act2 ht-arrow" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous">‹</button>
        <div className="ht-dots">
          {SLIDES.map((s, n) => <button key={s.id} type="button" className={n === i ? 'on' : ''} onClick={() => go(n)} aria-label={`Slide ${n + 1}: ${s.title}`} />)}
        </div>
        {i < last
          ? <button type="button" className="act2 gold ht-arrow" onClick={() => go(i + 1)} aria-label="Next">›</button>
          : <button type="button" className="act2 gold ht-arrow" onClick={onGuide} aria-label="Read the full rule guide">📜</button>}
      </div>
      <button type="button" className="ht-guide-link" onClick={onGuide}>Full rule guide</button>
    </div>
  );
}
