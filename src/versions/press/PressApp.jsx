import { useState } from 'react';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import VersionSwitcher from '../../shared/VersionSwitcher';

const num = (i) => String(i + 1).padStart(2, '0');

export default function PressApp() {
  const [open, setOpen] = useState(null);
  const lead = editions[0];
  const rest = editions.slice(1);
  const record = open != null ? editions[open] : null;

  return (
    <div className="paper">
      <VersionSwitcher current="press" tone="light" />

      <header className="masthead">
        <div className="masthead__rule masthead__rule--thick" />
        <div className="masthead__meta">
          <span>Vol. IX · No. 9</span>
          <span>Quarterly</span>
          <span>Stan · The Standard</span>
        </div>
        <h1 className="masthead__title">The Standard</h1>
        <div className="masthead__meta masthead__meta--sub">
          <span>Everything new across Stan</span>
          <span>Q2 2026 Edition</span>
          <span>Nine dispatches</span>
        </div>
        <div className="masthead__rule" />
      </header>

      <main className="sheet">
        <article className="lead">
          <div className="lead__body">
            <p className="kicker">
              <span className="kicker__dot" style={{ background: toneOf(lead).base }} />
              {lead.quarter} {lead.year} · Lead
            </p>
            <h2 className="lead__head">{lead.blurb}</h2>
            <p className="lead__standfirst">
              <span className="drop">{lead.name.charAt(0)}</span>
              {lead.name.slice(1)} arrives this quarter as the headline release — the first
              edition to put an assistant inside every store rather than beside it.
            </p>
            <div className="lead__cols">
              {lead.highlights.map((h) => (
                <p key={h} className="lead__col">
                  {h}.
                </p>
              ))}
            </div>
            <button className="readmore" type="button" onClick={() => setOpen(0)}>
              Read the full dispatch
            </button>
          </div>
          <aside className="lead__plate">
            <div className="plate" style={{ background: toneOf(lead).paper }}>
              <span className="plate__num" style={{ color: toneOf(lead).base }}>
                {num(0)}
              </span>
              <span className="plate__name">{lead.name}</span>
              <span className="plate__rule" style={{ background: toneOf(lead).base }} />
              <span className="plate__q">
                {lead.quarter} {lead.year}
              </span>
            </div>
          </aside>
        </article>

        <div className="sheet__rule" />

        <section className="columns">
          {rest.map((e, i) => (
            <article className="story" key={e.id}>
              <button className="story__hit" type="button" onClick={() => setOpen(i + 1)}>
                <p className="story__meta">
                  <span className="story__num" style={{ color: toneOf(e).base }}>
                    {num(i + 1)}
                  </span>
                  {e.quarter} {e.year}
                </p>
                <h3 className="story__head">{e.name}</h3>
                <p className="story__dek">{e.blurb}</p>
                <ul className="story__list">
                  {e.highlights.slice(0, 2).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </button>
            </article>
          ))}
        </section>
      </main>

      <footer className="colophon">
        <span>Printed on demand · stan.store</span>
        <span>The Standard — every quarter, in full</span>
      </footer>

      {record && (
        <div className="clipping-wrap" onClick={() => setOpen(null)}>
          <article className="clipping" onClick={(ev) => ev.stopPropagation()}>
            <button className="clipping__close" type="button" onClick={() => setOpen(null)}>
              Close
            </button>
            <p className="kicker">
              <span className="kicker__dot" style={{ background: toneOf(record).base }} />
              {record.quarter} {record.year} · Edition {num(open)}
            </p>
            <h2 className="clipping__head">{record.name}</h2>
            <p className="clipping__dek">{record.blurb}</p>
            <div className="clipping__rule" />
            <ul className="clipping__list">
              {record.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <a className="clipping__cta" href={record.url} target="_blank" rel="noreferrer">
              Open in Stan →
            </a>
          </article>
        </div>
      )}
    </div>
  );
}
