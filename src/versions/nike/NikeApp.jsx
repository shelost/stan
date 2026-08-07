import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FamilyScene from '../stan/FamilyScene';

gsap.registerPlugin(ScrollTrigger);

const BACKDROPS = [
  '/alexander-dummer-aS4Duj2j7r4-unsplash.jpg',
  '/keagan-henman-pPxJTtxfV1A-unsplash.jpg',
  '/jonatan-pie-h8nxGssjQXs-unsplash.jpg',
  '/luca-micheli-ruWkmt3nU58-unsplash.jpg',
  '/sheng-l-q2dUSl9S4Xg-unsplash.jpg',
  '/tianshu-liu-aqZ3UAjs_M4-unsplash.jpg',
  '/ignacio-correia-1_yycyoMT6g-unsplash.jpg',
  '/computer.jpg',
];

const BUILDERS = [
  {
    id: 'jt',
    name: 'JT Barnett',
    handle: '@jtbarnett',
    tag: 'Content Strategy',
    role: 'Creator',
    number: '01',
    img: '/ch_2.png',
    color: '#c45a3e',
    headline: ['RETIRED', 'WITH', 'NOTHING.'],
    spotlight: ['RETIRED WITH', 'NOTHING.'],
    blurb: 'Left the rink with zero. Built the playbook brands still steal — under a name that stays yours.',
    context: 'Left pro hockey with $0. Built the playbook brands still steal.',
    line: 'Start over at zero.',
  },
  {
    id: 'steven',
    name: 'Steven Bartlett',
    handle: '@steven',
    tag: 'Podcaster',
    role: 'Creator',
    number: '02',
    img: '/ch_1.png',
    color: '#2f6fdb',
    headline: ['START BEFORE', "YOU'RE READY."],
    spotlight: ['FROM NOTHING', 'BUT A CAMERA.'],
    blurb: "Stan's integrated creation tools help you superpower your workflow by connecting your existing third-party tools.",
    context: 'From a Manchester estate to the chair across from every founder.',
    line: 'Own the mic.',
  },
  {
    id: 'roy',
    name: 'Roy Lee',
    handle: '@itsroylee',
    tag: 'Entrepreneur',
    role: 'Creator',
    number: '03',
    img: '/ch_4.png',
    color: '#1a9d4b',
    headline: ['BUILD', 'ANYWAY.'],
    spotlight: ['GET REJECTED.', 'GET FUNDED.'],
    blurb: 'Ship the company anyway. The stack stays under your name — not rented from someone else.',
    context: 'Suspended. Dropped out. Still shipped the company.',
    line: 'Get rejected. Get funded.',
  },
  {
    id: 'sarah',
    name: 'Sarah Perl',
    handle: '@hothighpriestess',
    tag: 'Social Media',
    role: 'Creator',
    number: '04',
    img: '/ch_5.png',
    color: '#d478a8',
    headline: ['POST', 'THE FIRST', 'ONE.'],
    spotlight: ['POST THE', 'FIRST ONE.'],
    blurb: 'One video. Then a storefront with your name on the door. Keep the relationship yours.',
    context: 'One tarot video. Then a seven-figure storefront.',
    line: 'Rewire everything.',
  },
];

const WALL = [
  { id: 'ch3', img: '/ch_3.png', color: '#e86a54', href: '#roster', name: 'Builder' },
  { id: 'ch2', img: '/ch_2.png', color: '#2e88d6', href: '#jt', name: 'JT Barnett' },
  { id: 'ch1', img: '/ch_1.png', color: '#000000', href: '#steven', name: 'Steven Bartlett', focal: true },
  { id: 'ch4', img: '/ch_4.png', color: '#2da566', href: '#roy', name: 'Roy Lee' },
  { id: 'ch5', img: '/ch_5.png', color: '#d1a56c', href: '#sarah', name: 'Sarah Perl' },
];

