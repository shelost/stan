// One hue per edition, all drawn from a cool violet family so the nine
// sit together. Muted on purpose — the bright purple is reserved for
// the interface highlight.
//
// `deep` is the shadow end of each hue. The sleeve field mixes paper →
// soft → base → deep to get depth out of a two-colour palette.
export const TONES = {
  graphite: { base: '#6355ff', soft: '#8a80ff', deep: '#2a1f7a', paper: '#eceaff' },
  slate: { base: '#5a6480', soft: '#8f9ab8', deep: '#242c44', paper: '#e9edf6' },
  plum: { base: '#7d5a88', soft: '#a888b2', deep: '#3a2246', paper: '#f2e9f6' },
  clay: { base: '#96718d', soft: '#c197b8', deep: '#4a2b45', paper: '#f7ecf3' },
  sage: { base: '#5f7f8a', soft: '#8fadb8', deep: '#223a44', paper: '#e8f0f3' },
  stone: { base: '#6e6b86', soft: '#9b98b4', deep: '#2e2b44', paper: '#eeecfa' },
  moss: { base: '#547073', soft: '#87a3a5', deep: '#1f3437', paper: '#e7f0f0' },
  rust: { base: '#8a5f72', soft: '#b78e9d', deep: '#432434', paper: '#f6eaef' },
  sand: { base: '#7c7398', soft: '#a79fc3', deep: '#332c4e', paper: '#f0edfa' },
};

export const toneOf = (edition) => TONES[edition.tone] ?? TONES.stone;
