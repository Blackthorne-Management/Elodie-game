// Two players choose Race or Battle (rules-decisions 82): solo against a bot, or when hosting a 2-player game.
import type { TwoPlayerMode } from '../engine/houseChoice';
import { TWO_PLAYER_MODES } from '../data/rules';

export function TwoPlayerModeField({ value, onChange }: { value: TwoPlayerMode; onChange: (m: TwoPlayerMode) => void }) {
  return (
    <div className="field">
      <span>Two-player game</span>
      <div className="seg">
        {(['race', 'battle'] as const).map(m => (
          <button key={m} type="button" className={value === m ? 'on' : ''} onClick={() => onChange(m)}>{TWO_PLAYER_MODES[m].name}</button>
        ))}
      </div>
      <small className="muted small">{TWO_PLAYER_MODES[value].short}</small>
    </div>
  );
}
