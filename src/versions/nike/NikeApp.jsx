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
    headline: ['BUILD', 'ANYWAY.'],
    spotlight: ['KICKED OUT.', 'FUNDED ANYWAY.'],
    blurb:
      'Suspended by Columbia for the AI tool he built. Months later, Cluely raised $15M from a16z. He shipped anyway — under his own name.',
    float: { x: '8%', y: '22%', depth: 1.4, delay: 0 },
  },
  {
    id: 'steven',
    name: 'Steven Bartlett',
    handle: '@steven',
    tag: 'The Diary of a CEO',
    img: '/ch_1.png',
    color: '#2f6fdb',
    headline: ['START BEFORE', "YOU'RE READY."],
    spotlight: ['FROM NOTHING', 'BUT A CAMERA.'],
    blurb:
      'Dropped out at 18. Built Social Chain, then the biggest business podcast in the world. Every episode ships under his name.',
    float: { x: '62%', y: '18%', depth: 0.8, delay: 0.35 },
  },
  {
    id: 'emma',
    name: 'Emma Grede',
    handle: '@emmagrede',
    tag: 'CEO, Good American',
    img: '/ch_5.png',
    color: '#8a6a86',
    headline: ['THE ROOM', 'STAYS YOURS.'],
    spotlight: ['THE ROOM', 'STAYS YOURS.'],
    blurb:
      'The largest denim launch in history. Founding partner of Skims. Shark on Shark Tank. She builds brands — and keeps the room.',
    float: { x: '13%', y: '58%', depth: 1.1, delay: 0.7 },
  },
  {
    id: 'sarah',
    name: 'Sarah Perl',
    handle: '@hothighpriestess',
    tag: 'Manifestation Coach',
    img: '/ch_3.png',
    color: '#d478a8',
    headline: ['POST', 'THE FIRST', 'ONE.'],
    spotlight: ['ONE VIDEO.', 'ONE MILLION.'],
    blurb:
      'One tarot video at 150 followers. A seven-figure manifestation business on Stan by 23 — one of its highest-earning creators.',
    float: { x: '68%', y: '54%', depth: 1.6, delay: 1.05 },
  },
  {
    id: 'jt',
    name: 'JT Barnett',
    handle: '@jtbarnett',
    tag: 'Founder, BarnettX',
    img: '/ch_2.png',
    color: '#c45a3e',
    headline: ['RETIRED', 'WITH', 'NOTHING.'],
    spotlight: ['RETIRED WITH', 'NOTHING.'],
    blurb:
      'Left pro hockey with zero. Now the strategist Fortune 500 brands call before they post. The playbook stays his.',
    float: { x: '40%', y: '74%', depth: 0.6, delay: 1.4 },
  },
];

const WALL = [
  { id: 'ch3', img: '/ch_5.png', color: '#e86a54', href: '#spot', name: 'Emma Grede' },
  { id: 'ch2', img: '/ch_2.png', color: '#2e88d6', href: '#spot', name: 'JT Barnett' },
  { id: 'ch1', img: '/ch_1.png', color: '#000000', href: '#spot', name: 'Steven Bartlett', focal: true },
  { id: 'ch4', img: '/ch_4.png', color: '#2da566', href: '#spot', name: 'Roy Lee' },
  { id: 'ch5', img: '/ch_3.png', color: '#d1a56c', href: '#spot', name: 'Sarah Perl' },
];

