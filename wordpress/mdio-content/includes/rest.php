<?php
/** GET /wp-json/mdio/v1/content */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'mdio/v1', '/content', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$res = new WP_REST_Response( mdio_export_all() );
			$res->header( 'Cache-Control', 'no-cache, must-revalidate, max-age=0' );
			return $res;
		},
	) );
} );
