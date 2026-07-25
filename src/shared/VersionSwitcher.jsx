import { useEffect, useState } from 'react';
import { versions } from '../data/versions';

// Subdomains and paths both resolve to the same page, so links stay on
// whichever scheme the visitor arrived through.
function hrefFor(version) {
  if (typeof window === 'undefined') return version.path;
  const { hostname, protocol, port } = window.location;
  const parts = hostname.split('.');
  const isSubdomainScheme =
    parts.length > 2 && versions.some((v) => v.id === parts[0]);
  if (isSubdomainScheme) {
    const root = parts.slice(1).join('.');
    return `${protocol}//${version.id}.${root}${port ? `:${port}` : ''}/`;
  }
  return version.path;
}

export default function VersionSwitcher({ current, tone = 'dark' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = versions.find((v) => v.id === current);

  return (
    <div className={`vswitch vswitch--${tone}${open ? ' vswitch--open' : ''}`}>
      <button
        className="vswitch__button"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="vswitch__dot" style={{ background: active?.accent }} />
        {active?.name}
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul className="vswitch__menu">
          {versions.map((v) => (
            <li key={v.id}>
              <a
                className={`vswitch__item${v.id === current ? ' vswitch__item--on' : ''}`}
                href={hrefFor(v)}
              >
                <span className="vswitch__dot" style={{ background: v.accent }} />
                <span>
                  <strong>{v.name}</strong>
                  <em>{v.tagline}</em>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
