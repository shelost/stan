import { useId } from 'react';
import { toneOf } from '../../data/tones';

// Sleeve artwork is generated entirely from type, geometry and gradients.
//
// Each edition supplies a *field recipe* (two glow anchors, a wash angle and
// one of five shared texture families) plus an SVG *figure*. The figure is
// drawn on a fixed 0 0 100 100 viewBox, so `preserveAspectRatio` letterboxes
// it inside any host — square /editions sleeves or tall 9/19 phone sleeves —
// without ever distorting the geometry.

const FIELDS = {
  stanley: { fx: 26, fy: 16, gx: 86, gy: 94, fa: 152, tex: 'rings' },
  'creator-os': { fx: 84, fy: 12, gx: 14, gy: 88, fa: 198, tex: 'lattice' },
  storefront: { fx: 16, fy: 86, gx: 88, gy: 14, fa: 126, tex: 'weave' },
  classroom: { fx: 76, fy: 84, gx: 18, gy: 10, fa: 168, tex: 'hairline' },
  booked: { fx: 50, fy: 8, gx: 50, gy: 98, fa: 182, tex: 'lattice' },
  community: { fx: 28, fy: 32, gx: 80, gy: 80, fa: 138, tex: 'rings' },
  payday: { fx: 88, fy: 28, gx: 12, gy: 80, fa: 212, tex: 'hairline' },
  fans: { fx: 20, fy: 94, gx: 82, gy: 22, fa: 116, tex: 'wave' },
  'hello-stan': { fx: 50, fy: 80, gx: 50, gy: 10, fa: 174, tex: 'wave' },
};

const FALLBACK_FIELD = { fx: 50, fy: 18, gx: 50, gy: 92, fa: 170, tex: 'lattice' };

// —— figure geometry tables ——————————————————————————————————————

// dashboard tiles surrounding the hero panel
const TILES = [
  { x: 66, y: 16, w: 23, h: 15, soft: false },
  { x: 66, y: 35, w: 23, h: 15, soft: true },
  { x: 11, y: 56, w: 23, h: 28, soft: true },
  { x: 39, y: 56, w: 22, h: 28, soft: false },
  { x: 66, y: 56, w: 23, h: 28, soft: true },
];

// 4 columns × 3 rows, row-major — index 5 is the booked day
const CAL = [45, 62, 79].flatMap((y) => [20, 38, 56, 74].map((x) => ({ x, y })));
const CAL_ON = 5;

const LINKS = [
  [50, 18, 20, 60],
  [50, 18, 80, 60],
  [20, 60, 80, 60],
  [20, 60, 50, 88],
  [80, 60, 50, 88],
  [50, 18, 50, 88],
];

const BARS = [22, 34, 29, 46, 58, 74].map((h, i) => ({ h, x: 12 + i * 13 }));

const RAY_ANGLES = [-74, -49, -24, 0, 24, 49, 74];
const RAYS = RAY_ANGLES.map((deg) => {
  const r = ((deg - 90) * Math.PI) / 180;
  return {
    deg,
    x1: 50 + Math.cos(r) * 30,
    y1: 58 + Math.sin(r) * 30,
    x2: 50 + Math.cos(r) * 39.5,
    y2: 58 + Math.sin(r) * 39.5,
  };
});

// —— the nine figures ————————————————————————————————————————————

