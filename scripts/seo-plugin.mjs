// Plugin Vite: riscrive nelle pagine buildate i dati SEO (title, meta, Open Graph,
// Twitter, JSON-LD, noscript) a partire da content/*.json, cosi' prezzi, date e FAQ
// modificati in WordPress arrivano anche ai motori di ricerca.
// Genera anche /apertura-nazionale.json (emitFile) dai dati.
// Cio' che non e' nei JSON (organizzatore, luoghi, url, date delle sotto-giornate...) e' costante qui sotto.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SITE = 'https://multidistrettolombardo.org';
const IMG = `${SITE}/assets/og-cover-1200.jpeg`;
const ORGANIZER = {
  '@type': 'Organization',
  name: 'MDIO — Multidistretto Rotaract Italia Ovest',
  url: SITE,
  logo: `${SITE}/assets/logo-mdio.jpeg`,
};
const EVENT_URL = `${SITE}/apertura-nazionale.html`;
const SHOP_URL = `${SITE}/shop.html`;
const EVENT_LOCATION = [
  { '@type': 'Place', name: 'Venue serata Mille e una Notte — Milano', address: { '@type': 'PostalAddress', streetAddress: 'Via Tibaldi / Bocconi', addressLocality: 'Milano', addressRegion: 'Lombardia', addressCountry: 'IT' } },
  { '@type': 'Place', name: 'Autodromo Nazionale di Monza', address: { '@type': 'PostalAddress', streetAddress: 'Viale di Vedano, 5', addressLocality: 'Monza', postalCode: '20900', addressRegion: 'Lombardia', addressCountry: 'IT' } },
  { '@type': 'Place', name: 'Sale Marasino — Lago d\'Iseo', address: { '@type': 'PostalAddress', addressLocality: 'Sale Marasino', addressRegion: 'Lombardia', addressCountry: 'IT' } },
];
// Orari e luoghi delle sotto-giornate (non presenti nei JSON), per id della giornata.
const DAY_CONST = {
  g1: { startDate: '2026-09-18T20:00:00+02:00', endDate: '2026-09-19T02:00:00+02:00', location: { '@type': 'Place', name: 'Milano', address: { '@type': 'PostalAddress', addressLocality: 'Milano', addressCountry: 'IT' } } },
  g2: { startDate: '2026-09-19T10:00:00+02:00', endDate: '2026-09-19T23:59:00+02:00', location: { '@type': 'Place', name: 'Autodromo Nazionale di Monza', address: { '@type': 'PostalAddress', addressLocality: 'Monza', addressCountry: 'IT' } } },
  g3: { startDate: '2026-09-20T12:30:00+02:00', endDate: '2026-09-20T17:00:00+02:00', location: { '@type': 'Place', name: 'Sale Marasino, Lago d\'Iseo', address: { '@type': 'PostalAddress', addressLocality: 'Sale Marasino', addressCountry: 'IT' } } },
};

// pagina buildata -> file di contenuto
const PAGES = {
  'index.html': 'home',
  'apertura-nazionale.html': 'apertura',
  'shop.html': 'shop',
  'gratta-vinci/index.html': 'gratta-vinci',
  'distretti/2041.html': 'distretti/2041',
  'distretti/2042.html': 'distretti/2042',
  'distretti/2050.html': 'distretti/2050',
};

// ---------- utilita' ----------
const readJson = (key) => {
  const f = join(root, 'content', `${key}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
// testo semplice: toglie <br/>, <em>, <strong>, va a capo -> spazio
const plain = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const price = (s) => {
  const m = String(s ?? '').replace(/\./g, '').replace(',', '.').match(/\d+(\.\d+)?/);
  return m ? String(parseFloat(m[0])) : null;
};
const stripDot = (s) => plain(s).replace(/\.$/, '');

function priceTokens(apertura) {
  const priced = (apertura?.packages ?? []).map((p) => ({ p, n: parseFloat(price(p.price)) })).filter((x) => !Number.isNaN(x.n));
  if (!priced.length) return {};
  const min = priced.reduce((a, b) => (b.n < a.n ? b : a));
  const max = priced.reduce((a, b) => (b.n > a.n ? b : a));
  return { prezzoMin: min.p.price, prezzoMax: max.p.price };
}
const fill = (s, tokens) => String(s).replace(/\{\{(\w+)\}\}/g, (m, k) => (k in tokens ? tokens[k] : m));

function setMeta(html, key, value) {
  if (value === undefined || value === null) return html;
  const re = new RegExp(`(<meta (?:name|property)="${key.replace(/[:.]/g, '\\$&')}" content=")[^"]*(")`);
  return html.replace(re, (_, a, b) => `${a}${escAttr(value)}${b}`);
}
function mapJsonLd(html, fn) {
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, body, c) => {
    const out = fn(JSON.parse(body));
    return `${a}\n${JSON.stringify(out, null, 2).replace(/</g, '\\u003c')}\n${c}`;
  });
}

