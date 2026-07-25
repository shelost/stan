export default function DetailPanel({ edition, onClose }) {
  return (
    <aside className="detail">
      <button className="detail__close" type="button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <p className="detail__meta">
        {edition.quarter} {edition.year} · Edition
        {edition.isNew && <em className="detail__new">New</em>}
      </p>
      <h2 className="detail__name">{edition.name}</h2>
      <p className="detail__blurb">{edition.blurb}</p>
      <ul className="detail__list">
        {edition.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <a className="detail__open" href={edition.url} target="_blank" rel="noreferrer">
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
  );
}
