import { useEffect } from 'react';
import Cover from '../editions/Cover';
import { toneOf } from '../../data/tones';
import { num } from './helpers';

export default function LearnModal({ edition, index, onClose }) {
  const tone = toneOf(edition);
  const items = edition.shipped
    ? [...edition.shipped.headline, ...edition.shipped.supporting]
    : edition.highlights.map((h, i) => ({ id: `h-${i}`, name: h }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="nmodal-wrap" onClick={onClose} role="presentation">
      <div
        className="nmodal"
        role="dialog"
        aria-modal="true"
        aria-label={edition.name}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="nmodal__bar">
          <div className="nmodal__crumbs">
            <span>The Standard</span>
            <span>/</span>
            <span>
              {edition.quarter} {edition.year}
            </span>
            <span>/</span>
            <strong>{edition.name}</strong>
          </div>
          <button className="nmodal__close" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="nmodal__page">
          <div className="nmodal__hero">
            <div className="nmodal__cover" style={{ '--paper': tone.paper }}>
              <Cover edition={edition} index={index} />
            </div>
            <div className="nmodal__props">
              <div>
                <span>Edition</span>
                <strong>{num(index)}</strong>
              </div>
              <div>
                <span>Quarter</span>
                <strong>
                  {edition.quarter} {edition.year}
                </strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{edition.isNew ? 'New release' : 'Shipped'}</strong>
              </div>
              {edition.creator && (
                <div>
                  <span>Creator</span>
                  <strong>{edition.creator.name}</strong>
                  {edition.creator.handle && <i>{edition.creator.handle}</i>}
                </div>
              )}
            </div>
          </div>

          <h1 className="nmodal__title">{edition.name}</h1>
          <p className="nmodal__lede">{edition.blurb}</p>
          <p className="nmodal__story">{edition.story}</p>

          <h2 className="nmodal__h">What shipped</h2>
          <ul className="nmodal__list">
            {items.map((item) => (
              <li key={item.id || item.name}>
                <strong>{item.name}</strong>
                {item.blurb && <span>{item.blurb}</span>}
                {item.status && <em>{item.status}</em>}
              </li>
            ))}
          </ul>

          <a className="nmodal__link" href={edition.url} target="_blank" rel="noreferrer">
            Open in Stan →
          </a>
        </div>
      </div>
    </div>
  );
}
