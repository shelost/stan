import { useState } from 'react';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import VersionSwitcher from '../../shared/VersionSwitcher';

const num = (i) => String(i + 1).padStart(2, '0');

// tile footprints, largest first — the newest edition gets the hero slot
const SPANS = ['hero', 'wide', 'wide', 'tall', 'small', 'small', 'small', 'small', 'small'];

export default function HomeApp() {
  const [open, setOpen] = useState(0);

  return (
    <div className="home">
      <VersionSwitcher current="home" tone="light" />

      <header className="home__head">
        <p className="home__eyebrow">Stan · The Standard</p>
        <h1 className="home__title">Your quarter at a glance</h1>
      </header>

      <div className="home__grid">
        <article className="tile tile--stat">
          <p className="tile__label">Editions shipped</p>
          <p className="tile__stat">{editions.length}</p>
          <p className="tile__sub">Q2 2024 — Q2 2026</p>
        </article>

        {editions.map((e, i) => {
          const tone = toneOf(e);
          const size = SPANS[i] ?? 'small';
          const isOpen = open === i;
          return (
            <article
              key={e.id}
              className={`tile tile--${size}${isOpen ? ' tile--open' : ''}`}
              style={{ '--tone': tone.base, '--paper': tone.paper }}
            >
              <button className="tile__hit" type="button" onClick={() => setOpen(isOpen ? null : i)}>
                <span className="tile__top">
                  <span className="tile__mark">{e.name.charAt(0)}</span>
                  <span className="tile__meta">
                    {e.quarter} {e.year}
                  </span>
                  {e.isNew && <span className="tile__new">New</span>}
                </span>

                <span className="tile__body">
                  <span className="tile__num">{num(i)}</span>
                  <span className="tile__name">{e.name}</span>
                  {size !== 'small' && <span className="tile__blurb">{e.blurb}</span>}
                </span>
              </button>

              {isOpen && (
                <div className="tile__detail">
                  <ul>
                    {e.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <a href={e.url} target="_blank" rel="noreferrer">
                    Open in Stan →
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
