import { useEffect, useMemo, useRef, useState } from 'react';
import EditionCard from '../editions/EditionCard';
import LearnModal from './LearnModal';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';

const TILTS = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.4, -2, 1.6, -1.4];
const num = (i) => String(i + 1).padStart(2, '0');

export default function StandardApp() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const fillRef = useRef(null);
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
          <em>An atlas of every quarter</em>
        </div>
      </header>

      <aside className="scard" key={edition.id} style={{ '--tone': tone.base }}>
        <span className="scard__idx">{num(active)}</span>
        <div className="scard__copy">
          <p className="scard__meta">
            {edition.quarter} {edition.year}
            {edition.isNew && <em>New</em>}
          </p>
          <h1 className="scard__name">{edition.name}</h1>
        </div>
        <button className="scard__cta" type="button" onClick={() => setOpen(true)}>
          Learn more
        </button>
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
