import { useEffect, useState } from 'react';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import VersionSwitcher from '../../shared/VersionSwitcher';

const num = (i) => String(i + 1).padStart(2, '0');

export default function GridApp() {
  const [openId, setOpenId] = useState(null);
  const open = editions.find((e) => e.id === openId);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="pad">
      <VersionSwitcher current="grid" tone="light" />

      <div className="pad__status">
        <span>The Standard</span>
        <span>Q2 2026</span>
      </div>

      <main className="pad__screen">
        <div className="pad__apps">
          {editions.map((e, i) => {
            const tone = toneOf(e);
            return (
              <button
                key={e.id}
                type="button"
                className="app"
                onClick={() => setOpenId(e.id)}
                style={{ '--tone': tone.base, '--soft': tone.soft }}
              >
                <span className="app__icon">
                  <span className="app__mark">{e.name.charAt(0)}</span>
                  {e.isNew && <span className="app__badge">1</span>}
                </span>
                <span className="app__label">{e.name}</span>
              </button>
            );
          })}
        </div>

        <div className="pad__dock">
          {editions.slice(0, 4).map((e) => (
            <button
              key={e.id}
              type="button"
              className="app app--dock"
              onClick={() => setOpenId(e.id)}
              style={{ '--tone': toneOf(e).base, '--soft': toneOf(e).soft }}
              aria-label={e.name}
            >
              <span className="app__icon">
                <span className="app__mark">{e.name.charAt(0)}</span>
              </span>
            </button>
          ))}
        </div>
      </main>

      {open && (
        <div className="sheet-wrap" onClick={() => setOpenId(null)}>
          <section
            className="sheet"
            onClick={(ev) => ev.stopPropagation()}
            style={{ '--tone': toneOf(open).base, '--paper': toneOf(open).paper }}
          >
            <header className="sheet__bar">
              <span className="sheet__mark">{open.name.charAt(0)}</span>
              <span className="sheet__title">
                <strong>{open.name}</strong>
                <em>
                  {open.quarter} {open.year} · Edition {num(editions.indexOf(open))}
                </em>
              </span>
              <button type="button" className="sheet__close" onClick={() => setOpenId(null)}>
                Done
              </button>
            </header>

            <div className="sheet__body">
              <p className="sheet__blurb">{open.blurb}</p>
              <ul className="sheet__list">
                {open.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <a className="sheet__cta" href={open.url} target="_blank" rel="noreferrer">
                Open in Stan →
              </a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
