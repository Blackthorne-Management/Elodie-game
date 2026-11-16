// The table may agree on the Sudden Death round (rules-decisions 93): any square of the printed track from the
// earliest allowed, with the standard round marked. Used when starting a game against bots and when hosting online.
import { SUDDEN_DEATH_ROUND } from '../config';
import { SUDDEN_DEATH_CHOICES } from './suddenDeath';

export function SuddenDeathField({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="field">
      <span>Sudden Death after round</span>
      <div className="seg eight">
        {SUDDEN_DEATH_CHOICES.map(n => (
          <button key={n} type="button" className={value === n ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>
        ))}
      </div>
      <small className="muted small">
        {value === SUDDEN_DEATH_ROUND
          ? `Standard: if no one has claimed the Throne by the end of round ${SUDDEN_DEATH_ROUND}, the richest player wins.`
          : `${value < SUDDEN_DEATH_ROUND ? 'A shorter' : 'A longer'} game than the standard ${SUDDEN_DEATH_ROUND} rounds.`}
      </small>
    </div>
  );
}
