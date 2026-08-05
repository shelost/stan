import { useRef } from 'react';
import Cover from './Cover';
import usePointerTilt from './usePointerTilt';
import { toneOf } from '../../data/tones';

export default function EditionCard({ edition, index, tilt, active, onOpen }) {
  const ref = useRef(null);
  const tone = toneOf(edition);

  usePointerTilt(ref, { inner: '.sleeve__inner' });

  return (
    <button
      ref={ref}
      id={`card-${edition.id}`}
      type="button"
      className={`sleeve${active ? ' sleeve--active' : ''}`}
      style={{
        '--tilt': `${tilt}deg`,
        '--tone': tone.base,
        '--soft': tone.soft,
        '--deep': tone.deep,
      }}
      onClick={() => onOpen(index, ref.current.getBoundingClientRect())}
      aria-label={`Open ${edition.name}`}
    >
      <span className="sleeve__inner">
        <Cover edition={edition} index={index} />
        <span className="sleeve__edge" aria-hidden="true" />
      </span>
    </button>
  );
}
