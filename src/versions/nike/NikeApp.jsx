import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FamilyScene from '../stan/FamilyScene';

gsap.registerPlugin(ScrollTrigger);

const BUILDERS = [
  {
    id: 'jt',
    name: 'JT Barnett',
    handle: '@jtbarnett',
    tag: 'Content Strategy',
    number: '01',
    img: '/ch_2.png',
    color: '#c45a3e',
    headline: ['RETIRED', 'WITH', 'NOTHING.'],
    context: 'Left pro hockey with $0. Built the playbook brands still steal.',
    line: 'Start over at zero.',
  },
  {
    id: 'steven',
    name: 'Steven Bartlett',
    handle: '@steven',
    tag: 'Podcaster',
    number: '02',
    img: '/ch_1.png',
    color: '#2f6fdb',
    headline: ['START BEFORE', "YOU'RE READY."],
    context: 'From a Manchester estate to the chair across from every founder.',
    line: 'Own the mic.',
  },
  {
    id: 'roy',
    name: 'Roy Lee',
    handle: '@itsroylee',
    tag: 'Entrepreneur',
    number: '03',
    img: '/ch_4.png',
    color: '#1a9d4b',
    headline: ['BUILD', 'ANYWAY.'],
    context: 'Suspended. Dropped out. Still shipped the company.',
    line: 'Get rejected. Get funded.',
  },
  {
    id: 'sarah',
    name: 'Sarah Perl',
    handle: '@hothighpriestess',
    tag: 'Social Media',
    number: '04',
    img: '/ch_5.png',
    color: '#d478a8',
    headline: ['POST', 'THE FIRST', 'ONE.'],
    quote: 'They said the dream was crazy. She posted anyway.',
    context: 'One tarot video. Then a seven-figure storefront.',
    line: 'Rewire everything.',
  },
];

// Five-person wall — studio cutouts on black (ch_1…ch_5).
const WALL = [
  { id: 'ch1', img: '/ch_1.png', color: '#2f6fdb', href: '#steven', name: 'Steven Bartlett' },
  { id: 'ch2', img: '/ch_2.png', color: '#c45a3e', href: '#jt', name: 'JT Barnett' },
  { id: 'ch3', img: '/ch_3.png', color: '#7c6ae8', href: '#roster', name: 'Builder' },
  { id: 'ch4', img: '/ch_4.png', color: '#1a9d4b', href: '#roy', name: 'Roy Lee' },
  { id: 'ch5', img: '/ch_5.png', color: '#d478a8', href: '#sarah', name: 'Sarah Perl' },
];

const PRODUCTS = [
  {
    id: 'stanley',
    icon: '/icon_stanley.svg',
    name: 'Stanley',
    tag: 'A second brain that sounds like you',
  },
  {
    id: 'store',
    icon: '/icon_store.svg',
    name: 'Store',
    tag: 'Where your work meets money',
  },
  {
    id: 'stories',
    icon: '/icon_stories.svg',
    name: 'Stories',
    tag: 'Proof it is possible',
  },
  {
    id: 'studio',
    icon: '/icon_studio.svg',
    name: 'Studio',
    tag: 'Ship the cut. Keep going.',
  },
];

const KIT = [
  {
    id: 'roof',
    lead: 'The roof.',
    tag: 'One place with your name on it',
    copy: 'Everything you make, sell, and say — under one mark. Not rented. Yours.',
  },
  {
    id: 'pace',
    lead: 'The pace.',
    tag: 'A second brain that keeps up',
    copy: 'Drafts, replies, pages that move while you stay in the work only you can do.',
  },
  {
    id: 'door',
    lead: 'The door.',
    tag: 'Where the work meets the room',
    copy: 'One link. Live when you are. The relationship stays on your side of the glass.',
  },
  {
    id: 'proof',
    lead: 'The proof.',
    tag: 'Builders already in motion',
    copy: 'How they started. What they own. What they wish they knew sooner.',
  },
  {
    id: 'cut',
    lead: 'The cut.',
    tag: 'Ship it. Keep going.',
    copy: 'Rough to posted without losing the week. Protect the craft. Release the take.',
  },
];

const MARQUEE = [
  'RETIRED WITH NOTHING',
  "START BEFORE YOU'RE READY",
  'BUILD ANYWAY',
  'POST THE FIRST ONE',
  'OWN THE MIC',
  'FAIL FORWARD',
];

const MANIFESTO = ['NOBODY', 'HANDS', 'YOU', 'A', 'BUSINESS.', 'YOU', 'BUILD', 'YOUR', 'OWN.'];

