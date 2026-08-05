// Three shelves, three editions each, read top-to-bottom and left-to-right in
// edition order. Three baselines instead of four keeps the eye calm and buys
// every card enough height to stay legible.
//
// A shelf is only as long as the things standing on it — the board is sized by
// its contents plus a fixed overhang — so the lengths vary because the
// groupings vary, not arbitrarily. `shift` then steps each board along, and the
// three right-hand edges land close together so the whole thing reads as one
// piece of furniture rather than three floating planks.
//
// Per shelf
//   shift  distance from the scene's left edge, as a fraction of its width
//   gap    space beneath the board, in shelf units (`--unit`)
//
// Per item
//   depth  'back' | 'mid' | 'front' — drives scale, dim, lift and stacking
//   nudge  extra space to its left, in shelf units, to break items into groups
//   scale  optional override of the depth's default size
//   lean   resting rotation of an edition card, in degrees
//   prop   'left' | 'right' — which side the edition's paired gear sits on
//
// Editions are addressed by id. Anything in `editions` that no slot claims is
// appended to the last shelf by resolveShelves(), so adding an edition can
// never silently drop it out of the scene.
//
// The lamp stands in the middle of the top shelf, between the two editions the
// data marks as spotlit up there, and throws down across the shelves below.

export const SHELVES = [
  {
    id: 'crown',
    shift: 0,
    gap: 0.46,
    items: [
      { kind: 'prop', variant: 'books', depth: 'back' },
      { kind: 'edition', id: 'stanley', depth: 'front', lean: -1.4, prop: 'left' },
      { kind: 'prop', variant: 'lamp', depth: 'mid', nudge: 0.2 },
      { kind: 'edition', id: 'creator-os', depth: 'mid', lean: 1.2, prop: 'right', nudge: 0.2 },
      { kind: 'edition', id: 'storefront', depth: 'back', lean: -1.1, prop: 'right' },
    ],
  },
  {
    id: 'middle',
    shift: 0.14,
    gap: 0.46,
    items: [
      { kind: 'edition', id: 'classroom', depth: 'back', lean: 1.3, prop: 'left' },
      { kind: 'edition', id: 'booked', depth: 'mid', lean: -1.2, prop: 'left' },
      { kind: 'edition', id: 'community', depth: 'front', lean: 1.5, prop: 'right', nudge: 0.2 },
      { kind: 'prop', variant: 'vine', depth: 'back' },
    ],
  },
  {
    id: 'base',
    shift: 0.04,
    gap: 0,
    items: [
      { kind: 'prop', variant: 'mug', depth: 'back' },
      { kind: 'edition', id: 'payday', depth: 'back', lean: 1.1, prop: 'right' },
      { kind: 'edition', id: 'fans', depth: 'mid', lean: -1.3, prop: 'right', nudge: 0.18 },
      { kind: 'edition', id: 'hello-stan', depth: 'back', lean: 1.4, prop: 'right', nudge: 0.18 },
      { kind: 'prop', variant: 'plant', depth: 'mid' },
    ],
  },
];

// Resolves ids against the live edition list and guarantees full coverage.
export function resolveShelves(editions) {
  const byId = new Map(editions.map((edition, index) => [edition.id, { edition, index }]));
  const placed = new Set();

  const shelves = SHELVES.map((shelf) => ({
    ...shelf,
    items: shelf.items.flatMap((item) => {
      if (item.kind !== 'edition') return [item];
      const hit = byId.get(item.id);
      if (!hit) return [];
      placed.add(item.id);
      return [{ ...item, edition: hit.edition, index: hit.index }];
    }),
  }));

  const orphans = editions
    .map((edition, index) => ({ edition, index }))
    .filter(({ edition }) => !placed.has(edition.id))
    .map(({ edition, index }) => ({
      kind: 'edition',
      id: edition.id,
      depth: 'mid',
      lean: 1.2,
      prop: 'right',
      edition,
      index,
    }));

  if (orphans.length) {
    const last = shelves[shelves.length - 1];
    last.items = [...last.items, ...orphans];
  }

  return shelves;
}
