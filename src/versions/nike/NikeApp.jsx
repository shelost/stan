import { useEffect, useRef } from 'react';
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
    img: '/img_jtbarnett.png',
    color: '#e07a5f',
    // Pro hockey → retired with $0 → rebuilt via content + CreatorX
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
    img: '/img_steven.png',
    color: '#3b82f6',
    // Social Chain → Diary of a CEO → Dragon's Den
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
    img: '/img_roylee.png',
    color: '#22c55e',
    // Suspended / dropped out → founded Cluely
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
    img: '/img_sarahperl.png',
    color: '#f7a8d8',
    // Immigrant / scarcity → one viral TikTok → seven-figure Stan
    headline: ['POST', 'THE FIRST', 'ONE.'],
    quote: 'They said the dream was crazy. She posted anyway.',
    context: 'One tarot video. Then a seven-figure storefront.',
    line: 'Rewire everything.',
  },
];

// Five-person wall — studio cutouts on black (ch_1…ch_5).
const WALL = [
  { id: 'ch1', img: '/ch_1.png' },
  { id: 'ch2', img: '/ch_2.png' },
  { id: 'ch3', img: '/ch_3.png' },
  { id: 'ch4', img: '/ch_4.png' },
  { id: 'ch5', img: '/ch_5.png' },
];

const FEATURED = BUILDERS[3];

// Four products under the Stan mark — icons shared with /stan.
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

const CREED = [
  {
    id: 'name',
    mark: '01',
    lead: 'YOUR NAME.',
    line: 'On the door. On the work. On the thing you refuse to rent.',
  },
  {
    id: 'audience',
    mark: '02',
    lead: 'YOUR AUDIENCE.',
    line: 'Not borrowed reach. People who chose you — and stay.',
  },
  {
    id: 'terms',
    mark: '03',
    lead: 'YOUR TERMS.',
    line: 'What you sell. What you charge. Who you answer to.',
  },
  {
    id: 'craft',
    mark: '04',
    lead: 'YOUR CRAFT.',
    line: 'The drafts. The late nights. Shipped on your clock.',
  },
];

const MARQUEE = [
  'RETIRED WITH NOTHING',
  'START BEFORE YOU\'RE READY',
  'BUILD ANYWAY',
  'POST THE FIRST ONE',
  'OWN THE MIC',
  'FAIL FORWARD',
];

const MANIFESTO = ['NOBODY', 'HANDS', 'YOU', 'A', 'BUSINESS.', 'YOU', 'BUILD', 'YOUR', 'OWN.'];

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
  const long = builder.headline.some((line) => line.length > 10);
  return (
    <article className="pcard">
      <p className="pcard__label">products</p>
      <div className="pcard__frame">
        <div className="pcard__brand">
          <img src="/stan_logo.svg" alt="Stan" />
        </div>
        <p className="pcard__num" aria-hidden="true">
          {builder.number}
        </p>
        <h3 className={`pcard__slogan${long ? ' pcard__slogan--long' : ''}`}>
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
    </article>
  );
}

