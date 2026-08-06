// Copy voice: benefit-led, title-cased, short. An edition is named by what it
// does for you ("Know Your Revenue"), never by the feature that does it
// ("Revenue analytics"). Supporting lines run two or three clipped sentences
// at most — the artwork and the shelf carry the page, not the prose.
//
// Fields:
//   tagline    the episode-title beat, shown as the kicker above the name
//   blurb      one breath of supporting copy — the reference's "Reach more
//              inboxes. Build a stronger audience."
//   highlights three quick hits. Plain strings, because eight other version
//              pages render them as text (atlas and phone draw them onto a
//              canvas); anything richer belongs in `shipped`.
//   story      the modal's paragraph. Still short.
//   shipped    OPTIONAL richer modal content: headline + supporting items,
//              each { id, name, icon, blurb, status? }. When absent the modal
//              falls back to `highlights`.
//   tone       key into src/data/tones.js — one pastel hue per release.
//   prop       key into the shelf prop vocabulary (src/versions/standard/ShelfProp.jsx).
//              The piece of creator gear that sits beside this edition.
//   spotlight  opt-in to the lamp's light pool. `isNew` is lit implicitly, so
//              this flag is for older editions partnerships wants surfaced.
//   creator    OPTIONAL and currently unset — the forward-looking partnerships
//              hook. Shape: { name: 'Full Name', handle: '@handle' }. When
//              present it renders in the side card and the Learn-more modal;
//              when absent nothing renders and no placeholder is substituted.