// ---------- JSON-LD ----------
function offerOf(p) {
  const pr = price(p.price);
  if (pr === null) return null;
  const desc = p.group === 'singoli'
    ? [stripDot(p.description), stripDot(p.note)].filter(Boolean).join('. ') + '.'
    : (p.includes ?? []).map(stripDot).join('. ') + '.';
  return {
    '@type': 'Offer',
    name: `${plain(p.name)} — ${plain(p.tag)}`,
    description: desc,
    price: pr,
    priceCurrency: 'EUR',
    // evento concluso, vendite chiuse: nessuna disponibilita' di acquisto
    availability: 'https://schema.org/SoldOut',
  };
}
const faqLd = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (faq?.items ?? []).map((i) => ({
    '@type': 'Question',
    name: plain(i.q),
    acceptedAnswer: { '@type': 'Answer', text: plain(i.a) },
  })),
});
function eventLd(ap) {
  const seo = ap.seo;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: seo.eventName,
    description: seo.eventDescription,
    startDate: seo.startDate,
    endDate: seo.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: EVENT_LOCATION,
    organizer: ORGANIZER,
    subEvent: (ap.days ?? []).map((d) => ({
      '@type': 'Event',
      name: `${plain(d.tag)} — ${plain(d.city)}`,
      description: (d.bullets ?? []).map(stripDot).join('. ') + '.',
      ...(DAY_CONST[d.id] ?? {}),
    })),
    image: IMG,
    url: EVENT_URL,
    keywords: seo.keywords,
  };
}
function shopLd(shop, ap) {
  const items = (ap?.packages ?? []).map(offerOf).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: shop.seo.listName,
    description: shop.seo.listDescription,
    url: SHOP_URL,
    itemListElement: items.map((o, i) => ({ '@type': 'ListItem', position: i + 1, item: { ...o, url: SHOP_URL } })),
  };
}

