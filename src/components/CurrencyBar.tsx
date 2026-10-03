import { useGame } from '../state/store';

export function CurrencyBar() {
  const { sparks } = useGame(s => s.save.currency);
  const crystals = useGame(s => s.save.stormCrystals);
  return (
    <div className="currency">
      <span className="pill spark">✦ {sparks.toLocaleString()} Sparks</span>
      <span className="pill crystal">◆ {crystals} Crystal{crystals === 1 ? '' : 's'}</span>
    </div>
  );
}
