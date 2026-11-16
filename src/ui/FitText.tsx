// Text that must fit a fixed box (a card's title bar, a name plate): it stays on one line and shrinks until it fits,
// down to `min` of its size, and only then ends in "…". Refits when the box changes size.
import { useLayoutEffect, useRef, type ReactNode } from 'react';

export function FitText({ children, min = 0.62, className = '' }: { children: ReactNode; min?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '';
      const base = parseFloat(getComputedStyle(el).fontSize);
      let size = base;
      while (el.scrollWidth > el.clientWidth + 0.5 && size > base * min) { size -= 0.5; el.style.fontSize = `${size}px`; }
    };
    fit();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(el.parentElement ?? el);
    void document.fonts?.ready.then(fit);
    return () => ro?.disconnect();
  }, [children, min]);
  return <span ref={ref} className={`fit ${className}`}>{children}</span>;
}
