import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
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
    id: 'roy',
    name: 'Roy Lee',
    handle: '@im_roy_lee',
    tag: 'Founder, Cluely',
    img: '/ch_4.png',
    color: '#1a9d4b',
  },
  {
    id: 'steven',
    name: 'Steven Bartlett',
    handle: '@steven',
    tag: 'The Diary of a CEO',
    img: '/ch_1.png',
    color: '#2f6fdb',
  },
  {
    id: 'emma',
    name: 'Emma Grede',
    handle: '@emmagrede',
    tag: 'CEO, Good American',
    img: '/ch_5.png',
    color: '#8a6a86',
  },
  {
    id: 'sarah',
    name: 'Sarah Perl',
    handle: '@hothighpriestess',
    tag: 'Manifestation Coach',
    img: '/ch_3.png',
    color: '#d478a8',
  },
  {
    id: 'jt',
    name: 'JT Barnett',
    handle: '@jtbarnett',
    tag: 'Founder, BarnettX',
    img: '/ch_2.png',
    color: '#c45a3e',
  },
];

const PRODUCTS = [
  { id: 'stanley', icon: '/icon_stanley.svg', name: 'Stanley', tag: 'A second brain that sounds like you' },
  { id: 'studio', icon: '/icon_studio.svg', name: 'Studio', tag: 'Ship the cut. Keep going.' },
  { id: 'store', icon: '/icon_store.svg', name: 'Store', tag: 'Where your work meets money' },
];

const MARQUEE = [
  'BUILD YOUR OWN',
  'YOUR NAME',
  'YOUR AUDIENCE',
  'YOUR TERMS',
  'YOUR CRAFT',
  'OWNED',
];

const MANIFESTO = ['NOBODY', 'HANDS', 'YOU', 'A', 'BUSINESS.', 'YOU', 'BUILD', 'YOUR', 'OWN.'];

const POSTERS = [
  { id: 'poster-own', img: '/ch_5.png', side: 'right', headline: ['BUILD', 'YOUR OWN.'] },
  { id: 'jt', img: '/ch_2.png', side: 'left', headline: ['RETIRED', 'WITH', 'NOTHING.'], name: 'JT Barnett' },
  { id: 'steven', img: '/ch_1.png', side: 'right', headline: ['START BEFORE', "YOU'RE READY."], name: 'Steven Bartlett' },
  { id: 'poster-fail', img: '/ch_1.png', side: 'left', headline: ['FAIL', 'FORWARD.'] },
  { id: 'roy', img: '/ch_4.png', side: 'right', headline: ['BUILD', 'ANYWAY.'], name: 'Roy Lee' },
  { id: 'sarah', img: '/ch_3.png', side: 'left', headline: ['POST', 'THE FIRST', 'ONE.'], name: 'Sarah Perl' },
  { id: 'poster-work', img: '/ch_5.png', side: 'right', headline: ['STOP DREAMING.', 'START WORKING.'] },
];

