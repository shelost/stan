// Small shared helpers for The Standard, kept in one place so the app shell,
// the scene and the modal are not each carrying their own copy.

import { useEffect, useState } from 'react';

// Every GSAP entrance on the page early-returns through this, so it settles
// straight into its resting state when the visitor has asked the OS for less
// motion. The matching CSS guards live in standard.scss and _shelfscene.scss.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Editions are numbered from 01 wherever their index is shown.
export const num = (index) => String(index + 1).padStart(2, '0');

// Subscribes to a media query. The scene uses it to swap in a narrower shelf
// arrangement on phones — a layout change, not a style change, so it has to be
// decided in JS rather than CSS. Initialised from the real match so the first
// paint is already correct and no reflow flashes the wrong composition.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
