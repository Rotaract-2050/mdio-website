<?php
/** Pubblicazione automatica: al salvataggio dei contenuti avvia la build del sito su GitHub (repository_dispatch). */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Il modulo è attivo solo se in wp-config.php è definito MDIO_GITHUB_TOKEN non vuoto. */
function mdio_deploy_enabled() {
	return defined( 'MDIO_GITHUB_TOKEN' ) && is_string( MDIO_GITHUB_TOKEN ) && '' !== MDIO_GITHUB_TOKEN;
}

/** Segna la richiesta come "da pubblicare". Senza argomenti legge il flag. Mai durante WP-CLI. */
function mdio_deploy_mark( $set = true ) {
	static $marked = false;
	if ( $set && ! ( defined( 'WP_CLI' ) && WP_CLI ) && mdio_deploy_enabled() ) {
		$marked = true;
	}
	return $marked;
}

/** Il valore è una chiave dei tipi di contenuto? */
function mdio_deploy_is_cpt( $type ) {
	return is_string( $type ) && array_key_exists( $type, mdio_cpts() );
}

/** Salvataggio dei campi: pagine opzioni (ctx stringa) o voci dei tipi di contenuto (id numerico). */
add_action( 'acf/save_post', function ( $post_id ) {
	if ( ! mdio_deploy_enabled() ) {
		return;
	}
	if ( is_string( $post_id ) && ! is_numeric( $post_id ) ) {
		foreach ( mdio_docs() as $d ) {
			if ( $d['ctx'] === $post_id ) {
				mdio_deploy_mark();
				return;
			}
		}
		return;
	}
	if ( is_numeric( $post_id ) && mdio_deploy_is_cpt( get_post_type( (int) $post_id ) ) ) {
		mdio_deploy_mark();
	}
}, 40 );

/** Cestino, ripristino ed eliminazione definitiva delle voci dei tipi di contenuto. */
function mdio_deploy_on_post( $post_id, $post = null ) {
	if ( ! mdio_deploy_enabled() ) {
		return;
	}
	if ( ! $post instanceof WP_Post ) {
		$post = 'deleted_post' === current_filter() ? null : get_post( $post_id );
	}
	if ( $post instanceof WP_Post && mdio_deploy_is_cpt( $post->post_type ) ) {
		mdio_deploy_mark();
	}
}
add_action( 'trashed_post', 'mdio_deploy_on_post', 10, 2 );
add_action( 'untrashed_post', 'mdio_deploy_on_post', 10, 2 );
add_action( 'deleted_post', 'mdio_deploy_on_post', 10, 2 );

/** Invio unico a fine richiesta (gira anche dopo il redirect del salvataggio). */
add_action( 'shutdown', function () {
	if ( ! mdio_deploy_enabled() || ! mdio_deploy_mark( false ) ) {
		return;
	}
	$repo = defined( 'MDIO_GITHUB_REPO' ) && is_string( MDIO_GITHUB_REPO ) && '' !== MDIO_GITHUB_REPO ? MDIO_GITHUB_REPO : 'Rotaract-2050/mdio-website';
	$res  = wp_remote_post(
		'https://api.github.com/repos/' . $repo . '/dispatches',
		array(
			'timeout' => 5,
			'headers' => array(
				'Accept'               => 'application/vnd.github+json',
				'Authorization'        => 'Bearer ' . MDIO_GITHUB_TOKEN,
				'X-GitHub-Api-Version' => '2022-11-28',
				'Content-Type'         => 'application/json',
				'User-Agent'           => 'mdio-content',
			),
			'body'    => wp_json_encode( array( 'event_type' => 'content-updated' ) ),
		)
	);
	if ( is_wp_error( $res ) ) {
		$code = 0;
		$msg  = $res->get_error_message();
		$ok   = false;
	} else {
		$code = (int) wp_remote_retrieve_response_code( $res );
		$msg  = (string) $code;
		$ok   = 204 === $code;
	}
	// Il token non finisce mai nell'esito.
	update_option( 'mdio_deploy_last', array( 'ok' => $ok, 'code' => $code, 'msg' => $msg, 'time' => time() ), false );
} );

/** Siamo su una schermata del plugin? */
function mdio_deploy_on_plugin_screen() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}
	$screen = get_current_screen();
	if ( ! $screen ) {
		return false;
	}
	if ( ! empty( $screen->post_type ) && mdio_deploy_is_cpt( $screen->post_type ) ) {
		return true;
	}
	$id = isset( $screen->id ) ? (string) $screen->id : '';
	foreach ( mdio_docs() as $d ) {
		$suffix = '_page_' . $d['slug'];
		if ( $id === 'toplevel_page_' . $d['slug'] || substr( $id, -strlen( $suffix ) ) === $suffix ) {
			return true;
		}
	}
	return false;
}

/** Esito dell'ultimo invio, solo a chi modifica i contenuti e solo nelle schermate del plugin. */
add_action( 'admin_notices', function () {
	if ( ! mdio_deploy_enabled() || ! current_user_can( 'edit_posts' ) || ! mdio_deploy_on_plugin_screen() ) {
		return;
	}
	$last = get_option( 'mdio_deploy_last' );
	if ( ! is_array( $last ) || ! isset( $last['ok'], $last['time'] ) ) {
		return;
	}
	if ( $last['ok'] ) {
		if ( time() - (int) $last['time'] <= 120 ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html( 'Pubblicazione avviata: il sito si aggiorna in circa un minuto.' ) . '</p></div>';
		}
		return;
	}
	$msg = isset( $last['msg'] ) ? (string) $last['msg'] : '';
	echo '<div class="notice notice-error"><p>' . esc_html( 'Pubblicazione automatica non riuscita (' . $msg . '). Il sito si aggiornerà con il passaggio programmato, oppure avviala da GitHub.' ) . '</p></div>';
} );
