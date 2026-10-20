// The Sudden Death rounds a table may choose (rules-decisions 93): the printed track from the earliest allowed.
import { ROUND_TRACK, SUDDEN_DEATH_EARLIEST, SUDDEN_DEATH_ROUND } from '../config';

export const SUDDEN_DEATH_CHOICES = Array.from({ length: ROUND_TRACK - SUDDEN_DEATH_EARLIEST + 1 }, (_, i) => SUDDEN_DEATH_EARLIEST + i);
// A stored or typed value, or the standard round when it isn't one of the choices.
export const validSuddenDeath = (n: unknown) =>
  typeof n === 'number' && Number.isInteger(n) && n >= SUDDEN_DEATH_EARLIEST && n <= ROUND_TRACK ? n : SUDDEN_DEATH_ROUND;
