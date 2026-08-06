import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Cover from '../editions/Cover';
import LearnModal from './LearnModal';
import ShelfScene from './ShelfScene';
import usePointerTilt from '../editions/usePointerTilt';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import { num, prefersReducedMotion } from './helpers';

export default function StandardApp() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const scardRef = useRef(null);
  const deviceRef = useRef(null);
  const hasSelected = useRef(false);
  const edition = editions[active];
  const tone = toneOf(edition);

  // The hero phone follows the cursor like the shelf sleeves do; the aside
  // remounts per edition (key below), so the hook rebinds on selection.
  usePointerTilt(
    deviceRef,
    { inner: '.scard__screen', tiltX: 9, tiltY: 11, shiftX: 10, shiftY: 8 },
    [edition.id],
  );

  const select = (index) => {
    setActive((current) => {
      const next = Math.max(0, Math.min(index, editions.length - 1));
      return next === current ? current : next;
    });
  };

  // Staggered springy sleeve + shelf entrance.
  // No "has entered" ref here: StrictMode mounts twice in dev, and a latch
  // would let the first pass claim it and the second pass skip it, so the
  // entrance would never play. `ctx.revert()` already undoes the first pass.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const sleeves = root.querySelectorAll('.sleeve');
      const boards = root.querySelectorAll('.sshelf__board');
      const props = root.querySelectorAll('.sprop');
      const head = root.querySelector('.shead');
      const newBtn = root.querySelector('.snew');
      const rail = root.querySelector('.srail');

      gsap.set(sleeves, { y: 72, rotate: 8, scale: 0.78, autoAlpha: 0, transformOrigin: '50% 100%' });
      gsap.set(boards, { scaleX: 0.4, autoAlpha: 0, transformOrigin: '50% 50%' });
      gsap.set(props, { y: 26, scale: 0.9, autoAlpha: 0, transformOrigin: '50% 100%' });
      gsap.set(head, { y: -18, autoAlpha: 0 });
      gsap.set(newBtn, { y: -18, autoAlpha: 0 });
      gsap.set(rail, { x: 16, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.6)' } });
      tl.to(head, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out' }, 0)
        .to(newBtn, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out' }, 0)
        .to(boards, { scaleX: 1, autoAlpha: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, 0.08)
        .to(
          sleeves,
          {
            y: 0,
            // each card settles onto the lean its layout slot asked for
            rotate: (i, el) => parseFloat(getComputedStyle(el).getPropertyValue('--tilt')) || 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.75,
            stagger: { each: 0.06, from: 'start' },
          },
          0.18,
        )
        .to(
          props,
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            stagger: { each: 0.05, from: 'random' },
            ease: 'power3.out',
          },
          0.3,
        )
        .to(rail, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, 0.5)
        // hand transforms back to CSS so --tilt / hover still drive motion
        .add(() => {
          gsap.set(sleeves, { clearProps: 'transform' });
          gsap.set(props, { clearProps: 'transform' });
        });
    }, root);

    return () => ctx.revert();
  }, []);

  // Pop the artwork of the sleeve that just became selected
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const figure = root.querySelector('.sleeve--active .art__figure');
    if (!figure) return;

    const pop = gsap.fromTo(
      figure,
      { scale: 0.86 },
      { scale: 1, duration: 0.7, ease: 'back.out(2.4)' },
    );

    return () => pop.kill();
  }, [edition.id]);

  // Hero panel entrance, replayed on every selection because the aside is
  // keyed by edition id and therefore remounts. The copy arrives as a stagger
  // — kicker, meta, name, blurb, then the highlights one at a time — while the
  // device swings in underneath it and its artwork settles out of a slight
  // over-scale, so the cover reads as a physical object being set down rather
  // than a picture being swapped.
  useEffect(() => {
    const card = scardRef.current;
    if (!card) return;
    if (prefersReducedMotion()) return;

    const q = gsap.utils.selector(card);
    const glow = q('.scard__glow');
    const device = q('.scard__device');
    const art = q('.scard__screen .art');
    const figure = q('.scard__screen .art__figure');
    const kicker = q('.scard__kicker');
    const meta = q('.scard__meta');
    const name = q('.scard__name');
    const creator = q('.scard__creator');
    const blurb = q('.scard__blurb');
    const points = q('.scard__points li');
    const cta = q('.scard__cta');

    const targets = [
      card,
      ...glow,
      ...device,
      ...art,
      ...figure,
      ...kicker,
      ...meta,
      ...name,
      ...creator,
      ...blurb,
      ...points,
      ...cta,
    ];
    gsap.killTweensOf(targets);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(card, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 })
      .fromTo(glow, { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6 }, 0.04)
      .fromTo(
        device,
        { y: 34, rotate: -3.5, scale: 0.9, autoAlpha: 0 },
        { y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.7)' },
        0.05,
      )
      .fromTo(art, { scale: 1.16, y: 8 }, { scale: 1, y: 0, duration: 0.85 }, 0.08)
      .fromTo(figure, { scale: 0.84, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(2.2)' }, 0.16)
      .fromTo(kicker, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.18)
      .fromTo(meta, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.38 }, 0.22)
      .fromTo(name, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.25)
      .fromTo(creator, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 0.3)
      .fromTo(blurb, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42 }, 0.33)
      .fromTo(
        points,
        { x: -10, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.36, stagger: 0.075 },
        0.38,
      )
      .fromTo(cta, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.5);

    // Idle float, so the hero never sits completely dead between selections.
    // Held as its own tween rather than started from a timeline callback, so
    // the cleanup below can reliably kill it.
    const float = gsap.to(device, {
      y: -7,
      duration: 3.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.1,
    });

    return () => {
      tl.kill();
      float.kill();
    };
  }, [edition.id]);

  useEffect(() => {
    if (fillRef.current) {
      const pct = (active / (editions.length - 1)) * 100;
      fillRef.current.style.height = `${pct}%`;
    }
  }, [active]);

  useEffect(() => {
    const onKey = (e) => {
      if (open) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, editions.length - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const i = editions.findIndex((e) => e.id === hash);
    if (i >= 0) setActive(i);
  }, []);

  useEffect(() => {
    if (window.location.hash.replace('#', '') !== edition.id) {
      history.replaceState(null, '', `#${edition.id}`);
    }

    // Reveal the card the visitor just chose. Skipped on the first run: on the
    // stacked mobile layout the shelves sit below a full-height hero, so
    // scrolling to a card at mount would open the page part-way down it.
    if (!hasSelected.current) {
      hasSelected.current = true;
      return;
    }

    document.getElementById(`card-${edition.id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [edition.id]);

  return (
    <div className="standard" ref={rootRef}>
      <header className="shead">
        <span className="shead__coin">$</span>
        <div className="shead__lockup">
          <strong>The Standard</strong>
        </div>
      </header>

      <button className="snew" type="button" onClick={() => select(0)} aria-label="Jump to newest edition">
        See what's new
        <span aria-hidden="true">→</span>
      </button>

      <aside
        className="scard"
        ref={scardRef}
        key={edition.id}
        style={{
          '--tone': tone.base,
          '--soft': tone.soft,
          '--deep': tone.deep,
          '--paper': tone.paper,
        }}
      >
        <span className="scard__glow" aria-hidden="true" />
        <button
          className="scard__device"
          ref={deviceRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Learn more about ${edition.name}`}
        >
          <span className="scard__screen">
            <Cover edition={edition} index={active} />
            <span className="scard__edge" aria-hidden="true" />
            <span className="scard__cam" aria-hidden="true" />
          </span>
        </button>
        <div className="scard__info">
          {/* The tagline is the headline and the edition name is the label above
              it — the release is already on screen as artwork, so the line worth
              setting in serif is the one that says what it does for you. */}
          <p className="scard__kicker">{edition.name}</p>
          <h1 className="scard__name">{edition.tagline ?? edition.name}</h1>
          {/* Sits under the headline in wide tracking, the way the season pages
              set "S E A S O N   O N E" beneath their display word. */}
          <p className="scard__meta">
            <span className="scard__idx">{num(active)}</span>
            {edition.quarter} {edition.year}
            {edition.isNew && <em>New</em>}
          </p>
          {edition.creator && (
            <p className="scard__creator">
              <span>{edition.creator.name}</span>
              {edition.creator.handle && <em>{edition.creator.handle}</em>}
            </p>
          )}
          <p className="scard__blurb">{edition.blurb}</p>
          {edition.highlights && (
            <ul className="scard__points">
              {edition.highlights.slice(0, 3).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <button className="scard__cta" type="button" onClick={() => setOpen(true)}>
            Explore the edition
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </aside>

      <main className="sstage">
        <ShelfScene active={active} onSelect={select} />
      </main>

      <nav className="srail" aria-label="Editions">
        <span className="srail__line">
          <span className="srail__fill" ref={fillRef} />
        </span>
        {editions.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className={`srail__tick${i === active ? ' srail__tick--on' : ''}`}
            onClick={() => select(i)}
            aria-label={e.name}
          >
            <span className="srail__label">
              {e.quarter} {e.year} · {e.name}
            </span>
            <span className="srail__dot" />
          </button>
        ))}
      </nav>

      {open && <LearnModal edition={edition} index={active} onClose={() => setOpen(false)} />}
    </div>
  );
}