// ---------- noscript ----------
const dayPrice = (ap, id) => {
  const d = (ap.days ?? []).find((x) => x.id === id);
  return d?.info?.find((i) => i.l === 'Prezzo')?.v ?? '';
};
const pkgLi = (p) => {
  const body = p.group === 'singoli'
    ? `${esc(plain(p.tag))}: ${esc(stripDot(p.description))}`
    : `${esc(plain(p.dates))}: ${(p.includes ?? []).map((x) => esc(stripDot(x))).join(' + ')}`;
  return `      <li><strong>${esc(plain(p.name))}</strong> — ${body}. <strong>${esc(p.price)} ${esc(p.priceSub ?? '')}.</strong></li>`;
};
function aperturaNoscript(ap, site) {
  const seo = ap.seo;
  const exp = (ap.packages ?? []).filter((p) => p.group === 'experience').map(pkgLi).join('\n');
  const sing = (ap.packages ?? []).filter((p) => p.group === 'singoli').map(pkgLi).join('\n');
  const extras = (ap.extras?.items ?? []).map((x) => `      <li><strong>${esc(x.name)}</strong> — ${esc(x.seoText)} <strong>${esc(x.price)} a persona.</strong></li>`).join('\n');
  const faq = (ap.faq?.items ?? []).map((i) => `      <dt>${esc(plain(i.q))}</dt>\n      <dd>${esc(plain(i.a))}</dd>`).join('\n');
  const p1 = dayPrice(ap, 'g1'), p2 = dayPrice(ap, 'g2'), p3 = dayPrice(ap, 'g3');
  return `<noscript>
  <main>
    <h1>${esc(seo.eventName)}</h1>
    <p>L'Apertura Nazionale Rotaract 2026 è stata il primo evento nazionale diffuso su tre distretti: tre giorni per aprire l'anno rotaractiano tutti insieme tra Milano, Monza e il Lago d'Iseo — 18, 19 e 20 Settembre 2026. Evento concluso. Organizzato da MDIO — Multidistretto Rotaract Italia Ovest (distretti 2041, 2042, 2050). I pacchetti erano a prezzo bloccato, senza dynamic pricing, con navette incluse in tutti i pacchetti con pernotto.</p>

    <h2>Programma delle tre giornate</h2>
    <ul>
      <li><strong>Venerdì 18 Settembre — Milano · Serata "Mille e una Notte":</strong> Ambientazione ispirata ad Agrabah. Ore 20:00 ingresso e accoglienza, cena con live show orientale (4 portate), DJ set esclusivo. Navette di rientro verso le 2:00 per chi alloggiava in hotel. Dress code: tocco arabeggiante. Zona Tibaldi-Bocconi (bus 65). Biglietto singolo: ${esc(p1)}.</li>
      <li><strong>Sabato 19 Settembre — Monza · Gala all'Autodromo:</strong> Mattina: lavori nazionali alla Sala Maddalena (Via Santa Maddalena 7, Monza). Pomeriggio: pacchetti extra facoltativi (Galleria Campari, Autodromo Experience, Visita della Città, Beauty Care, Wine Experience). Ore 18:30 navetta dall'Hotel Falcone verso l'Autodromo. Ore 19:00 aperitivo standing nell'area box con auto da esposizione dello sponsor e DJ set. Ore 20:00 cena di gala 4 portate (antipasto, primo, secondo, dolce), vino senza limiti, drink incluso. Dress code: black tie. Biglietto singolo: ${esc(p2)} (hotel e navette non inclusi).</li>
      <li><strong>Domenica 20 Settembre — Sale Marasino · Conviviale sul Lago d'Iseo:</strong> Ore 12:30 arrivo e accoglienza. Conviviale con relatori d'eccezione. Chiusura ufficiale con passaggio di consegne al Distretto Rotaract 2071 per il S.I.R.D.E. Biglietto singolo: ${esc(p3)} (hotel e navette non inclusi).</li>
    </ul>

    <h2>Hotel ufficiale</h2>
    <p>Hotel Falcone 4★ — centro di Monza. Era incluso in tutti i pacchetti multi-giorno (Experience). A 15 minuti da Milano in treno.</p>

    <h2>Pacchetti Experience proposti (con hotel incluso — navette sempre incluse)</h2>
    <ul>
${exp}
    </ul>

    <h2>Biglietti Singoli proposti (senza hotel, senza navette)</h2>
    <ul>
${sing}
    </ul>

    <p>Le vendite sono chiuse.</p>

    <h2>Pacchetti Extra proposti (esperienze facoltative, posti limitati)</h2>
    <ul>
${extras}
    </ul>

    <h2>Domande frequenti</h2>
    <dl>
${faq}
    </dl>

    <h2>Organizzatori</h2>
    <p>Organizzato da MDIO — Multidistretto Rotaract Italia Ovest, in collaborazione con i distretti:</p>
    <ul>
      <li><a href="distretti/2041.html">Distretto Rotaract 2041 — Area Metropolitana di Milano (13 club, 350 soci)</a></li>
      <li><a href="distretti/2042.html">Distretto Rotaract 2042 — Lombardia Centro &amp; Nord (16 club, 260 soci)</a></li>
      <li><a href="distretti/2050.html">Distretto Rotaract 2050 — Lombardia Sud &amp; Piacenza (28 club, 403 soci)</a></li>
    </ul>
    <p><a href="index.html">MDIO — Multidistretto Rotaract Italia Ovest</a></p>
  </main>
</noscript>`;
}
function shopLi(p) {
  const detail = p.group === 'singoli'
    ? `${plain(p.dates)} · ${plain(p.tag)}`
    : [plain(p.dates), plain(p.tag), ...(p.includes ?? []).map(stripDot)].join(' · ');
  return `      <li><strong>${esc(plain(p.name))}</strong> — ${esc(detail)}: <strong>${esc(p.price)}</strong></li>`;
}
function shopNoscript(shop, ap) {
  const pk = ap?.packages ?? [];
  const exp = pk.filter((p) => p.group === 'experience').map(shopLi).join('\n');
  const sing = pk.filter((p) => p.group === 'singoli').map(shopLi).join('\n');
  return `<noscript>
  <main>
    <h1>Vendite chiuse — Apertura Nazionale Rotaract 2026</h1>
    <p>L'Apertura Nazionale Rotaract 2026 si è svolta a Milano (ven 18 Set), Monza (sab 19 Set) e Sale Marasino sul Lago d'Iseo (dom 20 Set). Le vendite sono chiuse. Pacchetti e biglietti proposti, a prezzi bloccati e senza dynamic pricing, con navette incluse in tutti i pacchetti con pernotto.</p>
    <h2>Pacchetti Experience proposti (hotel + navette inclusi)</h2>
    <ul>
${exp}
    </ul>
    <h2>Biglietti Singoli proposti (senza hotel, senza navette)</h2>
    <ul>
${sing}
    </ul>
    <p><a href="apertura-nazionale.html">Torna alla pagina dell'evento — Apertura Nazionale 2026</a></p>
  </main>
</noscript>`;
}