const PRODUCTS = [
  { id: 'stanley', icon: '/icon_stanley.svg', name: 'Stanley', tag: 'A second brain that sounds like you' },
  { id: 'store', icon: '/icon_store.svg', name: 'Store', tag: 'Where your work meets money' },
  { id: 'stories', icon: '/icon_stories.svg', name: 'Stories', tag: 'Proof it is possible' },
  { id: 'studio', icon: '/icon_studio.svg', name: 'Studio', tag: 'Ship the cut. Keep going.' },
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

const PROOF = BUILDERS.filter((b) => ['emma', 'sarah', 'steven'].includes(b.id)).map((b) => ({
  id: b.id,
  img: b.img,
  color: b.color,
  name: b.name,
  tag: b.tag,
}));

// Splits a line into per-character spans so headlines can rise out of
// masked word wrappers. The visually-split copy is aria-hidden; a
// screen-reader-only span carries the real text.
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
  const [spotIndex, setSpotIndex] = useState(1);
  const spot = BUILDERS[spotIndex];

  useEffect(() => {
    const id = window.setInterval(() => setHeroIndex((i) => (i + 1) % BACKDROPS.length), 5600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setSpotIndex((i) => (i + 1) % BUILDERS.length), 7000);
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

        // ---- nav + hero entrance ----
        gsap.from('.nbar', { y: -18, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: 0.1 });
        gsap.fromTo(
          '.hero .chars__ch',
          { yPercent: 120 },
          { yPercent: 0, duration: 1.25, stagger: 0.024, ease: 'expo.out', delay: 0.2 }
        );
        gsap.from('.hero__sub, .hero__cta, .hero__ticks, .hero__cue', {
          y: 24,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.09,
          ease: 'expo.out',
          delay: 0.7,
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

        // ---- spotlight: floats rise in, drift idle, and drift again on scroll ----
        gsap.from('.spot__float', {
          scrollTrigger: { trigger: '.spot', start: 'top 68%' },
          y: 56,
          autoAlpha: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: 'expo.out',
        });
        gsap.to('.spot__float', {
          y: '-=12',
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.4, from: 'random' },
        });
        q('.spot__float').forEach((el) => {
          const depth = parseFloat(el.dataset.depth || '1');
          gsap.fromTo(
            el,
            { yPercent: 30 * depth },
            {
              yPercent: -30 * depth,
              ease: 'none',
              scrollTrigger: { trigger: '.spot', start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
        gsap.fromTo(
          '.spot__photo',
          { yPercent: 8 },
          {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: { trigger: '.spot', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );

        // ---- proof: title chars, then cards shear up with photo counter-zoom ----
        gsap.fromTo(
          '.proof .chars__ch',
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.018,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.proof', start: 'top 74%' },
          }
        );
        gsap.from('.proof .shead__eyebrow, .proof .shead__sub', {
          scrollTrigger: { trigger: '.proof', start: 'top 74%' },
          y: 18,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
        });
        q('.proof__card').forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 110, rotate: (i - 1) * 1.6, autoAlpha: 0 },
            {
              y: 0,
              rotate: 0,
              autoAlpha: 1,
              duration: 1.3,
              ease: 'expo.out',
              delay: i * 0.12,
              scrollTrigger: { trigger: '.proof__grid', start: 'top 82%' },
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
        gsap.from('.orbit .shead__eyebrow, .orbit .shead__sub', {
          scrollTrigger: { trigger: '.orbit', start: 'top 72%' },
          y: 18,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
        });
        gsap.fromTo(
          '.orbit .chars__ch',
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.018,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.orbit', start: 'top 72%' },
          }
        );
        gsap.from('.orbit__stage', {
          scrollTrigger: { trigger: '.orbit', start: 'top 66%' },
          y: 40,
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.4,
          ease: 'expo.out',
        });

        // ---- band ----
        gsap.from('.band__inner', {
          scrollTrigger: { trigger: '.band', start: 'top 80%' },
          y: 48,
          autoAlpha: 0,
          scale: 0.97,
          duration: 1.2,
          ease: 'expo.out',
        });

        // ---- wall: columns settle, photos parallax at their own speeds ----
        gsap.from('.wall__col', {
          scrollTrigger: { trigger: '.wall', start: 'top 70%' },
          yPercent: 12,
          autoAlpha: 0,
          duration: 1.3,
          stagger: 0.07,
          ease: 'expo.out',
        });
        const wallSpeeds = [1.5, 0.7, 0.4, 1.1, 1.8];
        q('.wall__photo').forEach((ph, i) => {
          const s = wallSpeeds[i % wallSpeeds.length];
          gsap.fromTo(
            ph,
            { yPercent: 5 * s },
            {
              yPercent: -5 * s,
              ease: 'none',
              scrollTrigger: { trigger: '.wall', start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
        gsap.fromTo(
          '.wall .chars__ch',
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.02,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.wall', start: 'top 55%' },
          }
        );
        gsap.from('.wall__sub', {
          scrollTrigger: { trigger: '.wall', start: 'top 55%' },
          y: 16,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.2,
        });

        // ---- funnel: apex, then edges draw, then items pop in sequence ----
        const funnelTl = gsap.timeline({
          scrollTrigger: { trigger: '.funnel', start: 'top 70%' },
          defaults: { ease: 'expo.out' },
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
            { scale: 0.4, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)' },
            '-=0.5'
          )
          .from(
            '.funnel__item strong, .funnel__item span',
            { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.05 },
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
        gsap.fromTo(
          '.way .chars__ch',
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.02,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.way', start: 'top 55%' },
          }
        );
        gsap.from('.way__sub', {
          scrollTrigger: { trigger: '.way', start: 'top 55%' },
          y: 16,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.25,
        });

        // ---- posters: pinned, photo settles, headline lines wipe up ----
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
              { yPercent: 60, autoAlpha: 0.2 },
              { yPercent: 0, autoAlpha: 1, stagger: 0.08, ease: 'power2.out', duration: 0.4 },
              0.12
            );
          }
        });

        // ---- manifesto: pinned scroll-scrub word reveal ----
        const manifTl = gsap.timeline({
          scrollTrigger: { trigger: '.manif', start: 'top top', end: '+=180%', scrub: true, pin: true },
        });
        manifTl
          .fromTo('.manif__photo', { scale: 1.1 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo(
            '.manif__title span',
            { opacity: 0.12 },
            { opacity: 1, stagger: 0.09, ease: 'none', duration: 0.8 },
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
          <a href="#spot">Creators</a>
          <a href="#proof">Roster</a>
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

        <section className="spot" id="spot">
          <div className="spot__media" aria-hidden="true">
            <img className="spot__photo" key={spot.id} src={spot.img} alt="" />
            <div className="spot__mask" />
          </div>

          <div className="spot__floats" aria-hidden="true">
            {BUILDERS.map((b) => (
              <div
                key={b.id}
                className={`spot__float${b.id === spot.id ? ' spot__float--on' : ''}`}
                data-depth={b.float.depth}
                style={{ left: b.float.x, top: b.float.y, animationDelay: `${b.float.delay}s` }}
              >
                <strong>{b.name}</strong>
                <em>{b.handle}</em>
                <span>{b.tag}</span>
              </div>
            ))}
          </div>

          <div className="spot__copy" key={`${spot.id}-copy`}>
            <p className="spot__eyebrow">
              <span>01</span>
              Creators
            </p>
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

        <section className="proof" id="proof">
          <SectionHead
            index="02"
            label="The roster"
            title="THE BEST BUILD ON STAN"
            sub="Founders, podcasters, and coaches — all shipping under their own name."
          />
          <div className="proof__grid">
            {PROOF.map((p) => (
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
            index="03"
            label="The system"
            title="ONE STACK. YOURS."
            sub="Four tools in constant orbit around a single point — you."
          />
          <div className="orbit__stage" aria-hidden="true">
            <FamilyScene progressRef={kitProgress} />
          </div>
        </section>

        <section className="band">
          <div className="band__inner">
            <div className="band__silhouettes" aria-hidden="true">
              {BUILDERS.map((b) => (
                <img key={b.id} src={b.img} alt="" />
              ))}
            </div>
            <div className="band__mark">
              <img src="/stan_logo.svg" alt="Stan" />
              <p>Build your own.</p>
            </div>
          </div>
        </section>

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
            <div className="wall__copy">
              <h2 className="wall__title">
                <Chars text="BUILD YOUR OWN" />
              </h2>
              <p className="wall__sub">Five builders. One door. Your name on it.</p>
            </div>
          </div>
        </section>

        <section className="funnel" id="products">
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
            <a href="#spot">Creators</a>
            <a href="#wall">Roster</a>
            <a href="#products">Products</a>
          </div>
          <div>
            <p className="nfoot__label">Creators</p>
            {BUILDERS.map((b) => (
              <a key={b.id} href="#spot">
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
