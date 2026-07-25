import { useCallback, useEffect, useRef, useState } from 'react';
import AtlasScene from './AtlasScene';
import { editions } from '../../data/editions';
import VersionSwitcher from '../../shared/VersionSwitcher';

export default function AtlasApp() {
  const [active, setActive] = useState(0);
  const [want, setWant] = useState(undefined);
  const fillRef = useRef(null);

  // progress drives the rail meter directly to keep it off React's
  // render path — this fires every frame
  const handleProgress = useCallback((p) => {
    if (fillRef.current) {
      const pct = (p / (editions.length - 1)) * 100;
      fillRef.current.style.height = `${Math.max(0, Math.min(100, pct))}%`;
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setWant((w) => (w ?? active) + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setWant((w) => (w ?? active) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const edition = editions[active];

  return (
    <div className="atlas">
      <header className="ahead">
        <span className="ahead__coin">$</span>
        <div className="ahead__lockup">
          <strong>The Standard</strong>
          <em>An atlas of every quarter</em>
        </div>
      </header>

      <VersionSwitcher current="atlas" />

      <AtlasScene
        editions={editions}
        wantIndex={want}
        onActive={(i) => {
          setActive(i);
          setWant(undefined);
        }}
        onProgress={handleProgress}
      />

      <div className="acaption" key={edition.id}>
        <span className="acaption__idx">{String(active + 1).padStart(2, '0')}</span>
        <div>
          <p className="acaption__meta">
            {edition.quarter} {edition.year}
          </p>
          <h1 className="acaption__name">{edition.name}</h1>
        </div>
      </div>

      <a className="acta" href={edition.url} target="_blank" rel="noreferrer">
        Open {edition.name} in Stan
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

      <nav className="arail" aria-label="Editions">
        <span className="arail__line">
          <span className="arail__fill" ref={fillRef} />
        </span>
        {editions.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className={`arail__tick${i === active ? ' arail__tick--on' : ''}`}
            onClick={() => setWant(i)}
          >
            <span className="arail__label">
              {e.quarter} {e.year} · {e.name}
            </span>
            <span className="arail__dot" />
          </button>
        ))}
      </nav>

      <p className="ahint">Scroll to travel the helix · click a panel to lock it</p>
    </div>
  );
}
