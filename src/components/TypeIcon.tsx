import type { ElementType } from '../engine/types';

// Shape plus color, so types are readable without relying on color alone.
const SHAPES: Record<ElementType, string> = {
  gale: 'M12 3 L21 19 L3 19 Z',                                   // triangle
  rain: 'M12 2 C12 2 5 11 5 15 A7 7 0 0 0 19 15 C19 11 12 2 12 2 Z', // drop
  sun: 'M12 5 A7 7 0 1 1 11.99 5 Z',                               // circle
  frost: 'M12 2 L21 12 L12 22 L3 12 Z',                            // diamond
  bloom: 'M12 2 L14.5 8 L21 9 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9 L9.5 8 Z', // star
  eclipse: 'M15 3 A9 9 0 1 0 15 21 A7 7 0 1 1 15 3 Z',             // crescent
  aurora: 'M3 17 Q7 5 12 12 T21 7 L21 11 Q17 16 12 15 T3 21 Z',    // ribbon
  calm: 'M4 9 H20 V15 H4 Z',                                       // bar
};

export function TypeIcon({ type, size = 24 }: { type: ElementType; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label={type} role="img">
      <path d={SHAPES[type]} fill="#fff" stroke="rgba(0,0,0,.25)" strokeWidth="1" />
    </svg>
  );
}