const LINK_SLOTS = [72, 58, 64, 48];

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

function BuilderCard({ builder }) {
  return (
    <a className="pcard" href={`#${builder.id}`}>
      <div className="pcard__frame">
        <div className="pcard__brand">
          <img src="/stan_logo.svg" alt="" />
        </div>
        <p className="pcard__num" aria-hidden="true">
          {builder.number}
        </p>
        <h3 className="pcard__slogan">
          {builder.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h3>
        <div className="pcard__panel" style={{ background: builder.color }} aria-hidden="true" />
        <img className="pcard__photo" src={builder.img} alt={builder.name} />
        <div className="pcard__meta">
          <strong>{builder.name}</strong>
          <em>{builder.handle}</em>
          <span className="pcard__pill">{builder.tag}</span>
        </div>
      </div>
    </a>
  );
}

function PhoneStage({ builder }) {
  return (
    <div className="phone" style={{ '--tone': builder.color }}>
      <div className="phone__shell" aria-hidden="true">
        <div className="phone__notch" />
        <div className="phone__screen">
          <div className="phone__avatar" />
          <div className="phone__bars">
            {LINK_SLOTS.map((w, i) => (
              <span key={i} className="phone__bar" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
      <img className="phone__cutout" key={builder.id} src={builder.img} alt={builder.name} />
    </div>
  );
}

export default function NikeApp() {
  const kitProgress = useRef(0);
  const root = useRef(null);
  const [phoneIndex, setPhoneIndex] = useState(0);
  const activeBuilder = BUILDERS[phoneIndex];

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);

        gsap.from('.nbar', { y: -28, duration: 0.7, ease: 'power3.out', delay: 0.05 });
        gsap.from('.hero__logo, .hero__title span, .hero__sub, .hero__right', {
          y: 28,
          duration: 0.85,
          stagger: 0.06,
          ease: 'power4.out',
          delay: 0.1,
        });

        gsap.from('.wall__col', {
          scrollTrigger: { trigger: '.wall', start: 'top 70%' },
          y: 24,
          duration: 1,
          stagger: 0.05,
          ease: 'power3.out',
        });
        gsap.from('.wall__title, .wall__sub, .wall__mark', {
          scrollTrigger: { trigger: '.wall', start: 'top 70%' },
          y: 16,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2,
        });

        const acts = q('.kit__act');
        const N = acts.length;
        const kitTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.kit',
            start: 'top top',
            end: `+=${N * 115}%`,
            scrub: true,
            pin: true,
            onUpdate: (st) => {
              kitProgress.current = st.progress * (N - 1);
            },
          },
        });

        acts.forEach((act, i) => {
          const at = i * 1;
          gsap.set(act, { autoAlpha: i === 0 ? 1 : 0 });
          if (i > 0) {
            kitTl.to(act, { autoAlpha: 1, duration: 0.16 }, at - 0.16);
            kitTl.fromTo(
              act.querySelectorAll('.kit__lead .ch'),
              { yPercent: 115 },
              { yPercent: 0, stagger: 0.03, ease: 'power3.out', duration: 0.3 },
              at - 0.1
            );
            kitTl.fromTo(
              [act.querySelector('.kit__tag'), act.querySelector('.kit__copy')],
              { y: 20, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.24 },
              at - 0.06
            );
          }
          if (i < N - 1) {
            kitTl.to(act, { autoAlpha: 0, yPercent: -6, duration: 0.18 }, at + 0.64);
            kitTl.set(act, { yPercent: 0 }, at + 0.86);
          }
          kitTl.to(
            '.kit__count i',
            { yPercent: -i * 100, ease: 'power2.inOut', duration: 0.28 },
            Math.max(0, at - 0.1)
          );
        });
        kitTl.set({}, {}, N - 1 + 0.35);

        gsap.from('.funnel__apex, .funnel__title, .funnel__sub', {
          scrollTrigger: { trigger: '.funnel', start: 'top 75%' },
          y: 24,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        });

        gsap.fromTo(
          '.funnel__edge',
          { strokeDashoffset: 120 },
          {
            scrollTrigger: { trigger: '.funnel', start: 'top 75%' },
            strokeDashoffset: 0,
            duration: 1,
            stagger: 0.06,
            ease: 'power2.out',
            delay: 0.12,
          }
        );

        gsap.from('.funnel__icon', {
          scrollTrigger: { trigger: '.funnel', start: 'top 70%' },
          scale: 0.4,
          autoAlpha: 0,
          y: 36,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.6)',
          delay: 0.2,
        });
        gsap.from('.funnel__item strong, .funnel__item span', {
          scrollTrigger: { trigger: '.funnel', start: 'top 70%' },
          y: 16,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.45,
        });

        gsap.from('.roster__head, .pcard', {
          scrollTrigger: { trigger: '.roster', start: 'top 78%' },
          y: 36,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
        });

        q('.bill').forEach((sec) => {
          gsap
            .timeline({
              scrollTrigger: { trigger: sec, start: 'top top', end: '+=110%', scrub: true, pin: true },
            })
            .fromTo(sec.querySelector('.bill__photo'), { scale: 1.1 }, { scale: 1, ease: 'none', duration: 1 }, 0)
            .fromTo(
              sec.querySelector('.bill__title'),
              { y: 36, autoAlpha: 0.35 },
              { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.35 },
              0.15
            )
            .fromTo(
              [sec.querySelector('.bill__context'), sec.querySelector('.bill__foot')],
              { y: 20, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.06, ease: 'power2.out', duration: 0.28 },
              0.35
            );
        });

        gsap
          .timeline({
            scrollTrigger: { trigger: '.manif', start: 'top top', end: '+=130%', scrub: true, pin: true },
          })
          .fromTo('.manif__halo', { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.65 }, 0)
          .fromTo(
            q('.manif__title span'),
            { autoAlpha: 0.12, y: 16 },
            { autoAlpha: 1, y: 0, stagger: 0.07, ease: 'power2.out', duration: 0.45 },
            0
          )
          .fromTo('.manif__cta', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.6);

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
          const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.3, ease: 'power2.out' });
          tickFn = (_t, dtms) => {
            const dt = Math.min(dtms, 100) / 1000;
            const speed = 4.2 + gsap.utils.clamp(-30, 34, vel / 280);
            x = wrap(x - speed * dt);
            gsap.set(track, { xPercent: x });
            skewTo(gsap.utils.clamp(-10, 10, vel / -480));
            vel *= 0.9;
          };
          gsap.ticker.add(tickFn);
        }

        gsap.from('.nfoot__mark, .nfoot__grid > div, .nfoot__legal', {
          scrollTrigger: { trigger: '.nfoot', start: 'top 88%' },
          y: 24,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
        });

        return () => {
          if (tickFn) gsap.ticker.remove(tickFn);
        };
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="nike" ref={root}>
      <header className="nbar">
        <a className="nbar__logo" href="#top" aria-label="Stan">
          <img src="/stan_logo.svg" alt="Stan" />
        </a>
        <nav className="nbar__links">
          <a href="#wall">Roster</a>
          <a href="#kit">The kit</a>
          <a href="#phones">Creators</a>
          <a href="#products">Products</a>
        </nav>
        <a className="nbar__cta" href="https://stan.store" target="_blank" rel="noreferrer">
          Start building
        </a>
      </header>

      <main id="top">
        <section className="hero" id="phones">
          <div className="hero__left">
            <img className="hero__logo" src="/stan_logo.svg" alt="Stan" />
            <h1 className="hero__title">
              <span>BUILD</span>
              <span>YOUR</span>
              <span>OWN.</span>
            </h1>
            <p className="hero__sub">The platform for creators who put their name on the work.</p>
          </div>

          <div className="hero__right">
            <PhoneStage builder={activeBuilder} />

            <div className="phone__seg" role="tablist" aria-label="Creators">
              {BUILDERS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-label={b.name}
                  aria-selected={i === phoneIndex}
                  className={`phone__dot${i === phoneIndex ? ' phone__dot--on' : ''}`}
                  style={{ '--tone': b.color }}
                  onClick={() => setPhoneIndex(i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="wall" id="wall" aria-label="Builders">
          <div className="wall__stage">
            <div className="wall__cols">
              {WALL.map((b) => (
                <a
                  className="wall__col"
                  key={b.id}
                  href={b.href}
                  style={{ '--tone': b.color }}
                  aria-label={b.name}
                >
                  <span className="wall__glow" aria-hidden="true" />
                  <img className="wall__photo" src={b.img} alt="" />
                </a>
              ))}
            </div>
            <div className="wall__copy">
              <h2 className="wall__title">Build Your Own.</h2>
              <p className="wall__sub">Five builders. One mark. Tap a face to read their story.</p>
              <img className="wall__mark" src="/stan_logo.svg" alt="Stan" />
            </div>
          </div>
        </section>

        <section className="kit" id="kit">
          <FamilyScene progressRef={kitProgress} />
          <div className="kit__count" aria-hidden="true">
            <i>
              {KIT.map((k, n) => (
                <b key={k.id}>0{n + 1}</b>
              ))}
            </i>
          </div>
          {KIT.map((k) => (
            <article className="kit__act" key={k.id}>
              <h2 className="kit__lead">
                <Chars text={k.lead} />
              </h2>
              <p className="kit__tag">{k.tag}</p>
              <p className="kit__copy">{k.copy}</p>
            </article>
          ))}
          <p className="kit__hint" aria-hidden="true">
            Keep scrolling
          </p>
        </section>

        <section className="funnel" id="products">
          <header className="funnel__head">
            <img className="funnel__logo" src="/stan_logo.svg" alt="Stan" />
            <h2 className="funnel__title">
              One mark.
              <br />
              Four ways in.
            </h2>
            <p className="funnel__sub">Stanley, Store, Stories, Studio — the stack under every Stan.</p>
          </header>

          <div className="funnel__chart">
            <div className="funnel__apex">
              <img src="/stan_logo.svg" alt="" />
            </div>

            <svg className="funnel__edges" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <path className="funnel__edge" d="M50 2 L12.5 38" />
              <path className="funnel__edge" d="M50 2 L37.5 38" />
              <path className="funnel__edge" d="M50 2 L62.5 38" />
              <path className="funnel__edge" d="M50 2 L87.5 38" />
            </svg>

            <ul className="funnel__row">
              {PRODUCTS.map((p) => (
                <li className="funnel__item" key={p.id}>
                  <img className="funnel__icon" src={p.icon} alt="" />
                  <strong>{p.name}</strong>
                  <span>{p.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="roster" id="roster">
          <header className="roster__head">
            <h2 className="roster__title">
              Builders
              <br />
              already in
              <br />
              motion.
            </h2>
            <p className="roster__sub">
              Different story. Same grit. Four builders who put their name on the work.
            </p>
          </header>
          <div className="roster__grid">
            {BUILDERS.map((b) => (
              <BuilderCard key={b.id} builder={b} />
            ))}
          </div>
        </section>

        <section className="mq" aria-hidden="true">
          <div className="mq__track">
            {[...MARQUEE, ...MARQUEE].map((w, i) => (
              <span className={`mq__item${i % 2 ? ' mq__item--slash' : ''}`} key={i}>
                {w}
              </span>
            ))}
          </div>
        </section>

        {BUILDERS.map((b, i) => (
          <section className={`bill${i % 2 ? ' bill--alt' : ''}`} key={b.id} id={b.id}>
            <div className="bill__media">
              <div className="bill__wash" style={{ background: b.color }} aria-hidden="true" />
              <img className="bill__photo" src={b.img} alt={b.name} />
              <div className="bill__tint" />
            </div>
            <div className="bill__copy">
              <h2 className="bill__title">
                {b.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="bill__context">{b.context}</p>
              <div className="bill__foot">
                <img src="/stan_logo.svg" alt="Stan" />
                <span>{b.name}</span>
              </div>
            </div>
          </section>
        ))}

        <section className="manif">
          <div className="manif__halo" aria-hidden="true" />
          <h2 className="manif__title">
            {MANIFESTO.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </h2>
          <a className="nbtn nbtn--light manif__cta" href="https://stan.store" target="_blank" rel="noreferrer">
            Start building
          </a>
        </section>
      </main>

      <footer className="nfoot">
        <p className="nfoot__mark">BUILD YOUR OWN.</p>
        <div className="nfoot__grid">
          <div>
            <p className="nfoot__label">Explore</p>
            <a href="#phones">Creators</a>
            <a href="#wall">Roster</a>
            <a href="#products">Products</a>
            <a href="#kit">The kit</a>
          </div>
          <div>
            <p className="nfoot__label">Roster</p>
            {BUILDERS.map((b) => (
              <a key={b.id} href={`#${b.id}`}>
                {b.name}
              </a>
            ))}
          </div>
          <div>
            <p className="nfoot__label">Company</p>
            <a href="/stan">Classic</a>
            <a href="/">Editions</a>
            <a href="https://stan.store" target="_blank" rel="noreferrer">
              stan.store
            </a>
          </div>
        </div>
        <p className="nfoot__legal">
          <span>© 2026 Stan</span>
          <span>Build Your Own.</span>
        </p>
      </footer>
    </div>
  );
}
