import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './home.css';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Header from './components/Header';
import RichText from './components/RichText';
import EventBanner from './components/EventBanner';
import content from './content/home.json';
import site from './content/site.json';

const Home = () => {
  const [hover, setHover] = React.useState(null);

  React.useEffect(() => {
    const y = sessionStorage.getItem('home_scroll');
    if (y) {
      sessionStorage.removeItem('home_scroll');
      window.scrollTo(0, parseInt(y, 10));
    }
  }, []);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const [heroImgs] = React.useState(() =>
    content.districts.map((d) => (d.imgPool && d.imgPool.length ? pick(d.imgPool) : d.img))
  );
  const districts = content.districts.map((d, i) => ({ ...d, img: heroImgs[i] }));

  return (
    <div className="vb-root">
      {/* HEADER */}
      <Header
        homeLink={content.header.homeLink}
        logoPath={content.header.logoPath}
        ctaText={content.header.ctaText}
        ctaLink={content.header.ctaLink}
      >
        {content.header.nav.map((n, i) =>
          n.disabled
            ? <span key={i} style={{ opacity: 0.45, cursor: 'default' }}>{n.label}</span>
            : <a key={i} href={n.href}>{n.label}</a>
        )}
      </Header>

      {/* HERO — TRE BLOCCHI */}
      <section className="vb-hero">
        <div className="vb-hero-top">
          <div className="vb-hero-eyebrow">
            <span>◆</span> {content.hero.eyebrow}
          </div>
          <h1 className="vb-hero-title">
            <span className="vb-h-line">{content.hero.titleLines[0]}</span>
            <span className="vb-h-line vb-h-amp">{content.hero.titleSeparator}</span>
            <span className="vb-h-line">{content.hero.titleLines[1]}</span>
          </h1>
          <p className="vb-hero-sub">
            <RichText text={content.hero.sub} />
          </p>
        </div>

        <div className="vb-blocks">
          {districts.map((d, i) => (
            <div
              key={d.n}
              className={`vb-block ${hover === i ? 'is-hover' : ''} ${hover !== null && hover !== i ? 'is-dim' : ''}`}
              style={{ background: d.bg, color: d.fg }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="vb-block-top">
                <div className="vb-block-num">{d.n}</div>
                <div className="vb-block-arrow" style={{ color: d.accent }}>↗</div>
              </div>
              <div className="vb-block-bottom">
                <div className="vb-block-sub" style={{ color: d.accent }}>Distretto Rotaract</div>
                <div className="vb-block-city">{d.city}</div>
                <div className="vb-block-tag">{d.sub}</div>
                <div className="vb-block-stats">
                  <div><strong>{d.clubs}</strong> club</div>
                  <div className="vb-dot" style={{ background: d.accent }} />
                  <div><strong>{d.soci}</strong> soci</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA APERTURA NAZIONALE — TICKER */}
      <EventBanner starText="✦" button={site.event.buttons.home} />

      {/* MANIFESTO */}
      <section id="manifesto" className="vb-manifesto">
        <div className="vb-manifesto-side">
          <div className="vb-section-no">[ 01 ]</div>
          <div className="vb-section-name">MANIFESTO</div>
        </div>
        <div className="vb-manifesto-main">
          <h2 className="vb-manifesto-title">
            <RichText text={content.manifesto.title} />
          </h2>
          <div className="vb-manifesto-body">
            <p className="vb-manifesto-lede">
              <RichText text={content.manifesto.lede} />
            </p>
            {content.manifesto.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>

          <div className="vb-pillars">
            {content.manifesto.pillars.map((p) => (
              <div key={p.n} className="vb-pillar">
                <div className="vb-pillar-n">{p.n}</div>
                <div className="vb-pillar-t">{p.t}</div>
                <div className="vb-pillar-d">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMERI */}
      <section id="numeri" className="vb-numbers">
        <div className="vb-numbers-head">
          <div className="vb-section-no vb-light">[ 02 ]</div>
          <div className="vb-section-name vb-light">IL MDIO IN CIFRE</div>
        </div>
        <div className="vb-numbers-grid">
          {content.numbers.map((x, i) => (
            <div key={i} className="vb-num-cell">
              <div className="vb-num-n">{x.n}</div>
              <div className="vb-num-l">{x.l}</div>
              <div className="vb-num-s">{x.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DISTRETTI EXPANDED */}
      <section id="distretti" className="vb-distretti">
        <div className="vb-distretti-head">
          <div>
            <div className="vb-section-no">[ 03 ]</div>
            <div className="vb-section-name">I DISTRETTI</div>
          </div>
          <h2 className="vb-distretti-title">
            {content.districtsSection.title}<br />
            <span className="vb-amp">{content.districtsSection.emph}</span>
          </h2>
        </div>

        <div className="vb-dist-stack">
          {districts.map((d, i) => (
            <article
              key={d.n}
              className="vb-dist-row"
              style={{ '--bg': d.bg, '--fg': d.fg, '--ac': d.accent }}
            >
              <div className="vb-dist-no">
                <span className="vb-dist-no-d">{d.n.slice(-2)}</span>
                <span className="vb-dist-no-m">{d.n}</span>
              </div>
              <div className="vb-dist-img">
                <img src={d.img} alt={d.city} loading="lazy" />
                <div className="vb-dist-overlay" />
              </div>
              <div className="vb-dist-content">
                <div className="vb-dist-sub">{d.sub.toUpperCase()}</div>
                <h3 className="vb-dist-city">{d.city}</h3>
                <p className="vb-dist-claim">{d.claim}</p>
                <div className="vb-dist-zone">{d.zone}</div>
                {d.zones && (
                  <div className="vb-dist-zones">
                    <span>ZONE:</span>
                    {d.zones.map((z) => <span key={z}>{z}</span>)}
                  </div>
                )}
                <div className="vb-dist-cities">
                  {d.cities.map((c) => (
                    <span key={c} className="vb-city-chip">{c}</span>
                  ))}
                </div>
              </div>
              <div className="vb-dist-cta">
                <a
                  href={d.page || d.sito}
                  {...(d.page ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="vb-dist-cta-main"
                  onClick={() => { if (d.page) sessionStorage.setItem('home_scroll', window.scrollY); }}
                >
                  SCOPRI<br />DI PIÙ
                  <span>↗</span>
                </a>
                <div className="vb-dist-cta-sub">
                  <a href={d.ig} target="_blank" rel="noopener noreferrer">IG</a>
                  <a href={d.sito} target="_blank" rel="noopener noreferrer">SITO</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MAPPA */}
      <section id="mappa" className="vb-mappa">
        <div className="vb-mappa-head">
          <div className="vb-section-no vb-light">[ 04 ]</div>
          <div className="vb-section-name vb-light">TERRITORIO</div>
          <h2 className="vb-mappa-title"><RichText text={content.mappa.title} /></h2>
        </div>
        <div className="vb-mappa-wrap">
          <img src={content.mappa.image} alt={content.mappa.imageAlt} className="vb-mappa-svg" loading="lazy" />
          <div className="vb-mappa-legend">
            {content.mappa.legend.map((l) => (
              <div key={l.label} className="vb-leg-item"><span style={{ background: l.color }} />{l.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <Home />
      <CookieBanner />
    </>
  </React.StrictMode>
);
