// One page per version; each is served from its own subdomain and
// from a matching path in the same deployment.
export const versions = [
  {
    id: 'books',
    name: 'Books',
    tagline: 'A clothbound stack you pull from',
    note: 'Three.js hardcovers, Stripe Press style',
    path: '/books',
    accent: '#8a7bff',
  },
  {
    id: 'editions',
    name: 'Editions',
    tagline: 'Album covers on a gallery shelf',
    note: 'The Shopify Editions layout, closely',
    path: '/editions',
    accent: '#30ffb4',
  },
  {
    id: 'phone',
    name: 'Phone',
    tagline: 'A device with a turning screen carousel',
    note: 'Rotating 3D ring of app screens',
    path: '/phone',
    accent: '#5cc8ff',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'Fly the helix of every quarter',
    note: 'Editor’s pick — a spiral through time',
    path: '/atlas',
    accent: '#ff9ad2',
  },
];
