// "Claim at 9 total, with 2+ in every pillar" (and the one-pillar route, when the settings allow it).
export function claimGoal(t: { combined: number; minEach: number; single: number }) {
  const total = `${t.combined} total${t.minEach ? `, with ${t.minEach}+ in every pillar` : ''}`;
  return Number.isFinite(t.single) ? `${total}, or ${t.single} in one` : total;
}
