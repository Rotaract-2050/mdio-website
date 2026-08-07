import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './apertura-nazionale.css';
import Countdown from './components/Countdown';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Header from './components/Header';

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

  const days = [
    {
      id: 'g1',
      num: '01',
      city: 'Milano',
      sub: 'Serata di apertura',
      tag: 'Mille e una Notte',
      date: 'Ven 18 Set',
      img: 'assets/2041-05-Milano.jpeg',
      color: 'cranberry',
      bullets: [
        'Ingresso nella magia di Agrabah',
        'Cena con live show e delizie d\'oriente',
        'Dopocena con DJ set esclusivo',
      ],
      timeline: [
        { t: '20:00', title: 'Ingresso & accoglienza', d: 'Immergiti nella magia di Agrabah e se fortunato tieniti pronto ad esprimere 3 desideri.' },
        { t: 'A seguire', title: 'Cena con live show', d: 'Gusta le delizie d\'oriente e lasciati trasportare in un\'atmosfera unica.' },
        { t: 'Dopocena', title: 'DJ set esclusivo', d: 'La serata continua con musica e divertimento per tutti.' },
        { t: '02:00', title: 'Navette di rientro', d: 'Navette disponibili verso le 2:00 circa per chi alloggia negli hotel.' },
      ],
      info: [
        { l: 'Prezzo', v: '€80', s: 'biglietto singolo' },
        { l: 'Posti', v: 'Limitati', s: 'su prenotazione' },
        { l: 'Come arrivare', v: 'Auto o mezzi', s: 'Tibaldi-Bocconi, bus 65' },
        { l: 'Dress code', v: 'Mille e una notte', s: 'tocco arabeggiante' },
      ],
    },
    {
      id: 'g2',
      num: '02',
      city: 'Monza',
      sub: 'Evento principale',
      tag: 'Gala all\'Autodromo',
      date: 'Sab 19 Set',
      img: 'assets/2042-13-Monza.jpeg',
      color: 'royal',
      featured: true,
      bullets: [
        'Lavori nazionali mattutini — Sala Maddalena, Monza',
        'Cena di gala all\'Autodromo + DJ set',
        'Navette incluse — Hotel Falcone 4★ Monza centro',
      ],
      timeline: [
        { t: '10:00', title: 'Lavori nazionali', d: 'Sala Maddalena · Via Santa Maddalena, 7, Monza (Istituto Scolastico "T. Confalonieri", centro città).' },
        { t: '14:00', title: 'Attività pomeridiane facoltative', d: 'Pacchetti extra opzionali: Galleria Campari, Autodromo Experience, Visita della Città, Beauty Care e Wine Experience. Scopri tutti i dettagli qui sotto.' },
        { t: '18:30', title: 'Navetta → Autodromo', d: 'Partenza indicativa dall\'Hotel Falcone.' },
        { t: '19:00', title: 'Aperitivo standing', d: 'Nell\'area box con auto da esposizione dello sponsor. DJ set. Allestimento floreale.' },
        { t: '20:00', title: 'Cena di gala', d: 'Antipasto · Primo · Secondo · Dolce. Vino senza limiti + drink incluso. Mise en place curata.' },
      ],
      info: [
        { l: 'Prezzo', v: '€155', s: 'biglietto singolo serata' },
        { l: 'Hotel', v: 'Falcone 4★', s: 'Monza centro' },
        { l: 'Trasporti', v: 'Navette incluse', s: 'hotel ↔ autodromo' },
        { l: 'Da Milano', v: '15 min', s: 'in treno da Centrale' },
      ],
    },
    {
      id: 'g3',
      num: '03',
      city: 'Sale Marasino',
      sub: 'Conviviale sul Lago',
      tag: 'Chiusura sul Lago',
      date: 'Dom 20 Set',
      img: 'assets/2050-01-Iseo.jpeg',
      color: 'gold',
      bullets: [
        'Relatori d\'eccezione',
        'Pranzo conviviale sul Lago d\'Iseo',
        'Chiusura ufficiale dell\'Apertura Nazionale',
      ],
      timeline: [
        { t: '12:30', title: 'Arrivo e accoglienza', d: 'Apri gli occhi e preparati a contemplare la bellezza di un panorama mozzafiato.' },
        { t: 'A seguire', title: 'Conviviale con relatori d\'eccezione', d: 'Coccolato dal dolce bisbiglio del Lago d\'Iseo, ti riempirai di entusiasmo interagendo con persone dalle vite eccezionali.' },
        { t: 'In chiusura', title: 'Chiusura ufficiale dell\'Apertura Nazionale', d: 'Vedrai passare le consegne al Distretto Rotaract 2071 per l\'organizzazione del S.I.R.D.E.' },
      ],
      info: [
        { l: 'Location', v: 'Lago d\'Iseo', s: 'Provincia di Brescia' },
        { l: 'Da Monza', v: '~1h', s: 'in auto o treno' },
        { l: 'Navette', v: 'Incluse', s: 'da e per l\'albergo' },
        { l: 'Ospite', v: 'Seguiranno Sorprese' },
        { l: 'Prezzo', v: '€55', s: 'biglietto singolo' },
      ],
    },
  ];

  const extras = [
    {
      icon: '🍹',
      name: 'Galleria Campari',
      date: 'Sabato 19 Settembre · 14:30',
      loc: 'Viale A. Gramsci 161, Sesto S. Giovanni (MI)',
      desc: 'Scopri l\'arte, il gusto e l\'iconico rosso Campari con una visita esclusiva alla Galleria Campari.',
      price: '€20',
    },
    {
      icon: '🪔',
      name: 'Narghilè',
      date: 'Venerdì 18 Settembre',
      loc: 'El Jadida',
      desc: 'Rendi il tuo venerdì sera ancora più magico prenotando il tuo narghilè.',
      price: '€45',
    },
    {
      icon: '💅',
      name: 'Beauty Care',
      date: 'Sab 19 Set · 11:00 / 17:00 — Dom 20 Set · 10:30',
      loc: 'La Rinascente Monza',
      desc: 'Trattamento mani e viso donna, in collaborazione con la Rinascente Monza.',
      price: '€10',
    },
    {
      icon: '🏁',
      name: 'Autodromo Experience',
      date: 'Sabato 19 Settembre · 18:00',
      loc: 'Autodromo Nazionale Monza',
      desc: 'Tour in pullman guidato della pista e visita dell\'autodromo con foto sul podio.',
      price: '€35',
    },
    {
      icon: '⛪',
      name: 'Visita della Città — Quater Pass',
      date: 'Sabato 19 Settembre · 15:00',
      loc: 'Centro storico di Monza',
      desc: 'Scopri i segreti dell\'incantevole centro storico di Monza in una visita guidata.',
      price: '€10',
    },
    {
      icon: '🍷',
      name: 'Wine Experience & Masterclass',
      date: 'Sab 19 Set · 11:00 / 17:00 — Dom 20 Set · 11:00',
      loc: 'La Rinascente Monza',
      desc: 'Un viaggio tra i migliori vini e i segreti della degustazione, guidato da esperti sommelier.',
      price: '€10',
    },
  ];

  const faq = [
    {
      q: 'Posso partecipare a un solo giorno?',
      a: 'Certo. Puoi scegliere i Biglietti Singoli per partecipare solo alle singole giornate: Milano (€80), Monza (€155) e Iseo (€55). Oppure puoi scegliere uno dei Pacchetti Experience con hotel incluso.',
    },
    {
      q: 'L\'hotel è incluso nel pacchetto?',
      a: 'Sì, tutti i Pacchetti Experience (Full Weekend, Venerdì & Sabato, Sabato & Domenica) includono il pernottamento all\'Hotel Falcone 4★ e le navette. Per i Biglietti Singoli, l\'hotel non è incluso.',
    },
    {
      q: 'Come arrivo a Monza dall\'aeroporto?',
      a: 'Da Malpensa: Malpensa Express + cambio a Centrale (~1h). Da Linate: bus + metro o taxi. Da Bergamo Orio: navetta + treno per Monza (~1h15). Per il sabato sono previste navette tra l\'Hotel Falcone e l\'Autodromo.',
    },
    {
      q: 'Qual è il dress code?',
      a: 'Venerdì sera tema "Mille e una Notte" — mettiti un tocco arabeggiante!\nSabato gala all\'Autodromo: black tie / abito lungo per le donne, smoking o abito scuro per gli uomini.\nDomenica casual elegante.',
    },
    {
      q: 'Entro quando posso iscrivermi?',
      a: 'Le iscrizioni sono aperte fino ad esaurimento posti. Non ci sono aumenti di prezzo last minute: la quota è bloccata. I posti per il sabato a Monza sono limitati a 350.',
    },
    {
      q: 'Voglio partecipare a tutte e tre le serate: come acquisto?',
      a: 'Aggiungi al carrello separatamente i biglietti per Milano, Monza e Iseo, poi procedi al pagamento. I Biglietti Singoli non includono il pernottamento: i Pacchetti sono pensati solo per chi desidera anche l\'hotel.',
    },
  ];

  return (
    <div className="an-root">
      {/* HEADER */}
      <Header
        homeLink="./index.html"
        logoPath="assets/logo-mdio.jpeg"
        ctaText="Acquista i biglietti →"
        ctaLink="shop.html?back=apertura-nazionale.html%23pacchetti"
      >
        <a href="./index.html">← MDIO</a>
        <a href="#programma">Programma</a>
        <a href="#pacchetti">Pacchetti</a>
        <a href="#info">Info pratiche</a>
        <a href="#faq">FAQ</a>
      </Header>

      {/* HERO */}
      <section className="an-hero">
        <div className="an-hero-inner">
          <div>
            <div className="an-eyebrow">
              <span className="an-eyebrow-dot" />
              MDIO Lombardo · A.R. 2026—2027
            </div>
            <h1 className="an-hero-title">
              Apertura<br />
              <em>Nazionale</em><br />
              2026.
            </h1>
            <div className="an-hero-dates">18 · 19 · 20 Settembre</div>
            <div className="an-hero-badge">
              Il primo evento nazionale diffuso in 3 distretti
            </div>
            <p className="an-hero-lede">
              Tre giorni per aprire l'anno rotaractiano <em>tutti insieme</em>:
              {' '}<strong>Milano</strong> tra danze e profumi orientali,
              {' '}<strong>Monza</strong> al gala dell'Autodromo,
              {' '}<strong>Sale Marasino</strong> per i lavori e il conviviale sul lago.
            </p>
            <div className="an-hero-actions">
              <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-btn-primary">Acquista i biglietti →</a>
              <a href="#programma" className="an-btn-ghost">Programma completo</a>
            </div>
          </div>

          <div className="an-hero-right">
            <div className="an-hero-imagewrap">
              <img src="assets/2041-05-Milano.jpeg" alt="" className="an-hero-img an-hero-img-1" />
              <img src="assets/2042-13-Monza.jpeg" alt="" className="an-hero-img an-hero-img-2" />
              <img src="assets/2050-01-Iseo.jpeg" alt="" className="an-hero-img an-hero-img-3" />
              <div className="an-hero-cit-tag an-hero-cit-tag-1">
                <span>GIORNO 01</span>
                <span>Milano</span>
              </div>
              <div className="an-hero-cit-tag an-hero-cit-tag-2">
                <span>GIORNO 02</span>
                <span>Monza</span>
              </div>
              <div className="an-hero-cit-tag an-hero-cit-tag-3">
                <span>GIORNO 03</span>
                <span>Sale Marasino</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="an-countdown">
        <div className="an-countdown-inner">
          <div className="an-countdown-label">
            Manca poco all'apertura <em className="an-countdown-em">nazionale</em>
          </div>
          <div className="an-countdown-numbers">
            <Countdown />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="an-marquee">
        <div className="an-marquee-track">
          <span>Milano</span><span>•</span>
          <span>Monza</span><span>•</span>
          <span>Sale Marasino</span><span>•</span>
          <span>3 giorni</span><span>•</span>
          <span>14 distretti</span><span>•</span>
          <span>Mille e una Notte</span><span>•</span>
          <span>Autodromo Gala</span><span>•</span>
          <span>Lago d'Iseo</span><span>•</span>
          <span>Milano</span><span>•</span>
          <span>Monza</span><span>•</span>
          <span>Sale Marasino</span><span>•</span>
          <span>3 giorni</span><span>•</span>
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
            Tre città,<br /><em>tre serate</em>,<br />una sola apertura.
          </h2>
          <p className="an-programma-lede">
            Da venerdì 18 a domenica 20 settembre 2026.
            {' '}Sfoglia le giornate, scopri il programma e scegli quale vivere.
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
              Scegli il tuo<br /><em>pacchetto</em>.
            </h2>
            <p className="an-pacchetti-lede">
              Crediamo nel valore della partecipazione, non nell'ansia della prenotazione. Nessun dynamic pricing, nessun aumento dell'ultimo minuto: abbiamo scelto di mantenere un <strong>prezzo unico e bloccato</strong>. Stessa esperienza, massima trasparenza.
            </p>
          </div>
        </div>

        {/* ── EXPERIENCE: titolo ── */}
        <div className="an-pack-section-heading">
          <h3 className="an-pack-group-title">
            Pacchetti <em>Experience</em>{' '}
            <span className="an-pack-group-title-sub">(Multi-giorno con Hotel)</span>
          </h3>
        </div>

        {/* ── EXPERIENCE: hero (3 giorni) ── */}
        <div className="an-pack-hero an-pack featured">
          <div className="an-pack-best an-pack-best--hero">Best Seller Assoluto</div>
          <div>
            <div className="an-pack-dates">18 · 19 · 20 SET · 3 GIORNI</div>
            <h3 className="an-pack-name">Sotto il cielo<br />di <em>Lombardia</em></h3>
            <div className="an-pack-tag">Milano · Monza · Lago d'Iseo</div>
            <ul className="an-pack-includes">
              <li>Serata Mille e una Notte (Milano)</li>
              <li>Gala all'Autodromo (Monza)</li>
              <li>Pranzo conviviale sul Lago (Iseo)</li>
              <li>2 Notti in Hotel 4★ a Monza</li>
              <li>Navette incluse tra hotel ed eventi</li>
            </ul>
          </div>
          <div className="an-pack-hero-right">
            <div className="an-pack-price">€435</div>
            <div className="an-pack-price-sub">a persona</div>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>
        </div>

        {/* ── EXPERIENCE: 3 pacchetti bigiorno ── */}
        <div className="an-pack-grid an-pack-grid--experience">
          <div className="an-pack">
            <div className="an-pack-dates">18 · 19 SET</div>
            <h3 className="an-pack-name">Aladino<br /><em>in pista</em></h3>
            <div className="an-pack-tag">Venerdì + Sabato</div>
            <div className="an-pack-price">€380</div>
            <div className="an-pack-price-sub">a persona</div>
            <ul className="an-pack-includes">
              <li>Serata Mille e una Notte (Milano)</li>
              <li>Gala all'Autodromo (Monza)</li>
              <li>2 Notti in Hotel 4★</li>
              <li>Navette incluse</li>
            </ul>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>

          <div className="an-pack">
            <div className="an-pack-dates">19 · 20 SET</div>
            <h3 className="an-pack-name">3…2…1…<br /><em>lancio</em></h3>
            <div className="an-pack-tag">Sabato + Domenica</div>
            <div className="an-pack-price">€285</div>
            <div className="an-pack-price-sub">a persona</div>
            <ul className="an-pack-includes">
              <li>Gala all'Autodromo (Monza)</li>
              <li>Pranzo conviviale sul Lago (Iseo)</li>
              <li>1 Notte in Hotel 4★</li>
              <li>Navette incluse</li>
            </ul>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>

          <div className="an-pack">
            <div className="an-pack-dates">19 SET + HOTEL</div>
            <h3 className="an-pack-name"><em>Pit</em><br />Stop</h3>
            <div className="an-pack-tag">Sabato + notte in hotel</div>
            <div className="an-pack-price">€230</div>
            <div className="an-pack-price-sub">a persona</div>
            <ul className="an-pack-includes">
              <li>Gala all'Autodromo (Monza)</li>
              <li>1 Notte in Hotel 4★ a Monza</li>
              <li>Navette incluse hotel ↔ autodromo</li>
            </ul>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>
        </div>

        {/* ── Banner navette ── */}
        <div className="an-logistica-wrap">
          <div className="an-logistica-banner">
            <div className="an-logistica-icon">🚌</div>
            <div className="an-logistica-text">
              <strong className="an-logistica-label">Logistica</strong>
              <strong>Il servizio navetta è sempre incluso</strong> per chi acquista i pacchetti comprensivi di hotel! Non dovrai preoccuparti degli spostamenti tra gli eventi e la struttura.
            </div>
          </div>
        </div>

        {/* ── SINGOLI: titolo ── */}
        <h3 className="an-pack-group-title an-pack-group-title--singoli">
          Biglietti Singoli
        </h3>

        {/* ── SINGOLI: 3 giornate ── */}
        <div className="an-pack-grid an-pack-grid--singoli">
          <div className="an-pack an-pack--singolo">
            <div className="an-pack-dates">18 SET · UN GIORNO</div>
            <h3 className="an-pack-name">Le mille<br />ed <em>una notte</em></h3>
            <div className="an-pack-tag">Venerdì · Milano</div>
            <div className="an-pack-price">€80</div>
            <div className="an-pack-price-sub">a persona</div>
            <p className="an-pack-desc">
              Ingresso ad Agrabah, cena con live show orientale e DJ set esclusivo.<br /><br />
              <span className="an-pack-desc-muted">Hotel e navette non inclusi.<br></br>Le navette sono incluse solo nei pacchetti con pernotto.</span>
            </p>
            <div className="an-pack-guarantee">✓ Prezzo Bloccato</div>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>

          <div className="an-pack an-pack--singolo">
            <div className="an-pack-dates">19 SET · UN GIORNO</div>
            <h3 className="an-pack-name">Il tempio<br />della <em>velocità</em></h3>
            <div className="an-pack-tag">Sabato · Monza</div>
            <div className="an-pack-price">€155</div>
            <div className="an-pack-price-sub">a persona</div>
            <p className="an-pack-desc">
              Aperitivo standing nell'area box, cena di gala 4 portate e DJ set.<br /><br />
              <span className="an-pack-desc-muted">Hotel e navette non inclusi.<br></br>Le navette sono incluse solo nei pacchetti con pernotto.</span>
            </p>
            <div className="an-pack-guarantee">✓ Prezzo Bloccato</div>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>

          <div className="an-pack an-pack--singolo">
            <div className="an-pack-dates">20 SET · UN GIORNO</div>
            <h3 className="an-pack-name">Un lago<br />di <em>stelle</em></h3>
            <div className="an-pack-tag">Domenica · Sale Marasino</div>
            <div className="an-pack-price">€55</div>
            <div className="an-pack-price-sub">a persona</div>
            <p className="an-pack-desc">
              Relatore d'eccezione e pranzo conviviale sul Lago d'Iseo.<br /><br />
              <span className="an-pack-desc-muted">Hotel e navette non inclusi.<br></br>Le navette sono incluse solo nei pacchetti con pernotto.</span>
            </p>
            <div className="an-pack-guarantee">✓ Prezzo Bloccato</div>
            <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-pack-cta">Acquista ora →</a>
          </div>
        </div>

        {/* ── PACCHETTI EXTRA ── */}
        <div className="an-activities-wrap">
          <div className="an-activities-head">
            <h3 className="an-pack-group-title an-pack-group-title--activities">
              Pacchetti <em>Extra</em>
            </h3>
            <p className="an-activities-sub">Esperienze esclusive · Posti limitati</p>
          </div>
          <div className="an-extra-grid">
            {extras.map((a, i) => (
              <div key={i} className="an-extra-card">
                <div className="an-extra-icon">{a.icon}</div>
                <h4 className="an-extra-name">{a.name}</h4>
                <div className="an-extra-meta">{a.date}</div>
                <div className="an-extra-meta an-extra-meta-loc">{a.loc}</div>
                <p className="an-extra-desc">{a.desc}</p>
                <div className="an-extra-footer">
                  <div className="an-extra-price">{a.price}</div>
                  <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-extra-cta">Prenota →</a>
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
            Tutto quello<br />che ti serve <em>sapere</em>.
          </h2>
        </div>
        <div className="an-info-grid">
          <div className="an-info-cell">
            <div className="an-info-cell-h">→ Date</div>
            <div className="an-info-cell-t">18—20 Settembre 2026</div>
            <div className="an-info-cell-d">Tre giorni: Milano, Monza, Iseo</div>
          </div>
          <div className="an-info-cell">
            <div className="an-info-cell-h">→ Hotel ufficiale</div>
            <div className="an-info-cell-t">Hotel Falcone 4★</div>
            <div className="an-info-cell-d">Monza centro</div>
          </div>
          <div className="an-info-cell">
            <div className="an-info-cell-h">→ Posti</div>
            <div className="an-info-cell-t"></div>
            <div className="an-info-cell-d">Iscrizioni in 3 wave</div>
          </div>
          <div className="an-info-cell">
            <div className="an-info-cell-h">→ Trasporti</div>
            <div className="an-info-cell-t">Navette incluse</div>
            <div className="an-info-cell-d">Hotel ↔ Autodromo (sabato)</div>
          </div>
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
            Hai un <em>dubbio</em>?<br />Probabilmente è qui.
          </h2>
        </div>
        <div className="an-faq-list">
          {faq.map((f, i) => (
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
          <div className="an-cta-final-eyebrow">Non perdere il via</div>
          <h2 className="an-cta-final-title">
            Ti aspettiamo a<br /><em>Milano, Monza e Sale Marasino</em>.
          </h2>
          <p className="an-cta-final-text">
            Tre giorni per aprire l'anno rotaractiano insieme,
            tra eventi, amicizia e ricordi che resteranno.
          </p>
          <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-cta-final-btn">Acquista i biglietti →</a>
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
                <div className="an-modal-day-meta">Giorno {d.num} · {d.date === 'Ven 18 Set' ? 'Venerdì 18 Settembre' : d.date === 'Sab 19 Set' ? 'Sabato 19 Settembre' : 'Domenica 20 Settembre'}</div>
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
                <a href="shop.html?back=apertura-nazionale.html%23pacchetti" className="an-mod-cta">Acquista ora →</a>
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
