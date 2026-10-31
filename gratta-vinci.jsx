import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import './gratta-vinci.css';
import CookieBanner from './components/CookieBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import content from './content/gratta-vinci.json';

const premi = content.prizes;

const termini = `L'iniziativa denominata "Apertura Nazionale Rotaract 2026" è organizzata congiuntamente dal Multidistretto Lombardia e Provincia di Piacenza, costituito dai Distretti Rotaract 2041, 2042 e 2050, nell'ambito delle attività istituzionali, associative e promozionali connesse all'evento nazionale previsto nei giorni 18, 19 e 20 settembre 2026.

Il Distretto Rotaract 2041, C.F. 97659950154, con sede in Via Antonio Canova 19A, 20145 Milano (MI), è rappresentato per l'anno sociale 2026-2027 dal proprio rappresentante legale pro tempore.

L'Associazione Distretto Rotaract 2042, C.F. 97659960153, con sede in Via Antonio Canova 19A, Milano (MI), Italia, è rappresentata per l'anno sociale 2026-2027 dal proprio rappresentante legale pro tempore.

Il Distretto Rotaract 2050, C.F. 96032330183 con sede legale in Via Egidio Gorra 55, 29121 Piacenza (PC), è rappresentato per l'anno sociale 2026-2027 dal proprio rappresentante legale pro tempore.

L'iniziativa prevede la distribuzione gratuita di cartoline promozionali celebrative dell'evento, alcune delle quali riportano l'assegnazione di specifiche utilità promozionali rese disponibili esclusivamente grazie a liberalità, sponsorizzazioni, contributi volontari e donazioni effettuate da sponsor, partner e distretti aderenti all'iniziativa.

La distribuzione delle cartoline avviene esclusivamente a titolo gratuito, senza corresponsione di denaro, senza obbligo di acquisto e senza alcuna finalità commerciale o lucrativa.

Le cartoline non costituiscono titolo di credito, promessa al pubblico, strumento finanziario, operazione a premi, lotteria, concorso o manifestazione assimilabile ai sensi della normativa vigente, né attribuiscono ai possessori alcun diritto patrimoniale autonomo o convertibile economicamente.

L'accettazione materiale della cartolina da parte del destinatario costituisce implicita, piena ed integrale accettazione del presente regolamento e di tutte le condizioni di utilizzo qui previste.

Le utilità eventualmente riportate sulle cartoline consistono esclusivamente nelle seguenti liberalità promozionali:

n. 2 gioielli offerti da Lunati Gioielli;
n. 10 bottiglie di vino offerte dai Distretti Rotaract 2041, 2042 e 2050;
n. 4 drink per la serata di venerdì offerti dal Distretto Rotaract 2041;
n. 4 drink per la serata di sabato offerti dal Distretto Rotaract 2042;
n. 1 cena del venerdì offerta dal Distretto Rotaract 2041;
n. 1 pranzo della domenica offerto dal Distretto Rotaract 2050.

Le utilità sopra indicate devono intendersi esclusivamente come attribuzioni gratuite di cortesia istituzionale e promozionale prive di valore economico autonomo in capo al destinatario.

Le cartoline e le eventuali utilità associate sono strettamente personali, non cedibili, non trasferibili, non vendibili, non commerciabili e non convertibili in denaro, neppure parzialmente.

È espressamente vietata qualsiasi forma di vendita, commercializzazione, asta, riproduzione, alterazione, distribuzione a fini economici o utilizzo speculativo delle cartoline o delle utilità eventualmente associate.

L'eventuale utilizzo delle utilità dovrà avvenire esclusivamente durante lo svolgimento dell'Apertura Nazionale Rotaract 2026, secondo disponibilità organizzativa, logistica e operativa dei soggetti organizzatori e dei partner aderenti, fatto salvo per eventuali beni o utilità già materialmente consegnati nel corso del Congresso Nazionale di Chiusura organizzato dal Distretto 2071, tenutosi a Siena in data 09/05/2026.

I Distretti organizzatori si riservano il diritto insindacabile di annullare, ritirare o rifiutare qualsiasi cartolina in caso di alterazione materiale, contraffazione, utilizzo improprio, riproduzione non autorizzata, cessione a terzi, utilizzo contrario al presente regolamento o comportamento lesivo dell'immagine dei Distretti organizzatori o dell'evento.

I Distretti organizzatori, gli sponsor e i partner aderenti non assumono alcuna responsabilità in relazione a smarrimento delle cartoline, furto, deterioramento, impossibilità di utilizzo, indisponibilità sopravvenuta delle utilità, modifiche organizzative dell'evento, cancellazioni, limitazioni logistiche, cause di forza maggiore o fatti imputabili a terzi.

Le utilità eventualmente indicate sulle cartoline non generano in alcun caso obbligazioni commerciali, contrattuali o risarcitorie nei confronti dei Distretti organizzatori, degli sponsor o dei partner aderenti.

I Distretti organizzatori si riservano inoltre il diritto di modificare, sospendere, interrompere o annullare l'iniziativa in qualsiasi momento per esigenze organizzative, motivi di sicurezza, indisponibilità dei partner o altre circostanze ritenute rilevanti, senza che ciò possa determinare pretese economiche o risarcitorie da parte dei destinatari.

Per ogni controversia relativa all'interpretazione, validità o applicazione del presente regolamento sarà competente in via esclusiva il Foro di Milano.`;

