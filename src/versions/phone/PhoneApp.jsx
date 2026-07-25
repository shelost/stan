import { useCallback, useEffect, useRef, useState } from 'react';
import PhoneScene from './PhoneScene';
import { editions } from '../../data/editions';
import VersionSwitcher from '../../shared/VersionSwitcher';

export default function PhoneApp() {
  const [active, setActive] = useState(0);
  const [wanted, setWanted] = useState(undefined);
  const spinRef = useRef(null);

  const step = useCallback((dir) => {
    spinRef.current?.step(dir);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const edition = editions[active];

  return (
    <div className="phone-page">
      <header className="phead">
        <span className="phead__coin">$</span>
        <div className="phead__lockup">
          <strong>The Standard</strong>
          <em>Everything new, every quarter</em>
        </div>
      </header>

      <VersionSwitcher current="phone" />

      <PhoneScene
        editions={editions}
        activeIndex={wanted}
        onActive={(i) => {
          setActive(i);
          setWanted(undefined);
        }}
        spinRef={spinRef}
      />

      <div className="pinfo" key={edition.id}>
        <p className="pinfo__meta">
          {edition.quarter} {edition.year} · Edition
          {edition.isNew && <em className="pinfo__new">New</em>}
        </p>
        <h1 className="pinfo__name">{edition.name}</h1>
        <p className="pinfo__blurb">{edition.blurb}</p>
        <a className="pinfo__cta" href={edition.url} target="_blank" rel="noreferrer">
          Open in Stan
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className="pnav">
        <button type="button" className="pnav__arrow" onClick={() => step(-1)} aria-label="Previous">
          ‹
        </button>
        <div className="pnav__dots">
          {editions.map((e, i) => (
            <button
              key={e.id}
              type="button"
              className={`pnav__dot${i === active ? ' pnav__dot--on' : ''}`}
              onClick={() => setWanted(i)}
              aria-label={e.name}
            >
              <span>{e.name}</span>
            </button>
          ))}
        </div>
        <button type="button" className="pnav__arrow" onClick={() => step(1)} aria-label="Next">
          ›
        </button>
      </div>

      <p className="phint">Drag, scroll, or use ← → to turn the carousel</p>
    </div>
  );
}
