// Muted, editorial hues — one per edition. Desaturated on purpose so the
// nine read as a considered set rather than a colour wheel.
export const TONES = {
  graphite: { base: '#3f3f39', soft: '#5a5a52', paper: '#e8e7e2' },
  clay: { base: '#a06249', soft: '#b87d63', paper: '#f0e7e1' },
  sage: { base: '#6b7d64', soft: '#87977f', paper: '#e8ece5' },
  slate: { base: '#57687a', soft: '#748496', paper: '#e5e9ed' },
  sand: { base: '#a98d64', soft: '#c0a681', paper: '#f0ebe0' },
  plum: { base: '#6a5364', soft: '#856c80', paper: '#ebe5ea' },
  moss: { base: '#55624b', soft: '#707d64', paper: '#e7eae2' },
  rust: { base: '#94583d', soft: '#ac7157', paper: '#f0e5df' },
  stone: { base: '#77776f', soft: '#93938a', paper: '#eaeae6' },
};

export const toneOf = (edition) => TONES[edition.tone] ?? TONES.stone;
