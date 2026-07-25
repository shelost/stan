import { useEffect, useState } from 'react';
import { editions } from '../../data/editions';
import VersionSwitcher from '../../shared/VersionSwitcher';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.·';

// Characters settle left to right, like a Solari board coming to rest.
// The frame is derived from elapsed time rather than a counter so the
// run always converges, even if the effect is mounted twice.
function useFlap(target, tick = 45) {
  const [out, setOut] = useState(target);

  useEffect(() => {
    const settleAt = (i) => i * 2 + 5;
    const total = settleAt(target.length);
    const start = performance.now();
    let raf = 0;
    let shown = -1;

    const step = (t) => {
      const frame = Math.floor((t - start) / tick);
      if (frame !== shown) {
        shown = frame;
        let s = '';
        for (let i = 0; i < target.length; i += 1) {
          s +=
            frame >= settleAt(i) || target[i] === ' '
              ? target[i]
              : CHARS[(Math.random() * CHARS.length) | 0];
        }
        setOut(s);
      }
      if (frame < total) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, tick]);

  return out;
}

function Flaps({ text, size = 'md' }) {
  const shown = useFlap(text.toUpperCase());
  return (
    <span className={`flaps flaps--${size}`}>
      {shown.split('').map((c, i) => (
        <span className="flap" key={i}>
          <span className="flap__char">{c === ' ' ? ' ' : c}</span>
          <span className="flap__seam" />
        </span>
      ))}
    </span>
  );
}

const pad = (s, n) => s.toUpperCase().slice(0, n).padEnd(n, ' ');

export default function FlipApp() {
  const [sel, setSel] = useState(0);
  const active = editions[sel];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown') setSel((s) => (s + 1) % editions.length);
      if (e.key === 'ArrowUp') setSel((s) => (s - 1 + editions.length) % editions.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="board">
      <VersionSwitcher current="flip" />

      <header className="board__head">
        <div>
          <p className="board__eyebrow">The Standard · Departures</p>
          <h1 className="board__title">Every quarter, on the board</h1>
        </div>
        <p className="board__clock">
          {editions.length} editions · Q2 2024 → Q2 2026
        </p>
      </header>

      <section className="marquee">
        <p className="marquee__label">Now showing</p>
        <Flaps text={pad(active.name, 14)} size="lg" />
        <p className="marquee__sub">
          {active.quarter} {active.year} · {active.blurb}
        </p>
      </section>

      <div className="rows">
        <div className="rows__head">
          <span>Quarter</span>
          <span>Edition</span>
          <span className="rows__status">Status</span>
        </div>
        {editions.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className={`row${i === sel ? ' row--on' : ''}`}
            onClick={() => setSel(i)}
          >
            <Flaps text={pad(`${e.quarter} ${e.year}`, 7)} size="sm" />
            <Flaps text={pad(e.name, 18)} size="md" />
            <span className="row__status">
              <Flaps text={pad(e.isNew ? 'new' : 'shipped', 7)} size="sm" />
            </span>
          </button>
        ))}
      </div>

      <footer className="board__foot">
        <div className="board__detail">
          {active.highlights.map((h) => (
            <p key={h}>{h}</p>
          ))}
        </div>
        <a className="board__cta" href={active.url} target="_blank" rel="noreferrer">
          Open {active.name} →
        </a>
      </footer>
    </div>
  );
}
