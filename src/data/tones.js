// One hue per edition, nine of them, spaced around the wheel so no two
// releases can be confused at a glance. Each keeps the soft pastel family
// but leans into a more distinct personality: violet, sky, rose, peach,
// seafoam, orchid, aqua, coral, indigo.
//
// Every hue is generated from the same five stops — base ~68% lightness,
// soft ~82%, paper ~95%, deep ~32%, wash a translucent room tint — with a
// small saturation trim on the yellows, greens and teals, which read louder
// than violets at equal saturation. That shared recipe is what keeps the
// shelf looking like one pastel set instead of a bag of candy, while still
// giving each release its own identity.
//
//   paper  the sleeve's background — the lightest wash of the hue
//   soft   the highlight end; kickers, bloom, the field's brightest mesh
//   base   the identity colour; dots, CTA fill, the tone halo
//   deep   the shadow end; type on paper, and the darkest mesh stop
//   wash   a translucent tint for ambient room light behind the hero
//
// The sleeve field mixes paper → soft → base → deep, so depth comes out of
// four stops of one hue rather than a second colour.
export const TONES = {
  violet: {
    base: '#a078f0',
    soft: '#d0b8ff',
    deep: '#3d1f8f',
    paper: '#ebe3ff',
    wash: 'rgba(160, 120, 240, 0.24)',
  },
  sky: {
    base: '#6eb8e8',
    soft: '#b3def8',
    deep: '#1f5a82',
    paper: '#e3f2fb',
    wash: 'rgba(110, 184, 232, 0.22)',
  },
  blush: {
    base: '#f078a8',
    soft: '#f8bfd6',
    deep: '#8a2448',
    paper: '#ffe6ef',
    wash: 'rgba(240, 120, 168, 0.22)',
  },
  apricot: {
    base: '#f0b878',
    soft: '#f8ddc0',
    deep: '#8a5520',
    paper: '#ffefd9',
    wash: 'rgba(240, 184, 120, 0.22)',
  },
  mint: {
    base: '#68dcb0',
    soft: '#b4f0d8',
    deep: '#1f7a58',
    paper: '#e0faf0',
    wash: 'rgba(104, 220, 176, 0.22)',
  },
  lilac: {
    base: '#d870f0',
    soft: '#eeb8f8',
    deep: '#6e2088',
    paper: '#f7e4ff',
    wash: 'rgba(216, 112, 240, 0.22)',
  },
  teal: {
    base: '#58d4dc',
    soft: '#b0f0f4',
    deep: '#1a7078',
    paper: '#dff8fa',
    wash: 'rgba(88, 212, 220, 0.22)',
  },
  coral: {
    base: '#f08870',
    soft: '#f8c4b8',
    deep: '#8a3020',
    paper: '#ffe8e1',
    wash: 'rgba(240, 136, 112, 0.22)',
  },
  periwinkle: {
    base: '#7088f0',
    soft: '#b8c4f8',
    deep: '#203088',
    paper: '#e4e8ff',
    wash: 'rgba(112, 136, 240, 0.22)',
  },
};

export const toneOf = (edition) => TONES[edition.tone] ?? TONES.violet;
