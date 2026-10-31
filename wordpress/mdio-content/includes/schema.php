<?php
/**
 * Schema dei contenuti: unica fonte di verità per campi SCF, export JSON e import.
 *
 * Tipi: text, area (textarea), bool, num, list (elenco di stringhe),
 * rep (repeater di oggetti), grp (gruppo/oggetto), x (rimando a un tipo di contenuto).
 * Opzione 'opt' => la chiave JSON viene omessa se il valore e' vuoto/falso.
 * L'ordine dei campi nello schema e' l'ordine delle chiavi nel JSON.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function mdio_T( $n, $l, $o = array() ) {
	return array_merge( array( 't' => 'text', 'n' => $n, 'l' => $l ), $o );
}
function mdio_RT( $n, $l, $o = array() ) { // testo che puo' contenere <em>, <strong>, <br/>
	return mdio_T( $n, $l, array_merge( array( 'rich' => 1 ), $o ) );
}
function mdio_A( $n, $l, $o = array() ) {
	return array_merge( array( 't' => 'area', 'n' => $n, 'l' => $l ), $o );
}
function mdio_B( $n, $l, $o = array() ) {
	return array_merge( array( 't' => 'bool', 'n' => $n, 'l' => $l ), $o );
}
function mdio_N( $n, $l, $o = array() ) {
	return array_merge( array( 't' => 'num', 'n' => $n, 'l' => $l ), $o );
}
function mdio_L( $n, $l, $item = 'Voce', $o = array() ) {
	return array_merge( array( 't' => 'list', 'n' => $n, 'l' => $l, 'item' => $item ), $o );
}
function mdio_R( $n, $l, $f, $o = array() ) {
	return array_merge( array( 't' => 'rep', 'n' => $n, 'l' => $l, 'f' => $f ), $o );
}
function mdio_G( $n, $l, $f, $o = array() ) {
	return array_merge( array( 't' => 'grp', 'n' => $n, 'l' => $l, 'f' => $f ), $o );
}
function mdio_X( $n, $l, $cpt, $o = array() ) {
	return array_merge( array( 't' => 'x', 'n' => $n, 'l' => $l, 'cpt' => $cpt ), $o );
}

/** Assegna a ogni campo la chiave SCF (field_mdio_<prefisso>_<percorso>). */
function mdio_finalize( $fields, $prefix ) {
	foreach ( $fields as $i => $f ) {
		$fields[ $i ]['k'] = 'field_mdio_' . $prefix . '_' . $f['n'];
		if ( ! empty( $f['f'] ) ) {
			$fields[ $i ]['f'] = mdio_finalize( $f['f'], $prefix . '_' . $f['n'] );
		}
	}
	return $fields;
}

function mdio_nav_fields() {
	return array(
		mdio_T( 'label', 'Testo' ),
		mdio_T( 'href', 'Link', array( 'opt' => 1 ) ),
		mdio_B( 'disabled', 'Voce disattivata (non cliccabile)', array( 'opt' => 1 ) ),
	);
}
function mdio_header_fields() {
	return array(
		mdio_T( 'homeLink', 'Link del logo' ),
		mdio_T( 'logoPath', 'Percorso immagine logo' ),
		mdio_T( 'ctaText', 'Testo pulsante in alto' ),
		mdio_T( 'ctaLink', 'Link pulsante in alto' ),
		mdio_R( 'nav', 'Menu di navigazione', mdio_nav_fields(), array( 'item' => 'Voce di menu' ) ),
	);
}
function mdio_pillars_fields() {
	return array(
		mdio_T( 'n', 'Numero' ),
		mdio_T( 't', 'Titolo' ),
		mdio_T( 'd', 'Descrizione' ),
	);
}
function mdio_numbers_fields() {
	return array(
		mdio_T( 'n', 'Numero' ),
		mdio_T( 'l', 'Etichetta' ),
		mdio_T( 's', 'Sottotitolo' ),
	);
}
function mdio_link_fields() {
	return array( mdio_T( 'label', 'Testo' ), mdio_T( 'href', 'Link' ) );
}

