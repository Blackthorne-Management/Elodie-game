import type { ElementType, WeatherType } from './types';
import { TYPE_ADVANTAGE, TYPE_DISADVANTAGE } from '../config';

// The weather wheel: each type beats the next one round.
const BEATS: Record<WeatherType, WeatherType> = {
  gale: 'rain', rain: 'sun', sun: 'frost', frost: 'bloom', bloom: 'gale',
};

const isWeather = (t: ElementType): t is WeatherType => t in BEATS;

export function typeMultiplier(attacker: ElementType, defender: ElementType): number {
  if (attacker === 'calm' || defender === 'calm') return 1;
  if ((attacker === 'eclipse' && defender === 'aurora') ||
      (attacker === 'aurora' && defender === 'eclipse')) return TYPE_ADVANTAGE;
  if (isWeather(attacker) && isWeather(defender)) {
    if (BEATS[attacker] === defender) return TYPE_ADVANTAGE;
    if (BEATS[defender] === attacker) return TYPE_DISADVANTAGE;
  }
  return 1;
}
