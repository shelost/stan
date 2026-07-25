// Each edition gets its own art direction so the shelf reads like a row
// of distinct album sleeves rather than one template in nine colours.
const ART = {
  stanley: (e) => (
    <>
      <div className="art__aurora" />
      <div className="art__spark">{e.emoji}</div>
      <span className="art__script">{e.name}</span>
    </>
  ),
  'creator-os': (e) => (
    <>
      <div className="art__grid" />
      <div className="art__window">
        <span className="art__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="art__emoji">{e.emoji}</span>
      </div>
      <span className="art__mono">{e.name}</span>
    </>
  ),
  storefront: (e) => (
    <>
      <div className="art__layers">
        <div />
        <div />
        <div />
      </div>
      <span className="art__emoji art__emoji--corner">{e.emoji}</span>
      <span className="art__slab">{e.name}</span>
    </>
  ),
  classroom: (e) => (
    <>
      <div className="art__bars">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} />
        ))}
      </div>
      <span className="art__emoji">{e.emoji}</span>
      <span className="art__serif">{e.name}</span>
    </>
  ),
  booked: (e) => (
    <>
      <div className="art__cal">
        {Array.from({ length: 20 }).map((_, i) => (
          <i key={i} className={i === 9 ? 'on' : undefined} />
        ))}
      </div>
      <span className="art__slab art__slab--dark">{e.name}</span>
      <span className="art__emoji art__emoji--corner">{e.emoji}</span>
    </>
  ),
  community: (e) => (
    <>
      <div className="art__bubbles">
        <span />
        <span />
        <span />
      </div>
      <span className="art__emoji">{e.emoji}</span>
      <span className="art__slab">{e.name}</span>
    </>
  ),
  payday: (e) => (
    <>
      <div className="art__stripes" />
      <div className="art__coin">$</div>
      <span className="art__slab">{e.name}</span>
    </>
  ),
  fans: (e) => (
    <>
      <div className="art__chart">
        {[38, 52, 46, 68, 84, 96].map((h) => (
          <div key={h} style={{ height: `${h}%` }} />
        ))}
      </div>
      <span className="art__slab">{e.name}</span>
      <span className="art__emoji art__emoji--corner">{e.emoji}</span>
    </>
  ),
  'hello-stan': (e) => (
    <>
      <div className="art__rays" />
      <span className="art__emoji art__emoji--big">{e.emoji}</span>
      <span className="art__display">{e.name}</span>
    </>
  ),
};

export default function Cover({ edition }) {
  const render = ART[edition.id];
  return (
    <div className={`art art--${edition.id}`}>
      <span className="art__masthead">The Standard</span>
      {render ? render(edition) : <span className="art__slab">{edition.name}</span>}
    </div>
  );
}
