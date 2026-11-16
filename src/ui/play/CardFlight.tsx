// A card being played, shown to everyone: it rises into view large enough to read, with who played it, holds a
// moment, then shrinks down onto the board. Your own cards rise from your hand; rivals' come down from their seats.
import type { Game } from '../../engine/game';
import { CardFrame } from '../CardFrame';
import { Emblem } from './Figures';

export interface Flight { seq: number; card: number; player: number; verb: string; mine: boolean }

export function CardFlight({ g, f, ms }: { g: Game; f: Flight; ms: number }) {
  const p = g.s.players[f.player];
  return (
    <div className={`flight ${f.mine ? 'from-me' : 'from-rival'}`} key={f.seq} style={{ ['--ms' as string]: `${ms}ms` }} aria-live="polite">
      <div className="flight-who"><Emblem house={p.house} size={20} /> {f.mine ? 'You' : p.name} {f.verb}</div>
      <div className="flight-card"><CardFrame card={g.card(f.card)} /></div>
    </div>
  );
}
