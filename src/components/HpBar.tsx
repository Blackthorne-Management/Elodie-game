export function HpBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const level = pct > 50 ? 'high' : pct > 20 ? 'mid' : 'low';
  return (
    <div className="hpbar" role="meter" aria-valuemin={0} aria-valuemax={maxHp} aria-valuenow={hp}>
      <div className={`hpbar-fill ${level}`} style={{ width: `${pct}%` }} />
      <span className="hpbar-text">{hp}/{maxHp}</span>
    </div>
  );
}