/**
 * Gruppo "SEO": testi per title, meta description, Open Graph, Twitter e dati strutturati.
 * Viene usato in fase di build (scripts/seo-plugin.mjs). Va sempre in fondo ai campi, perche'
 * l'ordine dello schema e' l'ordine delle chiavi nel JSON.
 */
function mdio_seo_group( $extra = array(), $tokens = false ) {
	$ph = $tokens ? ' Segnaposto: {{prezzoMin}} e {{prezzoMax}} diventano il prezzo piu\' basso e piu\' alto dei pacchetti.' : '';
	$f  = array(
		mdio_T( 'title', 'Titolo della pagina (title)' ),
		mdio_A( 'description', 'Descrizione per i motori di ricerca (meta description)', $ph ? array( 'h' => trim( $ph ) ) : array() ),
		mdio_T( 'ogTitle', 'Titolo per i social (Open Graph)' ),
		mdio_A( 'ogDescription', 'Descrizione per i social (Open Graph)', $ph ? array( 'h' => trim( $ph ) ) : array() ),
		mdio_T( 'twitterTitle', 'Titolo per Twitter' ),
		mdio_A( 'twitterDescription', 'Descrizione per Twitter' ),
	);
	return mdio_G( 'seo', 'SEO', array_merge( $f, $extra ) );
}
function mdio_seo_group_title_only() {
	return mdio_G( 'seo', 'SEO', array(
		mdio_T( 'title', 'Titolo della pagina (title)' ),
		mdio_A( 'description', 'Descrizione per i motori di ricerca (meta description)' ),
	) );
}

