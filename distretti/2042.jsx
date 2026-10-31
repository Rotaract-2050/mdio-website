import React from 'react';
import ReactDOM from 'react-dom/client';
import '../globals.css';
import '../home.css';
import './2042.css';
import CookieBanner from '../components/CookieBanner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RichText from '../components/RichText';
import EventBanner from '../components/EventBanner';
import content from '../content/distretti/2042.json';
import site from '../content/site.json';

const Distretto2042 = () => {
  const [zoneHover, setZoneHover] = React.useState(null);
  const [heroImg] = React.useState(() => {
    const imgs = content.hero.imagePool;
    return imgs[Math.floor(Math.random() * imgs.length)];
  });

  return (
    <div className="vb-root d-root">

      {/* ── HEADER ──────────────────────────────── */}
      <Header
        homeLink={content.header.homeLink}
        logoPath={content.header.logoPath}
        ctaText={content.header.ctaText}
        ctaLink={content.header.ctaLink}
      >
        {content.header.nav.map((n, i) => (
          <a key={i} href={n.href}>{n.label}</a>
        ))}
      </Header>

      {/* ── HERO ────────────────────────────────── */}
      <section className="d-hero">
        <div className="d-hero-inner">
          <div className="d-hero-left">
            <div className="d-hero-eyebrow">Distretto Rotaract</div>
            <div className="d-hero-num">{content.number}</div>
            <h1 className="d-hero-title">
              <RichText text={content.hero.title} />
            </h1>
            <p className="d-hero-claim">
              <RichText text={content.hero.claim} />
            </p>
            <div className="d-hero-stats">
              {content.hero.stats.map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span>·</span>}
                  <span><strong>{s.n}</strong> {s.l}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="d-hero-actions">
              <a
                href={content.hero.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="d-btn-primary"
              >
                Sito Ufficiale ↗
              </a>
              <a
                href={content.hero.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="d-btn-ghost"
              >
                Instagram ↗
              </a>
            </div>
          </div>
          <div className="d-hero-img">
            <img src={heroImg} alt={content.hero.imageAlt} />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────── */}
      <div className="d-marquee">
        <div className="d-marquee-track">
          {[0, 1].map((i) => (
            <React.Fragment key={i}>
              {content.marquee.map((t, k) => (
                <React.Fragment key={k}>
                  <span>{t}</span>
                  <span className="d-star"> ✦ </span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── IDENTITÀ ────────────────────────────── */}
      <section id="identita" className="vb-manifesto">
        <div className="vb-manifesto-side">
          <div className="vb-section-no">[ 01 ]</div>
          <div className="vb-section-name">IDENTITÀ</div>
        </div>
        <div className="vb-manifesto-main">
          <h2 className="vb-manifesto-title">
            <RichText text={content.identity.title} />
          </h2>
          <div className="vb-manifesto-body">
            <p className="vb-manifesto-lede">
              <RichText text={content.identity.lede} />
            </p>
            {content.identity.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
            <p className="d-founding">
              <RichText text={content.identity.founding} />
            </p>
          </div>
          <div className="vb-pillars">
            {content.identity.pillars.map((p) => (
              <div key={p.n} className="vb-pillar">
                <div className="vb-pillar-n">{p.n}</div>
                <div className="vb-pillar-t">{p.t}</div>
                <div className="vb-pillar-d">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMERI ──────────────────────────────── */}
      <section id="numeri" className="vb-numbers">
        <div className="vb-numbers-head">
          <div className="vb-section-no vb-light">[ 02 ]</div>
          <div className="vb-section-name vb-light">IL DISTRETTO IN CIFRE</div>
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

      {/* ── ZONE / AREE ─────────────────────────── */}
      <section id="aree" className="d-zones">
        <div className="d-zones-head">
          <div className="vb-section-no vb-light">[ 03 ]</div>
          <div className="vb-section-name vb-light">{content.zones.label}</div>
          <h2 className="d-zones-title">
            <RichText text={content.zones.title} />
          </h2>
        </div>
        <div className="d-zone-blocks">
          {content.zones.items.map((z, i) => (
            <div
              key={z.name}
              className={`d-zone-block${zoneHover === i ? ' is-hover' : ''}${zoneHover !== null && zoneHover !== i ? ' is-dim' : ''}`}
              style={{ background: z.bg, color: z.fg }}
              onMouseEnter={() => setZoneHover(i)}
              onMouseLeave={() => setZoneHover(null)}
            >
              <div>
                <div className="d-zone-num">{z.n}</div>
                <div className="d-zone-name">{z.name}</div>
                <div className="d-zone-prov">{z.prov}</div>
              </div>
              <div className="d-zone-clubs">
                {z.clubs.map((c) => (
                  <span key={c} className="d-zone-club">{c}</span>
                ))}
              </div>
              <div className="d-zone-desc">{z.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORIA & RICONOSCIMENTI ─────────────── */}
      <section id="storia" className="d-awards">
        <div className="d-awards-head">
          <div className="vb-section-no">[ 04 ]</div>
          <div className="vb-section-name">{content.awards.label}</div>
          <h2 className="d-awards-title">
            <RichText text={content.awards.title} />
          </h2>
        </div>
        <div className="d-awards-grid">
          {content.awards.items.map((a) => (
            <div key={a.n} className="d-award-card">
              <div className="d-award-n">{a.n}</div>
              <div className="d-award-title">{a.title}</div>
              <div className="d-award-body">{a.body}</div>
              <span className="d-award-tag">{a.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICE & SFIDE ─────────────────────── */}
      <section id="service" className="d-services">
        <div className="d-services-head">
          <div className="vb-section-no vb-light">[ 05 ]</div>
          <div className="vb-section-name vb-light">{content.services.label}</div>
          <h2 className="d-services-title">
            <RichText text={content.services.title} />
          </h2>
        </div>
        <div className="d-services-grid">
          {content.services.items.map((s) => (
            <div key={s.n} className="d-service-card">
              <div className="d-service-icon">{s.icon}</div>
              <div className="d-service-num">{s.n}</div>
              <div className="d-service-title">{s.title}</div>
              <div className="d-service-body">{s.body}</div>
              <div className="d-service-tags">
                {s.tags.map((t) => (
                  <span key={t} className="d-service-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FARE RETE ───────────────────────────── */}
      <section className="d-rete">
        <div className="d-rete-inner">
          <div className="d-rete-label">[ 06 ] — Perché fare rete con noi</div>
          <div className="d-rete-quote">
            {content.rete.quote}
          </div>
          <p className="d-rete-sub">
            {content.rete.sub}
          </p>
          <div className="d-rete-actions">
            <a href={content.rete.email} className="d-btn-primary">
              Contattaci →
            </a>
            <a
              href={content.hero.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-btn-ghost"
            >
              Sito Ufficiale ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA APERTURA ────────────────────────── */}
      <EventBanner starText=" ✦ " button={site.event.buttons.district} />

      {/* ── FOOTER ──────────────────────────────── */}
      <Footer />

    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <Distretto2042 />
      <CookieBanner />
    </>
  </React.StrictMode>
);
