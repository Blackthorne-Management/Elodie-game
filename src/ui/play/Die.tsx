// A die face drawn by the game (always the right number of pips).
const PIPS: Record<number, number[]> = {   // cells of a 3x3 grid, 0-8
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};

export function Die({ n }: { n: number }) {
  const on = PIPS[n] ?? [];
  return (
    <span className="die" role="img" aria-label={`Rolled ${n}`}>
      {Array.from({ length: 9 }, (_, i) => <span key={i} className={on.includes(i) ? 'pip' : ''} />)}
    </span>
  );
}