// Splits a line into per-character spans inside word wrappers so
// headlines can animate word by word. The split copy is aria-hidden;
// a screen-reader-only span carries the real text.
function Chars({ text }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="chars" aria-hidden="true">
        {text.split(' ').map((word, wi) => (
          <span className="chars__word" key={`${word}-${wi}`}>
            {word.split('').map((ch, ci) => (
              <span className="chars__ch" key={ci}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

function SectionHead({ index, label, title, sub, tone = 'dark' }) {
  return (
    <header className={`shead${tone === 'light' ? ' shead--light' : ''}`}>
      <p className="shead__eyebrow">
        <span>{index}</span>
        {label}
      </p>
      <h2 className="shead__title">
        <Chars text={title} />
      </h2>
      {sub && <p className="shead__sub">{sub}</p>}
    </header>
  );
}

function Marquee({ variant = '' }) {
  return (
    <section className={`mq${variant ? ` mq--${variant}` : ''}`} aria-hidden="true">
      <div className="mq__track">
        {[...MARQUEE, ...MARQUEE].map((w, i) => (
          <span className={`mq__item${i % 2 ? ' mq__item--slash' : ''}`} key={`${variant}-${i}`}>
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function NikeApp() {
  const root = useRef(null);
  const kitProgress = useRef(0);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setHeroIndex((i) => (i + 1) % BACKDROPS.length), 5600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Lenis inertia scrolling drives ScrollTrigger for the Apple-glide feel.
    let lenis = null;
    let lenisTick = null;
    let onAnchorClick = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      lenisTick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);

      // Route in-page anchors through Lenis so nav taps glide too.
      onAnchorClick = (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      };
      document.addEventListener('click', onAnchorClick);
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);
        const cleanups = [];

        // Words slam down from above the screen plane — heavy stamp,
        // slight overshoot squash, then settle.
        const pound = (targets, vars = {}) =>
          gsap.fromTo(
            targets,
            { scale: 2.6, autoAlpha: 0, filter: 'blur(10px)' },
            {
              keyframes: [
                { scale: 0.94, autoAlpha: 1, filter: 'blur(0px)', duration: 0.34, ease: 'power4.in' },
                { scale: 1, duration: 0.24, ease: 'back.out(4)' },
              ],
              stagger: 0.14,
              ...vars,
            }
          );

        // ---- nav + hero entrance ----
        gsap.from('.nbar', { y: -18, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: 0.1 });
        pound(q('.hero .chars__word'), { delay: 0.25, stagger: 0.2 });
        gsap.from('.hero__sub, .hero__cta, .hero__ticks, .hero__cue', {
          y: 24,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.09,
          ease: 'expo.out',
          delay: 1.1,
        });

        // ---- hero scroll parallax: media sinks slower, copy lifts away ----
        gsap.fromTo(
          '.hero__media',
          { yPercent: 0, scale: 1 },
          {
            yPercent: 16,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          }
        );
        gsap.to('.hero__body', {
          yPercent: -36,
          autoAlpha: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '75% top', scrub: true },
        });

        // ---- hero pointer parallax ----
        const heroEl = q('.hero')[0];
        const bodyX = gsap.quickTo('.hero__body', 'x', { duration: 1, ease: 'power3.out' });
        const bodyY = gsap.quickTo('.hero__body', 'y', { duration: 1, ease: 'power3.out' });
        const mediaX = gsap.quickTo('.hero__media', 'x', { duration: 1.4, ease: 'power3.out' });
        const onHeroMove = (e) => {
          const r = heroEl.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
          const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
          bodyX(nx * 16);
          bodyY(ny * 10);
          mediaX(nx * -22);
        };
        heroEl.addEventListener('pointermove', onHeroMove);
        cleanups.push(() => heroEl.removeEventListener('pointermove', onHeroMove));

        // ---- cards: title pounds, cards shear up with photo counter-zoom ----
        pound(q('.proof .chars__word'), {
          stagger: 0.1,
          scrollTrigger: { trigger: '.proof', start: 'top 72%' },
        });
        gsap.from('.proof .shead__eyebrow, .proof .shead__sub', {
          scrollTrigger: { trigger: '.proof', start: 'top 72%' },
          y: 18,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.4,
        });
        q('.proof__card').forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 110, rotate: (i - 2) * 1.4, autoAlpha: 0 },
            {
              y: 0,
              rotate: 0,
              autoAlpha: 1,
              duration: 1.3,
              ease: 'expo.out',
              delay: i * 0.1,
              scrollTrigger: { trigger: '.proof__grid', start: 'top 84%' },
            }
          );
          const photo = card.querySelector('.proof__photo');
          gsap.fromTo(
            photo,
            { scale: 1.18, yPercent: 6 },
            {
              scale: 1,
              yPercent: -2,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });

        // ---- orbit ----
        ScrollTrigger.create({
          trigger: '.orbit',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            kitProgress.current = self.progress * 0.15;
          },
        });
        pound(q('.orbit .chars__word'), {
          stagger: 0.1,
          scrollTrigger: { trigger: '.orbit', start: 'top 70%' },
        });
        gsap.from('.orbit .shead__eyebrow, .orbit .shead__sub', {
          scrollTrigger: { trigger: '.orbit', start: 'top 70%' },
          y: 18,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.4,
        });
        gsap.from('.orbit__stage', {
          scrollTrigger: { trigger: '.orbit', start: 'top 64%' },
          y: 40,
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.4,
          ease: 'expo.out',
        });

        // ---- product tree: draw in, then stay alive ----
        const treeIdle = () => {
          // Edges become flowing dashed conveyors once drawn.
          q('.funnel__edge').forEach((edge) => {
            edge.setAttribute('stroke-dasharray', '2.5 5');
            gsap.fromTo(
              edge,
              { strokeDashoffset: 0 },
              { strokeDashoffset: -7.5, duration: 0.9, ease: 'none', repeat: -1 }
            );
          });
          gsap.to('.funnel__apex img', {
            scale: 1.07,
            duration: 1.9,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
          gsap.to('.funnel__icon', {
            y: -9,
            duration: 2.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.45,
          });
        };
        const funnelTl = gsap.timeline({
          scrollTrigger: { trigger: '.funnel', start: 'top 70%' },
          defaults: { ease: 'expo.out' },
          onComplete: treeIdle,
        });
        funnelTl
          .from('.funnel__apex', { y: 26, autoAlpha: 0, scale: 0.85, duration: 0.8 })
          .fromTo(
            '.funnel__edge',
            { strokeDashoffset: 120 },
            { strokeDashoffset: 0, duration: 1, stagger: 0.1, ease: 'power2.inOut' },
            '-=0.25'
          )
          .from(
            '.funnel__icon',
            { scale: 0.4, autoAlpha: 0, duration: 0.7, stagger: 0.14, ease: 'back.out(1.6)' },
            '-=0.5'
          )
          .from(
            '.funnel__item strong, .funnel__item span',
            { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.06 },
            '-=0.55'
          );

        // ---- way: giant mark scales up under scrub, Apple style ----
        gsap.fromTo(
          '.way__logo',
          { scale: 0.55, yPercent: 24 },
          {
            scale: 1,
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.way', start: 'top bottom', end: 'center 55%', scrub: true },
          }
        );
        pound(q('.way .chars__word'), {
          stagger: 0.1,
          scrollTrigger: { trigger: '.way', start: 'top 52%' },
        });
        gsap.from('.way__sub', {
          scrollTrigger: { trigger: '.way', start: 'top 52%' },
          y: 16,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.55,
        });

        // ---- posters: pinned, photo settles, headline lines slam under scrub ----
        q('.poster').forEach((sec) => {
          const photo = sec.querySelector('.poster__photo');
          const lines = sec.querySelectorAll('.poster__title span');
          const logo = sec.querySelector('.poster__logo');
          if (!photo) return;
          const tl = gsap.timeline({
            scrollTrigger: { trigger: sec, start: 'top top', end: '+=100%', scrub: true, pin: true },
          });
          tl.fromTo(photo, { scale: 1.08, yPercent: 4 }, { scale: 1, yPercent: -3, ease: 'none', duration: 1 }, 0);
          if (logo) tl.fromTo(logo, { autoAlpha: 0.3, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.08);
          if (lines.length) {
            tl.fromTo(
              lines,
              { scale: 1.7, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, stagger: 0.09, ease: 'power3.in', duration: 0.34 },
              0.1
            );
          }
        });

        // ---- manifesto: pinned scroll-scrub word slam ----
        const manifTl = gsap.timeline({
          scrollTrigger: { trigger: '.manif', start: 'top top', end: '+=180%', scrub: true, pin: true },
        });
        manifTl
          .fromTo('.manif__photo', { scale: 1.1 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo(
            '.manif__title span',
            { opacity: 0.1, scale: 1.55 },
            { opacity: 1, scale: 1, stagger: 0.09, ease: 'power2.out', duration: 0.8 },
            0.05
          )
          .fromTo('.manif__cta', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.86);

        // ---- marquees: scroll-velocity driven ----
        q('.mq').forEach((el) => {
          const track = el.querySelector('.mq__track');
          if (!track) return;
          const wrap = gsap.utils.wrap(-50, 0);
          let x = 0;
          let vel = 0;
          ScrollTrigger.create({
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              vel = self.getVelocity();
            },
          });
          const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.35, ease: 'power2.out' });
          const tickFn = (_t, dtms) => {
            const dt = Math.min(dtms, 100) / 1000;
            const speed = 3.2 + gsap.utils.clamp(-26, 28, vel / 320);
            x = wrap(x - speed * dt);
            gsap.set(track, { xPercent: x });
            skewTo(gsap.utils.clamp(-7, 7, vel / -560));
            vel *= 0.9;
          };
          gsap.ticker.add(tickFn);
          cleanups.push(() => gsap.ticker.remove(tickFn));
        });

        gsap.from('.nfoot__mark, .nfoot__grid > div, .nfoot__legal', {
          scrollTrigger: { trigger: '.nfoot', start: 'top 88%' },
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: 'expo.out',
        });

        return () => {
          cleanups.forEach((fn) => fn());
        };
      });
    }, root);

    return () => {
      ctx.revert();
      if (onAnchorClick) document.removeEventListener('click', onAnchorClick);
      if (lenisTick) gsap.ticker.remove(lenisTick);
      if (lenis) {
        lenis.destroy();
        if (window.__lenis === lenis) delete window.__lenis;
      }
    };
  }, []);

  return (
    <div className="nike" ref={root}>
      <header className="nbar">
        <a className="nbar__logo" href="#top" aria-label="Stan">
          <img src="/stan_logo.svg" alt="Stan" />
        </a>
        <nav className="nbar__links">
          <a href="#proof">Creators</a>
          <a href="#orbit">System</a>
          <a href="#products">Products</a>
        </nav>
        <a className="nbar__cta" href="https://stan.store" target="_blank" rel="noreferrer">
          Sign up
        </a>
      </header>

      <main id="top">
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
              <span className="hero__line">
                <Chars text="BUILD" />
              </span>
              <span className="hero__line">
                <Chars text="YOUR OWN." />
              </span>
            </h1>
            <p className="hero__sub">The everything store for creators. Your name. Your audience. Your terms.</p>
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
          <div className="hero__cue" aria-hidden="true">
            <span />
          </div>
        </section>

        <Marquee variant="top" />

        <section className="proof" id="proof">
          <SectionHead
            index="01"
            label="The roster"
            title="THE BEST BUILD ON STAN"
            sub="Founders, podcasters, and coaches — all shipping under their own name."
          />
          <div className="proof__grid">
            {BUILDERS.map((p) => (
              <article className="proof__card" key={p.id} style={{ '--tone': p.color }}>
                <div className="proof__frame">
                  <img className="proof__photo" src={p.img} alt={p.name} />
                </div>
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

        <section className="orbit" id="orbit">
          <SectionHead
            index="02"
            label="The system"
            title="ONE STACK. YOURS."
            sub="The tools in constant orbit around a single point — you."
          />
          <div className="orbit__stage" aria-hidden="true">
            <FamilyScene progressRef={kitProgress} />
          </div>
        </section>

        <section className="funnel" id="products">
          <div className="funnel__chart">
            <div className="funnel__apex">
              <img src="/stan_logo.svg" alt="Stan" />
            </div>
            <svg className="funnel__edges" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <path className="funnel__edge" d="M50 2 L16.5 38" pathLength="100" />
              <path className="funnel__edge" d="M50 2 L50 38" pathLength="100" />
              <path className="funnel__edge" d="M50 2 L83.5 38" pathLength="100" />
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

        <section className="way" id="way">
          <img className="way__logo" src="/stan_logo.svg" alt="Stan" />
          <h2 className="way__title">
            <Chars text="A NEW WAY TO WORK." />
          </h2>
          <p className="way__sub">One store. One brain. One name — yours.</p>
        </section>

        <Marquee />

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
        <p className="nfoot__mark">Build your own.</p>
        <div className="nfoot__grid">
          <div>
            <p className="nfoot__label">Explore</p>
            <a href="#proof">Creators</a>
            <a href="#orbit">System</a>
            <a href="#products">Products</a>
          </div>
          <div>
            <p className="nfoot__label">Creators</p>
            {BUILDERS.map((b) => (
              <a key={b.id} href="#proof">
                {b.name}
              </a>
            ))}
          </div>
          <div>
            <p className="nfoot__label">Company</p>
            <a href="/editions">Editions</a>
            <a href="/gallery">Gallery</a>
            <a href="https://stan.store" target="_blank" rel="noreferrer">
              stan.store
            </a>
          </div>
        </div>
        <p className="nfoot__legal">
          <span>© 2026 Stan</span>
          <span>Build your own.</span>
        </p>
      </footer>
    </div>
  );
}
