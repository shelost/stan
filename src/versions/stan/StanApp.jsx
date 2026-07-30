import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FamilyScene from './FamilyScene';

gsap.registerPlugin(ScrollTrigger);

const IMG = (id, w = 1800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const PHOTOS = {
  stanley: IMG('photo-1610716632424-4d45990bcd48', 2200),
  store: IMG('photo-1664277497095-424e085175e8', 2200),
};

const FAMILY = [
  {
    id: 'stan',
    icon: '/icon_stan.svg',
    name: 'Stan',
    tag: 'Build Your Own.',
    copy: 'One brand on the door — yours. Stan is the home of everything you make, sell and say.',
  },
  {
    id: 'stanley',
    icon: '/icon_stanley.svg',
    name: 'Stanley',
    tag: 'Your AI Creator Assistant',
    copy: 'Drafts, replies, product pages — written in your voice while you stay in the studio.',
  },
  {
    id: 'store',
    icon: '/icon_store.svg',
    name: 'Store',
    tag: 'Your All-in-One Creator Store',
    copy: 'Courses, coaching, community. One link in your bio, live in minutes, no code.',
  },
  {
    id: 'stories',
    icon: '/icon_stories.svg',
    name: 'Stories',
    tag: 'Real Creators. Real Stories.',
    copy: 'The people already building on Stan — how they started and what they wish they knew.',
  },
  {
    id: 'studio',
    icon: '/icon_studio.svg',
    name: 'Studio',
    tag: 'Your AI Video Editor',
    copy: 'Rough cut to posted clip in minutes. Hook found, dead air gone, captions in your style.',
  },
];

const MANIFESTO = 'Nobody hands you an audience. You build one.'.split(' ');

export default function StanApp() {
  const [panel, setPanel] = useState(false);
  const famProgress = useRef(0);
  const root = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setPanel(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);

      // ---- floating island drops in ----
      gsap.from('.isl', { y: -70, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 });

      // ---- hero: pinned, photo breathes, then a purple wipe swallows it ----
      gsap
        .timeline({
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=170%', scrub: true, pin: true },
        })
        .fromTo('.hero__photo', { scale: 1.03, yPercent: 0 }, { scale: 1.2, yPercent: -7, ease: 'none' }, 0)
        .to('.hero__body', { yPercent: -26, autoAlpha: 0, ease: 'power1.in' }, 0.28)
        .to('.hero__scrim', { opacity: 0.75, ease: 'none' }, 0)
        .fromTo(
          '.hero__wipe',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 0.45 },
          0.55
        )
        .fromTo(
          '.hero__wipemark',
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.3 },
          0.72
        );

      // ---- family: one long pinned act track over the 3D scene ----
      const acts = q('.fam__act');
      const N = acts.length;
      const famTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.fam',
          start: 'top top',
          end: `+=${N * 120}%`,
          scrub: true,
          pin: true,
          onUpdate: (st) => {
            famProgress.current = st.progress * (N - 1);
          },
        },
      });

      acts.forEach((act, i) => {
        const head = act.querySelector('.fam__head');
        const tag = act.querySelector('.fam__tag');
        const copy = act.querySelector('.fam__copy');
        const icon = act.querySelector('.fam__icon');
        const at = i * 1; // one unit per act
        gsap.set(act, { autoAlpha: i === 0 ? 1 : 0 });
        if (i > 0) {
          famTl.to(act, { autoAlpha: 1, duration: 0.18 }, at - 0.18);
          famTl.fromTo(
            head,
            { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 30 },
            { clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, ease: 'power3.out', duration: 0.3 },
            at - 0.12
          );
          famTl.fromTo(
            [icon, tag, copy],
            { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.05, ease: 'power2.out', duration: 0.26 },
            at - 0.08
          );
        }
        if (i < N - 1) {
          famTl.to(act, { autoAlpha: 0, yPercent: -8, duration: 0.2 }, at + 0.62);
          famTl.set(act, { yPercent: 0 }, at + 0.86);
        }
        famTl.to(
          '.fam__count i',
          { yPercent: -i * 100, ease: 'power2.inOut', duration: 0.3 },
          Math.max(0, at - 0.12)
        );
      });
      famTl.set({}, {}, N - 1 + 0.4); // tail room on the last act

      // ---- feature panels: card melts to full bleed (wipe), copy rises ----
      q('.wf').forEach((sec) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: sec, start: 'top top', end: '+=130%', scrub: true, pin: true },
          })
          .fromTo(
            sec.querySelector('.wf__media'),
            { clipPath: 'inset(14% 10% 14% 10% round 22px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 0.5 },
            0
          )
          .fromTo(
            sec.querySelector('.wf__photo'),
            { scale: 1.18 },
            { scale: 1.02, ease: 'none', duration: 1 },
            0
          )
          .fromTo(
            sec.querySelector('.wf__body'),
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.32 },
            0.42
          )
          .fromTo(
            sec.querySelector('.wf__badge'),
            { scale: 0, rotate: -14 },
            { scale: 1, rotate: 0, ease: 'back.out(2)', duration: 0.25 },
            0.55
          );
      });

      // ---- manifesto: words light as you scrub ----
      gsap
        .timeline({
          scrollTrigger: { trigger: '.manif', start: 'top top', end: '+=140%', scrub: true, pin: true },
        })
        .fromTo(
          q('.manif__title span'),
          { autoAlpha: 0.14, y: 14 },
          { autoAlpha: 1, y: 0, stagger: 0.09, ease: 'power2.out', duration: 0.5 },
          0
        )
        .fromTo('.manif__cta', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.62);

      return () => {};
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="brand" ref={root}>
      {/* ---- floating header island ---- */}
      <header className={`isl${panel ? ' isl--open' : ''}`} onMouseLeave={() => setPanel(false)}>
        <div className="isl__bar">
          <a className="isl__logo" href="#top" aria-label="Stan">
            <img src="/stan_logo.svg" alt="Stan" />
          </a>
          <nav className="isl__links">
            <button
              type="button"
              className="isl__trigger"
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
          <a className="isl__cta" href="https://stan.store" target="_blank" rel="noreferrer">
            Get Started
            <span>↑</span>
          </a>
        </div>
        <div className="isl__panelwrap" data-open={panel || undefined}>
          <div className="isl__panel">
            {FAMILY.map((f) => (
              <a className="isl__item" key={f.id} href="#family" onClick={() => setPanel(false)}>
                <img src={f.icon} alt="" />
                <span>
                  <strong>{f.name}</strong>
                  <em>{f.tag}</em>
                </span>
              </a>
            ))}
          </div>
        </div>
      </header>

      <main id="top">
        {/* ---- hero ---- */}
        <section className="hero">
          <div className="hero__media">
            <img className="hero__photo" src="/computer.jpg" alt="A creator's desk mid-edit" />
          </div>
          <div className="hero__scrim" />
          <div className="hero__body">
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
              <a className="pill pill--white" href="https://stan.store" target="_blank" rel="noreferrer">
                Get Started
                <span className="pill__orb">↑</span>
              </a>
              <a className="pill pill--line" href="#family">
                Meet the family
              </a>
            </div>
          </div>
          {/* purple wipe that swallows the hero */}
          <div className="hero__wipe" aria-hidden="true">
            <p className="hero__wipemark">The family</p>
          </div>
        </section>

        {/* ---- family: provenance-style pinned act track ---- */}
        <section className="fam" id="family">
          <FamilyScene progressRef={famProgress} />
          <div className="fam__count" aria-hidden="true">
            <i>
              {FAMILY.map((f, n) => (
                <b key={f.id}>0{n + 1}</b>
              ))}
            </i>
          </div>
          {FAMILY.map((f) => (
            <article className="fam__act" key={f.id}>
              <img className="fam__icon" src={f.icon} alt="" />
              <h2 className="fam__head">{f.name}</h2>
              <p className="fam__tag">{f.tag}</p>
              <p className="fam__copy">{f.copy}</p>
            </article>
          ))}
          <p className="fam__hint" aria-hidden="true">
            Keep scrolling
          </p>
        </section>

        {/* ---- wipe panel: stanley ---- */}
        <section className="wf" id="stanley">
          <div className="wf__media">
            <img className="wf__photo" src={PHOTOS.stanley} alt="A studio microphone in low light" />
            <div className="wf__tint" />
          </div>
          <div className="wf__body">
            <img className="wf__badge" src="/icon_stanley.svg" alt="" />
            <p className="wf__kick">Stanley · Your AI Creator Assistant</p>
            <h2>Never run out of things to say.</h2>
            <p className="wf__copy">
              Stanley studies what you make and writes like you mean it — while you stay in the
              studio. The first hire that costs nothing and never clocks out.
            </p>
            <a className="pill pill--white" href="/chat">
              Meet Stanley
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </section>

        {/* ---- wipe panel: store ---- */}
        <section className="wf wf--right" id="store">
          <div className="wf__media">
            <img className="wf__photo" src={PHOTOS.store} alt="A creator filming at a home studio" />
            <div className="wf__tint" />
          </div>
          <div className="wf__body">
            <img className="wf__badge" src="/icon_store.svg" alt="" />
            <p className="wf__kick">Store · Your All-in-One Creator Store</p>
            <h2>One link. Everything you sell.</h2>
            <p className="wf__copy">
              Courses, coaching, downloads, community — live in minutes from the link in your bio.
              No one between you and the people who back you.
            </p>
            <a className="pill pill--white" href="https://stan.store" target="_blank" rel="noreferrer">
              Open your store
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </section>

        {/* ---- manifesto ---- */}
        <section className="manif">
          <h2 className="manif__title">
            {MANIFESTO.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </h2>
          <a
            className="pill pill--white manif__cta"
            href="https://stan.store"
            target="_blank"
            rel="noreferrer"
          >
            Start building
            <span className="pill__orb">↑</span>
          </a>
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
            <a href="#family">Stories</a>
            <a href="#family">Studio</a>
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
