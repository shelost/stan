// One hue per edition, nine of them, spaced around the wheel so no two
// releases can be confused at a glance: violet, sky, blush, apricot, mint,
// lilac, teal, coral, periwinkle.
//
// Every hue is generated from the same four stops — base 70% lightness, soft
// 84%, paper 96%, deep 34% — with a small saturation trim on the yellows,
// greens and teals, which read louder than violets at equal saturation. That
// shared recipe is what keeps the shelf looking like one pastel set instead of
// a bag of candy, while still giving each release its own identity.
//
//   paper  the sleeve's background — the lightest wash of the hue
//   soft   the highlight end; kickers, bloom, the field's brightest mesh
//   base   the identity colour; dots, CTA fill, the tone halo
//   deep   the shadow end; type on paper, and the darkest mesh stop
//
// The sleeve field mixes paper → soft → base → deep, so depth comes out of
// four stops of one hue rather than a second colour.
export const TONES = {
  violet: { base: '#9d7de8', soft: '#c9b6f6', deep: '#432687', paper: '#f2edfc' },
  sky: { base: '#80bde5', soft: '#b8dcf4', deep: '#2a6084', paper: '#eef6fc' },
  blush: { base: '#e77ea5', soft: '#f5b7ce', deep: '#86284a', paper: '#fcedf3' },
  apricot: { base: '#e3b382', soft: '#f4d6b9', deep: '#82572b', paper: '#fcf5ee' },
  mint: { base: '#82e3bc', soft: '#b9f4dc', deep: '#2b825f', paper: '#eefcf6' },
  lilac: { base: '#d27ee7', soft: '#e9b7f5', deep: '#732886', paper: '#f9edfc' },
  teal: { base: '#82dde3', soft: '#b9f0f4', deep: '#2b7c82', paper: '#eefbfc' },
  coral: { base: '#e78c7e', soft: '#f5bfb7', deep: '#863428', paper: '#fcefed' },
  periwinkle: { base: '#7e90e7', soft: '#b7c2f5', deep: '#283786', paper: '#edf0fc' },
};

export const toneOf = (edition) => TONES[edition.tone] ?? TONES.violet;
