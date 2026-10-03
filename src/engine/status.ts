import type { Combatant, StatusInstance } from './damage';
import type { StatusId } from './types';

export function addStatus(c: Combatant, id: StatusId, turns: number, value?: number): boolean {
  if (id === 'freeze' && c.freezeImmune > 0) return false;
  const existing = c.statuses.find(s => s.id === id);
  if (existing) {                       // refresh, never stack
    existing.turns = Math.max(existing.turns, turns);
    if (value !== undefined) existing.value = Math.max(existing.value ?? 0, value);
  } else {
    c.statuses.push({ id, turns, value });
  }
  return true;
}

export function takeStatus(c: Combatant, id: StatusId): StatusInstance | undefined {
  const i = c.statuses.findIndex(s => s.id === id);
  return i >= 0 ? c.statuses.splice(i, 1)[0] : undefined;
}

// Shields soak damage first. Returns the HP actually lost.
export function absorb(c: Combatant, amount: number): number {
  const shield = c.statuses.find(s => s.id === 'shield');
  if (shield?.value) {
    const soaked = Math.min(shield.value, amount);
    shield.value -= soaked;
    amount -= soaked;
    if (shield.value <= 0) takeStatus(c, 'shield');
  }
  c.hp = Math.max(0, c.hp - amount);
  return amount;
}