/** Pagine di impostazioni (SCF options page): slug => definizione. */
function mdio_docs() {
	static $docs = null;
	if ( null !== $docs ) {
		return $docs;
	}
	$ctl = 'Controlli principali';

	$docs = array(
		'site' => array(
			'title'  => 'Sito',
			'menu'   => 'Sito',
			'file'   => 'site',
			'fields' => array(
				mdio_T( 'closedLabel', 'Etichetta "evento concluso"', array( 'tab' => $ctl, 'h' => 'Mostrata al posto del conto alla rovescia in home, Apertura Nazionale e pagine distretto, per esempio "Evento concluso · 18–20 Settembre 2026".' ) ),
				mdio_T( 'ticketTailorUrl', 'Link di acquisto Ticket Tailor', array( 'tab' => $ctl, 'h' => 'Indirizzo completo del checkout.' ) ),
				mdio_B( 'salesOpen', 'Vendite aperte', array( 'tab' => $ctl, 'h' => 'Attivo: mostra il widget di acquisto (e carica lo script Ticket Tailor). Spento: la pagina Shop mostra il messaggio di vendite chiuse.' ) ),
				mdio_G( 'footer', 'Piè di pagina', array(
					mdio_T( 'title', 'Titolo' ),
					mdio_T( 'subtitle', 'Sottotitolo' ),
					mdio_R( 'columns', 'Colonne', array(
						mdio_T( 'heading', 'Intestazione colonna' ),
						mdio_R( 'links', 'Link', mdio_link_fields(), array( 'item' => 'Link', 'layout' => 'table' ) ),
					), array( 'item' => 'Colonna' ) ),
					mdio_L( 'bottom', 'Righe in fondo', 'Riga' ),
				) ),
				mdio_G( 'event', 'Banner evento', array(
					mdio_L( 'ticker', 'Scritte scorrevoli', 'Scritta' ),
					mdio_T( 'eyebrow', 'Sopratitolo' ),
					mdio_L( 'titleLines', 'Righe del titolo', 'Riga' ),
					mdio_T( 'emph', 'Testo in evidenza' ),
					mdio_G( 'buttons', 'Pulsanti', array(
						mdio_G( 'home', 'Pulsante nella home', array( mdio_T( 'text', 'Testo' ), mdio_T( 'href', 'Link' ) ) ),
						mdio_G( 'district', 'Pulsante nelle pagine distretto', array( mdio_T( 'text', 'Testo' ), mdio_T( 'href', 'Link' ) ) ),
					) ),
				) ),
			),
		),
		'home' => array(
			'title'  => 'Home',
			'menu'   => 'Home',
			'file'   => 'home',
			'fields' => array(
				mdio_G( 'header', 'Intestazione', mdio_header_fields() ),
				mdio_G( 'hero', 'Hero', array(
					mdio_T( 'eyebrow', 'Sopratitolo' ),
					mdio_L( 'titleLines', 'Righe del titolo', 'Riga' ),
					mdio_T( 'titleSeparator', 'Separatore tra le righe' ),
					mdio_RT( 'sub', 'Sottotitolo' ),
				) ),
				mdio_R( 'districts', 'Schede dei distretti', array(
					mdio_T( 'n', 'Numero distretto' ),
					mdio_T( 'city', 'Zona' ),
					mdio_T( 'sub', 'Sottotitolo' ),
					mdio_T( 'img', 'Immagine (percorso)', array( 'opt' => 1 ) ),
					mdio_T( 'bg', 'Colore sfondo' ),
					mdio_T( 'fg', 'Colore testo' ),
					mdio_T( 'accent', 'Colore di accento' ),
					mdio_T( 'claim', 'Frase di presentazione' ),
					mdio_T( 'zone', 'Descrizione territorio' ),
					mdio_L( 'zones', 'Zone', 'Zona' ),
					mdio_L( 'cities', 'Città', 'Città' ),
					mdio_N( 'clubs', 'Numero club' ),
					mdio_N( 'soci', 'Numero soci' ),
					mdio_T( 'page', 'Pagina del distretto' ),
					mdio_T( 'sito', 'Sito web del distretto' ),
					mdio_T( 'ig', 'Instagram del distretto' ),
					mdio_L( 'imgPool', 'Immagini a rotazione (percorsi)', 'Immagine', array( 'opt' => 1 ) ),
				), array( 'item' => 'Distretto' ) ),
				mdio_G( 'manifesto', 'Chi siamo', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_RT( 'lede', 'Introduzione' ),
					mdio_L( 'paragraphs', 'Paragrafi', 'Paragrafo' ),
					mdio_R( 'pillars', 'Pilastri', mdio_pillars_fields(), array( 'item' => 'Pilastro' ) ),
				) ),
				mdio_R( 'numbers', 'Numeri', mdio_numbers_fields(), array( 'item' => 'Numero' ) ),
				mdio_G( 'mappa', 'Mappa del territorio', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_T( 'image', 'Immagine mappa (percorso)' ),
					mdio_T( 'imageAlt', 'Descrizione immagine' ),
					mdio_R( 'legend', 'Legenda', array( mdio_T( 'color', 'Colore' ), mdio_T( 'label', 'Testo' ) ), array( 'item' => 'Voce', 'layout' => 'table' ) ),
				) ),
				mdio_G( 'districtsSection', 'Sezione distretti', array(
					mdio_T( 'title', 'Titolo' ),
					mdio_T( 'emph', 'Testo in evidenza' ),
				) ),
				mdio_seo_group( array( mdio_A( 'jsonLdDescription', 'Descrizione per i dati strutturati (Organization)' ) ) ),
			),
		),
		'apertura' => array(
			'title'  => 'Apertura Nazionale',
			'menu'   => 'Apertura Nazionale',
			'file'   => 'apertura',
			'fields' => array(
				mdio_G( 'header', 'Intestazione', mdio_header_fields() ),
				mdio_G( 'hero', 'Hero', array(
					mdio_T( 'eyebrow', 'Sopratitolo' ),
					mdio_RT( 'title', 'Titolo' ),
					mdio_T( 'dates', 'Date' ),
					mdio_T( 'badge', 'Etichetta' ),
					mdio_RT( 'lede', 'Introduzione' ),
					mdio_G( 'ghostCta', 'Pulsante secondario', array( mdio_T( 'text', 'Testo' ), mdio_T( 'href', 'Link' ) ) ),
					mdio_R( 'images', 'Immagini', array( mdio_T( 'src', 'Immagine (percorso)' ), mdio_T( 'day', 'Giorno' ), mdio_T( 'city', 'Città' ) ), array( 'item' => 'Immagine' ) ),
				) ),
				mdio_G( 'closed', 'Fascia "evento concluso"', array( mdio_T( 'labelPrefix', 'Testo iniziale', array( 'h' => 'Gli spazi alla fine contano.' ) ), mdio_T( 'labelEmph', 'Testo in evidenza' ) ) ),
				mdio_L( 'marquee', 'Scritte scorrevoli', 'Scritta' ),
				mdio_G( 'programma', 'Programma', array( mdio_RT( 'title', 'Titolo' ), mdio_T( 'lede', 'Introduzione' ) ) ),
				mdio_X( 'days', 'Giornate', 'mdio_giornata' ),
				mdio_G( 'pacchetti', 'Pacchetti', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_RT( 'lede', 'Introduzione' ),
					mdio_RT( 'experienceTitle', 'Titolo pacchetti Experience' ),
					mdio_T( 'experienceSub', 'Sottotitolo pacchetti Experience' ),
					mdio_T( 'singoliTitle', 'Titolo biglietti singoli' ),
				) ),
				mdio_X( 'packages', 'Elenco pacchetti', 'mdio_pacchetto' ),
				mdio_G( 'logistica', 'Logistica', array(
					mdio_T( 'icon', 'Icona' ),
					mdio_T( 'label', 'Etichetta' ),
					mdio_T( 'strong', 'Testo in grassetto' ),
					mdio_T( 'text', 'Testo', array( 'h' => 'Gli spazi all\'inizio contano.' ) ),
				) ),
				mdio_G( 'extras', 'Pacchetti extra', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_T( 'sub', 'Sottotitolo' ),
					mdio_R( 'items', 'Esperienze', array(
						mdio_T( 'icon', 'Icona' ),
						mdio_T( 'name', 'Nome' ),
						mdio_T( 'date', 'Data e orario' ),
						mdio_T( 'loc', 'Luogo' ),
						mdio_A( 'desc', 'Descrizione' ),
						mdio_T( 'price', 'Prezzo' ),
						mdio_A( 'seoText', 'Testo per i motori di ricerca', array( 'h' => 'Usato solo nella versione senza JavaScript.' ) ),
					), array( 'item' => 'Esperienza' ) ),
				) ),
				mdio_G( 'info', 'Informazioni utili', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_R( 'cells', 'Riquadri', array( mdio_T( 'h', 'Intestazione' ), mdio_T( 't', 'Titolo' ), mdio_T( 'd', 'Descrizione' ) ), array( 'item' => 'Riquadro' ) ),
				) ),
				mdio_G( 'faq', 'FAQ', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_X( 'items', 'Domande', 'mdio_faq' ),
				) ),
				mdio_G( 'ctaFinal', 'Invito finale', array(
					mdio_T( 'eyebrow', 'Sopratitolo' ),
					mdio_RT( 'title', 'Titolo' ),
					mdio_T( 'text', 'Testo' ),
				) ),
				mdio_seo_group( array(
					mdio_T( 'eventName', 'Nome dell\'evento (dati strutturati)' ),
					mdio_A( 'eventDescription', 'Descrizione dell\'evento (dati strutturati)' ),
					mdio_T( 'startDate', 'Inizio evento', array( 'h' => 'Formato AAAA-MM-GGTHH:MM:SS+02:00, per esempio 2026-09-18T20:00:00+02:00.' ) ),
					mdio_T( 'endDate', 'Fine evento', array( 'h' => 'Stesso formato dell\'inizio.' ) ),
					mdio_A( 'keywords', 'Parole chiave (separate da virgola)' ),
				), true ),
			),
		),
		'shop' => array(
			'title'  => 'Shop',
			'menu'   => 'Shop',
			'file'   => 'shop',
			'fields' => array(
				mdio_G( 'header', 'Intestazione', array(
					mdio_T( 'homeLink', 'Link del logo' ),
					mdio_T( 'logoPath', 'Percorso immagine logo' ),
					mdio_T( 'ctaText', 'Testo pulsante in alto' ),
					mdio_T( 'ctaLink', 'Link pulsante in alto' ),
					mdio_T( 'backLabel', 'Testo "torna indietro"' ),
					mdio_T( 'defaultBackUrl', 'Link "torna indietro" predefinito' ),
				) ),
				mdio_G( 'hero', 'Hero', array(
					mdio_T( 'eyebrow', 'Sopratitolo' ),
					mdio_T( 'title', 'Titolo' ),
					mdio_T( 'sub', 'Sottotitolo' ),
				) ),
				mdio_G( 'widget', 'Widget di acquisto', array(
					mdio_T( 'fallbackLinkText', 'Testo link alternativo' ),
					mdio_T( 'poweredByText', 'Testo "powered by"' ),
					mdio_T( 'poweredByUrl', 'Link "powered by"' ),
					mdio_T( 'noticeText', 'Avviso' ),
					mdio_T( 'noticeLinkText', 'Testo link dell\'avviso' ),
				) ),
				mdio_G( 'closed', 'Messaggio "vendite chiuse"', array(
					mdio_T( 'eyebrow', 'Sopratitolo' ),
					mdio_RT( 'title', 'Titolo' ),
					mdio_RT( 'sub', 'Testo' ),
					mdio_G( 'instagram', 'Instagram', array( mdio_T( 'url', 'Link' ), mdio_T( 'label', 'Testo' ) ) ),
					mdio_T( 'ctaLabel', 'Testo di invito' ),
					mdio_G( 'button', 'Pulsante', array( mdio_T( 'href', 'Link' ), mdio_T( 'label', 'Testo' ) ) ),
				) ),
				mdio_seo_group( array(
					mdio_T( 'listName', 'Nome dell\'elenco biglietti (dati strutturati)' ),
					mdio_A( 'listDescription', 'Descrizione dell\'elenco biglietti (dati strutturati)' ),
				), true ),
			),
		),
		'gratta-vinci' => array(
			'title'  => 'Cartoline',
			'menu'   => 'Cartoline',
			'file'   => 'gratta-vinci',
			'fields' => array(
				mdio_R( 'prizes', 'Premi', array( mdio_T( 'qty', 'Quantità', array( 'h' => 'Per esempio "× 2".' ) ), mdio_T( 'name', 'Premio' ), mdio_T( 'donor', 'Offerto da' ) ), array( 'item' => 'Premio', 'layout' => 'table' ) ),
				mdio_G( 'howItWorks', 'Come funziona', array(
					mdio_T( 'title', 'Titolo' ),
					mdio_L( 'paragraphs', 'Paragrafi', 'Paragrafo' ),
				) ),
				mdio_seo_group_title_only(),
			),
		),
	);

	foreach ( $docs as $slug => $d ) {
		$docs[ $slug ]['slug']   = 'mdio-' . $slug;
		$docs[ $slug ]['ctx']    = 'mdio_' . str_replace( '-', '_', $slug );
		$docs[ $slug ]['fields'] = mdio_finalize( $d['fields'], str_replace( '-', '_', $slug ) );
	}
	return $docs;
}

