// Small shared helpers for The Standard, kept in one place so the app shell,
// the scene and the modal are not each carrying their own copy.

// Every GSAP entrance on the page early-returns through this, so it settles
// straight into its resting state when the visitor has asked the OS for less
// motion. The matching CSS guards live in standard.scss and _shelfscene.scss.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Editions are numbered from 01 wherever their index is shown.
export const num = (index) => String(index + 1).padStart(2, '0');
