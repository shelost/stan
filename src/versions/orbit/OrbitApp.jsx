import { useEffect, useState } from 'react';
import OrbitScene from './OrbitScene';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import VersionSwitcher from '../../shared/VersionSwitcher';

const num = (i) => String(i + 1).padStart(2, '0');

export default function OrbitApp() {
  const [sel, setSel] = useState(0);
  const e = editions[sel];

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown')
        setSel((s) => (s + 1) % editions.length);
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp')
        setSel((s) => (s - 1 + editions.length) % editions.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="orb">
      <VersionSwitcher current="orbit" tone="light" />
      <OrbitScene editions={editions} selected={sel} onSelect={setSel} />

      <header className="orb__head">
        <p className="orb__eyebrow">The Standard</p>
        <p className="orb__sub">An orrery of everything shipped</p>
      </header>

      <section className="orb__panel" key={e.id}>
        <p className="orb__meta">
          <span className="orb__swatch" style={{ background: toneOf(e).base }} />
          {num(sel)} · {e.quarter} {e.year}
          {e.isNew && <em className="orb__new">New</em>}
        </p>
        <h1 className="orb__name">{e.name}</h1>
        <p className="orb__blurb">{e.blurb}</p>
        <ul className="orb__list">
          {e.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <a className="orb__cta" href={e.url} target="_blank" rel="noreferrer">
          Open in Stan →
        </a>
      </section>

      <nav className="orb__rail">
        {editions.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={`orb__tick${i === sel ? ' orb__tick--on' : ''}`}
            onClick={() => setSel(i)}
          >
            <span className="orb__tickdot" style={{ background: toneOf(x).base }} />
            <span className="orb__ticklabel">{x.name}</span>
          </button>
        ))}
      </nav>

      <p className="orb__hint">Click a body, or use ← → to step through the quarters</p>
    </div>
  );
}