/** Tipi di contenuto (CPT). */
function mdio_cpts() {
	static $cpts = null;
	if ( null !== $cpts ) {
		return $cpts;
	}
	$cpts = array(
		'mdio_distretto' => array(
			'singular' => 'Distretto',
			'plural'   => 'Distretti',
			'icon'     => 'dashicons-location-alt',
			'tabs'     => true,
			'fields'   => array(
				mdio_T( 'number', 'Numero del distretto', array( 'tab' => 'Distretto', 'h' => 'Per esempio 2041. Determina il nome del file distretti/<numero>.' ) ),
				mdio_G( 'header', 'Intestazione', mdio_header_fields() ),
				mdio_G( 'hero', 'Hero', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_RT( 'claim', 'Frase di presentazione' ),
					mdio_R( 'stats', 'Numeri in evidenza', array( mdio_T( 'n', 'Numero' ), mdio_T( 'l', 'Etichetta' ) ), array( 'item' => 'Numero', 'layout' => 'table' ) ),
					mdio_T( 'siteUrl', 'Sito web' ),
					mdio_T( 'instagramUrl', 'Instagram' ),
					mdio_T( 'image', 'Immagine (percorso)', array( 'opt' => 1, 'h' => 'Usa questo campo oppure le immagini a rotazione.' ) ),
					mdio_L( 'imagePool', 'Immagini a rotazione (percorsi)', 'Immagine', array( 'opt' => 1 ) ),
					mdio_T( 'imageAlt', 'Descrizione immagine' ),
				) ),
				mdio_L( 'marquee', 'Scritte scorrevoli', 'Scritta' ),
				mdio_G( 'identity', 'Identità', array(
					mdio_RT( 'title', 'Titolo' ),
					mdio_RT( 'lede', 'Introduzione' ),
					mdio_L( 'paragraphs', 'Paragrafi', 'Paragrafo' ),
					mdio_T( 'founding', 'Frase sulla fondazione' ),
					mdio_R( 'pillars', 'Pilastri', mdio_pillars_fields(), array( 'item' => 'Pilastro' ) ),
				) ),
				mdio_R( 'numbers', 'Numeri', mdio_numbers_fields(), array( 'item' => 'Numero' ) ),
				mdio_G( 'zones', 'Zone / aree di focus', array(
					mdio_T( 'label', 'Etichetta' ),
					mdio_RT( 'title', 'Titolo' ),
					mdio_R( 'items', 'Zone', array(
						mdio_T( 'n', 'Numero' ),
						mdio_T( 'name', 'Nome' ),
						mdio_T( 'prov', 'Province / ambito' ),
						mdio_L( 'clubs', 'Club della zona', 'Club', array( 'opt' => 1 ) ),
						mdio_T( 'desc', 'Descrizione' ),
						mdio_T( 'bg', 'Colore sfondo' ),
						mdio_T( 'fg', 'Colore testo' ),
					), array( 'item' => 'Zona' ) ),
				) ),
				mdio_G( 'awards', 'Storia e riconoscimenti', array(
					mdio_T( 'label', 'Etichetta' ),
					mdio_RT( 'title', 'Titolo' ),
					mdio_R( 'items', 'Riconoscimenti', array(
						mdio_T( 'n', 'Numero' ),
						mdio_T( 'title', 'Titolo' ),
						mdio_T( 'body', 'Testo' ),
						mdio_T( 'tag', 'Etichetta' ),
					), array( 'item' => 'Riconoscimento' ) ),
				) ),
				mdio_G( 'services', 'Service', array(
					mdio_T( 'label', 'Etichetta' ),
					mdio_RT( 'title', 'Titolo' ),
					mdio_R( 'items', 'Service', array(
						mdio_T( 'n', 'Numero' ),
						mdio_T( 'icon', 'Icona' ),
						mdio_T( 'title', 'Titolo' ),
						mdio_T( 'body', 'Testo' ),
						mdio_L( 'tags', 'Etichette', 'Etichetta' ),
					), array( 'item' => 'Service' ) ),
				) ),
				mdio_G( 'rete', 'Fare rete', array(
					mdio_T( 'quote', 'Citazione' ),
					mdio_T( 'sub', 'Testo' ),
					mdio_T( 'email', 'Email (mailto:)' ),
				) ),
				mdio_seo_group( array( mdio_A( 'jsonLdDescription', 'Descrizione per i dati strutturati (Organization)' ) ) ),
			),
		),
		'mdio_giornata'  => array(
			'singular' => 'Giornata',
			'plural'   => 'Giornate evento',
			'icon'     => 'dashicons-calendar-alt',
			'fields'   => array(
				mdio_T( 'id', 'Identificativo', array( 'h' => 'Per esempio g1. Non cambiarlo senza motivo.' ) ),
				mdio_T( 'num', 'Numero' ),
				mdio_T( 'city', 'Città' ),
				mdio_T( 'sub', 'Sottotitolo' ),
				mdio_T( 'tag', 'Etichetta' ),
				mdio_T( 'date', 'Data breve' ),
				mdio_T( 'img', 'Immagine (percorso)' ),
				mdio_T( 'color', 'Colore', array( 'h' => 'Per esempio cranberry, royal, gold.' ) ),
				mdio_B( 'featured', 'Evento principale', array( 'opt' => 1 ) ),
				mdio_L( 'bullets', 'Punti elenco', 'Punto' ),
				mdio_R( 'timeline', 'Programma orario', array(
					mdio_T( 't', 'Orario' ),
					mdio_T( 'title', 'Titolo' ),
					mdio_T( 'd', 'Descrizione' ),
				), array( 'item' => 'Momento' ) ),
				mdio_R( 'info', 'Informazioni', array(
					mdio_T( 'l', 'Etichetta' ),
					mdio_T( 'v', 'Valore' ),
					mdio_T( 's', 'Dettaglio', array( 'opt' => 1 ) ),
				), array( 'item' => 'Informazione', 'layout' => 'table' ) ),
				mdio_T( 'longDate', 'Data estesa' ),
			),
		),
		'mdio_pacchetto' => array(
			'singular' => 'Pacchetto',
			'plural'   => 'Pacchetti',
			'icon'     => 'dashicons-tickets-alt',
			'fields'   => array(
				mdio_T( 'group', 'Gruppo', array( 'h' => '"experience" (con hotel) oppure "singoli" (biglietti singoli).' ) ),
				mdio_B( 'featured', 'In evidenza', array( 'opt' => 1 ) ),
				mdio_T( 'badge', 'Bollino', array( 'opt' => 1 ) ),
				mdio_T( 'dates', 'Date' ),
				mdio_RT( 'name', 'Nome' ),
				mdio_T( 'tag', 'Etichetta' ),
				mdio_T( 'price', 'Prezzo' ),
				mdio_T( 'priceSub', 'Dicitura sotto il prezzo' ),
				mdio_L( 'includes', 'Cosa include', 'Voce', array( 'opt' => 1 ) ),
				mdio_T( 'description', 'Descrizione', array( 'opt' => 1 ) ),
				mdio_RT( 'note', 'Nota', array( 'opt' => 1 ) ),
				mdio_T( 'guarantee', 'Garanzia', array( 'opt' => 1 ) ),
			),
		),
		'mdio_faq'       => array(
			'singular' => 'Domanda',
			'plural'   => 'FAQ',
			'icon'     => 'dashicons-editor-help',
			'fields'   => array(
				mdio_T( 'q', 'Domanda' ),
				mdio_A( 'a', 'Risposta', array( 'h' => 'Un a capo nel testo viene mantenuto così com\'è.' ) ),
			),
		),
	);
	foreach ( $cpts as $slug => $c ) {
		$cpts[ $slug ]['fields'] = mdio_finalize( $c['fields'], $slug );
	}
	return $cpts;
}

/** Titolo mostrato nell'elenco dell'admin (calcolato dai campi). */
function mdio_auto_title( $cpt, $post_id ) {
	$g = function ( $n ) use ( $cpt, $post_id ) {
		foreach ( mdio_cpts()[ $cpt ]['fields'] as $f ) {
			if ( $f['n'] === $n ) {
				return (string) get_field( $f['k'], $post_id );
			}
		}
		return '';
	};
	switch ( $cpt ) {
		case 'mdio_distretto':
			return 'Distretto ' . $g( 'number' );
		case 'mdio_giornata':
			return 'Giorno ' . $g( 'num' ) . ' — ' . $g( 'city' );
		case 'mdio_pacchetto':
			return trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( preg_replace( '/<br\s*\/?>/i', ' ', $g( 'name' ) ) ) ) );
		case 'mdio_faq':
			return $g( 'q' );
	}
	return '';
}