// ---------- /apertura-nazionale.json ----------
function aperturaJson(ap, site) {
  const seo = ap.seo ?? {};
  const days = ap.days ?? [];
  const year = (seo.startDate ?? '').slice(0, 4);
  const parts = days.map((d) => String(d.longDate ?? '').match(/^(\S+)\s+(\d+)\s+(\S+)$/));
  let testo = days.map((d) => d.longDate).join(' · ');
  if (parts.length && parts.every(Boolean)) {
    testo = parts.map((m, i) => (i === parts.length - 1 ? `${m[1]} ${m[2]} ${m[3]} ${year}` : `${m[1]} ${m[2]}`)).join(' · ');
  }
  const infoVal = (d, l) => d.info?.find((i) => i.l === l);
  return {
    aggiornato: new Date().toISOString().slice(0, 10),
    evento: 'Apertura Nazionale Rotaract 2026',
    edizione: 'MDIO — Multidistretto Italia Ovest',
    anno_rotaractiano: '2026-2027',
    url: EVENT_URL,
    date: { inizio: (seo.startDate ?? '').slice(0, 10), fine: (seo.endDate ?? '').slice(0, 10), testo },
    citta: days.map((d) => plain(d.city)),
    distretti_partecipanti: 14,
    hotel_ufficiale: { nome: 'Hotel Falcone', stelle: 4, citta: 'Monza' },
    giorni: days.map((d, i) => {
      const dc = infoVal(d, 'Dress code');
      return {
        numero: i + 1,
        data: `${d.longDate} ${year}`.trim(),
        citta: plain(d.city),
        tema: plain(d.tag),
        tipo: plain(d.sub),
        ...(d.featured ? { featured: true } : {}),
        prezzo: infoVal(d, 'Prezzo')?.v ?? '',
        ...(dc ? { dress_code: [dc.v, dc.s].filter(Boolean).join(' — ') } : {}),
        programma: (d.timeline ?? []).map((t) => ({ orario: t.t, titolo: plain(t.title), descrizione: plain(t.d) })),
        info: (d.info ?? []).map((x) => ({ etichetta: x.l, valore: x.v, ...(x.s ? { nota: x.s } : {}) })),
      };
    }),
    pacchetti: (ap.packages ?? []).map((p) => ({
      id: plain(p.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      nome: plain(p.name),
      gruppo: p.group,
      ...(p.featured ? { consigliato: true } : {}),
      date: plain(p.dates),
      tag: plain(p.tag),
      prezzo: p.price,
      include: p.group === 'singoli' ? [plain(p.description)].filter(Boolean) : (p.includes ?? []).map(plain),
    })),
    stato: {
      evento_concluso: true,
      vendite_aperte: site?.salesOpen ?? false,
    },
    faq: (ap.faq?.items ?? []).map((i) => ({ domanda: plain(i.q), risposta: plain(i.a) })),
    organizzatore: { nome: ORGANIZER.name, url: SITE, distretti: ['2041', '2042', '2050'] },
  };
}

// ---------- plugin ----------
export default function seoPlugin() {
  return {
    name: 'mdio-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const rel = (ctx.path ?? '').replace(/^\//, '');
        const key = PAGES[rel];
        if (!key) return html;
        const data = readJson(key);
        const seo = data?.seo;
        if (!seo) return html;
        const ap = key === 'apertura' || key === 'shop' ? readJson('apertura') : null;
        const site = readJson('site');
        const tokens = priceTokens(ap ?? readJson('apertura'));
        const f = (v) => (v === undefined ? undefined : fill(v, tokens));

        if (seo.title !== undefined) html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(f(seo.title))}</title>`);
        html = setMeta(html, 'description', f(seo.description));
        html = setMeta(html, 'og:title', f(seo.ogTitle));
        html = setMeta(html, 'og:description', f(seo.ogDescription));
        html = setMeta(html, 'twitter:title', f(seo.twitterTitle));
        html = setMeta(html, 'twitter:description', f(seo.twitterDescription));

        if (key === 'apertura') {
          html = mapJsonLd(html, (o) => (o['@type'] === 'FAQPage' ? faqLd(data.faq) : eventLd(data)));
          html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => aperturaNoscript(data, site));
        } else if (key === 'shop') {
          html = mapJsonLd(html, () => shopLd(data, ap));
          html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => shopNoscript(data, ap));
        } else if (seo.jsonLdDescription !== undefined) {
          html = mapJsonLd(html, (o) => ({ ...o, description: seo.jsonLdDescription }));
        }
        return html;
      },
    },
    generateBundle() {
      const ap = readJson('apertura');
      if (!ap) return;
      this.emitFile({
        type: 'asset',
        fileName: 'apertura-nazionale.json',
        source: JSON.stringify(aperturaJson(ap, readJson('site')), null, 2) + '\n',
      });
    },
  };
}
