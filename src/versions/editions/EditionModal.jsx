import { useEffect, useLayoutEffect, useRef } from 'react';
import Cover from './Cover';
import { toneOf } from '../../data/tones';

const num = (i) => String(i + 1).padStart(2, '0');

export default function EditionModal({ edition, index, origin, onClose }) {
  const ref = useRef(null);

  // FLIP: start the panel sitting exactly over the sleeve that was
  // clicked, then let it settle into its centred position.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !origin) return;
    const r = el.getBoundingClientRect();
    const dx = origin.left + origin.width / 2 - (r.left + r.width / 2);
    const dy = origin.top + origin.height / 2 - (r.top + r.height / 2);
    const s = origin.width / r.width;

    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
    el.style.opacity = '0.5';

    const id = requestAnimationFrame(() => {
      el.style.transition =
        'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease';
      el.style.transform = '';
      el.style.opacity = '1';
    });
    return () => cancelAnimationFrame(id);
  }, [origin]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const tone = toneOf(edition);

  return (
    <div className="emodal-wrap" onClick={onClose}>
      <div
        className="emodal"
        ref={ref}
        role="dialog"
        aria-label={edition.name}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="emodal__art">
          <Cover edition={edition} index={index} />
        </div>

        <div className="emodal__body">
          <button className="emodal__close" type="button" onClick={onClose}>
            Close
          </button>

          <p className="emodal__meta">
            <span className="emodal__dot" style={{ background: tone.base }} />
            {edition.quarter} {edition.year} · Edition {num(index)}
            {edition.isNew && <em className="emodal__new">New</em>}
          </p>

          <h2 className="emodal__name">{edition.name}</h2>
          <p className="emodal__blurb">{edition.blurb}</p>

          <ul className="emodal__list">
            {edition.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <a className="emodal__cta" href={edition.url} target="_blank" rel="noreferrer">
            Open in Stan →
          </a>
        </div>
      </div>
    </div>
  );
}
