import { useState } from 'react';
import Cover from './Cover';

export default function EditionCard({ edition, index, tilt, active }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      id={`card-${edition.id}`}
      className={`sleeve${active ? ' sleeve--active' : ''}${flipped ? ' sleeve--flipped' : ''}`}
      style={{ '--tilt': `${tilt}deg` }}
    >
      <div className="sleeve__inner">
        <div className="sleeve__face sleeve__face--front">
          <Cover edition={edition} index={index} />
          {edition.isNew && (
            <div className="sleeve__sticker">
<span>New</span>
            </div>
          )}
          <div className="sleeve__actions">
            <a
              className="sleeve__btn sleeve__btn--open"
              href={edition.url}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
            <button
              className="sleeve__btn sleeve__btn--details"
              type="button"
              onClick={() => setFlipped(true)}
            >
              Details
            </button>
          </div>
        </div>
        <div className="sleeve__face sleeve__face--back">
          <p className="sleeve__meta">
            {edition.quarter} {edition.year} · Edition
          </p>
          <h3 className="sleeve__name">{edition.name}</h3>
          <p className="sleeve__blurb">{edition.blurb}</p>
          <ul className="sleeve__list">
            {edition.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <button
            className="sleeve__btn sleeve__btn--details"
            type="button"
            onClick={() => setFlipped(false)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
