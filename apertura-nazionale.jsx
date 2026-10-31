import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './apertura-nazionale.css';
import Countdown from './components/Countdown';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Header from './components/Header';
import RichText from './components/RichText';
import content from './content/apertura.json';

const Package = ({ pack: p, shopUrl }) => {
  if (p.featured) {
    return (
      <div className="an-pack-hero an-pack featured">
        <div className="an-pack-best an-pack-best--hero">{p.badge}</div>
        <div>
          <div className="an-pack-dates">{p.dates}</div>
          <h3 className="an-pack-name"><RichText text={p.name} /></h3>
          <div className="an-pack-tag">{p.tag}</div>
          <ul className="an-pack-includes">
            {p.includes.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="an-pack-hero-right">
          <div className="an-pack-price">{p.price}</div>
          <div className="an-pack-price-sub">{p.priceSub}</div>
          <a href={shopUrl} className="an-pack-cta">{p.ctaLabel}</a>
        </div>
      </div>
    );
  }
  if (p.group === 'singoli') {
    return (
      <div className="an-pack an-pack--singolo">
        <div className="an-pack-dates">{p.dates}</div>
        <h3 className="an-pack-name"><RichText text={p.name} /></h3>
        <div className="an-pack-tag">{p.tag}</div>
        <div className="an-pack-price">{p.price}</div>
        <div className="an-pack-price-sub">{p.priceSub}</div>
        <p className="an-pack-desc">
          {p.description}<br /><br />
          <span className="an-pack-desc-muted"><RichText text={p.note} /></span>
        </p>
        <div className="an-pack-guarantee">{p.guarantee}</div>
        <a href={shopUrl} className="an-pack-cta">{p.ctaLabel}</a>
      </div>
    );
  }
  return (
    <div className="an-pack">
      <div className="an-pack-dates">{p.dates}</div>
      <h3 className="an-pack-name"><RichText text={p.name} /></h3>
      <div className="an-pack-tag">{p.tag}</div>
      <div className="an-pack-price">{p.price}</div>
      <div className="an-pack-price-sub">{p.priceSub}</div>
      <ul className="an-pack-includes">
        {p.includes.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <a href={shopUrl} className="an-pack-cta">{p.ctaLabel}</a>
    </div>
  );
};

const AperturaNazionale = () => {
  const [openFaq, setOpenFaq] = React.useState(-1);
  const [openModal, setOpenModal] = React.useState(null);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpenModal(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);


  const { days, faq, shopUrl } = content;
  const experience = content.packages.filter((p) => p.group === 'experience');
  const singoli = content.packages.filter((p) => p.group === 'singoli');
  const featuredPack = experience.find((p) => p.featured);
  const experienceGrid = experience.filter((p) => !p.featured);

  return (
    <div className="an-root">
      {/* HEADER */}
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

      {/* HERO */}
      <section className="an-hero">
        <div className="an-hero-inner">
          <div>
            <div className="an-eyebrow">
              <span className="an-eyebrow-dot" />
              {content.hero.eyebrow}
            </div>
            <h1 className="an-hero-title">
              <RichText text={content.hero.title} />
            </h1>
            <div className="an-hero-dates">{content.hero.dates}</div>
            <div className="an-hero-badge">
              {content.hero.badge}
            </div>
            <p className="an-hero-lede">
              <RichText text={content.hero.lede} />
            </p>
            <div className="an-hero-actions">
              <a href={shopUrl} className="an-btn-primary">{content.hero.primaryCta}</a>
              <a href={content.hero.ghostCta.href} className="an-btn-ghost">{content.hero.ghostCta.text}</a>
            </div>
          </div>

          <div className="an-hero-right">
            <div className="an-hero-imagewrap">
              {content.hero.images.map((im, i) => (
                <img key={i} src={im.src} alt="" className={`an-hero-img an-hero-img-${i + 1}`} />
              ))}
              {content.hero.images.map((im, i) => (
                <div key={i} className={`an-hero-cit-tag an-hero-cit-tag-${i + 1}`}>
                  <span>{im.day}</span>
                  <span>{im.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="an-countdown">
        <div className="an-countdown-inner">
          <div className="an-countdown-label">
            {content.countdown.labelPrefix}<em className="an-countdown-em">{content.countdown.labelEmph}</em>
          </div>
          <div className="an-countdown-numbers">
            <Countdown />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="an-marquee">
        <div className="an-marquee-track">
          {content.marquee.map((w, i) => (
            <React.Fragment key={i}>
              <span>{w}</span><span>•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PROGRAMMA */}
      <section id="programma" className="an-programma">
        <div className="an-programma-head">
          <div>
            <div className="an-section-num">01</div>
            <div className="an-section-lab">Programma</div>
          </div>
          <h2 className="an-programma-title">
            <RichText text={content.programma.title} />
          </h2>
          <p className="an-programma-lede">
            {content.programma.lede}
          </p>
        </div>

        <div className="an-days-grid">
          {days.map((d) => (
            <button
              key={d.id}
              className={`an-day-card ${d.featured ? 'featured' : ''}`}
              onClick={() => setOpenModal(d.id)}
            >
              <div className="an-day-img">
                <div className="an-day-img-bg" style={{ backgroundImage: `url(${d.img})` }} />
                <div className="an-day-img-overlay">
                  <div className="an-day-img-label">Giorno</div>
                  <div className="an-day-img-num">{d.num}</div>
                </div>
                <div className="an-day-num">{d.num}</div>
                <div className="an-day-date">{d.date}</div>
                {d.featured && <div className="an-day-featured-badge">Evento principale</div>}
              </div>
              <div className="an-day-body">
                <div className="an-day-sub">{d.sub}</div>
                <h3 className="an-day-city">{d.city}</h3>
                <div className="an-day-tag">{d.tag}</div>
                <ul className="an-day-list">
                  {d.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="an-day-cta">
                  <span>Scopri di più</span>
                  <span>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* PACCHETTI */}
      <section id="pacchetti" className="an-pacchetti">
        <div className="an-pacchetti-head">
          <div>
            <div className="an-section-num an-section-num-light">02</div>
            <div className="an-section-lab an-section-lab-light">Partecipa</div>
          </div>
          <div>
            <h2 className="an-pacchetti-title">
              <RichText text={content.pacchetti.title} />
            </h2>
            <p className="an-pacchetti-lede">
              <RichText text={content.pacchetti.lede} />
            </p>
          </div>
        </div>

        {/* ── EXPERIENCE: titolo ── */}
        <div className="an-pack-section-heading">
          <h3 className="an-pack-group-title">
            <RichText text={content.pacchetti.experienceTitle} />{' '}
            <span className="an-pack-group-title-sub">{content.pacchetti.experienceSub}</span>
          </h3>
        </div>

        {/* ── EXPERIENCE: hero (3 giorni) ── */}
        {featuredPack && <Package pack={featuredPack} shopUrl={shopUrl} />}

        {/* ── EXPERIENCE: pacchetti bigiorno ── */}
        <div className="an-pack-grid an-pack-grid--experience">
          {experienceGrid.map((p, i) => (
            <Package key={i} pack={p} shopUrl={shopUrl} />
          ))}
        </div>

        {/* ── Banner navette ── */}
        <div className="an-logistica-wrap">
          <div className="an-logistica-banner">
            <div className="an-logistica-icon">{content.logistica.icon}</div>
            <div className="an-logistica-text">
              <strong className="an-logistica-label">{content.logistica.label}</strong>
              <strong>{content.logistica.strong}</strong>{content.logistica.text}
            </div>
          </div>
        </div>

        {/* ── SINGOLI: titolo ── */}
        <h3 className="an-pack-group-title an-pack-group-title--singoli">
          {content.pacchetti.singoliTitle}
        </h3>

        {/* ── SINGOLI: giornate ── */}
        <div className="an-pack-grid an-pack-grid--singoli">
          {singoli.map((p, i) => (
            <Package key={i} pack={p} shopUrl={shopUrl} />
          ))}
        </div>

        {/* ── ATTIVITÀ FACOLTATIVE (SEGRETE) ── */}
        <div className="an-activities-wrap">
          <div className="an-activities-head">
            <h3 className="an-pack-group-title an-pack-group-title--activities">
              <RichText text={content.activities.title} />
            </h3>
            <p className="an-activities-sub">{content.activities.sub}</p>
          </div>
          <div className="an-activities-grid">
            {content.activities.items.map((a, i) => (
              <div key={i} className="an-activity-card">
                <div className="an-activity-content">
                  <div className="an-activity-name">{a.name}</div>
                  <div className="an-activity-price">{a.price}</div>
                </div>
                <div className="an-activity-overlay">
                  <div className="an-activity-lock">{content.activities.lockIcon}</div>
                  <div className="an-activity-coming">{content.activities.overlayText}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO PRATICHE */}
      <section id="info" className="an-info">
        <div className="an-info-head">
          <div>
            <div className="an-section-num">03</div>
            <div className="an-section-lab">Info pratiche</div>
          </div>
          <h2 className="an-info-title">
            <RichText text={content.info.title} />
          </h2>
        </div>
        <div className="an-info-grid">
          {content.info.cells.map((c, i) => (
            <div key={i} className="an-info-cell">
              <div className="an-info-cell-h">{c.h}</div>
              <div className="an-info-cell-t">{c.t}</div>
              <div className="an-info-cell-d">{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="an-faq">
        <div className="an-faq-head">
          <div>
            <div className="an-section-num">04</div>
            <div className="an-section-lab">Domande frequenti</div>
          </div>
          <h2 className="an-faq-title">
            <RichText text={content.faq.title} />
          </h2>
        </div>
        <div className="an-faq-list">
          {faq.items.map((f, i) => (
            <div key={i} className={`an-faq-item ${openFaq === i ? '' : 'closed'}`}>
              <div className="an-faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span><em>{String(i + 1).padStart(2, '0')}.</em>&nbsp;&nbsp;{f.q}</span>
                <span className="an-faq-q-toggle">{openFaq === i ? '−' : '+'}</span>
              </div>
              <div className="an-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA finale */}
      <section className="an-cta-final">
        <div className="an-cta-final-inner">
          <div className="an-cta-final-eyebrow">{content.ctaFinal.eyebrow}</div>
          <h2 className="an-cta-final-title">
            <RichText text={content.ctaFinal.title} />
          </h2>
          <p className="an-cta-final-text">
            {content.ctaFinal.text}
          </p>
          <a href={shopUrl} className="an-cta-final-btn">{content.ctaFinal.button}</a>
        </div>
      </section>

      {/* FOOTER */}
      <Footer bgColor="var(--paper-2)" textColor="var(--ink)" borderTop="1.5px solid var(--ink)" />

      {/* MODAL */}
      {openModal && (() => {
        const d = days.find(x => x.id === openModal);
        if (!d) return null;
        return (
          <React.Fragment>
            <div className="an-overlay open visible" onClick={() => setOpenModal(null)} />
            <div className="an-modal open visible">
              <div className={`an-modal-header col-${d.color}`}>
                <button className="an-modal-close" onClick={() => setOpenModal(null)}>✕</button>
                <div className="an-modal-day-meta">Giorno {d.num} · {d.longDate}</div>
                <h3 className="an-modal-city">{d.city}</h3>
                <div className="an-modal-subtitle">{d.tag}</div>
                <span className="an-modal-pill">{d.sub}</span>
              </div>
              <div className="an-modal-body">
                <div>
                  <div className="an-mod-section-h">Programma della giornata</div>
                  <div className="an-tl">
                    {d.timeline.map((t, i) => (
                      <div key={i} className="an-tl-row">
                        <div className="an-tl-time">{t.t}</div>
                        <div className="an-tl-content">
                          <h4 className="an-tl-title">{t.title}</h4>
                          <div className="an-tl-desc">{t.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="an-mod-section-h">Info pratiche</div>
                  <div className="an-mod-info">
                    {d.info.map((i, k) => (
                      <div key={k} className="an-mod-info-cell">
                        <div className="an-mod-info-l">{i.l}</div>
                        <div className="an-mod-info-v">{i.v} {i.s && <small>{i.s}</small>}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <a href={shopUrl} className="an-mod-cta">{content.buyLabel}</a>
              </div>
            </div>
          </React.Fragment>
        );
      })()}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <AperturaNazionale />
      <CookieBanner />
    </>
  </React.StrictMode>
);
