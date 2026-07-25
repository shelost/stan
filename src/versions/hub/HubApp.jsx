import { versions } from '../../data/versions';
import { editions } from '../../data/editions';

// Minimal moving preview per version so the hub shows what each one is
// before you commit a click.
function Preview({ id }) {
  if (id === 'books') {
    return (
      <div className="pv pv--books">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    );
  }
  if (id === 'editions') {
    return (
      <div className="pv pv--editions">
        <div className="pv__shelf">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ '--i': i }} />
          ))}
        </div>
        <i />
      </div>
    );
  }
  if (id === 'phone') {
    return (
      <div className="pv pv--phone">
        <div className="pv__device" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    );
  }
  return (
    <div className="pv pv--atlas">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span key={i} style={{ '--i': i }} />
      ))}
    </div>
  );
}

export default function HubApp() {
  return (
    <div className="hub">
      <header className="hub__head">
        <span className="hub__coin">$</span>
        <div>
          <h1>The Standard</h1>
          <p>Everything new across Stan, every quarter — built four ways.</p>
        </div>
      </header>

      <ul className="hub__grid">
        {versions.map((v) => (
          <li key={v.id}>
            <a className="hub__card" href={v.path} style={{ '--accent': v.accent }}>
              <Preview id={v.id} />
              <div className="hub__body">
                <h2>
                  {v.name}
                  <span className="hub__sub">{v.id}</span>
                </h2>
                <p className="hub__tag">{v.tagline}</p>
                <p className="hub__note">{v.note}</p>
              </div>
              <span className="hub__go">
                Open
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
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="hub__foot">
        <p>
          {editions.length} editions · {versions.length} presentations · one data set
        </p>
      </footer>
    </div>
  );
}
