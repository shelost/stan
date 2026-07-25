import { toneOf } from '../../data/tones';

// Nine sleeve designs built from type and geometry only — no pictograms,
// so the shelf reads as a considered set rather than a sticker sheet.
const ART = {
  stanley: () => (
    <>
      <span className="art__rings" />
      <span className="art__dot" />
    </>
  ),
  'creator-os': () => (
    <span className="art__grid">
      {Array.from({ length: 16 }).map((_, i) => (
        <i key={i} />
      ))}
    </span>
  ),
  storefront: () => (
    <span className="art__stack">
      <i />
      <i />
      <i />
    </span>
  ),
  classroom: () => (
    <span className="art__bars">
      <i />
      <i />
      <i />
      <i />
    </span>
  ),
  booked: () => (
    <span className="art__cal">
      {Array.from({ length: 12 }).map((_, i) => (
        <i key={i} className={i === 5 ? 'on' : undefined} />
      ))}
    </span>
  ),
  community: () => (
    <span className="art__nodes">
      <i />
      <i />
      <i />
      <i />
    </span>
  ),
  payday: () => (
    <span className="art__rule">
      <i />
      <i />
      <i />
    </span>
  ),
  fans: () => (
    <span className="art__chart">
      {[34, 48, 42, 66, 82, 100].map((h) => (
        <i key={h} style={{ height: `${h}%` }} />
      ))}
    </span>
  ),
  'hello-stan': () => <span className="art__horizon" />,
};

export default function Cover({ edition, index }) {
  const tone = toneOf(edition);
  const render = ART[edition.id];

  return (
    <div
      className={`art art--${edition.id}`}
      style={{ '--tone': tone.base, '--soft': tone.soft, '--paper': tone.paper }}
    >
      <span className="art__top">
        <span className="art__mast">The Standard</span>
        <span className="art__idx">{String(index + 1).padStart(2, '0')}</span>
      </span>

      <span className="art__figure">{render?.()}</span>

      <span className="art__foot">
        <span className="art__name">{edition.name}</span>
        <span className="art__q">
          {edition.quarter} {edition.year}
        </span>
      </span>
    </div>
  );
}
