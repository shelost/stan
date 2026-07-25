import { versions } from '../../data/versions';
import { editions } from '../../data/editions';

export default function HubApp() {
  return (
    <div className="hub">
      <header className="hub__head">
        <p className="hub__eyebrow">Stan · The Standard</p>
        <h1 className="hub__title">
          Everything new across Stan, every quarter — presented nine ways.
        </h1>
        <p className="hub__lede">
          One set of {editions.length} quarterly editions, from Q2 2024 to Q2 2026, rendered
          through {versions.length} different interfaces. Same data, nine arguments about how
          release notes should feel.
        </p>
      </header>

      <ol className="hub__list">
        {versions.map((v, i) => (
          <li key={v.id}>
            <a className="hub__row" href={v.path} style={{ '--accent': v.accent }}>
              <span className="hub__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="hub__name">{v.name}</span>
              <span className="hub__tag">{v.tagline}</span>
              <span className="hub__note">{v.note}</span>
              <span className="hub__go" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path
                    d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <footer className="hub__foot">
        <span>
          {editions.length} editions · {versions.length} presentations · one data set
        </span>
        <a href="https://stan.store" target="_blank" rel="noreferrer">
          stan.store ↗
        </a>
      </footer>
    </div>
  );
}
