export default function ComingSoonApp() {
  return (
    <div className="soon">
      <a className="soon__logo" href="/" aria-label="Stan">
        <img src="/stan_logo.svg" alt="Stan" />
      </a>
      <main className="soon__body">
        <h1 className="soon__title">
          <span>Coming</span>
          <span>soon</span>
        </h1>
        <p className="soon__sub">The site is on the way. These are live now.</p>
        <div className="soon__actions">
          <a className="soon__btn soon__btn--fill" href="https://stan.store" target="_blank" rel="noreferrer">
            Stan Store
          </a>
          <a className="soon__btn soon__btn--ghost" href="https://getstanley.ai" target="_blank" rel="noreferrer">
            Stanley
          </a>
        </div>
      </main>
    </div>
  );
}
