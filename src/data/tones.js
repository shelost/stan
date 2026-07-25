// One hue per edition, all drawn from a cool violet family so the nine
// sit together. Muted on purpose — the bright purple is reserved for
// the interface highlight.
export const TONES = {
  graphite: { base: '#6355ff', soft: '#8a80ff', paper: '#e9e7ff' },
  slate: { base: '#5a6480', soft: '#78829c', paper: '#e7eaf1' },
  plum: { base: '#6f5478', soft: '#8c6f95', paper: '#efe7f2' },
  clay: { base: '#8a6a86', soft: '#a486a0', paper: '#f2e9f1' },
  sage: { base: '#5f7480', soft: '#7d919c', paper: '#e8eef1' },
  stone: { base: '#6e6b80', soft: '#8b889c', paper: '#eceafa' },
  moss: { base: '#586b6e', soft: '#75888b', paper: '#e7eeef' },
  rust: { base: '#7d5f7a', soft: '#9a7c96', paper: '#f0e8ef' },
  sand: { base: '#7a7290', soft: '#968fa9', paper: '#eeebf7' },
};

export const toneOf = (edition) => TONES[edition.tone] ?? TONES.stone;
