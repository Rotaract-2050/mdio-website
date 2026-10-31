<?php
/** Conversione campi SCF <-> struttura JSON identica a quella dei file in content/. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Costruisce l'oggetto JSON per una lista di campi, dai valori SCF (per nome). */
function mdio_build( $fields, $values ) {
	$out = array();
	foreach ( $fields as $f ) {
		$n = $f['n'];
		$v = is_array( $values ) && array_key_exists( $n, $values ) ? $values[ $n ] : null;
		switch ( $f['t'] ) {
			case 'text':
			case 'area':
				$s = str_replace( "\r\n", "\n", (string) $v );
				if ( '' === $s && ! empty( $f['opt'] ) ) {
					break;
				}
				$out[ $n ] = $s;
				break;
			case 'bool':
				$b = ! empty( $v ) && '0' !== $v;
				if ( ! $b && ! empty( $f['opt'] ) ) {
					break;
				}
				$out[ $n ] = $b;
				break;
			case 'num':
				if ( null === $v || '' === $v ) {
					if ( empty( $f['opt'] ) ) {
						$out[ $n ] = 0;
					}
					break;
				}
				$out[ $n ] = $v + 0;
				break;
			case 'list':
				$list = array();
				if ( is_array( $v ) ) {
					foreach ( $v as $row ) {
						$list[] = str_replace( "\r\n", "\n", (string) ( isset( $row['valore'] ) ? $row['valore'] : '' ) );
					}
				}
				if ( ! $list && ! empty( $f['opt'] ) ) {
					break;
				}
				$out[ $n ] = $list;
				break;
			case 'rep':
				$rows = array();
				if ( is_array( $v ) ) {
					foreach ( $v as $row ) {
						$rows[] = mdio_build( $f['f'], $row );
					}
				}
				if ( ! $rows && ! empty( $f['opt'] ) ) {
					break;
				}
				$out[ $n ] = $rows;
				break;
			case 'grp':
				$out[ $n ] = mdio_build_group( $f, $v );
				break;
			case 'x':
				$out[ $n ] = mdio_export_cpt( $f['cpt'] );
				break;
		}
	}
	return $out;
}

function mdio_build_group( $f, $v ) {
	$o = mdio_build( $f['f'], is_array( $v ) ? $v : array() );
	return $o ? $o : (object) array();
}

/** Legge i valori SCF (per chiave) di un contesto: pagina opzioni o post. */
function mdio_read( $fields, $ctx ) {
	$vals = array();
	foreach ( $fields as $f ) {
		if ( 'x' !== $f['t'] ) {
			$vals[ $f['n'] ] = get_field( $f['k'], $ctx );
		}
	}
	return $vals;
}

function mdio_published( $cpt ) {
	return get_posts( array(
		'post_type'      => $cpt,
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'ID' => 'ASC' ),
		'no_found_rows'  => true,
	) );
}

function mdio_export_cpt( $cpt ) {
	$fields = mdio_cpts()[ $cpt ]['fields'];
	$list   = array();
	foreach ( mdio_published( $cpt ) as $p ) {
		$list[] = mdio_build( $fields, mdio_read( $fields, $p->ID ) );
	}
	return $list;
}

/** Tutti i documenti, con le chiavi usate dall'endpoint e dai file di content/. */
function mdio_export_all() {
	$all = array();
	foreach ( mdio_docs() as $slug => $d ) {
		$all[ $slug ] = mdio_build( $d['fields'], mdio_read( $d['fields'], $d['ctx'] ) );
	}
	$dist = array();
	$f    = mdio_cpts()['mdio_distretto']['fields'];
	foreach ( mdio_published( 'mdio_distretto' ) as $p ) {
		$doc                 = mdio_build( $f, mdio_read( $f, $p->ID ) );
		$dist[ 'distretti/' . $doc['number'] ] = $doc;
	}
	ksort( $dist, SORT_STRING );
	return $all + $dist;
}
