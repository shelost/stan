import { useEffect, useRef, useState } from 'react';
import CoinScene from './CoinScene';
import { useScrub, useParallax, phase } from './useScrub';

const IMG = (id, w = 1800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const PHOTOS = {
  stanley: IMG('photo-1610716632424-4d45990bcd48'),
  store: IMG('photo-1664277497095-424e085175e8'),
  stories: IMG('photo-1594751684241-bcef815d5a57', 1200),
  studio: IMG('photo-1616412875447-096e932d893c', 1200),
};

const FAMILY = [
  { id: 'stan', icon: '/icon_stan.svg', name: 'Stan', tag: 'Build Your Own.', href: '#top' },
  {
    id: 'stanley',
    icon: '/icon_stanley.svg',
    name: 'Stanley',
    tag: 'Your AI Creator Assistant',
    href: '#stanley',
  },
  {
    id: 'store',
    icon: '/icon_store.svg',
    name: 'Store',
    tag: 'Your All-in-One Creator Store',
    href: '#store',
  },
  {
    id: 'stories',
    icon: '/icon_stories.svg',
    name: 'Stories',
    tag: 'Real Creators. Real Stories.',
    href: '#more',
  },
  {
    id: 'studio',
    icon: '/icon_studio.svg',
    name: 'Studio',
    tag: 'Your AI Video Editor',
    href: '#more',
  },
];

const ICONS = FAMILY.map((f) => f.icon);

const MANIFESTO = 'Nobody hands you an audience. You build one.'.split(' ');

export default function StanApp() {
  useParallax();

  // ---- expanding header ----
  const [panel, setPanel] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e) => e.key === 'Escape' && setPanel(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // ---- hero scrub ----
  const heroWrap = useRef(null);
  const heroPhoto = useRef(null);
  const heroBody = useRef(null);
  const heroScrim = useRef(null);

  useScrub(heroWrap, (p) => {
    const photo = heroPhoto.current;
    const body = heroBody.current;
    const scrim = heroScrim.current;
    if (!photo || !body || !scrim) return;
    photo.style.transform = `translateY(${(-p * 9).toFixed(2)}%) scale(${(1.02 + p * 0.16).toFixed(3)})`;
    const out = phase(p, 0.48, 0.92);
    body.style.opacity = (1 - out).toFixed(3);
    body.style.transform = `translateY(${(-out * 54).toFixed(1)}px)`;
    scrim.style.opacity = (0.5 + p * 0.5).toFixed(3);
  });

  // ---- family scrub ----
  const famWrap = useRef(null);
  const famList = useRef(null);
  const famRail = useRef(null);
  const famProgress = useRef(0);

  useScrub(famWrap, (p) => {
    famProgress.current = p;
    const list = famList.current;
    const rail = famRail.current;
    if (!list || !rail) return;
    const n = FAMILY.length;
    const active = Math.max(0, Math.min(n - 1, Math.round(p * (n - 1))));
    [...list.children].forEach((li, i) => {
      li.dataset.state = i === active ? 'on' : i < active ? 'done' : 'off';
    });
    rail.style.transform = `scaleY(${(p || 0.001).toFixed(4)})`;
  });

  // ---- manifesto scrub ----
  const manWrap = useRef(null);
  const manWords = useRef(null);

  useScrub(manWrap, (p) => {
    const holder = manWords.current;
    if (!holder) return;
    const words = holder.children;
    const n = words.length;
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * 0.7;
      const w = phase(p, a, a + 0.26);
      words[i].style.opacity = (0.14 + w * 0.86).toFixed(3);
      words[i].style.transform = `translateY(${((1 - w) * 12).toFixed(1)}px)`;
    }
  });

  return (
    <div className="brand">
      <header
        className={`hd${condensed ? ' hd--condensed' : ''}${panel ? ' hd--open' : ''}`}
        onMouseLeave={() => setPanel(false)}
      >
        <div className="hd__bar">
          <a className="hd__logo" href="#top" aria-label="Stan">
            <img src="/stan_logo.svg" alt="Stan" />
          </a>
          <nav className="hd__links">
            <button
              type="button"
              className="hd__trigger"
              aria-expanded={panel}
              onMouseEnter={() => setPanel(true)}
              onFocus={() => setPanel(true)}
              onClick={() => setPanel((v) => !v)}
            >
              Products
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M4 6l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a href="#stanley" onMouseEnter={() => setPanel(false)}>
              Stanley
            </a>
            <a href="#store" onMouseEnter={() => setPanel(false)}>
              Store
            </a>
            <a href="/" onMouseEnter={() => setPanel(false)}>
              Editions
            </a>
          </nav>
          <div className="hd__cta">
            <a className="hd__ghost" href="https://stan.store" target="_blank" rel="noreferrer">
              Sign in
            </a>
            <a className="pill pill--solid" href="https://stan.store" target="_blank" rel="noreferrer">
              Get Started
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </div>

        {/* expanding panel */}
        <div className="hd__panelwrap" data-open={panel || undefined}>
          <div className="hd__panel">
            <div className="hd__grid">
              {FAMILY.map((f) => (
                <a className="hd__item" key={f.id} href={f.href} onClick={() => setPanel(false)}>
                  <img src={f.icon} alt="" />
                  <span>
                    <strong>{f.name}</strong>
                    <em>{f.tag}</em>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ---- hero ---- */}
        <section className="hero" ref={heroWrap}>
          <div className="hero__sticky">
            <div className="hero__media">
              <img ref={heroPhoto} src="/computer.jpg" alt="A creator's desk mid-edit" />
            </div>
            <div className="hero__scrim" ref={heroScrim} />
            <div className="hero__body" ref={heroBody}>
              <p className="hero__eyebrow">
                <img src="/icon_stan.svg" alt="" />
                Stan — for the ones who make
              </p>
              <h1 className="hero__title">
                <span>
                  <em>Build</em>
                </span>
                <span>
                  <em>your own.</em>
                </span>
              </h1>
              <p className="hero__sub">
                The <b>easiest</b> way to make money online.
              </p>
              <div className="hero__actions">
                <a
                  className="pill pill--white pill--lg"
                  href="https://stan.store"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Started
                  <span className="pill__orb">↑</span>
                </a>
                <a className="pill pill--line" href="#family">
                  Meet the family
                </a>
              </div>
            </div>
            <div className="hero__hint" aria-hidden="true">
              <span>Scroll</span>
              <i />
            </div>
          </div>
        </section>

        {/* ---- marquee ---- */}
        <div className="marq" aria-hidden="true">
          <div className="marq__track">
            {[0, 1].map((n) => (
              <div className="marq__set" key={n}>
                {['Build your own', 'Own your work', 'Keep the upside', 'Start today'].map((m) => (
                  <span key={m}>
                    {m}
                    <b>✦</b>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---- family ---- */}
        <section className="fam" id="family" ref={famWrap}>
          <div className="fam__sticky">
            <p className="fam__kicker">The family</p>
            <div className="fam__grid">
              <div className="fam__left">
                <span className="fam__railtrack">
                  <span className="fam__rail" ref={famRail} />
                </span>
                <ol className="fam__list" ref={famList}>
                  {FAMILY.map((f) => (
                    <li key={f.id}>
                      <img src={f.icon} alt="" />
                      <span className="fam__name">{f.name}</span>
                      <span className="fam__tag">{f.tag}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="fam__right">
                <CoinScene icons={ICONS} progressRef={famProgress} />
              </div>
            </div>
          </div>
        </section>

        {/* ---- editorial: stanley ---- */}
        <section className="feat" id="stanley">
          <div className="feat__media">
            <img data-plx="0.07" src={PHOTOS.stanley} alt="A studio microphone in low light" />
            <img className="feat__badge" src="/icon_stanley.svg" alt="" />
          </div>
          <div className="feat__body">
            <p className="kick">Stanley · Your AI Creator Assistant</p>
            <h2 className="feat__title">Never run out of things to say.</h2>
            <p className="feat__copy">
              Stanley studies what you make and writes like you mean it — product pages, posts,
              replies — while you stay in the studio. The first hire that costs nothing and never
              clocks out.
            </p>
            <a className="pill pill--solid" href="/chat">
              Meet Stanley
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </section>

        {/* ---- editorial: store ---- */}
        <section className="feat feat--flip" id="store">
          <div className="feat__media">
            <img data-plx="0.07" src={PHOTOS.store} alt="A creator filming at a home studio" />
            <img className="feat__badge" src="/icon_store.svg" alt="" />
          </div>
          <div className="feat__body">
            <p className="kick">Store · Your All-in-One Creator Store</p>
            <h2 className="feat__title">One link. Everything you sell.</h2>
            <p className="feat__copy">
              Courses, coaching, downloads, community — live in minutes from the link in your bio.
              No website. No code. No one between you and the people who back you.
            </p>
            <a
              className="pill pill--solid"
              href="https://stan.store"
              target="_blank"
              rel="noreferrer"
            >
              Open your store
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </section>

        {/* ---- stories + studio ---- */}
        <section className="duo" id="more">
          {[
            {
              id: 'stories',
              icon: '/icon_stories.svg',
              kick: 'Stories',
              head: 'Real Creators. Real Stories.',
              copy: 'The people already building on Stan — how they started, what they sell, what they wish they knew.',
              photo: PHOTOS.stories,
            },
            {
              id: 'studio',
              icon: '/icon_studio.svg',
              kick: 'Studio',
              head: 'Your AI Video Editor.',
              copy: 'Rough cut to posted clip in minutes. Studio finds the hook, trims the dead air, and captions it in your style.',
              photo: PHOTOS.studio,
            },
          ].map((d) => (
            <article className="duo__card" key={d.id}>
              <div className="duo__media">
                <img data-plx="0.05" src={d.photo} alt="" />
                <img className="duo__badge" src={d.icon} alt="" />
              </div>
              <p className="kick">{d.kick}</p>
              <h3>{d.head}</h3>
              <p className="duo__copy">{d.copy}</p>
            </article>
          ))}
        </section>

        {/* ---- manifesto ---- */}
        <section className="manif" ref={manWrap}>
          <div className="manif__sticky">
            <h2 className="manif__title" ref={manWords}>
              {MANIFESTO.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </h2>
            <a
              className="pill pill--white pill--lg"
              href="https://stan.store"
              target="_blank"
              rel="noreferrer"
            >
              Start building
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="bfoot">
        <img className="bfoot__logo" src="/stan_logo.svg" alt="Stan" />
        <div className="bfoot__grid">
          <div>
            <p className="bfoot__label">Family</p>
            <a href="/chat">Stanley</a>
            <a href="https://stan.store" target="_blank" rel="noreferrer">
              Store
            </a>
            <a href="#more">Stories</a>
            <a href="#more">Studio</a>
          </div>
          <div>
            <p className="bfoot__label">The Standard</p>
            <a href="/">All nine</a>
            <a href="/editions">Editions</a>
            <a href="/books">Books</a>
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
          <span>Build Your Own.</span>
        </p>
      </footer>
    </div>
  );
}
