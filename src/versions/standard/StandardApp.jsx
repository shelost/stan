import { useEffect, useState } from 'react';
import Cover from '../editions/Cover';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';

const num = (i) => String(i + 1).padStart(2, '0');

function Placeholder({ label, variant = 'hero' }) {
  return (
    <div className={`ph ph--${variant}`} aria-hidden="true">
      <span className="ph__grid" />
      <span className="ph__mark" />
      <span className="ph__label">{label}</span>
    </div>
  );
}

function ShippedCatalog({ edition, tone }) {
  const { headline, supporting } = edition.shipped;

  return (
    <div className="catalog">
      <header className="catalog__hero">
        <div className="catalog__intro">
          <p className="feature__meta">
            <span className="feature__dot" style={{ background: tone.base }} />
            {edition.quarter} {edition.year}
            <span className="feature__sep">·</span>
            Edition 01
            {edition.isNew && <em className="feature__new">New release</em>}
          </p>
          <h1 className="feature__title">{edition.name}</h1>
          <p className="feature__dek">{edition.blurb}</p>
          <p className="feature__story">{edition.story}</p>
          <div className="feature__actions">
            <a className="feature__cta" href={edition.url} target="_blank" rel="noreferrer">
              Open in Stan →
            </a>
            <a className="feature__quiet" href="#new">
              Browse what shipped
            </a>
          </div>
        </div>
        <div className="catalog__cover">
          <div className="feature__sleeve">
            <Cover edition={edition} index={0} />
            {edition.isNew && (
              <span className="feature__sticker">
                <span>New</span>
              </span>
            )}
          </div>
        </div>
      </header>

      <section className="catalog__section" id="new">
        <div className="catalog__head">
          <p className="catalog__kicker">Headline</p>
          <h2 className="catalog__title">New this edition</h2>
          <p className="catalog__lede">The builds that define Stanley — new surfaces across every Stan store.</p>
        </div>

        <div className="headline">
          {headline.map((item, i) => (
            <article
              key={item.id}
              className={`headline__row${i % 2 === 1 ? ' headline__row--flip' : ''}`}
            >
              <Placeholder label={item.name} variant="hero" />
              <div className="headline__copy">
                <p className="headline__index">{num(i)}</p>
                <h3 className="headline__name">
                  {item.name}
                  {item.status && <span className="headline__status">{item.status}</span>}
                </h3>
                <p className="headline__blurb">{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog__section catalog__section--support" id="updates">
        <div className="catalog__head">
          <p className="catalog__kicker">Supporting</p>
          <h2 className="catalog__title">Also shipping</h2>
          <p className="catalog__lede">Polish and revamps across the products creators already live in.</p>
        </div>

        <div className="support">
          {supporting.map((item) => (
            <article key={item.id} className="support__item">
              <Placeholder label={item.name} variant="tile" />
              <h3 className="support__name">{item.name}</h3>
              <p className="support__blurb">{item.blurb}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ClassicFeature({ edition, active, tone }) {
  return (
    <article
      className="feature"
      style={{ '--tone': tone.base, '--soft': tone.soft, '--paper': tone.paper }}
    >
      <div className="feature__cover">
        <div className="feature__sleeve">
          <Cover edition={edition} index={active} />
        </div>
      </div>

      <div className="feature__body">
        <p className="feature__meta">
          <span className="feature__dot" style={{ background: tone.base }} />
          {edition.quarter} {edition.year}
          <span className="feature__sep">·</span>
          Edition {num(active)}
        </p>

        <h1 className="feature__title">{edition.name}</h1>
        <p className="feature__dek">{edition.blurb}</p>
        <p className="feature__story">{edition.story}</p>

        <h2 className="feature__sub">What shipped</h2>
        <ul className="feature__list">
          {edition.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <div className="feature__actions">
          <a className="feature__cta" href={edition.url} target="_blank" rel="noreferrer">
            Open in Stan →
          </a>
          <a className="feature__quiet" href="/editions">
            See it on the shelf
          </a>
        </div>
      </div>
    </article>
  );
}

export default function StandardApp() {
  const [active, setActive] = useState(0);
  const edition = editions[active];
  const tone = toneOf(edition);
  const hasShipped = Boolean(edition.shipped);

  const select = (index) => {
    setActive((current) => {
      const next = Math.max(0, Math.min(index, editions.length - 1));
      return next === current ? current : next;
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, editions.length - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'new' || hash === 'updates') return;
    const i = editions.findIndex((e) => e.id === hash);
    if (i >= 0) setActive(i);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'new' || hash === 'updates') return;
    if (hash !== edition.id) {
      history.replaceState(null, '', `#${edition.id}`);
    }
    document
      .getElementById(`release-${edition.id}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [edition.id]);

  return (
    <div className="standard">
      <header className="standard__bar">
        <a className="standard__brand" href="/">
          <span className="standard__coin">$</span>
          <span>The Standard</span>
        </a>
        <p className="standard__tag">
          Everything new across Stan.
          <span>Every quarter.</span>
        </p>
        <nav className="standard__nav">
          <a href="/editions">Gallery</a>
          <a href="/options">Options</a>
          <a href="https://stan.store" target="_blank" rel="noreferrer">
            stan.store ↗
          </a>
        </nav>
      </header>

      <div className={`standard__layout${hasShipped ? ' standard__layout--catalog' : ''}`}>
        <div
          className="standard__main"
          key={edition.id}
          style={{ '--tone': tone.base, '--soft': tone.soft, '--paper': tone.paper }}
        >
          {hasShipped ? (
            <ShippedCatalog edition={edition} tone={tone} />
          ) : (
            <ClassicFeature edition={edition} active={active} tone={tone} />
          )}
        </div>

        <aside className="rail">
          <div className="rail__head">
            <p className="rail__label">Releases</p>
            <p className="rail__count">{editions.length} editions</p>
          </div>

          <ol className="rail__list">
            {editions.map((e, i) => {
              const t = toneOf(e);
              const on = i === active;
              return (
                <li key={e.id} id={`release-${e.id}`}>
                  <button
                    type="button"
                    className={`rail__item${on ? ' rail__item--on' : ''}`}
                    style={{ '--tone': t.base, '--paper': t.paper }}
                    onClick={() => select(i)}
                    aria-current={on ? 'true' : undefined}
                  >
                    <span className="rail__thumb" aria-hidden="true">
                      <Cover edition={e} index={i} />
                    </span>
                    <span className="rail__copy">
                      <span className="rail__when">
                        {e.quarter} {e.year}
                        {e.isNew && <em>New</em>}
                      </span>
                      <span className="rail__name">{e.name}</span>
                      <span className="rail__blurb">{e.blurb}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="rail__hint">↑↓ or J/K to browse</p>
        </aside>
      </div>
    </div>
  );
}