const PRODUCTS = [
  { id: 'stanley', icon: '/icon_stanley.svg', name: 'Stanley', tag: 'A second brain that sounds like you' },
  { id: 'store', icon: '/icon_store.svg', name: 'Store', tag: 'Where your work meets money' },
  { id: 'stories', icon: '/icon_stories.svg', name: 'Stories', tag: 'Proof it is possible' },
  { id: 'studio', icon: '/icon_studio.svg', name: 'Studio', tag: 'Ship the cut. Keep going.' },
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

const POSTERS = [
  { id: 'poster-own', img: '/ch_3.png', side: 'right', headline: ['BUILD', 'YOUR OWN.'] },
  { id: 'jt', img: '/ch_2.png', side: 'left', headline: ['RETIRED', 'WITH', 'NOTHING.'], name: 'JT Barnett' },
  { id: 'steven', img: '/ch_1.png', side: 'right', headline: ['START BEFORE', "YOU'RE READY."], name: 'Steven Bartlett' },
  { id: 'poster-fail', img: '/ch_1.png', side: 'left', headline: ['FAIL', 'FORWARD.'] },
  { id: 'roy', img: '/ch_4.png', side: 'right', headline: ['BUILD', 'ANYWAY.'], name: 'Roy Lee' },
  { id: 'sarah', img: '/ch_5.png', side: 'left', headline: ['POST', 'THE FIRST', 'ONE.'], name: 'Sarah Perl' },
  { id: 'poster-work', img: '/ch_5.png', side: 'right', headline: ['STOP DREAMING.', 'START WORKING.'] },
];

const PROOF = [
  { id: 'p1', img: '/ch_3.png', color: '#6f5478', name: 'Sarah Chen', tag: 'Creator' },
  { id: 'p2', img: '/ch_5.png', color: '#8a6a4a', name: 'Maya Ortiz', tag: 'Founder' },
  { id: 'p3', img: '/ch_1.png', color: '#3d5a80', name: 'Steven Bartlett', tag: 'Creator' },
];

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

export default function NikeApp() {
  const root = useRef(null);
  const kitProgress = useRef(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [spotIndex, setSpotIndex] = useState(1); // steven first, matches mock
  const spot = BUILDERS[spotIndex];

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % BACKDROPS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSpotIndex((i) => (i + 1) % BUILDERS.length);
    }, 6400);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);

        gsap.from('.nbar', { y: -24, duration: 0.7, ease: 'power3.out', delay: 0.05 });
        gsap.from('.hero__title span, .hero__cta', {
          y: 36,
          duration: 0.95,
          stagger: 0.08,
          ease: 'power4.out',
          delay: 0.15,
        });

        gsap.from('.spot__figure, .spot__meta, .spot__title span, .spot__blurb, .spot__ticks', {
          scrollTrigger: { trigger: '.spot', start: 'top 75%' },
          y: 28,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
        });

        gsap.from('.proof__title, .proof__card', {
          scrollTrigger: { trigger: '.proof', start: 'top 78%' },
          y: 32,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        });

        gsap.from('.orbit__copy, .orbit__stage', {
          scrollTrigger: { trigger: '.orbit', start: 'top 72%' },
          y: 28,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
        });

        // Drive the coin figure (act 0 of FamilyScene) gently while in view.
        ScrollTrigger.create({
          trigger: '.orbit',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            kitProgress.current = self.progress * 0.15;
          },
        });

        gsap.from('.band__inner', {
          scrollTrigger: { trigger: '.band', start: 'top 80%' },
          y: 40,
          duration: 0.85,
          ease: 'power3.out',
        });

        gsap.from('.wall__col', {
          scrollTrigger: { trigger: '.wall', start: 'top 72%' },
          yPercent: 12,
          duration: 1.05,
          stagger: 0.06,
          ease: 'power3.out',
        });
        gsap.from('.wall__photo', {
          scrollTrigger: { trigger: '.wall', start: 'top 72%' },
          y: 36,
          duration: 1.1,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.08,
        });
        gsap.from('.wall__title', {
          scrollTrigger: { trigger: '.wall', start: 'top 72%' },
          y: 28,
          autoAlpha: 0,
          duration: 0.95,
          ease: 'power4.out',
          delay: 0.28,
        });
        gsap.from('.wall__bar', {
          scrollTrigger: { trigger: '.wall', start: 'top 72%' },
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.18,
        });

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

        gsap.from('.roster__head, .pcard', {
          scrollTrigger: { trigger: '.roster', start: 'top 78%' },
          y: 36,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
        });

        q('.poster').forEach((sec) => {
          gsap
            .timeline({
              scrollTrigger: { trigger: sec, start: 'top top', end: '+=100%', scrub: true, pin: true },
            })
            .fromTo(
              sec.querySelector('.poster__photo'),
              { scale: 1.08, xPercent: 4 },
              { scale: 1, xPercent: 0, ease: 'none', duration: 1 },
              0
            )
            .fromTo(
              [sec.querySelector('.poster__logo'), sec.querySelector('.poster__title')],
              { y: 28 },
              { y: 0, stagger: 0.06, ease: 'power2.out', duration: 0.4 },
              0.1
            );
        });

        gsap
          .timeline({
            scrollTrigger: { trigger: '.manif', start: 'top top', end: '+=120%', scrub: true, pin: true },
          })
          .fromTo('.manif__photo', { scale: 1.1 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo(
            ['.manif__logo', '.manif__title', '.manif__cta'],
            { y: 24 },
            { y: 0, stagger: 0.08, ease: 'power2.out', duration: 0.4 },
            0.15
          );

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
          <a href="#spot">Creators</a>
          <a href="#proof">Roster</a>
          <a href="#products">Products</a>
        </nav>
        <a className="nbar__cta" href="https://stan.store" target="_blank" rel="noreferrer">
          Sign up
        </a>
      </header>

      <main id="top">
        {/* ---- Nike.com-style full-bleed hero ---- */}
        <section className="hero" aria-label="Build your own">
          <div className="hero__media" aria-hidden="true">
            {BACKDROPS.map((src, i) => (
              <img
                key={src}
                className={`hero__bg${i === heroIndex ? ' hero__bg--on' : ''}`}
                src={src}
                alt=""
              />
            ))}
            <div className="hero__scrim" />
          </div>
          <div className="hero__body">
            <h1 className="hero__title">
              <span>BUILD</span>
              <span>YOUR OWN.</span>
            </h1>
            <a className="nbtn nbtn--light hero__cta" href="https://stan.store" target="_blank" rel="noreferrer">
              Start building
            </a>
          </div>
          <div className="hero__ticks" aria-hidden="true">
            {BACKDROPS.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`hero__tick${i === heroIndex ? ' hero__tick--on' : ''}`}
                onClick={() => setHeroIndex(i)}
                aria-label={`Backdrop ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ---- Creator spotlight carousel ---- */}
        <section className="spot" id="spot">
          <div className="spot__stage">
            <div className="spot__glow" aria-hidden="true" />
            <div className="spot__figure" key={spot.id}>
              <img src={spot.img} alt={spot.name} />
            </div>
            <div className="spot__meta">
              <div className="spot__who">
                <strong>{spot.name}</strong>
                <span>/ {spot.role}</span>
              </div>
              <a className="spot__follow" href="https://stan.store" target="_blank" rel="noreferrer">
                Follow
              </a>
            </div>
          </div>

          <div className="spot__copy" key={`${spot.id}-copy`}>
            <h2 className="spot__title">
              {spot.spotlight.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="spot__blurb">{spot.blurb}</p>
          </div>

          <div className="spot__ticks" role="tablist" aria-label="Creators">
            {BUILDERS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-label={b.name}
                aria-selected={i === spotIndex}
                className={`spot__tick${i === spotIndex ? ' spot__tick--on' : ''}`}
                onClick={() => setSpotIndex(i)}
              />
            ))}
          </div>
        </section>

        {/* ---- Social proof grid ---- */}
        <section className="proof" id="proof">
          <h2 className="proof__title">The best entrepreneurs use Stan</h2>
          <div className="proof__grid">
            {PROOF.map((p) => (
              <article className="proof__card" key={p.id} style={{ '--tone': p.color }}>
                <img className="proof__photo" src={p.img} alt={p.name} />
                <div className="proof__foot">
                  <div>
                    <strong>{p.name}</strong>
                    <em>{p.tag}</em>
                  </div>
                  <a className="proof__follow" href="https://stan.store" target="_blank" rel="noreferrer">
                    Follow
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---- 3D coin / new way ---- */}
        <section className="orbit" id="orbit">
          <div className="orbit__stage" aria-hidden="true">
            <FamilyScene progressRef={kitProgress} />
          </div>
          <div className="orbit__copy">
            <h2 className="orbit__title">
              A new way
              <br />
              to work.
            </h2>
          </div>
        </section>

        {/* ---- Purple CTA band ---- */}
        <section className="band">
          <div className="band__inner">
            <div className="band__silhouettes" aria-hidden="true">
              {BUILDERS.map((b) => (
                <img key={b.id} src={b.img} alt="" />
              ))}
              <img src="/ch_3.png" alt="" />
            </div>
            <div className="band__mark">
              <img src="/stan_logo.svg" alt="Stan" />
              <p>Build Your Own.</p>
            </div>
          </div>
        </section>

        {/* ---- Existing: wall ---- */}
        <section className="wall" id="wall" aria-label="Builders">
          <div className="wall__stage">
            <div className="wall__cols">
              {WALL.map((b) => (
                <a
                  className={`wall__col${b.focal ? ' wall__col--focal' : ''}`}
                  key={b.id}
                  href={b.href}
                  style={{ '--tone': b.color }}
                  aria-label={b.name}
                >
                  <img className="wall__photo" src={b.img} alt="" />
                </a>
              ))}
            </div>
            <div className="wall__bar" aria-hidden="true" />
            <div className="wall__copy">
              <h2 className="wall__title">Build Your Own</h2>
            </div>
          </div>
        </section>

        {/* ---- Existing: products funnel ---- */}
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

        {/* ---- Existing: roster cards ---- */}
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

        {POSTERS.map((p) => (
          <section className={`poster${p.side === 'left' ? ' poster--left' : ''}`} key={p.id} id={p.id}>
            <div className="poster__media" aria-hidden="true">
              <img className="poster__photo" src={p.img} alt="" />
              <div className="poster__atmos" />
            </div>
            <div className="poster__copy">
              <img className="poster__logo" src="/stan_logo.svg" alt="Stan" />
              <h2 className="poster__title">
                {p.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
            </div>
          </section>
        ))}

        <section className="manif">
          <div className="manif__media" aria-hidden="true">
            <img className="manif__photo" src="/ch_4.png" alt="" />
            <div className="manif__atmos" />
          </div>
          <div className="manif__copy">
            <img className="manif__logo" src="/stan_logo.svg" alt="Stan" />
            <h2 className="manif__title">
              {MANIFESTO.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </h2>
            <a className="nbtn nbtn--light manif__cta" href="https://stan.store" target="_blank" rel="noreferrer">
              Start building
            </a>
          </div>
        </section>
      </main>

      <footer className="nfoot">
        <p className="nfoot__mark">BUILD YOUR OWN.</p>
        <div className="nfoot__grid">
          <div>
            <p className="nfoot__label">Explore</p>
            <a href="#spot">Creators</a>
            <a href="#wall">Roster</a>
            <a href="#products">Products</a>
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