const FIGURES = {
  // Stanley — a lit core with orbit rings and one satellite
  stanley: (u) => (
    <>
      <circle className="fig__halo" cx="50" cy="50" r="36" fill={`url(#${u}-core)`} />
      <circle className="fig__ring fig__soft" cx="50" cy="50" r="46" />
      <circle className="fig__ring" cx="50" cy="50" r="34" />
      <circle className="fig__ring fig__soft" cx="50" cy="50" r="22" />
      <ellipse className="fig__ring fig__spin" cx="50" cy="50" rx="46" ry="16" />
      <circle className="fig__pip fig__pulse" cx="50" cy="50" r="8.5" fill={`url(#${u}-sweep)`} />
      <g className="fig__orbit">
        <circle className="fig__dot" cx="50" cy="4" r="3.4" />
      </g>
    </>
  ),

  // Creator OS — a dashboard: hero panel, side tiles, a refresh scan
  'creator-os': (u) => (
    <>
      <rect className="fig__plate" x="4" y="8" width="92" height="84" rx="8" />
      <rect className="fig__hero" x="11" y="16" width="50" height="34" rx="4" fill={`url(#${u}-sweep)`} />
      {TILES.map((t) => (
        <rect
          key={`${t.x}-${t.y}`}
          className={`fig__tile${t.soft ? ' fig__soft' : ''}`}
          x={t.x}
          y={t.y}
          width={t.w}
          height={t.h}
          rx="3"
        />
      ))}
      <line className="fig__scan" x1="6" y1="10" x2="94" y2="10" />
    </>
  ),

  // Storefront — an awning over three stacked product rows
  storefront: (u) => (
    <>
      <path className="fig__awning" d="M10 32 Q10 14 27 14 H73 Q90 14 90 32 Z" fill={`url(#${u}-sweep)`} />
      <path
        className="fig__scallop"
        d="M10 32 q6.7 8 13.3 0 q6.7 8 13.3 0 q6.7 8 13.3 0 q6.7 8 13.3 0 q6.7 8 13.3 0 q6.7 8 13.3 0"
      />
      <rect className="fig__card fig__soft fig__drift" x="22" y="48" width="56" height="14" rx="3" />
      <rect className="fig__card" x="17" y="63" width="66" height="14" rx="3" />
      <rect className="fig__card fig__fill" x="12" y="78" width="76" height="14" rx="3" />
    </>
  ),

  // Classroom — a lesson disc over module rows with a progress fill
  classroom: (u) => (
    <>
      <circle className="fig__halo" cx="50" cy="30" r="26" fill={`url(#${u}-core)`} />
      <circle className="fig__ring fig__soft" cx="50" cy="30" r="21" />
      <path className="fig__fill fig__play" d="M44.5 21.5 L61 30 L44.5 38.5 Z" />
      <rect className="fig__row fig__soft" x="14" y="64" width="72" height="6" rx="3" />
      <rect className="fig__row fig__soft" x="14" y="76" width="72" height="6" rx="3" />
      <rect className="fig__row fig__soft" x="14" y="88" width="72" height="6" rx="3" />
      <rect className="fig__fill fig__grow" x="14" y="64" width="48" height="6" rx="3" />
      <rect className="fig__fill fig__grow fig__delay-1" x="14" y="76" width="30" height="6" rx="3" />
    </>
  ),

  // Booked — a calendar sheet with one day taken and a ping around it
  booked: () => (
    <>
      <rect className="fig__plate" x="10" y="14" width="80" height="78" rx="8" />
      <line className="fig__line" x1="10" y1="34" x2="90" y2="34" />
      <circle className="fig__dot fig__soft" cx="22" cy="24" r="2.6" />
      <circle className="fig__dot fig__soft" cx="78" cy="24" r="2.6" />
      {CAL.map((c, i) =>
        i === CAL_ON ? null : (
          <rect
            key={`${c.x}-${c.y}`}
            className="fig__cell fig__soft"
            x={c.x - 6}
            y={c.y - 6}
            width="12"
            height="12"
            rx="3"
          />
        ),
      )}
      <circle className="fig__ring fig__ping" cx={CAL[CAL_ON].x} cy={CAL[CAL_ON].y} r="11" />
      <rect
        className="fig__fill fig__pulse"
        x={CAL[CAL_ON].x - 6}
        y={CAL[CAL_ON].y - 6}
        width="12"
        height="12"
        rx="3"
      />
    </>
  ),

  // Community — a member graph, links drawn in, nodes breathing
  community: (u) => (
    <>
      <circle className="fig__halo" cx="50" cy="54" r="34" fill={`url(#${u}-core)`} />
      <g className="fig__links">
        {LINKS.map(([x1, y1, x2, y2], i) => (
          <line
            key={`${x1}-${y1}-${x2}-${y2}`}
            className="fig__draw"
            style={{ animationDelay: `${0.1 * i}s` }}
            pathLength="100"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        ))}
      </g>
      <circle className="fig__node fig__fill" cx="50" cy="18" r="9" />
      <circle className="fig__node fig__pulse" cx="20" cy="60" r="7" />
      <circle className="fig__node fig__pulse fig__delay-1" cx="80" cy="60" r="7" />
      <circle className="fig__node fig__pulse fig__delay-2" cx="50" cy="88" r="7" />
    </>
  ),

  // Payday — a fanned stack of notes, a coin lifting off, one ledger rule
  payday: (u) => (
    <>
      <rect
        className="fig__note fig__soft"
        x="16"
        y="30"
        width="68"
        height="22"
        rx="4"
        transform="rotate(-7 50 41)"
      />
      <rect className="fig__note" x="16" y="42" width="68" height="22" rx="4" transform="rotate(3.5 50 53)" />
      <rect className="fig__note fig__fill" x="16" y="56" width="68" height="24" rx="4" fill={`url(#${u}-sweep)`} />
      <circle className="fig__coin fig__drift" cx="72" cy="24" r="13" fill={`url(#${u}-core)`} />
      <circle className="fig__ring fig__drift" cx="72" cy="24" r="13" />
      <line className="fig__line" x1="24" y1="90" x2="76" y2="90" />
    </>
  ),

  // Fans — growth bars under a drawn-in trend curve
  fans: (u) => (
    <>
      {BARS.map((b, i) => (
        <rect
          key={b.x}
          className="fig__bar fig__rise"
          style={{ animationDelay: `${0.06 * i}s` }}
          x={b.x}
          y={88 - b.h}
          width="10"
          height={b.h}
          rx="2"
          fill={`url(#${u}-fade)`}
        />
      ))}
      <path
        className="fig__draw fig__curve"
        pathLength="100"
        d="M14 70 C28 64 32 52 46 49 S64 39 74 26 L88 15"
      />
      <circle className="fig__dot fig__pulse" cx="88" cy="15" r="4.5" />
      <line className="fig__line" x1="8" y1="90" x2="92" y2="90" />
    </>
  ),

  // Hello, Stan — first light: a sun clipped by the horizon it rises over
  'hello-stan': (u) => (
    <>
      <clipPath id={`${u}-sky`}>
        <rect x="0" y="0" width="100" height="72" />
      </clipPath>
      <g clipPath={`url(#${u}-sky)`}>
        <circle className="fig__halo" cx="50" cy="58" r="38" fill={`url(#${u}-core)`} />
        <circle className="fig__sun" cx="50" cy="58" r="24" fill={`url(#${u}-sweep)`} />
        <circle className="fig__ring fig__soft fig__ping" cx="50" cy="58" r="33" />
        <g className="fig__rays">
          {RAYS.map((r) => (
            <line key={r.deg} className="fig__ray" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
          ))}
        </g>
      </g>
      <line className="fig__horizon" x1="6" y1="72" x2="94" y2="72" />
      <line className="fig__line fig__drift" x1="24" y1="80" x2="76" y2="80" />
      <line className="fig__line fig__soft fig__drift fig__delay-1" x1="34" y1="87" x2="66" y2="87" />
    </>
  ),
};

