import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './home.css';
import './shop.css';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Header from './components/Header';
import RichText from './components/RichText';
import site from './content/site.json';
import content from './content/shop.json';

const SALES_OPEN = site.salesOpen;

const TT_URL = site.ticketTailorUrl;

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
            {content.widget.fallbackLinkText}
          </a>
          <br />
          <small>
            <a href={content.widget.poweredByUrl} className="tt-widget-powered">
              {content.widget.poweredByText}
            </a>
          </small>
        </p>
      </div>
    </div>
  );
};

const Shop = () => {
  const backUrl = new URLSearchParams(window.location.search).get('back') || content.header.defaultBackUrl;

  return (
  <div className="vb-root shop-root">
    <Header
      homeLink={content.header.homeLink}
      logoPath={content.header.logoPath}
      ctaText={content.header.ctaText}
      ctaLink={content.header.ctaLink}
    >
      <a href={backUrl}>{content.header.backLabel}</a>
    </Header>

    <section className="shop-hero">
      <div className="shop-hero-inner">
        <div className="shop-eyebrow">{content.hero.eyebrow}</div>
        <h1 className="shop-title">{content.hero.title}</h1>
        <p className="shop-sub">{content.hero.sub}</p>
      </div>
    </section>

    {SALES_OPEN && (
      <section className="shop-widget-wrap">
        <TicketTailorWidget />
        <div className="shop-fallback">
          <span>{content.widget.noticeText}</span>
          <a
            href={TT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-fallback-link"
          >
            {content.widget.noticeLinkText}
          </a>
        </div>
      </section>
    )}

    {!SALES_OPEN && (
      <section className="shop-soon">
        <div className="shop-soon-inner">
          <div className="shop-soon-eyebrow">{content.closed.eyebrow}</div>
          <h2 className="shop-soon-title">
            <RichText text={content.closed.title} />
          </h2>
          <p className="shop-soon-sub">
            <RichText text={content.closed.sub} />
          </p>
          <a
            href={content.closed.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-soon-btn shop-soon-btn--ig"
          >
            {content.closed.instagram.label}
          </a>
          <p className="shop-soon-cta-label">{content.closed.ctaLabel}</p>
          <a href={content.closed.button.href} className="shop-soon-btn">{content.closed.button.label}</a>
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
