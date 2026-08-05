// One renderer for every object on the shelving.
//
// A variant is three numbers and a drawing: `ph` is its height in shelf
// units (the same `--unit` that sizes an edition card), `box` is the SVG
// viewBox, and `drop` is how far below the shelf line it hangs. The host
// element is given the viewBox's exact aspect ratio and the SVG keeps
// `preserveAspectRatio`, so a prop can never stretch — it only ever scales.
//
// Everything is geometry and gradients: no image assets, no extra deps.
// Props are decorative, aria-hidden and pointer-events: none, so the
// edition card next to them stays the only thing you can click.
//
// Heights are deliberately kept under an edition card's 2.11 units (the lamp
// being the one exception, since it has to tower over what it lights). A prop
// that matches a card's height competes with it for attention.

const VARIANTS = {
  // —— the light source ————————————————————————————————————————
  lamp: {
    ph: 2,
    box: [88, 124],
    draw: () => (
      <>
        <ellipse className="pr__cast" cx="22" cy="118" rx="20" ry="5" />
        <rect className="pr__shell" x="7" y="109" width="31" height="8" rx="4" />
        <path className="pr__stem" d="M22 109 C22 76 24 46 44 34" />
        <g transform="rotate(-13 58 34)">
          <path className="pr__shell" d="M42 8 H74 L82 34 H34 Z" />
          <ellipse className="pr__glow" cx="58" cy="34" rx="23" ry="5" />
          <line className="pr__lite" x1="34" y1="34" x2="82" y2="34" />
        </g>
      </>
    ),
  },

  // —— living things ——————————————————————————————————————————
  plant: {
    ph: 1.25,
    box: [76, 100],
    draw: () => (
      <>
        <path className="pr__shell" d="M21 62 H55 L50 97 H26 Z" />
        <rect className="pr__shell" x="17" y="57" width="42" height="8" rx="3" />
        <g className="pr__sway">
          <path className="pr__vine" d="M38 58 C36 44 33 30 40 15" />
          <path className="pr__vine" d="M38 58 C30 48 24 42 20 36" />
          <path className="pr__vine" d="M38 58 C48 48 54 42 58 34" />
          <ellipse className="pr__leaf" cx="19" cy="34" rx="12" ry="5.6" transform="rotate(-32 19 34)" />
          <ellipse className="pr__leaf" cx="58" cy="32" rx="12" ry="5.6" transform="rotate(28 58 32)" />
          <ellipse className="pr__leaf" cx="40" cy="13" rx="9.5" ry="5" transform="rotate(-8 40 13)" />
          <ellipse className="pr__leaf pr__soft" cx="22" cy="50" rx="11" ry="5" transform="rotate(-48 22 50)" />
          <ellipse className="pr__leaf pr__soft" cx="56" cy="47" rx="11" ry="5" transform="rotate(44 56 47)" />
        </g>
      </>
    ),
  },

  // trails over the front edge of the board — hence `drop`
  vine: {
    ph: 1.45,
    box: [78, 132],
    drop: 0.64,
    draw: () => (
      // Asymmetric on purpose: one long trail down one side and a short curl
      // on the other. Two matching trails read as a pair of legs.
      <>
        <path className="pr__shell" d="M18 44 H62 L56 74 H24 Z" />
        <rect className="pr__shell" x="14" y="37" width="52" height="9" rx="3" />
        <g className="pr__hang">
          <ellipse className="pr__leaf" cx="44" cy="30" rx="12" ry="5.4" transform="rotate(-10 44 30)" />
          <ellipse className="pr__leaf" cx="30" cy="26" rx="10" ry="4.8" transform="rotate(-38 30 26)" />
          <ellipse className="pr__leaf pr__soft" cx="56" cy="27" rx="9" ry="4.4" transform="rotate(26 56 27)" />
          <ellipse className="pr__leaf pr__soft" cx="40" cy="18" rx="8" ry="4" transform="rotate(-4 40 18)" />

          <path className="pr__vine" d="M24 44 C16 58 13 74 17 90 C21 106 15 120 8 130" />
          <path className="pr__vine" d="M31 44 C27 60 29 76 25 92 C22 104 24 116 21 126" />
          <ellipse className="pr__leaf" cx="14" cy="58" rx="9" ry="4.4" transform="rotate(-34 14 58)" />
          <ellipse className="pr__leaf" cx="26" cy="64" rx="8.5" ry="4.2" transform="rotate(18 26 64)" />
          <ellipse className="pr__leaf" cx="13" cy="76" rx="9.5" ry="4.6" transform="rotate(-16 13 76)" />
          <ellipse className="pr__leaf" cx="28" cy="82" rx="8" ry="4" transform="rotate(24 28 82)" />
          <ellipse className="pr__leaf" cx="17" cy="94" rx="9" ry="4.4" transform="rotate(-28 17 94)" />
          <ellipse className="pr__leaf pr__soft" cx="25" cy="106" rx="8" ry="4" transform="rotate(14 25 106)" />
          <ellipse className="pr__leaf pr__soft" cx="12" cy="112" rx="8.5" ry="4.2" transform="rotate(-40 12 112)" />
          <ellipse className="pr__leaf pr__soft" cx="19" cy="126" rx="7.5" ry="3.6" transform="rotate(10 19 126)" />

          <path className="pr__vine" d="M55 44 C61 54 63 64 59 74" />
          <ellipse className="pr__leaf pr__soft" cx="63" cy="58" rx="8" ry="4" transform="rotate(34 63 58)" />
          <ellipse className="pr__leaf pr__soft" cx="58" cy="72" rx="7.5" ry="3.6" transform="rotate(-22 58 72)" />
        </g>
      </>
    ),
  },

  // —— lived-in clutter —————————————————————————————————————————
  books: {
    ph: 0.52,
    box: [92, 48],
    draw: () => (
      <>
        <rect className="pr__shell" x="6" y="35" width="80" height="11" rx="2" />
        <rect className="pr__deep" x="10" y="25" width="72" height="10" rx="2" />
        <rect className="pr__shell" x="14" y="15" width="64" height="10" rx="2" transform="rotate(-2 46 20)" />
        <rect className="pr__accent" x="19" y="6" width="54" height="9" rx="2" transform="rotate(1.6 46 10)" />
        <line className="pr__lite" x1="11" y1="40" x2="81" y2="40" />
        <line className="pr__lite pr__soft" x1="15" y1="30" x2="77" y2="30" />
      </>
    ),
  },

  mug: {
    ph: 0.4,
    box: [58, 46],
    draw: () => (
      <>
        <path className="pr__handle" d="M40 17 a10 10 0 0 1 0 15" />
        <path className="pr__shell" d="M7 9 H41 V31 A10 10 0 0 1 31 41 H17 A10 10 0 0 1 7 31 Z" />
        <ellipse className="pr__deep" cx="24" cy="9" rx="17" ry="4.6" />
        <ellipse className="pr__glow pr__soft" cx="24" cy="9" rx="12" ry="3" />
        <line className="pr__lite" x1="12" y1="16" x2="12" y2="30" />
      </>
    ),
  },

  // —— creator equipment ————————————————————————————————————————
  speaker: {
    ph: 0.72,
    box: [56, 68],
    draw: () => (
      <>
        <rect className="pr__shell" x="6" y="10" width="44" height="54" rx="15" />
        <line className="pr__lite pr__soft" x1="14" y1="30" x2="42" y2="30" />
        <line className="pr__lite pr__soft" x1="14" y1="38" x2="42" y2="38" />
        <line className="pr__lite pr__soft" x1="14" y1="46" x2="42" y2="46" />
        <ellipse className="pr__deep" cx="28" cy="12" rx="22" ry="6" />
        <ellipse className="pr__accent" cx="28" cy="12" rx="14" ry="3.6" />
      </>
    ),
  },

  tablet: {
    ph: 1.25,
    box: [80, 98],
    draw: () => (
      <g transform="rotate(-7 40 92)">
        <ellipse className="pr__cast" cx="40" cy="94" rx="26" ry="4" />
        <rect className="pr__shell" x="11" y="6" width="58" height="86" rx="8" />
        <rect className="pr__screen" x="15" y="10" width="50" height="78" rx="5" />
        <line className="pr__lite" x1="21" y1="22" x2="47" y2="22" />
        <line className="pr__lite pr__soft" x1="21" y1="32" x2="59" y2="32" />
        <rect className="pr__accent" x="21" y="42" width="22" height="16" rx="3" />
        <rect className="pr__accent pr__soft" x="47" y="42" width="12" height="16" rx="3" />
        <line className="pr__lite pr__soft" x1="21" y1="68" x2="59" y2="68" />
        <line className="pr__lite pr__soft" x1="21" y1="76" x2="45" y2="76" />
      </g>
    ),
  },

  dock: {
    ph: 1.15,
    box: [72, 108],
    draw: () => (
      <>
        <ellipse className="pr__cast" cx="36" cy="104" rx="25" ry="4.5" />
        <path className="pr__deep" d="M26 98 L31 54 H41 L46 98 Z" />
        <path className="pr__shell" d="M13 97 H59 L55 104 H17 Z" />
        <g transform="rotate(-8 36 56)">
          <rect className="pr__shell" x="18" y="10" width="36" height="74" rx="8" />
          <rect className="pr__screen" x="21" y="13" width="30" height="68" rx="6" />
          <line className="pr__lite" x1="27" y1="26" x2="45" y2="26" />
          <rect className="pr__accent" x="27" y="34" width="18" height="12" rx="3" />
          <line className="pr__lite pr__soft" x1="27" y1="54" x2="45" y2="54" />
          <line className="pr__lite pr__soft" x1="27" y1="62" x2="39" y2="62" />
        </g>
      </>
    ),
  },

  mic: {
    ph: 1.45,
    box: [70, 116],
    draw: () => (
      <>
        <ellipse className="pr__cast" cx="34" cy="112" rx="22" ry="4.5" />
        <rect className="pr__shell" x="16" y="103" width="37" height="9" rx="4.5" />
        <path className="pr__stem" d="M34 103 V64" />
        <path className="pr__lite" d="M19 44 V58 A15 15 0 0 0 49 58 V44" />
        <rect className="pr__shell" x="20" y="8" width="29" height="50" rx="14" />
        <line className="pr__lite pr__soft" x1="24" y1="20" x2="45" y2="20" />
        <line className="pr__lite pr__soft" x1="24" y1="28" x2="45" y2="28" />
        <line className="pr__lite pr__soft" x1="24" y1="36" x2="45" y2="36" />
        <circle className="pr__accent" cx="34" cy="48" r="3" />
      </>
    ),
  },

  camera: {
    ph: 0.72,
    box: [98, 68],
    draw: () => (
      <>
        <rect className="pr__deep" x="31" y="7" width="27" height="13" rx="4" />
        <rect className="pr__shell" x="6" y="18" width="86" height="45" rx="9" />
        <circle className="pr__deep" cx="53" cy="41" r="19" />
        <circle className="pr__lens" cx="53" cy="41" r="13" />
        <circle className="pr__glow pr__soft" cx="48" cy="36" r="4.2" />
        <rect className="pr__accent" x="14" y="27" width="11" height="5" rx="2.5" />
        <line className="pr__lite" x1="14" y1="53" x2="27" y2="53" />
      </>
    ),
  },

  ringlight: {
    ph: 1.5,
    box: [86, 124],
    draw: () => (
      <>
        <ellipse className="pr__cast" cx="43" cy="120" rx="24" ry="4" />
        <path className="pr__stem" d="M43 118 V76 M43 118 L26 119 M43 118 L60 119" />
        <line className="pr__lite pr__soft" x1="30" y1="104" x2="56" y2="104" />
        <circle className="pr__ringlight" cx="43" cy="41" r="31" />
        <circle className="pr__lite pr__soft" cx="43" cy="41" r="24" />
      </>
    ),
  },

  notepad: {
    ph: 0.52,
    box: [92, 50],
    draw: () => (
      <>
        <path className="pr__stem" d="M22 46 L72 36" />
        <g transform="rotate(-4 46 38)">
          <rect className="pr__shell" x="9" y="15" width="74" height="30" rx="3" />
          <rect className="pr__paper" x="12" y="10" width="68" height="31" rx="2" />
          <line className="pr__rule" x1="19" y1="20" x2="70" y2="20" />
          <line className="pr__rule" x1="19" y1="27" x2="70" y2="27" />
          <line className="pr__rule" x1="19" y1="34" x2="52" y2="34" />
          <circle className="pr__lite" cx="24" cy="10" r="2.2" />
          <circle className="pr__lite" cx="40" cy="10" r="2.2" />
          <circle className="pr__lite" cx="56" cy="10" r="2.2" />
          <circle className="pr__lite" cx="72" cy="10" r="2.2" />
        </g>
      </>
    ),
  },

  headphones: {
    ph: 0.85,
    box: [86, 74],
    draw: () => (
      <>
        <path className="pr__band" d="M13 52 V40 A30 30 0 0 1 73 40 V52" />
        <rect className="pr__shell" x="4" y="42" width="19" height="28" rx="9" />
        <rect className="pr__shell" x="63" y="42" width="19" height="28" rx="9" />
        <rect className="pr__accent" x="8" y="48" width="11" height="16" rx="5" />
        <rect className="pr__accent pr__soft" x="67" y="48" width="11" height="16" rx="5" />
        <path className="pr__lite" d="M20 32 A24 24 0 0 1 66 32" />
      </>
    ),
  },

  tripod: {
    ph: 1.42,
    box: [86, 118],
    draw: () => (
      <>
        <ellipse className="pr__cast" cx="43" cy="115" rx="30" ry="4" />
        <path className="pr__stem" d="M43 32 V70 M43 70 L17 114 M43 70 L43 114 M43 70 L69 114" />
        <line className="pr__lite pr__soft" x1="26" y1="92" x2="60" y2="92" />
        <rect className="pr__shell" x="29" y="14" width="28" height="18" rx="4" />
        <circle className="pr__lens" cx="43" cy="23" r="5.5" />
      </>
    ),
  },
};

export default function ShelfProp({ variant, scale = 1 }) {
  const spec = VARIANTS[variant];
  if (!spec) return null;

  const [w, h] = spec.box;

  return (
    <span
      className={`sprop sprop--${variant}`}
      aria-hidden="true"
      style={{
        '--ph': spec.ph,
        '--ar': `${w} / ${h}`,
        '--pscale': scale,
        '--drop': spec.drop ?? 0,
      }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax meet" focusable="false">
        {spec.draw()}
      </svg>
    </span>
  );
}