const GrattaVinci = () => (
  <div className="gv-root">
    <Header
      homeLink="../index.html"
      logoPath="../assets/logo-mdio.jpeg"
      ctaText="Scopri l'evento →"
      ctaLink="../apertura-nazionale.html"
    >
      <a href="../index.html">← MDIO</a>
      <a href="../apertura-nazionale.html">Apertura Nazionale</a>
      <a href="#premi">Premi</a>
      <a href="#termini">Regolamento</a>
    </Header>

    {/* HERO */}
    <section className="gv-hero">
      <div className="gv-hero-eyebrow">Apertura Nazionale Rotaract 2026 · MDIO</div>
      <h1 className="gv-hero-title">
        Cartoline<br /><em>Promozionali</em>
      </h1>
      <p className="gv-hero-sub">
        Distribuzione gratuita di cartoline celebrative dell'Apertura Nazionale 2026.
        Alcune cartoline riportano utilità promozionali offerte dai Distretti e dai partner dell'evento.
      </p>
      <div className="gv-hero-badge">Distribuzione gratuita · Nessun obbligo di acquisto</div>
    </section>

    {/* INFO */}
    <section className="gv-info">
      <h2 className="gv-info-title">{content.howItWorks.title}</h2>
      {content.howItWorks.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </section>

    {/* PREMI */}
    <section id="premi" className="gv-premi">
      <div className="gv-premi-inner">
        <div className="gv-premi-eyebrow">Utilità promozionali</div>
        <h2 className="gv-premi-title">Le liberalità<br />disponibili</h2>
        <div className="gv-premi-grid">
          {premi.map((p, i) => (
            <div key={i} className="gv-premio">
              <div className="gv-premio-qty">{p.qty}</div>
              <div className="gv-premio-body">
                <div className="gv-premio-name">{p.name}</div>
                <div className="gv-premio-donor">{p.donor}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="gv-cta">
      <h2 className="gv-cta-title">Vuoi partecipare all'evento?</h2>
      <p className="gv-cta-sub">Scopri il programma completo dell'Apertura Nazionale 2026.</p>
      <a href="../apertura-nazionale.html">Vai all'Apertura Nazionale →</a>
    </section>

    {/* TERMINI E CONDIZIONI */}
    <section id="termini" className="gv-termini">
      <div className="gv-termini-inner">
        <div className="gv-termini-label">Regolamento</div>
        <h2 className="gv-termini-title">Regolamento di Distribuzione Gratuita<br />Voucher Promozionali</h2>
        <p className="gv-termini-subtitle">Apertura Nazionale Rotaract 2026</p>
        <div className="gv-termini-body">
          {termini.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p style={{ marginTop: '32px', fontWeight: 600 }}>
            Multidistretto Lombardia e Provincia di Piacenza<br />
            Distretti Rotaract 2041 – 2042 – 2050<br />
            Apertura Nazionale Rotaract 2026
          </p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <GrattaVinci />
      <CookieBanner />
    </>
  </React.StrictMode>
);
