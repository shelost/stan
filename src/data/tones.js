// One hue per edition, all drawn from pastel space at matched saturation
// and lightness so the nine sit together as a family. Muted on purpose —
// the bright purple is reserved for the interface highlight.
//
// `deep` is the shadow end of each hue. The sleeve field mixes paper →
// soft → base → deep to get depth out of a two-colour palette.
export const TONES = {
  graphite: { base: '#5c4c9f', soft: '#8a80c8', deep: '#2a1f5a', paper: '#ece9f6' },
  slate: { base: '#4f7ec2', soft: '#7da3d8', deep: '#1e3a5f', paper: '#e8eff8' },
  plum: { base: '#c05d90', soft: '#d989b0', deep: '#5a1f45', paper: '#f5e9f0' },
  clay: { base: '#cf7154', soft: '#e39b80', deep: '#71301f', paper: '#fcece5' },
  sage: { base: '#4e9c77', soft: '#83c0a2', deep: '#1e4d38', paper: '#e6f3ed' },
  stone: { base: '#5a7a8f', soft: '#8fa5bf', deep: '#1f3447', paper: '#e9f1f6' },
  moss: { base: '#6b8b6e', soft: '#9db8a0', deep: '#273b2c', paper: '#eef3f0' },
  rust: { base: '#c65868', soft: '#de8b96', deep: '#6e2430', paper: '#fbe8ea' },
  sand: { base: '#d4a558', soft: '#e5c791', deep: '#6b4f1f', paper: '#faf5eb' },
};

export const toneOf = (edition) => TONES[edition.tone] ?? TONES.graphite;
