import { useRef } from 'react';
import Cover from './Cover';

export default function EditionCard({ edition, index, tilt, active, onOpen }) {
  const ref = useRef(null);

  return (
    <button
      ref={ref}
      id={`card-${edition.id}`}
      type="button"
      className={`sleeve${active ? ' sleeve--active' : ''}`}
      style={{ '--tilt': `${tilt}deg` }}
      onClick={() => onOpen(index, ref.current.getBoundingClientRect())}
      aria-label={`Open ${edition.name}`}
    >
      <span className="sleeve__inner">
        <Cover edition={edition} index={index} />
        {edition.isNew && (
          <span className="sleeve__sticker">
            <span>New</span>
          </span>
        )}
      </span>
    </button>
  );
}
