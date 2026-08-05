// Every edition carries three scene fields on top of its content:
//
//   prop       key into the shelf prop vocabulary (src/versions/standard/ShelfProp.jsx).
//              The piece of creator gear that sits beside this edition on the shelf.
//   spotlight  opt-in to the lamp's light pool. `isNew` is lit implicitly, so this
//              flag is for the one or two older editions partnerships wants surfaced.
//   creator    OPTIONAL and currently unset — the forward-looking partnerships hook.
//              Shape: { name: 'Full Name', handle: '@handle' }. When present it
//              renders in the side card and the Learn-more modal; when absent
//              nothing is rendered and no placeholder is substituted.

export const editions = [
  {
    id: 'stanley',
    year: '2026',
    quarter: 'Q2',
    name: 'Stanley',
    icon: 'auto_awesome',
    tone: 'graphite',
    blurb: 'Meet Stanley — the AI creator assistant built into every Stan store.',
    story:
      'Stanley is the first edition that lives inside the store rather than beside it. Ask it to draft a product page, tighten a price, or answer a DM — and it answers in your voice, with your links already attached.',
    highlights: [
      'Themes + Customization',
      'Stanley × Stan Store bridge',
      'Internationalization',
      'AI Store Builder',
      'Custom Domains',
      'Starter plan',
    ],
    shipped: {
      headline: [
        {
          id: 'themes',
          name: 'Themes + Customization',
          icon: 'palette',
          blurb: 'Themes, type, color, and layout that feel like yours.',
        },
        {
          id: 'bridge',
          name: 'Stanley × Store bridge',
          icon: 'hub',
          blurb: 'Draft, price, and reply without leaving the store.',
        },
        {
          id: 'i18n',
          name: 'Internationalization',
          icon: 'public',
          blurb: 'Localized store experiences for creators worldwide.',
        },
        {
          id: 'ai-builder',
          name: 'AI Store Builder',
          icon: 'auto_awesome',
          blurb: 'From a prompt to a working store.',
        },
        {
          id: 'domains',
          name: 'Custom Domains',
          icon: 'language',
          blurb: 'Your Stan store on a domain that is yours.',
        },
        {
          id: 'starter',
          name: 'Starter plan',
          icon: 'rocket_launch',
          blurb: 'A simpler way in for new creators.',
          status: 'Coming soon',
        },
      ],
      supporting: [
        {
          id: 'affiliate',
          name: 'Affiliate Share',
          icon: 'share',
          blurb: 'Cleaner affiliate tracking.',
        },
        {
          id: 'community',
          name: 'Community',
          icon: 'groups',
          blurb: 'Badges and a refreshed members page.',
        },
        {
          id: 'autodm',
          name: 'AutoDM',
          icon: 'chat',
          blurb: 'Replies that keep up when you spike.',
        },
        {
          id: 'email',
          name: 'Email Marketing',
          icon: 'mail',
          blurb: 'Deliverability, analytics, segments.',
        },
        {
          id: 'courses',
          name: 'Courses',
          icon: 'menu_book',
          blurb: 'Polish across build, teach, learn.',
        },
      ],
    },
    url: 'https://stan.store',
    isNew: true,
    prop: 'speaker',
  },
  {
    id: 'creator-os',
    year: '2026',
    quarter: 'Q1',
    name: 'Creator OS',
    icon: 'dashboard',
    tone: 'slate',
    blurb: 'One dashboard for everything you make, sell, and schedule.',
    story:
      'Creator OS pulls analytics, the mobile app, and every connected social into a single place you can run from. Revenue sits at the top. Everything else is one tap away.',
    highlights: [
      'Redesigned analytics with revenue at a glance',
      'A faster mobile app for managing your store anywhere',
      'Connect every social platform in one tap',
    ],
    url: 'https://stan.store',
    prop: 'tablet',
    spotlight: true,
  },
  {
    id: 'storefront',
    year: '2025',
    quarter: 'Q4',
    name: 'Storefront',
    icon: 'storefront',
    tone: 'plum',
    blurb: 'Your link-in-bio, now a full storefront that feels like you.',
    story:
      'Storefront turns the link in your bio into a real shop — themes, fonts, and drag-and-drop blocks for products, media, and links. Preview before you publish. Ship when it feels right.',
    highlights: [
      'New themes with custom fonts and colors',
      'Drag-and-drop blocks for links, products, and media',
      'Instant previews before you publish',
    ],
    url: 'https://stan.store',
    prop: 'dock',
  },
  {
    id: 'classroom',
    year: '2025',
    quarter: 'Q3',
    name: 'Classroom',
    icon: 'school',
    tone: 'clay',
    blurb: 'Courses that are as easy to build as they are to binge.',
    story:
      'Classroom is for courses that feel finished the day you ship them. Drip modules on your schedule, certificates when students finish, and every file type in one upload.',
    highlights: [
      'Drip modules that unlock on your schedule',
      'Completion certificates for your students',
      'Upload once — video, audio, and downloads together',
    ],
    url: 'https://stan.store',
    prop: 'ringlight',
  },
  {
    id: 'booked',
    year: '2025',
    quarter: 'Q2',
    name: 'Booked',
    icon: 'calendar_month',
    tone: 'sage',
    blurb: 'Coaching and calls without the calendar chaos.',
    story:
      'Booked keeps coaching sessions and workshops off the spreadsheet. Calendars sync both ways, reminders cut no-shows, and waitlists fill the seats you leave open.',
    highlights: [
      'Two-way calendar sync for 1:1 sessions',
      'Automatic reminders that cut no-shows',
      'Group workshops with built-in waitlists',
    ],
    url: 'https://stan.store',
    prop: 'headphones',
  },
  {
    id: 'community',
    year: '2025',
    quarter: 'Q1',
    name: 'Community',
    icon: 'groups',
    tone: 'stone',
    blurb: 'Turn followers into members with spaces of their own.',
    story:
      'Community gives your audience a place to stay. Paid memberships, member-only chat, exclusive drops, and welcome flows that run without you babysitting the inbox.',
    highlights: [
      'Paid memberships with monthly perks',
      'Member-only chat and exclusive drops',
      'Welcome flows that run themselves',
    ],
    url: 'https://stan.store',
    prop: 'mic',
    spotlight: true,
  },
  {
    id: 'payday',
    year: '2024',
    quarter: 'Q4',
    name: 'Payday',
    icon: 'payments',
    tone: 'moss',
    blurb: 'Getting paid, minus the paperwork.',
    story:
      'Payday is the money layer: instant bank payouts, invoices in one click, and tax exports that arrive when the year ends — not after a weekend of sorting.',
    highlights: [
      'Instant payouts to your bank',
      'One-click invoices and receipts',
      'Year-end tax exports that just work',
    ],
    url: 'https://stan.store',
    prop: 'notepad',
  },
  {
    id: 'fans',
    year: '2024',
    quarter: 'Q3',
    name: 'Fans',
    icon: 'favorite',
    tone: 'rust',
    blurb: 'Grow your audience — then keep it.',
    story:
      'Fans is the growth edition: email that reacts to what people do, offers with a clock on them, and funnels that carry a first click all the way to checkout.',
    highlights: [
      'Email flows triggered by what fans do',
      'Discount codes and limited-time offers',
      'Funnels from first click to checkout',
    ],
    url: 'https://stan.store',
    prop: 'camera',
  },
  {
    id: 'hello-stan',
    year: '2024',
    quarter: 'Q2',
    name: 'Hello, Stan',
    icon: 'waving_hand',
    tone: 'sand',
    blurb: 'The first edition: your creator store, live in minutes.',
    story:
      'Hello, Stan was the beginning — digital products from a link-in-bio, no website to maintain, no monthly headache. Built for creators from day one, and still the foundation under every edition since.',
    highlights: [
      'Sell digital products from your link-in-bio',
      'No website, no code, no monthly headache',
      'Built for creators from day one',
    ],
    url: 'https://stan.store',
    prop: 'tripod',
  },
];

// The lamp on the shelf lights the newest edition plus anything flagged
// `spotlight`. Everything else sits in the cool ambient of the room.
export const isSpotlit = (edition) => Boolean(edition.isNew || edition.spotlight);
