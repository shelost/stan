export default function Drawer({ editions, onClose }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <section
        className="drawer"
        role="dialog"
        aria-label="All editions"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__handle" aria-hidden="true" />
        <header className="drawer__head">
          <div>
            <h2 className="drawer__title">Every edition</h2>
            <p className="drawer__sub">The Standard · quarterly updates</p>
          </div>
          <button className="drawer__close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="drawer__grid">
          {editions.map((e) => (
            <article key={e.id} className={`gcard gcard--${e.tone}`}>
              <div className="gcard__top">
                <span className="gcard__thumb">{e.emoji}</span>
                <span className="gcard__meta">
                  {e.quarter} {e.year} · Edition
                  {e.isNew && <em className="gcard__new">New</em>}
                </span>
              </div>
              <h3 className="gcard__name">{e.name}</h3>
              <p className="gcard__blurb">{e.blurb}</p>
              <ul className="gcard__list">
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <a className="gcard__open" href={e.url} target="_blank" rel="noreferrer">
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
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
