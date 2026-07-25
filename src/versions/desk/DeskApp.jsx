import { useCallback, useEffect, useRef, useState } from 'react';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import VersionSwitcher from '../../shared/VersionSwitcher';

const num = (i) => String(i + 1).padStart(2, '0');

export default function DeskApp() {
  const [win, setWin] = useState(() => [
    { id: editions[0].id, x: 300, y: 132, z: 1 },
  ]);
  const [top, setTop] = useState(1);
  const drag = useRef(null);

  const focus = useCallback(
    (id) => {
      setTop((t) => {
        const next = t + 1;
        setWin((w) => w.map((x) => (x.id === id ? { ...x, z: next } : x)));
        return next;
      });
    },
    []
  );

  const open = (id) => {
    setWin((w) => {
      if (w.some((x) => x.id === id)) return w;
      const n = w.length;
      return [
        ...w,
        {
          id,
          x: 300 + ((n * 34) % 220),
          y: 132 + ((n * 30) % 180),
          z: top + 1,
        },
      ];
    });
    setTop((t) => t + 1);
    focus(id);
  };

  const close = (id) => setWin((w) => w.filter((x) => x.id !== id));

  // pointer-based dragging, tracked on the window so a fast drag can't
  // outrun the cursor and drop the grab
  useEffect(() => {
    const move = (e) => {
      if (!drag.current) return;
      const { id, dx, dy } = drag.current;
      setWin((w) =>
        w.map((x) =>
          x.id === id
            ? {
                ...x,
                x: Math.max(8, Math.min(window.innerWidth - 240, e.clientX - dx)),
                y: Math.max(34, Math.min(window.innerHeight - 90, e.clientY - dy)),
              }
            : x
        )
      );
    };
    const up = () => {
      drag.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  const startDrag = (e, w) => {
    drag.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y };
    focus(w.id);
  };

  return (
    <div className="desk">
      <VersionSwitcher current="desk" tone="light" />

      <div className="menubar">
        <span className="menubar__brand">The Standard</span>
        <span className="menubar__item">File</span>
        <span className="menubar__item">Edition</span>
        <span className="menubar__item">View</span>
        <span className="menubar__spacer" />
        <span className="menubar__clock">Q2 2026</span>
      </div>

      <aside className="finder">
        <p className="finder__label">Editions</p>
        <ul>
          {editions.map((e, i) => {
            const isOpen = win.some((w) => w.id === e.id);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  className={`finder__row${isOpen ? ' finder__row--open' : ''}`}
                  onClick={() => (isOpen ? focus(e.id) : open(e.id))}
                >
                  <span className="finder__swatch" style={{ background: toneOf(e).base }} />
                  <span className="finder__name">{e.name}</span>
                  <span className="finder__q">{e.quarter}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="finder__hint">Drag windows · click to bring forward</p>
      </aside>

      {win.map((w) => {
        const e = editions.find((x) => x.id === w.id);
        const i = editions.indexOf(e);
        const tone = toneOf(e);
        return (
          <section
            key={w.id}
            className="win"
            style={{ left: w.x, top: w.y, zIndex: w.z }}
            onPointerDown={() => focus(w.id)}
          >
            <header className="win__bar" onPointerDown={(ev) => startDrag(ev, w)}>
              <span className="win__lights">
                <button
                  type="button"
                  className="win__close"
                  onClick={() => close(w.id)}
                  aria-label={`Close ${e.name}`}
                />
                <i />
                <i />
              </span>
              <span className="win__title">
                {num(i)} — {e.name}
              </span>
            </header>
            <div className="win__body">
              <div className="win__hero" style={{ background: tone.paper }}>
                <span className="win__mark" style={{ background: tone.base }} />
                <span className="win__q">
                  {e.quarter} {e.year}
                </span>
                {e.isNew && <span className="win__new">New</span>}
              </div>
              <h2 className="win__name">{e.name}</h2>
              <p className="win__blurb">{e.blurb}</p>
              <ul className="win__list">
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <a className="win__cta" href={e.url} target="_blank" rel="noreferrer">
                Open in Stan →
              </a>
            </div>
          </section>
        );
      })}
    </div>
  );
}
