import { useEffect, useRef, useState } from 'react';

const IMG = (id, w = 1800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const PHOTOS = {
  hero: IMG('photo-1506863530036-1efeddceb993', 2400),
  stanley: IMG('photo-1610716632424-4d45990bcd48'),
  store: IMG('photo-1664277497095-424e085175e8'),
  cardStanley: IMG('photo-1616412875447-096e932d893c', 1200),
  cardStore: IMG('photo-1624717369095-ebacc7d68a40', 1200),
  cardEditions: IMG('photo-1673767298248-b128f17f89af', 1200),
  manifesto: IMG('photo-1453396450673-3fe83d2db2c4', 2400),
  storyA: IMG('photo-1594751684241-bcef815d5a57', 1000),
  storyB: IMG('photo-1507126117511-e87526de90e2', 1000),
  storyC: IMG('photo-1542190891-2093d38760f2', 1000),
};

// reveal-on-scroll: adds .is-in once, well before centre so it feels quick
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const MARQUEE = ['Build your own', 'Own your work', 'Keep the upside', 'Start today'];

const LINEUP = [
  {
    id: 'stanley',
    kicker: 'AI head of content',
    name: 'Stanley',
    line: 'The teammate who works while you sleep.',
    photo: PHOTOS.cardStanley,
    href: '/chat',
  },
  {
    id: 'store',
    kicker: 'The all-in-one creator store',
    name: 'Store',
    line: 'Everything you sell, one link.',
    photo: PHOTOS.cardStore,
    href: 'https://stan.store',
  },
  {
    id: 'editions',
    kicker: 'Everything new, every quarter',
    name: 'Editions',
    line: 'The record of what shipped.',
    photo: PHOTOS.cardEditions,
    href: '/editions',
  },
];

const STORIES = [
  {
    photo: PHOTOS.storyA,
    kicker: 'Start',
    head: 'First follower to first sale',
    copy: 'You don’t need a million fans. You need one person who cares, and a place to send them.',
  },
  {
    photo: PHOTOS.storyB,
    kicker: 'Work',
    head: 'The studio is wherever you are',
    copy: 'A phone, an idea, and an hour before work. Every catalogue started smaller than yours.',
  },
  {
    photo: PHOTOS.storyC,
    kicker: 'Ship',
    head: 'Done beats perfect',
    copy: 'Put it up. Price it. Let the audience tell you what to make next.',
  },
];

export default function StanApp() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="brand">
      <p className="strip">
        <span>Free to start</span>
        <i />
        <span>No code, no gatekeepers</span>
        <i />
        <span>stan.store</span>
      </p>

      <header className={`bnav${scrolled ? ' bnav--scrolled' : ''}`}>
        <a className="bnav__logo" href="#top" aria-label="Stan">
          Stan
        </a>
        <nav className="bnav__links">
          <a href="#stanley">Stanley</a>
          <a href="#store">Store</a>
          <a href="#lineup">Lineup</a>
          <a href="#stories">Stories</a>
        </nav>
        <div className="bnav__cta">
          <a className="pill pill--ghost" href="/">
            Editions
          </a>
          <a className="pill pill--ink" href="https://stan.store" target="_blank" rel="noreferrer">
            Start for free
          </a>
        </div>
      </header>

      <main id="top">
        {/* ---- hero ---- */}
        <section className="hero" ref={heroRef}>
          <div className="hero__media">
            <img src={PHOTOS.hero} alt="A creator at work in dramatic light" />
          </div>
          <div className="hero__scrim" />
          <div className="hero__body">
            <p className="hero__eyebrow">Stan — for the ones who make</p>
            <h1 className="hero__title" aria-label="Build your own">
              <span>
                <em>Build</em>
              </span>
              <span>
                <em>Your</em>
              </span>
              <span>
                <em>Own</em>
              </span>
            </h1>
            <p className="hero__sub">Your audience. Your work. Your terms.</p>
            <div className="hero__actions">
              <a className="pill pill--bone" href="https://stan.store" target="_blank" rel="noreferrer">
                Start for free
              </a>
              <a className="pill pill--line" href="#stanley">
                Meet Stanley
              </a>
            </div>
          </div>
        </section>

        {/* ---- marquee ---- */}
        <div className="marq" aria-hidden="true">
          <div className="marq__track">
            {[0, 1].map((n) => (
              <div className="marq__set" key={n}>
                {MARQUEE.map((m) => (
                  <span key={m}>
                    {m}
                    <b>✦</b>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---- stanley ---- */}
        <section className="feat" id="stanley">
          <div className="feat__media" data-reveal>
            <img src={PHOTOS.stanley} alt="A dark studio microphone waiting for a take" />
          </div>
          <div className="feat__body">
            <p className="kick" data-reveal>
              Stanley · AI head of content
            </p>
            <h2 className="feat__title" data-reveal>
              Never run out of things to say
            </h2>
            <p className="feat__copy" data-reveal>
              Stanley studies what you make and writes like you mean it — product pages, posts,
              replies — while you stay in the studio. The first hire that costs nothing and never
              clocks out.
            </p>
            <div data-reveal>
              <a className="pill pill--ink" href="/chat">
                Meet Stanley
              </a>
            </div>
          </div>
        </section>

        {/* ---- store ---- */}
        <section className="feat feat--flip" id="store">
          <div className="feat__media" data-reveal>
            <img src={PHOTOS.store} alt="A creator filming in a home studio" />
          </div>
          <div className="feat__body">
            <p className="kick" data-reveal>
              Store · The all-in-one creator store
            </p>
            <h2 className="feat__title" data-reveal>
              One link. Everything you sell
            </h2>
            <p className="feat__copy" data-reveal>
              Courses, coaching, downloads, community — live in minutes from the link in your bio.
              No website. No code. No one between you and the people who back you.
            </p>
            <div data-reveal>
              <a className="pill pill--ink" href="https://stan.store" target="_blank" rel="noreferrer">
                Open your store
              </a>
            </div>
          </div>
        </section>

        {/* ---- lineup ---- */}
        <section className="lineup" id="lineup">
          <header className="lineup__head" data-reveal>
            <h2>The lineup</h2>
            <p>Three ways in. One brand on the door — yours.</p>
          </header>
          <div className="lineup__row">
            {LINEUP.map((c, i) => (
              <a
                className="card"
                key={c.id}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                data-reveal
                style={{ '--d': `${i * 90}ms` }}
              >
                <span className="card__media">
                  <img src={c.photo} alt="" />
                </span>
                <span className="card__meta">
                  <span className="card__kicker">{c.kicker}</span>
                  <span className="card__name">
                    {c.name}
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="card__line">{c.line}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ---- manifesto ---- */}
        <section className="manif">
          <div className="manif__media">
            <img src={PHOTOS.manifesto} alt="" />
          </div>
          <div className="manif__scrim" />
          <div className="manif__body">
            <h2 className="manif__title">
              <span data-reveal>Nobody hands you</span>
              <span data-reveal>an audience.</span>
              <span data-reveal>
                <em>You build one.</em>
              </span>
            </h2>
            <p className="manif__sub" data-reveal>
              Every catalogue, every classroom, every community on Stan started at zero. Bring your
              work.
            </p>
            <div data-reveal>
              <a className="pill pill--bone" href="https://stan.store" target="_blank" rel="noreferrer">
                Start building
              </a>
            </div>
          </div>
        </section>

        {/* ---- stories ---- */}
        <section className="stories" id="stories">
          <header className="lineup__head" data-reveal>
            <h2>Field notes</h2>
            <p>Short lessons from people who stopped waiting.</p>
          </header>
          <div className="stories__row">
            {STORIES.map((s, i) => (
              <article className="story" key={s.head} data-reveal style={{ '--d': `${i * 90}ms` }}>
                <span className="story__media">
                  <img src={s.photo} alt="" />
                </span>
                <p className="kick">{s.kicker}</p>
                <h3>{s.head}</h3>
                <p className="story__copy">{s.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* ---- footer ---- */}
      <footer className="bfoot">
        <p className="bfoot__mark" aria-hidden="true">
          Stan
        </p>
        <div className="bfoot__grid">
          <div>
            <p className="bfoot__label">Products</p>
            <a href="/chat">Stanley</a>
            <a href="https://stan.store" target="_blank" rel="noreferrer">
              Store
            </a>
            <a href="/editions">Editions</a>
          </div>
          <div>
            <p className="bfoot__label">The Standard</p>
            <a href="/">All nine</a>
            <a href="/books">Books</a>
            <a href="/press">Press</a>
          </div>
          <div>
            <p className="bfoot__label">Company</p>
            <a href="https://stan.store" target="_blank" rel="noreferrer">
              stan.store
            </a>
            <a href="https://github.com/shelost/stan" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
        <p className="bfoot__legal">
          <span>© 2026 Stan</span>
          <span>Build your own.</span>
        </p>
      </footer>
    </div>
  );
}
