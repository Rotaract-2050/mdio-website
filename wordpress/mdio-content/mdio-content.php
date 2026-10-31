<?php
/**
 * Plugin Name: MDIO Content
 * Description: Contenuti editabili del sito MDIO (campi SCF, tipi di contenuto, endpoint JSON mdio/v1/content, comando wp mdio import).
 * Version: 1.0.0
 * Requires Plugins: secure-custom-fields
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MDIO_CONTENT_DIR', __DIR__ . '/includes/' );

require_once MDIO_CONTENT_DIR . 'schema.php';
require_once MDIO_CONTENT_DIR . 'fields.php';
require_once MDIO_CONTENT_DIR . 'export.php';
require_once MDIO_CONTENT_DIR . 'rest.php';

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once MDIO_CONTENT_DIR . 'cli.php';
}