export default function NikeApp() {
  const kitProgress = useRef(0);
  const root = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);

      // Transform-only entrances — never hide hero content with autoAlpha
      // (StrictMode remounts were leaving mid-fade / invisible states).
      gsap.from('.nbar', { y: -28, duration: 0.7, ease: 'power3.out', delay: 0.05 });
      gsap.from('.hero__logo, .hero__title span, .hero__stage', {
        y: 28,
        duration: 0.85,
        stagger: 0.06,
        ease: 'power4.out',
        delay: 0.1,
      });

      gsap.from('.funnel__apex, .funnel__item', {
        scrollTrigger: { trigger: '.funnel', start: 'top 75%' },
        y: 28,
        duration: 0.8,
        stagger: 0.07,
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

      gsap.from('.wall__col', {
        scrollTrigger: { trigger: '.wall', start: 'top 70%' },
        y: 24,
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
      });
      gsap.from('.wall__title, .wall__mark', {
        scrollTrigger: { trigger: '.wall', start: 'top 70%' },
        y: 16,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2,
      });

      const creedActs = q('.creed__act');
      const creedN = creedActs.length;
      const creedTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.creed',
          start: 'top top',
          end: `+=${creedN * 105}%`,
          scrub: true,
          pin: true,
        },
      });

      creedActs.forEach((act, i) => {
        const at = i * 1;
        gsap.set(act, { autoAlpha: i === 0 ? 1 : 0 });
        if (i > 0) {
          creedTl.to(act, { autoAlpha: 1, duration: 0.14 }, at - 0.14);
          creedTl.fromTo(
            act.querySelectorAll('.creed__lead .ch'),
            { yPercent: 110 },
            { yPercent: 0, stagger: 0.02, ease: 'power3.out', duration: 0.28 },
            at - 0.08
          );
          creedTl.fromTo(
            act.querySelector('.creed__line'),
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.22 },
            at - 0.04
          );
        }
        if (i < creedN - 1) {
          creedTl.to(act, { autoAlpha: 0, yPercent: -5, duration: 0.16 }, at + 0.68);
          creedTl.set(act, { yPercent: 0 }, at + 0.86);
        }
        creedTl.to(
          '.creed__tick',
          { xPercent: (i / (creedN - 1)) * 100, duration: 0.28, ease: 'power2.inOut' },
          Math.max(0, at - 0.08)
        );
      });
      creedTl.set({}, {}, creedN - 1 + 0.3);

      gsap.from('.roster__head, .pcard', {
        scrollTrigger: { trigger: '.roster', start: 'top 78%' },
        y: 36,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
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

      q('.bill').forEach((sec) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: sec, start: 'top top', end: '+=110%', scrub: true, pin: true },
          })
          .fromTo(sec.querySelector('.bill__photo'), { scale: 1.14 }, { scale: 1.02, ease: 'none', duration: 1 }, 0)
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
          <a href="#creed">The idea</a>
          <a href="#products">Products</a>
          <a href="#wall">Roster</a>
          <a href="#kit">The kit</a>
        </nav>
        <a className="nbar__cta" href="https://stan.store" target="_blank" rel="noreferrer">
          Start building
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__left">
            <img className="hero__logo" src="/stan_logo.svg" alt="Stan" />
            <h1 className="hero__title">
              <span>BUILD</span>
              <span>YOUR</span>
              <span>OWN.</span>
            </h1>
          </div>
          <div className="hero__stage">
            <div
              className="hero__panel"
              style={{ background: FEATURED.color }}
              aria-hidden="true"
            />
            <img className="hero__photo" src={FEATURED.img} alt={FEATURED.name} />
            <div className="hero__meta">
              <strong>{FEATURED.name}</strong>
              <em>{FEATURED.handle}</em>
              <span className="hero__pill">{FEATURED.tag}</span>
            </div>
          </div>
        </section>

        <section className="pace" aria-hidden="true">
          <div className="pace__track">
            <span>PREP</span>
            <i />
            <span>WORK</span>
            <i />
            <span>OWN</span>
          </div>
          <p className="pace__note">Find your pace</p>
        </section>

        <section className="creed" id="creed">
          <p className="creed__eyebrow">What we mean</p>
          <div className="creed__meter" aria-hidden="true">
            <b className="creed__tick" />
          </div>
          {CREED.map((c) => (
            <article className="creed__act" key={c.id}>
              <p className="creed__mark">{c.mark}</p>
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

        <section className="funnel" id="products">
          <header className="funnel__head">
            <p className="funnel__eyebrow">Products</p>
            <h2 className="funnel__title">
              One mark.
              <br />
              Four ways in.
            </h2>
          </header>

          <div className="funnel__chart">
            <div className="funnel__apex">
              <img src="/stan_logo.svg" alt="Stan" />
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

        <section className="wall" id="wall" aria-label="Builders">
          <div className="wall__stage">
            <div className="wall__cols" aria-hidden="true">
              {WALL.map((b) => (
                <div className="wall__col" key={b.id}>
                  <img className="wall__photo" src={b.img} alt="" />
                </div>
              ))}
            </div>
            <div className="wall__copy">
              <h2 className="wall__title">Build Your Own.</h2>
              <img className="wall__mark" src="/stan_logo.svg" alt="Stan" />
            </div>
          </div>
        </section>

        <section className="roster" id="roster">
          <header className="roster__head">
            <p className="roster__eyebrow">The roster</p>
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

        <section className="bridge">
          <p className="bridge__mark">The kit</p>
          <h2 className="bridge__title">
            Gear for
            <br />
            the ones
            <br />
            who build.
          </h2>
          <p className="bridge__sub">Not the point of the story — the tools that get you there.</p>
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

        {BUILDERS.map((b, i) => (
          <section className={`bill${i % 2 ? ' bill--flip' : ''}`} key={b.id} id={b.id}>
            <div className="bill__media">
              <img className="bill__photo" src={b.img} alt={b.name} />
              <div className="bill__tint" />
            </div>
            <div className="bill__copy">
              {b.quote ? (
                <h2 className="bill__title bill__title--quote">{b.quote}</h2>
              ) : (
                <h2 className="bill__title">
                  {b.headline.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
              )}
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
            <p className="nfoot__label">The idea</p>
            <a href="#creed">Your name</a>
            <a href="#products">Products</a>
            <a href="#creed">Your terms</a>
            <a href="#creed">Your craft</a>
          </div>
          <div>
            <p className="nfoot__label">Roster</p>
            {BUILDERS.map((b) => (
              <a key={b.id} href="#roster">
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