export const editions = [
  {
    id: 'stanley',
    year: '2026',
    quarter: 'Q2',
    name: 'Stanley',
    icon: 'auto_awesome',
    tone: 'violet',
    tagline: 'Build Faster with AI',
    // U+2011 non-breaking hyphen: the hero column is narrow enough at most
    // widths that a plain hyphen breaks the word across two lines.
    blurb: 'Work less. Create more. Meet your new co\u2011founder.',
    story:
      'Stanley is the first edition that lives inside the store instead of beside it. Ask for a product page, a sharper price, a reply to a DM — it answers in your voice, with your links already attached.',
    highlights: ['One Prompt, One Store', 'Themes That Feel Like Yours', 'No Borders'],
    shipped: {
      headline: [
        {
          id: 'ai-builder',
          name: 'One Prompt, One Store',
          icon: 'auto_awesome',
          blurb: 'Describe it. Stanley builds it.',
        },
        {
          id: 'themes',
          name: 'Make It Yours',
          icon: 'palette',
          blurb: 'Themes, type, and color that look like you.',
        },
        {
          id: 'i18n',
          name: 'No Borders',
          icon: 'public',
          blurb: 'Sell anywhere. Grow everywhere.',
        },
        {
          id: 'domains',
          name: 'Your Name, Your Domain',
          icon: 'language',
          blurb: 'Point a real domain at your store.',
        },
        {
          id: 'bridge',
          name: 'Stanley Lives Here Now',
          icon: 'hub',
          blurb: 'Draft, price, and reply without leaving.',
        },
        {
          id: 'starter',
          name: 'An Easier Way In',
          icon: 'rocket_launch',
          blurb: 'A starter plan for brand-new creators.',
          status: 'Coming soon',
        },
      ],
      supporting: [
        {
          id: 'affiliate',
          name: 'Share the Upside',
          icon: 'share',
          blurb: 'Cleaner affiliate tracking.',
        },
        {
          id: 'community',
          name: 'Somewhere to Belong',
          icon: 'groups',
          blurb: 'Badges and a refreshed members page.',
        },
        {
          id: 'autodm',
          name: 'Replies That Keep Up',
          icon: 'chat',
          blurb: 'AutoDM holds the line when you spike.',
        },
        {
          id: 'email',
          name: 'Every Email Counts',
          icon: 'mail',
          blurb: 'Reach more inboxes.',
        },
        {
          id: 'courses',
          name: 'Courses, Polished',
          icon: 'menu_book',
          blurb: 'Better to build. Better to finish.',
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
    tone: 'sky',
    tagline: 'Run the Whole Show',
    blurb: 'One dashboard. Everything you make, sell, and schedule.',
    story:
      'Creator OS pulls analytics, the mobile app, and every connected social into one place you can actually run from. Revenue sits at the top. The rest is one tap away.',
    highlights: ['Revenue at a Glance', 'Your Store, In Your Pocket', 'Every Platform, One Tap'],
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
    tone: 'blush',
    tagline: 'The Brand Upgrade',
    blurb: 'Make your storefront unmistakably you.',
    story:
      'Storefront turns a link in your bio into a real shop. Themes, fonts, and drag-and-drop blocks for products, media, and links. Preview it. Then ship it.',
    highlights: ['Themes With Real Type', 'Drag, Drop, Done', 'Preview Before You Publish'],
    url: 'https://stan.store',
    prop: 'dock',
  },
  {
    id: 'classroom',
    year: '2025',
    quarter: 'Q3',
    name: 'Classroom',
    icon: 'school',
    tone: 'apricot',
    tagline: 'Made to Binge',
    blurb: 'Courses as easy to build as they are to finish.',
    story:
      'Classroom is for courses that feel finished the day you ship them. Drip modules on your schedule, certificates at the finish line, and every file type in one upload.',
    highlights: ['Drip on Your Schedule', 'Certificates at the Finish', 'One Upload, Every Format'],
    url: 'https://stan.store',
    prop: 'ringlight',
  },
  {
    id: 'booked',
    year: '2025',
    quarter: 'Q2',
    name: 'Booked',
    icon: 'calendar_month',
    tone: 'mint',
    tagline: 'Never Double-Booked',
    blurb: 'Coaching and calls without the calendar chaos.',
    story:
      'Booked keeps sessions and workshops off the spreadsheet. Calendars sync both ways, reminders cut no-shows, and waitlists fill the seats you leave open.',
    highlights: [
      'Calendars That Sync Both Ways',
      'Reminders That Cut No-Shows',
      'Waitlists That Fill Seats',
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
    tone: 'lilac',
    tagline: 'Members Only',
    blurb: 'Turn followers into members with a place of their own.',
    story:
      'Community gives your audience somewhere to stay. Paid memberships, member-only chat, exclusive drops, and welcome flows that run without you.',
    highlights: [
      'Memberships Worth Paying For',
      'Chat and Drops for Members',
      'Welcome Flows That Run Themselves',
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
    tone: 'teal',
    tagline: 'Know Your Revenue',
    blurb: 'See exactly where your money is coming from.',
    story:
      'Payday is the money layer. Instant payouts to your bank, invoices in one click, and tax exports that land when the year ends — not after a weekend of sorting.',
    highlights: ['Payouts Straight to Your Bank', 'Invoices in One Click', 'Tax, Simplified'],
    url: 'https://stan.store',
    prop: 'notepad',
  },
  {
    id: 'fans',
    year: '2024',
    quarter: 'Q3',
    name: 'Fans',
    icon: 'favorite',
    tone: 'coral',
    tagline: 'Every Email Counts',
    blurb: 'Reach more inboxes. Build a stronger audience.',
    story:
      'Fans is the growth edition. Email that reacts to what people do, offers with a clock on them, and funnels that carry a first click all the way to checkout.',
    highlights: ['Email That Reacts to Fans', 'Offers With a Clock On Them', 'A Better Funnel'],
    url: 'https://stan.store',
    prop: 'camera',
  },
  {
    id: 'hello-stan',
    year: '2024',
    quarter: 'Q2',
    name: 'Hello, Stan',
    icon: 'waving_hand',
    tone: 'periwinkle',
    tagline: 'Where It All Began',
    blurb: 'The first edition. Your store, live in minutes.',
    story:
      'Hello, Stan was the beginning. Digital products from a link in bio, no website to maintain, no monthly headache — and still the foundation under every edition since.',
    highlights: ['A Link in Bio That Sells', 'No Website to Maintain', 'Built for Creators, Day One'],
    url: 'https://stan.store',
    prop: 'tripod',
  },
];

// The lamp on the shelf lights the newest edition plus anything flagged
// `spotlight`. Everything else sits in the cool ambient of the room.
export const isSpotlit = (edition) => Boolean(edition.isNew || edition.spotlight);
