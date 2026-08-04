import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FamilyScene from './FamilyScene';

gsap.registerPlugin(ScrollTrigger);

const IMG = (id, w = 1800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const PHOTOS = {
  stanley: IMG('photo-1522202176988-66273c2fd55f', 2200),
  store: IMG('photo-1556761175-b413da4baf72', 2200),
};

// Identity first. Products are the kit — not the point.
const CREED = [
  {
    id: 'name',
    lead: 'Your name.',
    line: 'On the door. On the work. On the thing you refuse to rent from anyone else.',
  },
  {
    id: 'audience',
    lead: 'Your audience.',
    line: 'Not borrowed reach. People who chose you — and stay because the work is real.',
  },
  {
    id: 'terms',
    lead: 'Your terms.',
    line: 'What you sell. What you charge. Who you answer to. The relationship stays yours.',
  },
  {
    id: 'craft',
    lead: 'Your craft.',
    line: 'The drafts. The late nights. The thing only you can make — shipped on your clock.',
  },
];

const FAMILY = [
  {
    id: 'stan',
    icon: '/icon_stan.svg',
    name: 'Stan',
    tag: 'The home with your name on it',
    copy: 'One brand on the door — yours. Everything you make, sell, and say, under one roof.',
  },
  {
    id: 'stanley',
    icon: '/icon_stanley.svg',
    name: 'Stanley',
    tag: 'A second brain that sounds like you',
    copy: 'Drafts, replies, pages — in your voice — so you can stay in the work that matters.',
  },
  {
    id: 'store',
    icon: '/icon_store.svg',
    name: 'Store',
    tag: 'Where your work meets money',
    copy: 'Courses, coaching, community. One link. Live when you are. No middleman owning the room.',
  },
  {
    id: 'stories',
    icon: '/icon_stories.svg',
    name: 'Stories',
    tag: 'Proof it is possible',
    copy: 'Builders already on Stan — how they started, what they own, what they wish they knew.',
  },
  {
    id: 'studio',
    icon: '/icon_studio.svg',
    name: 'Studio',
    tag: 'Ship the cut. Keep going.',
    copy: 'Rough cut to posted clip without losing the week. The edit that protects the craft.',
  },
];

const MANIFESTO = 'Nobody hands you a business. You build your own.'.split(' ');

const MARQUEE = [
  'Build Your Own',
  'Stan',
  'Your Name',
  'Your Audience',
  'Your Terms',
  'Your Craft',
];

// split a string into animatable letters
const Chars = ({ text }) =>
  text.split('').map((c, i) =>
    c === ' ' ? (
      ' '
    ) : (
      <i className="ch" key={i}>
        {c}
      </i>
    )
  );

// touch fires mouseenter before click, which would open + instantly
// re-toggle the panel — only let hover drive it on hover-capable devices
const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

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

      // ---- hero title arrives letter by letter ----
      gsap.from('.hero__title .ch', {
        yPercent: 130,
        rotate: 4,
        stagger: 0.045,
        duration: 1.05,
        ease: 'power4.out',
        delay: 0.25,
      });

      // ---- hero: pinned, photo breathes, letters scatter, blinds swallow it ----
      gsap
        .timeline({
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=170%', scrub: true, pin: true },
        })
        .fromTo('.hero__photo', { scale: 1.03, yPercent: 0 }, { scale: 1.2, yPercent: -7, ease: 'none' }, 0)
        .to(
          '.hero__title .ch',
          { yPercent: -46, stagger: { each: 0.014, from: 'end' }, ease: 'power1.in', duration: 0.3 },
          0.2
        )
        .to('.hero__body', { yPercent: -26, autoAlpha: 0, ease: 'power1.in' }, 0.28)
        .to('.hero__scrim', { opacity: 0.75, ease: 'none' }, 0)
        .fromTo(
          '.hero__wipe i',
          { yPercent: 101 },
          { yPercent: 0, stagger: 0.06, ease: 'power2.inOut', duration: 0.4 },
          0.55
        )
        .fromTo(
          '.hero__wipemark',
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.3 },
          0.75
        );

      // ---- creed: pinned belief track — audience as the hero ----
      const creedActs = q('.creed__act');
      const creedN = creedActs.length;
      const creedTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.creed',
          start: 'top top',
          end: `+=${creedN * 110}%`,
          scrub: true,
          pin: true,
        },
      });

      creedActs.forEach((act, i) => {
        const at = i * 1;
        gsap.set(act, { autoAlpha: i === 0 ? 1 : 0 });
        if (i > 0) {
          creedTl.to(act, { autoAlpha: 1, duration: 0.16 }, at - 0.16);
          creedTl.fromTo(
            act.querySelectorAll('.creed__lead .ch'),
            { yPercent: 120, rotate: 6 },
            { yPercent: 0, rotate: 0, stagger: 0.028, ease: 'back.out(1.5)', duration: 0.3 },
            at - 0.1
          );
          creedTl.fromTo(
            act.querySelector('.creed__line'),
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.24 },
            at - 0.05
          );
        }
        if (i < creedN - 1) {
          creedTl.to(act, { autoAlpha: 0, yPercent: -6, duration: 0.18 }, at + 0.65);
          creedTl.set(act, { yPercent: 0 }, at + 0.86);
        }
        creedTl.to(
          '.creed__count i',
          { yPercent: -i * 100, ease: 'power2.inOut', duration: 0.28 },
          Math.max(0, at - 0.1)
        );
      });
      creedTl.set({}, {}, creedN - 1 + 0.35);

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
        const at = i * 1;
        gsap.set(act, { autoAlpha: i === 0 ? 1 : 0 });
        if (i > 0) {
          famTl.to(act, { autoAlpha: 1, duration: 0.18 }, at - 0.18);
          famTl.fromTo(
            head.querySelectorAll('.ch'),
            { yPercent: 115, rotate: 8 },
            { yPercent: 0, rotate: 0, stagger: 0.035, ease: 'back.out(1.6)', duration: 0.32 },
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
      famTl.set({}, {}, N - 1 + 0.4);

      // ---- feature panels: card melts to full bleed, ghost name slides behind ----
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
            sec.querySelector('.wf__ghost'),
            { xPercent: 16 },
            { xPercent: -16, ease: 'none', duration: 1 },
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

      // ---- manifesto: words sharpen out of a blur, halo blooms behind ----
      gsap
        .timeline({
          scrollTrigger: { trigger: '.manif', start: 'top top', end: '+=140%', scrub: true, pin: true },
        })
        .fromTo(
          '.manif__halo',
          { scale: 0.3, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: 'power1.out', duration: 0.7 },
          0
        )
        .fromTo(
          q('.manif__title span'),
          { autoAlpha: 0.14, y: 14, filter: 'blur(7px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', stagger: 0.09, ease: 'power2.out', duration: 0.5 },
          0
        )
        .fromTo('.manif__ctawrap', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.62);

      // ---- marquee: drifts on its own, scroll velocity pushes and skews it ----
      const track = q('.mq__track')[0];
      let tickFn = null;
      if (track) {
        const wrap = gsap.utils.wrap(-50, 0);
        let x = 0;
        let vel = 0;
        ScrollTrigger.create({
          trigger: '.mq',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            vel = self.getVelocity();
          },
        });
        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.35, ease: 'power2.out' });
        tickFn = (t, dtms) => {
          const dt = Math.min(dtms, 100) / 1000;
          const speed = 3 + gsap.utils.clamp(-26, 30, vel / 320);
          x = wrap(x - speed * dt);
          gsap.set(track, { xPercent: x });
          skewTo(gsap.utils.clamp(-9, 9, vel / -520));
          vel *= 0.92;
        };
        gsap.ticker.add(tickFn);
      }

      // ---- magnetic CTA (hover devices only) ----
      const cta = q('.manif__cta')[0];
      let magnet = null;
      if (cta && window.matchMedia('(hover: hover)').matches) {
        const xT = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power3' });
        const yT = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power3' });
        magnet = (e) => {
          const r = cta.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy);
          const pull = d < 200 ? (1 - d / 200) * 0.42 : 0;
          xT(dx * pull);
          yT(dy * pull);
        };
        window.addEventListener('pointermove', magnet, { passive: true });
      }

      // ---- bridge + footer rise in ----
      gsap.from('.bridge__mark, .bridge__title, .bridge__sub', {
        scrollTrigger: { trigger: '.bridge', start: 'top 80%' },
        y: 28,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power3.out',
      });

      gsap.from('.bfoot__logo, .bfoot__grid > div, .bfoot__legal', {
        scrollTrigger: { trigger: '.bfoot', start: 'top 85%' },
        y: 36,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
      });

      return () => {
        if (tickFn) gsap.ticker.remove(tickFn);
        if (magnet) window.removeEventListener('pointermove', magnet);
      };
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
            <a href="#creed" onMouseEnter={() => setPanel(false)}>
              The idea
            </a>
            <button
              type="button"
              className="isl__trigger"
              aria-expanded={panel}
              onMouseEnter={() => canHover() && setPanel(true)}
              onClick={() => setPanel((v) => !v)}
            >
              Family
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
            <a href="/" onMouseEnter={() => setPanel(false)}>
              Editions
            </a>
          </nav>
          <a className="isl__cta" href="https://stan.store" target="_blank" rel="noreferrer">
            Start building
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
            <img className="hero__photo" src="/computer.jpg" alt="A builder at work" />
          </div>
          <div className="hero__scrim" />
          <div className="hero__body">
            <p className="hero__brand">
              <img src="/stan_logo.svg" alt="Stan" />
            </p>
            <h1 className="hero__title">
              <span>
                <em>
                  <Chars text="Build" />
                </em>
              </span>
              <span>
                <em>
                  <Chars text="your own." />
                </em>
              </span>
            </h1>
            <p className="hero__sub">
              For entrepreneurs and creators making something with their name on it.
            </p>
            <div className="hero__actions">
              <a className="pill pill--white" href="https://stan.store" target="_blank" rel="noreferrer">
                Start building
                <span className="pill__orb">↑</span>
              </a>
              <a className="pill pill--line" href="#creed">
                The idea
              </a>
            </div>
          </div>
          <div className="hero__wipe" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <p className="hero__wipemark">Build</p>
          </div>
        </section>

        {/* ---- creed: the belief, before the kit ---- */}
        <section className="creed" id="creed">
          <p className="creed__eyebrow">What we mean</p>
          <div className="creed__count" aria-hidden="true">
            <i>
              {CREED.map((c, n) => (
                <b key={c.id}>0{n + 1}</b>
              ))}
            </i>
          </div>
          {CREED.map((c) => (
            <article className="creed__act" key={c.id}>
              <h2 className="creed__lead">
                <Chars text={c.lead} />
              </h2>
              <p className="creed__line">{c.line}</p>
            </article>
          ))}
          <p className="creed__hint" aria-hidden="true">
            Keep scrolling
          </p>
        </section>

        {/* ---- bridge into the kit ---- */}
        <section className="bridge">
          <p className="bridge__mark">The kit</p>
          <h2 className="bridge__title">Tools for the ones who build.</h2>
          <p className="bridge__sub">
            Not the point of the story — the gear that gets you there.
          </p>
        </section>

        {/* ---- family: products as support, not the headline ---- */}
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
              <h2 className="fam__head">
                <Chars text={f.name} />
              </h2>
              <p className="fam__tag">{f.tag}</p>
              <p className="fam__copy">{f.copy}</p>
            </article>
          ))}
          <p className="fam__hint" aria-hidden="true">
            Keep scrolling
          </p>
        </section>

        {/* ---- marquee: velocity-reactive band ---- */}
        <section className="mq" aria-hidden="true">
          <div className="mq__track">
            {[...MARQUEE, ...MARQUEE].map((w, i) => (
              <span className={`mq__item${i % 2 ? ' mq__item--line' : ''}`} key={i}>
                {w}
              </span>
            ))}
          </div>
        </section>

        {/* ---- wipe panel: stanley ---- */}
        <section className="wf" id="stanley">
          <div className="wf__media">
            <img className="wf__photo" src={PHOTOS.stanley} alt="Builders collaborating on their work" />
            <div className="wf__tint" />
          </div>
          <span className="wf__ghost" aria-hidden="true">
            Stanley
          </span>
          <div className="wf__body">
            <img className="wf__badge" src="/icon_stanley.svg" alt="" />
            <p className="wf__kick">Stanley · Built for builders</p>
            <h2>Stay in the work. Let the rest keep moving.</h2>
            <p className="wf__copy">
              An assistant that studies how you sound — so drafts, replies, and pages keep pace
              while you build the thing only you can.
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
            <img className="wf__photo" src={PHOTOS.store} alt="An entrepreneur presenting their work" />
            <div className="wf__tint" />
          </div>
          <span className="wf__ghost" aria-hidden="true">
            Store
          </span>
          <div className="wf__body">
            <img className="wf__badge" src="/icon_store.svg" alt="" />
            <p className="wf__kick">Store · Your terms</p>
            <h2>One link. The business is yours.</h2>
            <p className="wf__copy">
              Put courses, coaching, downloads, community behind a door with your name on it. Live
              from the link in your bio — no one renting the relationship.
            </p>
            <a className="pill pill--white" href="https://stan.store" target="_blank" rel="noreferrer">
              Open your store
              <span className="pill__orb">↑</span>
            </a>
          </div>
        </section>

        {/* ---- manifesto ---- */}
        <section className="manif">
          <div className="manif__halo" aria-hidden="true" />
          <h2 className="manif__title">
            {MANIFESTO.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </h2>
          <div className="manif__ctawrap">
            <a
              className="pill pill--white manif__cta"
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
            <p className="bfoot__label">The idea</p>
            <a href="#creed">Build your own</a>
            <a href="#creed">Your name</a>
            <a href="#creed">Your audience</a>
            <a href="#creed">Your terms</a>
          </div>
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
            <p className="bfoot__label">Company</p>
            <a href="/">Editions</a>
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
