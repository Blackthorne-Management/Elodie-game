// Shown positions for every pawn, walked one square at a time toward where the engine says they are,
// so you watch each character travel. Teleports (cards, heirs rising at home) jump straight there.
import { useEffect, useRef, useState } from 'react';
import type { GameState, Pos } from '../../engine/types';
import { samePos } from '../../engine/board';

type Shown = Record<number, Pos | null>;

function lPath(from: Pos, to: Pos): Pos[] {
  const out: Pos[] = [];
  let { x, y } = from;
  while (x !== to.x) { x += Math.sign(to.x - x); out.push({ x, y }); }
  while (y !== to.y) { y += Math.sign(to.y - y); out.push({ x, y }); }
  return out;
}

export function useWalkers(s: GameState, version: number, stepMs: number) {
  const initial = (): Shown => Object.fromEntries(s.players.map(p => [p.id, p.pos ? { ...p.pos } : null]));
  const [shown, setShown] = useState<Shown>(initial);
  const shownRef = useRef<Shown>(shown);
  const queue = useRef<{ id: number; steps: Pos[] }[]>([]);
  const lastSeq = useRef(s.seq);
  const [walking, setWalking] = useState<number | null>(null);

  // When the game changes, queue a walk (or a jump) for every pawn that is somewhere new.
  useEffect(() => {
    const jumped = new Set<number>();
    for (const e of s.log) {
      if (e.seq <= lastSeq.current) continue;
      if (e.player !== undefined && ['teleport', 'succession', 'specter', 'setup'].includes(e.kind)) jumped.add(e.player);
      if (/bridges the gap/.test(e.text) && e.player !== undefined) jumped.add(e.player);
    }
    lastSeq.current = s.seq;
    const queuedTo = (id: number) => queue.current.filter(w => w.id === id).at(-1)?.steps.at(-1) ?? shownRef.current[id];
    for (const p of s.players) {
      const from = queuedTo(p.id);
      const to = p.pos;
      if (!to || !from || jumped.has(p.id) || stepMs === 0) {
        if (!(from && to && samePos(from, to))) {
          queue.current = queue.current.filter(w => w.id !== p.id);
          shownRef.current = { ...shownRef.current, [p.id]: to ? { ...to } : null };
          setShown(shownRef.current);
        }
        continue;
      }
      if (!samePos(from, to)) queue.current.push({ id: p.id, steps: lPath(from, to) });
    }
    if (queue.current.length) setWalking(queue.current[0].id);
  }, [version, s, stepMs]);

  // Advance the front walk one square per tick.
  useEffect(() => {
    if (walking === null) return;
    const t = setInterval(() => {
      const w = queue.current[0];
      if (!w) { setWalking(null); return; }
      const next = w.steps.shift()!;
      shownRef.current = { ...shownRef.current, [w.id]: next };
      setShown(shownRef.current);
      if (!w.steps.length) {
        queue.current.shift();
        setWalking(queue.current[0]?.id ?? null);
      }
    }, Math.max(60, stepMs));
    return () => clearInterval(t);
  }, [walking, stepMs]);

  return { shown, walking };
}
