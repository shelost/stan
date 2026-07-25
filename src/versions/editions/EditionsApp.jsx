import { useMemo, useRef, useState } from 'react';
import EditionCard from './EditionCard';
import EditionModal from './EditionModal';
import { editions } from '../../data/editions';
import VersionSwitcher from '../../shared/VersionSwitcher';

const TILTS = [-3, 2, -1.5, 2.5, -2, 1.5, -2.5, 2, -1.5];

export default function EditionsApp() {
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(null);
  const timerRef = useRef(null);

  const handleOpen = (index, rect) => setOpen({ index, rect });

  // four sleeves on the upper shelf, five below, like the original
  const shelves = useMemo(() => [editions.slice(0, 4), editions.slice(4)], []);

  const handleSelect = (id) => {
    setActiveId(id);
    document.getElementById(`card-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveId(null), 1700);
  };

  return (
    <div className="gallery" id="top">
      <header className="ghead">
        <a className="ghead__brand" href="#top">
          <span className="ghead__coin">$</span>
          <span>The Standard</span>
        </a>
        <button className="ghead__search" type="button">
          Search
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <line
              x1="13"
              y1="13"
              x2="17.5"
              y2="17.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <p className="gtagline">
        Everything new across Stan.
        <br />
        Every quarter.
      </p>

      <VersionSwitcher current="editions" tone="light" />

      <main className="gstage">
        {shelves.map((row, i) => (
          <section className="gshelf" key={i}>
            <div className="gshelf__row">
              {row.map((e, j) => (
                <EditionCard
                  key={e.id}
                  edition={e}
                  index={i * 4 + j}
                  tilt={TILTS[(i * 4 + j) % TILTS.length]}
                  active={activeId === e.id}
                  onOpen={handleOpen}
                />
              ))}
            </div>
            <div className="gshelf__board">
              <div className="gshelf__top" />
              <div className="gshelf__front" />
            </div>
          </section>
        ))}
      </main>

      <footer className="gindex">
        <div className="gindex__track">
          {editions.map((e) => (
            <button
              key={e.id}
              type="button"
              className={`gindex__item${activeId === e.id ? ' gindex__item--on' : ''}`}
              onClick={() => handleSelect(e.id)}
            >
              <span className="gindex__year">{e.year}</span>
              <span className="gindex__q">{e.quarter}</span>
              <span className="gindex__name">{e.name}</span>
            </button>
          ))}
        </div>
      </footer>

      {open && (
        <EditionModal
          edition={editions[open.index]}
          index={open.index}
          origin={open.rect}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
