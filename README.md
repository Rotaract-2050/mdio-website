# MDIO Rotaract · Multidistretto Italia Ovest

<div align="center">
  <img src="public/assets/logo-mdio.jpeg" alt="Logo MDIO" width="120" style="border-radius: 50%;" />
  <h3>Lombardia &amp; Provincia di Piacenza</h3>
  <p><strong>Distretti 2041 · 2042 · 2050</strong></p>
</div>

---

Sito web ufficiale del Multidistretto Italia Ovest (MDIO) del Rotaract: presenta i tre distretti, l'Apertura Nazionale 2026 (18-20 settembre 2026), lo shop biglietti e l'iniziativa delle cartoline (gratta-vinci).

Questo README è la documentazione completa del progetto. Chi lo legge dovrebbe riuscire ad avviare il sito, modificare i contenuti, capire il flusso, aggiungere una pagina o un campo, fare deploy e risolvere i guasti comuni.

## Indice

1. [Panoramica e stack](#1-panoramica-e-stack)
2. [Architettura](#2-architettura)
3. [Struttura del repo](#3-struttura-del-repo)
4. [Sviluppo locale](#4-sviluppo-locale)
5. [Pagine](#5-pagine)
6. [Contenuti](#6-contenuti)
7. [Guida per chi modifica i contenuti (WordPress)](#7-guida-per-chi-modifica-i-contenuti-wordpress)
8. [Plugin mdio-content](#8-plugin-mdio-content)
9. [Mu-plugin mdio-headless](#9-mu-plugin-mdio-headless)
10. [SEO](#10-seo)
11. [Build e deploy](#11-build-e-deploy)
12. [Risoluzione problemi](#12-risoluzione-problemi)
13. [Privacy e sicurezza](#13-privacy-e-sicurezza)
14. [Limiti noti e cose da fare](#14-limiti-noti-e-cose-da-fare)

## 1. Panoramica e stack

Il sito è una Multi-Page Application statica: ogni pagina ha il suo file HTML e il suo punto di ingresso React. Non c'è un server applicativo: in produzione si pubblicano file statici.

- React 18 (`react`, `react-dom`) per i componenti.
- Vite 5 (`@vitejs/plugin-react`) per sviluppo e build, con un plugin locale per la SEO (`scripts/seo-plugin.mjs`).
- CSS semplice, un file per pagina più `globals.css`. Font da Google Fonts.
- Contenuti in `content/*.json`, modificabili da un WordPress "headless" installato su `/cms` dello stesso dominio.
- Build e deploy con GitHub Actions; pubblicazione via FTP su Hostinger.
- `sharp` è una devDependency usata solo dallo script `convert-webp.js` (vedi [Limiti noti](#14-limiti-noti-e-cose-da-fare)).

Dominio di produzione: `https://multidistrettolombardo.org`.

## 2. Architettura

```
 Editor
   |  modifica i campi in WordPress (/cms/wp-admin/)
   v
 WordPress + plugin mdio-content
   |  endpoint pubblico  GET /cms/wp-json/mdio/v1/content
   v
 GitHub Action "Deploy to FTP"
   |  1. node scripts/fetch-content.mjs   -> riscrive content/*.json
   |  2. npm run build  (Vite + seo-plugin) -> dist/
   v
 FTP (FTP-Deploy-Action) -> cartella del dominio su Hostinger (public_html)
```

La Action parte a ogni push su `main`, a mano, su `repository_dispatch` (`content-updated`, inviato da WordPress al salvataggio: sezione 8) e ogni ora (cron di riserva).

Perché i contenuti si scaricano in fase di build e non dal browser:

- Il sito resta statico e veloce: nessuna chiamata a WordPress per ogni visitatore.
- Se WordPress è giù o rotto, il sito pubblico non se ne accorge: continua a servire l'ultima build.
- Nessun problema di CORS, perché il browser non contatta mai `/cms`.
- Titoli, meta tag, dati strutturati e testo `noscript` sono presenti già nell'HTML (utile ai motori di ricerca), cosa impossibile con un fetch lato client.
- `content/*.json` nel repo è uno snapshot: se il download fallisce la build usa quello.

## 3. Struttura del repo

```
.
├── index.html, apertura-nazionale.html, shop.html   entry HTML (root)
├── distretti/{2041,2042,2050}.{html,jsx,css}        pagine dei distretti
├── gratta-vinci/index.html                          entry HTML delle cartoline
├── home.jsx, apertura-nazionale.jsx, shop.jsx,
│   gratta-vinci.jsx                                 entry React (uno per pagina)
├── *.css, globals.css                               stili
├── components/                                      Header, Footer, EventClosed,
│                                                    EventBanner, RichText, CookieBanner
├── content/                                         snapshot dei contenuti (JSON)
│   ├── site.json, home.json, apertura.json,
│   │   shop.json, gratta-vinci.json
│   └── distretti/{2041,2042,2050}.json
├── public/                                          copiato com'è in dist/ da Vite
│   ├── assets/                                      immagini, logo, og-cover, mappa
│   └── robots.txt, sitemap.xml, llms.txt, llms-full.txt
├── scripts/
│   ├── fetch-content.mjs                            scarica i contenuti da WordPress
│   └── seo-plugin.mjs                               plugin Vite per la SEO
├── wordpress/mdio-content/                          plugin WordPress (vedi sezione 8)
├── .github/workflows/deploy.yml                     build e deploy
├── vite.config.js, package.json
└── convert-webp.js, check_error.js, signature.js    utilità (vedi sezione 14)
```

Le immagini stanno in `public/assets/`, non in una cartella `assets/` in root. Nei contenuti vanno scritte come `assets/nome-file.jpeg`.

`dist/` e `node_modules/` sono ignorati da git, come `.env`.

## 4. Sviluppo locale

Requisiti: Node.js 20 (stessa versione della Action) e npm.

```bash
npm ci            # installa le dipendenze (oppure npm install)
npm run dev       # server di sviluppo Vite
npm run build     # build di produzione in dist/
npm run preview   # serve dist/ in locale per provarla
```

Per scaricare i contenuti da WordPress prima di sviluppare o costruire:

```bash
WP_CONTENT_URL=https://multidistrettolombardo.org/cms/wp-json/mdio/v1/content node scripts/fetch-content.mjs
```

Script npm: `dev`, `build`, `preview`, `optimize-images` (esegue `convert-webp.js`, vedi sezione 14).

Senza `WP_CONTENT_URL` lo script non fa nulla ed esce con codice 0: si lavora sui JSON già presenti in `content/`. Anche se la rete o la validazione falliscono, `fetch-content.mjs` stampa un avviso `[contenuti] ATTENZIONE: ...`, lascia `content/` intatto ed esce con 0.

Attenzione: dopo un fetch riuscito `content/*.json` risulta modificato in git. Non committare per sbaglio uno snapshot che non vuoi (per esempio con dati di prova).

## 5. Pagine

Ogni pagina ha un HTML (con `<script type="module">` verso il suo `.jsx`), un entry React e un JSON di contenuti. L'elenco completo dei punti di ingresso è in `vite.config.js` (`build.rollupOptions.input`).

| Pagina | URL | Entry HTML | Entry React | Contenuti |
|---|---|---|---|---|
| Home | `/` | `index.html` | `home.jsx` | `content/home.json` + `site.json` |
| Apertura Nazionale | `/apertura-nazionale.html` | `apertura-nazionale.html` | `apertura-nazionale.jsx` | `content/apertura.json` |
| Shop biglietti | `/shop.html` | `shop.html` | `shop.jsx` | `content/shop.json` + `site.json` |
| Cartoline (gratta-vinci) | `/gratta-vinci/` | `gratta-vinci/index.html` | `gratta-vinci.jsx` | `content/gratta-vinci.json` |
| Distretto 2041 | `/distretti/2041.html` | `distretti/2041.html` | `distretti/2041.jsx` | `content/distretti/2041.json` + `site.json` |
| Distretto 2042 | `/distretti/2042.html` | `distretti/2042.html` | `distretti/2042.jsx` | `content/distretti/2042.json` + `site.json` |
| Distretto 2050 | `/distretti/2050.html` | `distretti/2050.html` | `distretti/2050.jsx` | `content/distretti/2050.json` + `site.json` |

`site.json` alimenta anche i componenti condivisi: `EventClosed` (etichetta "evento concluso"), `EventBanner` (banner evento in home e nei distretti), `Footer`, e lo shop (`salesOpen`, link Ticket Tailor).

### Aggiungere una pagina

1. Crea `nuova.html` (copia una pagina simile: meta, `<div id="root">`, `<script type="module" src="/nuova.jsx">`) e `nuova.jsx`, che importa `./content/nuova.json`.
2. Aggiungi la voce in `build.rollupOptions.input` di `vite.config.js`. Senza questo la pagina esiste in dev ma non finisce in `dist/`.
3. Crea `content/nuova.json`.
4. Se vuoi che sia modificabile da WordPress: aggiungi un documento allo schema (sezione 8) e la chiave `nuova` all'elenco `KEYS` di `scripts/fetch-content.mjs`.
5. Per la SEO automatica aggiungila a `PAGES` in `scripts/seo-plugin.mjs` e dai al JSON un gruppo `seo`.
6. Aggiungi l'URL a `public/sitemap.xml` (vedi sezione 10).

### Aggiungere un campo a una pagina esistente

1. Aggiungilo nello schema del plugin (sezione 8) e nel JSON in `content/`, con lo stesso nome.
2. Usalo nel `.jsx`.
3. Aggiorna il plugin su WordPress e rilancia l'import o compila il campo a mano (sezione 8).

Attenzione: `fetch-content.mjs` scarta tutta la risposta se a una chiave di primo livello dello snapshot manca una chiave presente in `content/`. Aggiungere un campo al JSON prima che il plugin lo esporti fa quindi fallire il fetch (ripiego sullo snapshot) finché il plugin non è aggiornato.

## 6. Contenuti

`content/` è la fonte letta da React e dal plugin SEO. I file sono:

- `site.json`: controlli generali (etichetta "evento concluso", link Ticket Tailor, `salesOpen`), footer, banner evento.
- `home.json`, `apertura.json`, `shop.json`, `gratta-vinci.json`.
- `distretti/2041.json`, `2042.json`, `2050.json`.

Di norma questi file sono riscritti da `fetch-content.mjs` ogni volta che la Action gira. Se li modifichi a mano e fai push, alla build successiva WordPress li sovrascrive (se raggiungibile e valido). Per cambiare un contenuto in modo duraturo si modifica WordPress, oppure si modifica il JSON e si reimporta con `wp mdio import` (sezione 8).

### Sintassi ammessa nel testo

I campi di testo "ricco" possono contenere solo:

- `<em>corsivo</em>`
- `<strong>grassetto</strong>`
- `<br/>` per andare a capo

Il componente `components/RichText.jsx` interpreta solo questi tre tag e tratta tutto il resto come testo semplice. Non viene usato `dangerouslySetInnerHTML`, quindi altri tag compariranno come testo letterale. Per i testi SEO e il `noscript`, il plugin rimuove ogni tag.

### Segnaposto nei testi SEO

Nei testi `seo` di `apertura.json` e `shop.json` si possono usare `{{prezzoMin}}` e `{{prezzoMax}}`: la build li sostituisce con il prezzo più basso e più alto tra i pacchetti (campo `price` dei pacchetti). Segnaposto sconosciuti restano com'è.

### Immagini

Nei JSON le immagini sono path relativi a `public/assets/` (esempio `assets/2042-01-Lecco.jpeg`). Non si usa la media library di WordPress perché le immagini fanno parte della build statica: dovrebbero stare in `public/assets/` nel repo. Per cambiare un'immagine si aggiunge il file a `public/assets/` (commit e push) e poi si scrive il suo path nel campo in WordPress.

## 7. Guida per chi modifica i contenuti (WordPress)

Questa sezione è per chi non è tecnico.

Il pannello è su `https://multidistrettolombardo.org/cms/wp-admin/`. Le credenziali non sono nel repo: chiedile ai maintainer.

Qui non c'è un editor visuale: non si trascina nulla e non si vede un'anteprima del sito. Si compilano campi di testo, si preme "Aggiorna" e il sito cambia dopo la prossima pubblicazione automatica (vedi sotto). Le voci "Pagine" e "Articoli" di WordPress non alimentano il sito: modificarle non cambia nulla. Si usa solo il menu "Contenuti MDIO".

### Il menu "Contenuti MDIO"

| Voce | Cosa contiene |
|---|---|
| Sito | Controlli principali (etichetta "evento concluso", link Ticket Tailor, vendite aperte), piè di pagina, banner evento. |
| Home | Intestazione, hero, schede dei tre distretti, "Chi siamo", numeri, mappa, SEO. |
| Apertura Nazionale | Pagina dell'evento: hero, fascia "evento concluso", programma, pacchetti (testi di sezione), logistica, pacchetti extra (le sei esperienze facoltative), info utili, FAQ (titolo), testo finale, SEO. |
| Shop | Testi della pagina biglietti e messaggio "vendite chiuse". |
| Cartoline | Premi e testo "Come funziona" della pagina gratta-vinci. |
| Distretti | Un contenuto per distretto (2041, 2042, 2050): hero, identità, zone, riconoscimenti, service, SEO. |
| Giornate evento | Le tre giornate dell'Apertura Nazionale (programma orario, informazioni). |
| Pacchetti | I pacchetti proposti, ora in archivio (nome, prezzo, cosa include). L'ordine è quello della colonna "Ordine". |
| FAQ | Le domande frequenti dell'Apertura Nazionale. L'ordine è quello della colonna "Ordine". |

Sotto ogni campo ci sono i suggerimenti sul formato. Nei campi di testo si possono usare solo `<em>`, `<strong>` e `<br/>` (sezione 6).

### Vendite e stato dell'evento

L'Apertura Nazionale 2026 (18-20 settembre 2026) è conclusa e il sito la presenta come archivio al passato. In Contenuti MDIO > Sito, scheda "Controlli principali":

- Vendite aperte (`salesOpen`): oggi **spento**. Con vendite spente la pagina Shop mostra il messaggio "vendite chiuse" (Contenuti MDIO > Shop) e non carica lo script Ticket Tailor. Se acceso, la pagina mostra il widget di acquisto. Il pulsante di acquisto non compare più nella pagina Apertura Nazionale: pacchetti e prezzi restano come elenco di ciò che era proposto.
- Link di acquisto Ticket Tailor (`ticketTailorUrl`): indirizzo del checkout, usato solo se le vendite sono accese.
- Etichetta "evento concluso" (`closedLabel`): per esempio "Evento concluso · 18–20 Settembre 2026". Compare nel banner dell'evento delle pagine distretto e nella fascia sotto l'hero della pagina Apertura Nazionale. La home usa invece il gruppo "Ringraziamento nella home" (`event.homeThanks`), con sopratitolo e testo del riquadro propri.

Il countdown non esiste più: non c'è alcun conto alla rovescia, né data di riferimento, né aggiornamento al secondo. Per un evento futuro andrebbe reintrodotto un componente apposito (e un campo data nello schema).

### Quando compaiono le modifiche

Premendo "Aggiorna" WordPress avvisa GitHub, che ricostruisce il sito: servono circa un minuto o due di build. In alto nella schermata compare "Pubblicazione avviata". Se invece compare "Pubblicazione automatica non riuscita", il sito si aggiorna comunque al prossimo passaggio orario (cron, al minuto 0), oppure chi ha accesso al repo può andare su GitHub > Actions > "Deploy to FTP" > "Run workflow".

Il webhook è attivo. Se il token manca o scade, resta solo la cron oraria (sezione 8, "Pubblicazione automatica").

Se più persone salvano in pochi minuti, GitHub tiene una sola build in attesa, che legge i contenuti più recenti: nessuna modifica va persa.

### Attenzione a FAQ e Pacchetti

Se riordini FAQ o Pacchetti dal campo "Ordine" va tutto bene. Ma se qualcuno rilancia l'import dai file (sezione 8) dopo un riordino, i contenuti si scambiano di posto. Se non sei sicuro, chiedi ai maintainer.

## 8. Plugin mdio-content

Sta in `wordpress/mdio-content/`. Richiede il plugin Secure Custom Fields (SCF, compatibile ACF). Fa cinque cose:

| File | Funzione |
|---|---|
| `mdio-content.php` | Intestazione del plugin (versione 1.1.0), carica gli altri file (e `cli.php` solo in WP-CLI). |
| `includes/schema.php` | Schema unico dei contenuti: elenco di documenti (`mdio_docs()`: site, home, apertura, shop, gratta-vinci) e di tipi di contenuto (`mdio_cpts()`: distretto, giornata, pacchetto, faq), con i loro campi. |
| `includes/fields.php` | Crea dallo schema i tipi di contenuto, il menu "Contenuti MDIO", le pagine opzioni e i gruppi di campi SCF. |
| `includes/export.php` | Converte i valori dei campi nella stessa struttura JSON dei file di `content/`. |
| `includes/rest.php` | Registra `GET /wp-json/mdio/v1/content`. |
| `includes/deploy.php` | Pubblicazione automatica: al salvataggio avvia la build su GitHub (`repository_dispatch`). |
| `includes/cli.php` | Comando `wp mdio import <cartella>`. |

### Endpoint

`GET https://multidistrettolombardo.org/cms/wp-json/mdio/v1/content` è pubblico e senza cache. Risponde con un oggetto che ha una chiave per file: `site`, `home`, `apertura`, `shop`, `gratta-vinci`, `distretti/2041`, `distretti/2042`, `distretti/2050`. Essendo pubblico, non deve contenere nulla di riservato.

### Aggiungere un campo (schema unico)

Lo schema in `schema.php` è l'unica fonte per campi, export e import. Per aggiungere un campo:

1. Aggiungilo nell'array `fields` del documento o del tipo giusto con gli helper: `mdio_T` (testo), `mdio_RT` (testo con `<em>`, `<strong>`, `<br/>`), `mdio_A` (area di testo), `mdio_B` (sì/no), `mdio_N` (numero), `mdio_L` (elenco di stringhe), `mdio_R` (ripetitore), `mdio_G` (gruppo), `mdio_X` (rimando a un tipo di contenuto).
2. L'ordine nello schema è l'ordine delle chiavi nel JSON. Con `'opt' => 1` la chiave viene omessa se vuota. Il gruppo `seo` va in fondo.
3. Carica il plugin aggiornato sul server.
4. Se il campo è nuovo in un JSON esistente, aggiornalo anche in `content/` e `.jsx` (sezione 5).

I nomi (`n`) devono coincidere con le chiavi JSON; le chiavi SCF interne si ricavano da soli (`field_mdio_<doc>_<campo>`).

### Pubblicazione automatica (`includes/deploy.php`)

Quando un editor salva contenuti, il modulo invia a GitHub un `repository_dispatch` di tipo `content-updated` e la Action ricostruisce il sito. Scatta a:

- salvataggio di una pagina di Contenuti MDIO (Sito, Home, Apertura, Shop, Cartoline);
- salvataggio, cestino, ripristino o eliminazione di una voce Distretti, Giornate, Pacchetti, FAQ.

Dettagli: l'invio è uno solo per richiesta, a fine richiesta, e registra l'esito nell'opzione `mdio_deploy_last` (solo codice HTTP o testo dell'errore, mai il token). Non parte con WP-CLI, quindi `wp mdio import` non avvia deploy. Nelle schermate del plugin chi può modificare gli articoli vede l'esito: verde "Pubblicazione avviata" per due minuti, rosso "Pubblicazione automatica non riuscita" finché un invio successivo non riesce. Non ci sono code, transient o cron di WordPress: la coda è gestita dal workflow (sezione 11).

Configurazione, in `wp-config.php`:

- `MDIO_GITHUB_TOKEN` (obbligatoria): senza, o se vuota, il modulo non fa nulla e non mostra errori.
- `MDIO_GITHUB_REPO` (facoltativa): default `Rotaract-2050/mdio-website`.

Attivazione (una tantum, a cura di un maintainer):

1. Su `https://github.com/settings/personal-access-tokens/new` crea un token fine-grained: resource owner `Rotaract-2050`, solo il repository `mdio-website` (l'org può chiedere di approvare il token), permesso Repository > Contents: Read and write, scadenza la più lunga consentita. Il permesso è richiesto da `repository_dispatch`, ma consente anche di scrivere nel repo: per questo il token vive solo nel `wp-config.php` del server, non va incollato altrove.
2. Sul server, nella cartella di WordPress (`/cms`), senza far comparire il token nella cronologia:

```bash
read -rs T && wp config set MDIO_GITHUB_TOKEN "$T" --type=constant && unset T
```

3. Salva una voce di prova e controlla che su GitHub > Actions parta una run "Deploy to FTP".

Stato attuale: attivo con il token `mdio-wp-deploy`, scadenza 1 novembre 2027. Il token scade: alla scadenza compare l'avviso rosso (401) e va rigenerato e sostituito con lo stesso comando.

### Cosa va online e quando

| Cosa cambia | Quando è online |
|---|---|
| Codice (push su `main`) | Da solo, la Action parte al push. |
| Testi modificati in WordPress | Al salvataggio, in un minuto o due. Se il webhook fallisce, alla cron oraria. |
| Testi cambiati solo nei `content/*.json` del repo | Non compaiono: alla build WordPress sovrascrive i file. Servono prima `wp mdio import` sul server (sotto) e poi una pubblicazione. |
| Plugin `wordpress/mdio-content/` | Da copiare a mano sul server (sotto). |

Non c'è sincronizzazione automatica al push dei JSON verso WordPress perché `wp mdio import` sovrascriverebbe le modifiche fatte in WordPress.

### Installare e aggiornare

Si copia la cartella `wordpress/mdio-content/` in `wp-content/plugins/` del WordPress su `/cms` (dal file manager di hPanel o via SSH/SFTP; credenziali in hPanel/1Password dei maintainer) e si attiva da Plugin. Per aggiornare si sostituisce la cartella con la versione del repo: resta un'operazione manuale, non c'è deploy del plugin. Serve SCF attivo.

### `wp mdio import`

```bash
wp mdio import /percorso/della/cartella/content
```

Carica nei campi di WordPress i JSON di `content/` (site, home, apertura, shop, gratta-vinci, distretti, giornate, pacchetti, FAQ). Serve per la prima popolazione o per riportare in WordPress ciò che è nel repo. È idempotente, ma con questi limiti:

- Sovrascrive tutto ciò che è stato modificato in WordPress sui campi coinvolti.
- Rimuove da WordPress i contenuti importati in passato che non sono più nei file.
- Le chiavi di corrispondenza sono: `distretto-<numero>`, `giorno-<id>` per le giornate, e la posizione per FAQ (`faq-N`) e pacchetti (`pacchetto-N`). Poiché FAQ e pacchetti dipendono dalla posizione, se in WordPress sono stati riordinati e poi si reimporta, i contenuti si scambiano di posto.

## 9. Mu-plugin mdio-headless

Esiste un mu-plugin `mdio-headless` che sta solo sul server, in `cms/wp-content/mu-plugins/`, e oggi non è nel repo. Questo è un limite: se il server va ricreato o migrato, quel pezzo va riscritto o recuperato dal server. Va aggiunto al repo (per esempio in `wordpress/`). Non è documentato cosa faccia, perché non è verificabile da qui.

## 10. SEO

`scripts/seo-plugin.mjs` è un plugin Vite. In build, per ogni pagina in `PAGES`, legge il JSON corrispondente e riscrive nell'HTML:

- `<title>` e meta description, Open Graph e Twitter, dal gruppo `seo` del JSON (con i segnaposto di prezzo).
- JSON-LD: `Event` (con `subEvent` per le giornate, stato `EventScheduled` e date reali, senza `offers` perché le vendite sono chiuse) e `FAQPage` per l'Apertura; `ItemList` per lo shop, con le offerte marcate `SoldOut`; `description` dell'Organization per home e distretti.
- Il blocco `<noscript>` di Apertura e Shop, generato da pacchetti, giornate e FAQ.
- `FAQPage` contiene solo le FAQ presenti e visibili nel JSON.

Genera inoltre `/apertura-nazionale.json` (file di riepilogo dell'evento per consumo esterno, con `stato.evento_concluso` e `stato.vendite_aperte`) a ogni build, dai dati correnti. Non va più tenuto in `public/` (il vecchio file è stato rimosso).

Resta fisso nel codice dello script: organizzatore, immagine di condivisione, luoghi, orari delle sotto-giornate (`DAY_CONST`), URL del sito, numero di distretti partecipanti e hotel ufficiale nel JSON generato, e parte del testo del `noscript` di Apertura. Cambiare questi dati significa modificare lo script.

### File root e public/

Vite pubblica solo il contenuto di `public/`, più le pagine HTML elencate in `vite.config.js`. In `dist/` finiscono quindi `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` e `public/llms-full.txt`. Le copie in root di questi file sono state eliminate: l'unica versione valida è quella in `public/`. `public/llms-full.txt` è scritto a partire dai dati di `content/` e va aggiornato a mano quando cambiano cifre, prezzi o date; `public/llms.txt` e `public/sitemap.xml` idem (le cifre di club e soci compaiono anche negli `.html` statici e in `scripts/seo-plugin.mjs`).

## 11. Build e deploy

Workflow: `.github/workflows/deploy.yml`, "Deploy to FTP". Passi: checkout, Node 20, `npm ci`, `node scripts/fetch-content.mjs` (con `WP_CONTENT_URL` impostata all'endpoint pubblico), `npm run build`, upload di `dist/` via FTP nella cartella del dominio (`public_html`).

Trigger:

- `push` su `main`.
- `workflow_dispatch` (manuale: Actions > Run workflow).
- `repository_dispatch` con tipo `content-updated`: lo invia il plugin al salvataggio dei contenuti (sezione 8).
- `schedule`: ogni ora (`0 * * * *`). È solo una riserva: le cron di GitHub possono ritardare o saltare esecuzioni, e vengono disattivate dopo 60 giorni di inattività del repo.

`concurrency` con gruppo `deploy` e `cancel-in-progress: false`: non si interrompe mai un upload FTP a metà. Se arrivano più avvii durante una run, GitHub ne tiene una sola in attesa; quella leggerà i contenuti più recenti.

Secret GitHub richiesti: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (Settings > Secrets and variables > Actions). I valori non sono nel repo.

Comportamento del fallback: se WordPress non risponde, risponde con errore o con dati incompleti, lo script avvisa nel log, lascia `content/` com'è e la build prosegue con lo snapshot committato. Il deploy non fallisce per questo motivo: guarda il log del passo "Aggiornamento contenuti da WordPress" se sospetti che non si aggiorni.

Regola: ogni push su `main` fa partire un deploy in produzione. Lavora su un branch e fai merge su `main` solo quando il contenuto è pronto. Su un branch diverso da `main` la Action non parte per il push (parte però il cron sulla branch di default).

### Come si contribuisce

Il repo è `Rotaract-2050/mdio-website` e segue lo standard del sito del Distretto 2050, senza il branch `dev`: con il deploy FTP non c'è un ambiente di anteprima.

- Branch: `feat/`, `fix/`, `docs/`, `ci/`, `content/` seguiti da una descrizione breve.
- Commit: `type(scope): descrizione`.
- `main` è protetto: si entra con una pull request approvata da un'altra persona. Solo gli admin dell'org possono scavalcare la regola, per le emergenze.
- Ogni merge su `main` va subito in produzione.
- Chi ha il permesso Write può leggere i secret FTP modificando un workflow in un branch: va dato solo a persone fidate. L'accesso passa dal team `mdio` dell'org.

## 12. Risoluzione problemi

**Il contenuto modificato in WordPress non compare.**
Controlla di aver premuto "Aggiorna". Poi aspetta il cron orario o lancia a mano "Deploy to FTP". Apri il log: se il passo di aggiornamento contenuti mostra `[contenuti] ATTENZIONE`, il sito è stato costruito con lo snapshot. Verifica anche che l'endpoint risponda (apri l'URL del `WP_CONTENT_URL` nel browser). Se il sito sembra ancora vecchio, forza il ricaricamento (cache del browser).

**Compare "Pubblicazione automatica non riuscita (...)".**
Il salvataggio è riuscito, ma l'avvio della build no. Il messaggio riporta il codice HTTP di GitHub: `401` token scaduto o errato (rigeneralo, sezione 8); `403` o `404` permessi insufficienti o repository sbagliato (il token deve avere solo `mdio-website` con Contents: Read and write; controlla `MDIO_GITHUB_REPO`). Un testo diverso è un errore di rete del server. Nel frattempo il sito si aggiorna con la cron oraria, oppure avvia a mano "Deploy to FTP". L'avviso sparisce al primo invio riuscito.

**WordPress è giù.**
Il sito pubblico non è toccato. La Action ripiega sullo snapshot. Quando WordPress torna, la prima esecuzione utile riallinea i contenuti.

**Il fetch fallisce con un warning.**
I messaggi dicono perché: download non riuscito (rete, HTTP), risposta non valida, chiave mancante nella risposta, oppure una chiave dello snapshot assente nella risposta (di solito il plugin sul server è più vecchio dei JSON del repo: aggiorna il plugin, sezione 8).

**Il CMS mostra un errore dopo un cambio della password del database.**
WordPress deve usare le credenziali nuove: aggiorna la configurazione del database di WordPress sul server (file di configurazione del CMS in `public_html/cms`) e verifica in hPanel che utente e password del database coincidano. I dettagli sono in hPanel/1Password dei maintainer.

**SSH: "Too many authentication failures".**
Hai molte chiavi nell'agent e il server scarta la connessione prima di provare quella giusta. Usa solo la chiave voluta:

```bash
ssh -o IdentitiesOnly=yes -i <chiave> <utente>@<host>
```

(o impostalo in `~/.ssh/config` con `IdentitiesOnly yes`). Credenziali e chiave sono in hPanel/1Password dei maintainer.

**404 su `/cms/wp-json/...`.**
Manca (o è sbagliato) `cms/.htaccess` con le regole di riscrittura di WordPress. In alternativa funziona `/cms/index.php?rest_route=/mdio/v1/content`. Ripristina `.htaccess` da Impostazioni > Permalink in wp-admin (salvando) o dal file standard di WordPress.

**La build locale fallisce su un JSON.**
Controlla la sintassi del file modificato (`node -e "JSON.parse(require('fs').readFileSync('content/home.json','utf8'))"`).

## 13. Privacy e sicurezza

- Il repo è pubblico: niente password, chiavi, utenti, indirizzi o credenziali di accesso nel codice, nei commit e in questo README. Servono solo come secret GitHub o nei gestori dei maintainer (hPanel, 1Password).
- Il token GitHub della pubblicazione automatica (`MDIO_GITHUB_TOKEN`) sta solo nel `wp-config.php` del server, mai nel repo. Ha il permesso Contents: Read and write su `mdio-website`, che consente anche di scrivere nel repo: limitalo a quel solo repository, con la scadenza più lunga consentita, e rigeneralo se sospetti una fuga. Il plugin non lo salva né lo scrive nei log.
- L'endpoint `/cms/wp-json/mdio/v1/content` è pubblico: tutto ciò che passa da WordPress è, di fatto, pubblico. Non inserire dati personali (nomi di persone fisiche con codice fiscale, data o luogo di nascita) né nei campi WordPress né nel codice. Il regolamento (`termini`) dell'iniziativa cartoline resta in `gratta-vinci.jsx`.
- Non lasciare backup, dump o archivi nella cartella pubblica del dominio (`public_html`): sono scaricabili da chiunque. I backup vanno fuori dalla cartella servita.
- Il CMS non deve essere indicizzato dai motori di ricerca: mantieni attiva l'opzione "scoraggia i motori di ricerca" o equivalente lato server. Questa impostazione non è versionata nel repo.
- Account WordPress con password forti e solo per chi serve.

## 14. Limiti noti e cose da fare

- Immagini: solo come path (sezione 6); non c'è caricamento da WordPress.
- Pubblicazione: il token del webhook scade il 1 novembre 2027 e va rinnovato a mano (sezione 8). L'aggiornamento del plugin sul server è manuale.
- Mu-plugin `mdio-headless` solo sul server (sezione 9).
- FAQ e pacchetti sono identificati per posizione: l'import dopo un riordino li scambia (sezione 8).
- Cifre di club e soci duplicate: compaiono in `content/` (WordPress), nei `<meta>` e `noscript` statici degli `.html` e in `scripts/seo-plugin.mjs`. Serie corrente: MDIO 61 club / 1.013 soci; 2041 13/350; 2042 18/260; 2050 30/403. Se cambiano vanno aggiornate in tutti questi punti e in `public/llms*.txt`.
- Script `convert-webp.js` (`npm run optimize-images`) cerca una cartella `assets/` in root che non esiste più (le immagini sono in `public/assets/`): va corretto prima di usarlo. `check_error.js` richiede `puppeteer`, che non è tra le dipendenze. `signature.js` è importato da `components/Header.jsx` e stampa solo i crediti nella console del browser.
- Il campo `seo` e il `noscript` non coprono tutte le pagine allo stesso modo (cartoline: solo title e description).