// Gradients live per-instance so several covers can share a page without
// their `url(#…)` references colliding.
function Defs({ uid }) {
  return (
    <defs>
      <radialGradient id={`${uid}-core`}>
        <stop offset="0" style={{ stopColor: 'var(--soft)', stopOpacity: 0.9 }} />
        <stop offset="0.55" style={{ stopColor: 'var(--tone)', stopOpacity: 0.45 }} />
        <stop offset="1" style={{ stopColor: 'var(--tone)', stopOpacity: 0 }} />
      </radialGradient>

      <linearGradient id={`${uid}-sweep`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" style={{ stopColor: 'var(--deep)', stopOpacity: 0.85 }} />
        <stop offset="0.55" style={{ stopColor: 'var(--tone)', stopOpacity: 0.95 }} />
        <stop offset="1" style={{ stopColor: 'var(--soft)', stopOpacity: 0.9 }} />
      </linearGradient>

      <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: 'var(--tone)', stopOpacity: 0.92 }} />
        <stop offset="1" style={{ stopColor: 'var(--tone)', stopOpacity: 0.24 }} />
      </linearGradient>
    </defs>
  );
}

export default function Cover({ edition, index }) {
  const tone = toneOf(edition);
  const field = FIELDS[edition.id] ?? FALLBACK_FIELD;
  const figure = FIGURES[edition.id];

  // useId() emits characters that are not safe inside url(#…), so strip them
  const uid = `art${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div
      className={`art art--${edition.id} art--tex-${field.tex}`}
      style={{
        '--tone': tone.base,
        '--soft': tone.soft,
        '--deep': tone.deep,
        '--paper': tone.paper,
        '--fx': `${field.fx}%`,
        '--fy': `${field.fy}%`,
        '--gx': `${field.gx}%`,
        '--gy': `${field.gy}%`,
        '--fa': `${field.fa}deg`,
      }}
    >
      <span className="art__field" aria-hidden="true" />
      <span className="art__mesh" aria-hidden="true" />
      <span className="art__tex" aria-hidden="true" />
      <span className="art__grain" aria-hidden="true" />
      <span className="art__gloss" aria-hidden="true" />
      <span className="art__sheen" aria-hidden="true" />

      <span className="art__stage">
        <span className="art__top">
          <span className="art__mast">The Standard</span>
          <span className="art__idx">{String(index + 1).padStart(2, '0')}</span>
        </span>

        <span className="art__figure">
          <svg className="art__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <Defs uid={uid} />
            {figure?.(uid)}
          </svg>
        </span>

        <span className="art__foot">
          <span className="art__name">{edition.name}</span>
          <span className="art__sub">
            <span className="art__q">
              {edition.quarter} {edition.year}
            </span>
            {edition.isNew && <span className="art__new">New</span>}
          </span>
        </span>
      </span>
    </div>
  );
}
