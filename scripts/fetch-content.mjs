// Scarica i contenuti da WordPress e aggiorna content/*.json.
// Uso: WP_CONTENT_URL=https://.../wp-json/mdio/v1/content node scripts/fetch-content.mjs
// Senza WP_CONTENT_URL non fa nulla. Se la rete o la validazione falliscono
// lascia lo snapshot in content/ intatto e termina comunque con exit 0.
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content');
const url = process.env.WP_CONTENT_URL;

// chiave dell'endpoint -> file in content/
const KEYS = [
  'site', 'home', 'apertura', 'shop', 'gratta-vinci',
  'distretti/2041', 'distretti/2042', 'distretti/2050',
];

const warn = (msg) => console.warn(`[contenuti] ATTENZIONE: ${msg}. Uso lo snapshot in content/.`);
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

async function main() {
  if (!url) return;

  let payload;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    payload = await res.json();
  } catch (e) {
    return warn(`download non riuscito (${e.message})`);
  }

  // Validazione: tutte le chiavi attese e tutte le chiavi di primo livello dello snapshot.
  if (!isObj(payload)) return warn('risposta non valida');
  for (const key of KEYS) {
    if (!isObj(payload[key])) return warn(`manca la chiave "${key}" nella risposta`);
    const file = join(contentDir, `${key}.json`);
    if (existsSync(file)) {
      const snapshot = JSON.parse(readFileSync(file, 'utf8'));
      const missing = Object.keys(snapshot).filter((k) => !(k in payload[key]));
      if (missing.length) return warn(`"${key}" senza le chiavi: ${missing.join(', ')}`);
    }
  }

  // Tutto valido: scrittura (prima i file temporanei, poi rename).
  const written = [];
  try {
    for (const key of KEYS) {
      const file = join(contentDir, `${key}.json`);
      mkdirSync(dirname(file), { recursive: true });
      const tmp = `${file}.tmp`;
      writeFileSync(tmp, JSON.stringify(payload[key], null, 2) + '\n');
      written.push([tmp, file]);
    }
    for (const [tmp, file] of written) renameSync(tmp, file);
  } catch (e) {
    for (const [tmp] of written) rmSync(tmp, { force: true });
    return warn(`scrittura non riuscita (${e.message})`);
  }
  console.log(`[contenuti] Aggiornati ${KEYS.length} file da WordPress.`);
}

main().catch((e) => warn(e.message)).then(() => process.exit(0));
