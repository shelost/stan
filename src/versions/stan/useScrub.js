import { useEffect, useRef } from 'react';

export const clamp01 = (t) => Math.max(0, Math.min(1, t));
export const smooth = (t) => t * t * (3 - 2 * t);
export const mix = (a, b, t) => a + (b - a) * t;

// map a sub-range of progress to 0..1
export const phase = (p, a, b) => smooth(clamp01((p - a) / (b - a)));

// rAF with a timeout backstop: in a visible tab the frame wins the race
// every time; in a suspended/background tab the timer keeps state moving.
function schedule(fn, delay = 120) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    fn();
  };
  const id = requestAnimationFrame(run);
  const to = setTimeout(run, delay);
  return () => {
    done = true;
    cancelAnimationFrame(id);
    clearTimeout(to);
  };
}

// Scroll-scrubbed sticky scene: the wrapper is taller than the viewport,
// progress runs 0→1 as it passes through, eased toward the target so
// motion stays silky at any scroll speed.
export function useScrub(ref, onProgress, ease = 0.14) {
  const cbRef = useRef(onProgress);
  cbRef.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancel = null;
    let cur = -1;

    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      return clamp01(-r.top / Math.max(r.height - vh, 1));
    };

    const tick = () => {
      cancel = null;
      const t = target();
      if (cur < 0 || reduced) cur = t;
      else {
        cur += (t - cur) * ease;
        if (Math.abs(t - cur) < 0.0005) cur = t;
      }
      cbRef.current(cur);
      if (Math.abs(target() - cur) > 0.0005) cancel = schedule(tick);
    };

    const kick = () => {
      if (!cancel) cancel = schedule(tick);
    };

    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      if (cancel) cancel();
    };
  }, [ref, ease]);
}

// Gentle image parallax for any [data-plx] element: offset follows the
// element's distance from the viewport centre, scaled by its data value.
export function useParallax() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    const els = [...document.querySelectorAll('[data-plx]')];
    if (!els.length) return undefined;
    let cancel = null;

    const render = () => {
      cancel = null;
      const vh = window.innerHeight || 1;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.plx || '0.1');
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        const d = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translateY(${(-d * speed).toFixed(1)}px) scale(${1 + Math.abs(speed) * 1.6})`;
      });
    };

    const kick = () => {
      if (!cancel) cancel = schedule(render);
    };

    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      if (cancel) cancel();
    };
  }, []);
}
