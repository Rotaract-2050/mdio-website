import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './home.css';
import './shop.css';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Header from './components/Header';

const SALES_OPEN = true;
const WAVE_PAUSED = false;

const TT_URL = 'https://www.tickettailor.com/checkout/new-session/id/7914588/chk/054c/?ref=website_widget&show_search_filter=true&show_date_filter=true&show_sort=true';

const TicketTailorWidget = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const container = ref.current;
    if (!container || container.querySelector('script[src*="tickettailor"]')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.tickettailor.com/js/widgets/min/widget.js';
    script.setAttribute('data-url', TT_URL);
    script.setAttribute('data-type', 'inline');
    script.setAttribute('data-inline-minimal', 'false');
    script.setAttribute('data-inline-show-logo', 'true');
    script.setAttribute('data-inline-bg-fill', 'false');
    script.setAttribute('data-inline-inherit-ref-from-url-param', '');
    script.setAttribute('data-inline-ref', 'website_widget');
    container.appendChild(script);

    return () => { container.innerHTML = ''; };
  }, []);

  return (
    <div className="tt-widget" ref={ref}>
      <div className="tt-widget-fallback">
        <p>
          <a href={TT_URL} target="_blank" rel="noopener noreferrer">
            Clicca qui per acquistare i biglietti
          </a>
          <br />
          <small>
            <a href="https://www.tickettailor.com?rf=wdg_300465" className="tt-widget-powered">
              Sell tickets online with Ticket Tailor
            </a>
          </small>
        </p>
      </div>
    </div>
  );
};

const Shop = () => {
  const backUrl = new URLSearchParams(window.location.search).get('back') || 'apertura-nazionale.html';

  return (
  <div className="vb-root shop-root">
    <Header
      homeLink="index.html"
      logoPath="assets/logo-mdio.jpeg"
      ctaText="Apertura Nazionale →"
      ctaLink="apertura-nazionale.html"
    >
      <a href={backUrl}>← Torna indietro</a>
    </Header>

    <section className="shop-hero">
      <div className="shop-hero-inner">
        <div className="shop-eyebrow">Apertura Nazionale 2026 — MDIO Lombardo</div>
        <h1 className="shop-title">Acquista i biglietti</h1>
        <p className="shop-sub">Milano · Monza · Sale Marasino — 18 · 19 · 20 Settembre</p>
      </div>
    </section>

    {SALES_OPEN && (
      <section className="shop-widget-wrap" style={WAVE_PAUSED ? { display: 'none' } : {}}>
        <TicketTailorWidget />
        <div className="shop-fallback">
          <span>Non vedi nulla?</span>
          <a
            href={TT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-fallback-link"
          >
            Clicca qui per acquistare →
          </a>
        </div>
      </section>
    )}

    {(!SALES_OPEN || WAVE_PAUSED) && (
      <section className="shop-soon">
        <div className="shop-soon-inner">
          <div className="shop-soon-eyebrow">— Prossima wave</div>
          <h2 className="shop-soon-title">
            {WAVE_PAUSED
              ? <><em>Rimani sintonizzato.</em></>
              : <>Stiamo arrivando.<br /><em>Ti faremo sapere.</em></>
            }
          </h2>
          <p className="shop-soon-sub">
            {WAVE_PAUSED
              ? <>Stiamo preparando la prossima wave di biglietti.<br />Seguici sui social per essere il primo a saperlo — l'annuncio arriverà presto.</>
              : <>Le vendite apriranno a breve.<br />Seguici su Instagram per essere il primo a saperlo.</>
            }
          </p>
          <a
            href="https://www.instagram.com/multidistrettolombardo/"
            target="_blank"
            rel="noopener noreferrer"
            className="shop-soon-btn shop-soon-btn--ig"
          >
            Seguici su Instagram →
          </a>
          <p className="shop-soon-cta-label">Nel frattempo, scopri il programma completo →</p>
          <a href="apertura-nazionale.html" className="shop-soon-btn">Scopri l'Apertura Nazionale</a>
        </div>
      </section>
    )}

    <Footer />
  </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <Shop />
      <CookieBanner />
    </>
  </React.StrictMode>
);
