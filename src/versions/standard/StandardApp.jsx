import { useEffect, useMemo, useState } from 'react';
import EditionCard from '../editions/EditionCard';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';

const TILTS = [-3, 2, -1.5, 2.5, -2, 1.5, -2.5, 2, -1.5];
const num = (i) => String(i + 1).padStart(2, '0');

export default function StandardApp() {
  const [active, setActive] = useState(0);
  const edition = editions[active];
  const tone = toneOf(edition);
  const shelves = useMemo(() => [editions.slice(0, 4), editions.slice(4)], []);

  const select = (index) => {
    setActive((current) => {
      const next = Math.max(0, Math.min(index, editions.length - 1));
      return next === current ? current : next;
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, editions.length - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
    document.getElementById(`card-${edition.id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [edition.id]);

  return (
    <div className="standard">
      <header className="shead">
        <span className="shead__coin">$</span>
        <div className="shead__lockup">
          <strong>The Standard</strong>
          <em>Every quarter</em>
        </div>
      </header>

      <aside className="scard" key={edition.id} style={{ '--tone': tone.base }}>
        <p className="scard__meta">
          <span className="scard__idx">{num(active)}</span>
          {edition.quarter} {edition.year}
          {edition.isNew && <em>New</em>}
        </p>
        <h1 className="scard__name">{edition.name}</h1>
        <p className="scard__blurb">{edition.blurb}</p>
        <a className="scard__cta" href={edition.url} target="_blank" rel="noreferrer">
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
      </aside>

      <main className="sstage">
        {shelves.map((row, i) => (
          <section className="sshelf" key={i}>
            <div className="sshelf__row">
              {row.map((e, j) => {
                const index = i * 4 + j;
                return (
                  <EditionCard
                    key={e.id}
                    edition={e}
                    index={index}
                    tilt={TILTS[index % TILTS.length]}
                    active={active === index}
                    onOpen={(idx) => select(idx)}
                  />
                );
              })}
            </div>
            <div className="sshelf__board">
              <div className="sshelf__top" />
              <div className="sshelf__front" />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
