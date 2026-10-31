<?php
/** wp mdio import <cartella> : carica i JSON di content/ in WordPress (idempotente). */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Valore SCF a partire dal valore JSON. */
function mdio_to_acf( $f, $v ) {
	switch ( $f['t'] ) {
		case 'text':
		case 'area':
			return null === $v ? '' : (string) $v;
		case 'bool':
			return empty( $v ) ? 0 : 1;
		case 'num':
			return null === $v ? '' : $v + 0;
		case 'list':
			$rows = array();
			foreach ( (array) $v as $s ) {
				$rows[] = array( 'valore' => (string) $s );
			}
			return $rows;
		case 'rep':
			$rows = array();
			foreach ( (array) $v as $item ) {
				$rows[] = mdio_to_acf_fields( $f['f'], $item );
			}
			return $rows;
		case 'grp':
			return mdio_to_acf_fields( $f['f'], $v );
	}
	return null;
}
function mdio_to_acf_fields( $fields, $data ) {
	$data = is_array( $data ) ? $data : array();
	$out  = array();
	foreach ( $fields as $f ) {
		if ( 'x' !== $f['t'] ) {
			$out[ $f['n'] ] = mdio_to_acf( $f, array_key_exists( $f['n'], $data ) ? $data[ $f['n'] ] : null );
		}
	}
	return $out;
}

class MDIO_CLI_Command {
	private $counts = array();

	/**
	 * Importa i JSON di content/ (site, home, apertura, shop, gratta-vinci, distretti/*).
	 *
	 * ## EXAMPLES
	 *
	 *     wp mdio import /percorso/content
	 *
	 * @param array $args Cartella dei JSON.
	 */
	public function import( $args ) {
		$dir = rtrim( $args[0], '/' );
		if ( ! is_dir( $dir ) ) {
			WP_CLI::error( "Cartella non trovata: $dir" );
		}
		foreach ( mdio_docs() as $slug => $d ) {
			$data = $this->load( "$dir/{$d['file']}.json" );
			foreach ( $d['fields'] as $f ) {
				if ( 'x' !== $f['t'] ) {
					update_field( $f['k'], mdio_to_acf( $f, isset( $data[ $f['n'] ] ) ? $data[ $f['n'] ] : null ), $d['ctx'] );
				}
			}
			$this->sync_x( $d['fields'], $data );
			WP_CLI::log( "Documento importato: $slug" );
		}

		$files = glob( "$dir/distretti/*.json" );
		sort( $files );
		$items = array();
		foreach ( $files as $file ) {
			$items[] = $this->load( $file );
		}
		$this->sync_cpt( 'mdio_distretto', $items, function ( $item, $i ) {
			return 'distretto-' . $item['number'];
		} );

		foreach ( $this->counts as $cpt => $n ) {
			WP_CLI::log( "$cpt: $n" );
		}
		WP_CLI::success( 'Import completato.' );
	}

	private function load( $file ) {
		if ( ! is_file( $file ) ) {
			WP_CLI::error( "File mancante: $file" );
		}
		$d = json_decode( file_get_contents( $file ), true );
		if ( ! is_array( $d ) ) {
			WP_CLI::error( "JSON non valido: $file" );
		}
		return $d;
	}

	/** Trova i campi di tipo x (anche dentro i gruppi) e sincronizza i relativi contenuti. */
	private function sync_x( $fields, $data ) {
		foreach ( $fields as $f ) {
			$v = isset( $data[ $f['n'] ] ) ? $data[ $f['n'] ] : null;
			if ( 'x' === $f['t'] ) {
				$this->sync_cpt( $f['cpt'], (array) $v, function ( $item, $i ) use ( $f ) {
					if ( 'mdio_giornata' === $f['cpt'] ) {
						return 'giorno-' . $item['id'];
					}
					return ( 'mdio_faq' === $f['cpt'] ? 'faq-' : 'pacchetto-' ) . ( $i + 1 );
				} );
			} elseif ( 'grp' === $f['t'] && is_array( $v ) ) {
				$this->sync_x( $f['f'], $v );
			}
		}
	}

	private function sync_cpt( $cpt, $items, $keyfn ) {
		$fields = mdio_cpts()[ $cpt ]['fields'];
		$keep   = array();
		foreach ( array_values( $items ) as $i => $item ) {
			$key   = $keyfn( $item, $i );
			$found = get_posts( array(
				'post_type'   => $cpt,
				'post_status' => 'any',
				'meta_key'    => '_mdio_key',
				'meta_value'  => $key,
				'numberposts' => 1,
				'fields'      => 'ids',
			) );
			if ( $found ) {
				$id = $found[0];
				wp_update_post( array( 'ID' => $id, 'post_status' => 'publish', 'menu_order' => $i + 1 ) );
			} else {
				$id = wp_insert_post( array(
					'post_type'   => $cpt,
					'post_status' => 'publish',
					'post_title'  => $key,
					'menu_order'  => $i + 1,
					'meta_input'  => array( '_mdio_key' => $key ),
				), true );
				if ( is_wp_error( $id ) ) {
					WP_CLI::error( $id->get_error_message() );
				}
			}
			foreach ( $fields as $f ) {
				if ( 'x' !== $f['t'] ) {
					update_field( $f['k'], mdio_to_acf( $f, array_key_exists( $f['n'], $item ) ? $item[ $f['n'] ] : null ), $id );
				}
			}
			mdio_sync_title( $id );
			$keep[] = $id;
		}
		// Rimuove i contenuti importati in passato che non sono piu' nei file.
		$old = get_posts( array(
			'post_type'    => $cpt,
			'post_status'  => 'any',
			'meta_key'     => '_mdio_key',
			'numberposts'  => -1,
			'fields'       => 'ids',
			'post__not_in' => $keep ? $keep : array( 0 ),
		) );
		foreach ( $old as $id ) {
			wp_delete_post( $id, true );
			WP_CLI::log( "Rimosso $cpt #$id (non piu' nei file)" );
		}
		$this->counts[ $cpt ] = count( $keep );
	}
}

WP_CLI::add_command( 'mdio', 'MDIO_CLI_Command' );
