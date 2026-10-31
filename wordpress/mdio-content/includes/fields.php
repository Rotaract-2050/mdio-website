<?php
/** Tipi di contenuto, pagine opzioni e gruppi di campi SCF. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const MDIO_RICH_HINT = 'Tag ammessi nel testo: &lt;em&gt;corsivo&lt;/em&gt;, &lt;strong&gt;grassetto&lt;/strong&gt;, &lt;br/&gt; per andare a capo. Non usarne altri.';

add_action( 'init', function () {
	foreach ( mdio_cpts() as $slug => $c ) {
		register_post_type( $slug, array(
			'labels'              => array(
				'name'               => $c['plural'],
				'singular_name'      => $c['singular'],
				'add_new'            => 'Aggiungi',
				'add_new_item'       => 'Aggiungi ' . strtolower( $c['singular'] ),
				'edit_item'          => 'Modifica ' . strtolower( $c['singular'] ),
				'new_item'           => 'Nuovo',
				'view_item'          => 'Visualizza',
				'search_items'       => 'Cerca',
				'not_found'          => 'Nessun elemento',
				'not_found_in_trash' => 'Nessun elemento nel cestino',
				'all_items'          => $c['plural'],
				'menu_name'          => $c['plural'],
			),
			'public'              => false,
			'publicly_queryable'  => false,
			'show_ui'             => true,
			'show_in_menu'        => 'mdio-site',
			'show_in_rest'        => true,
			'show_in_nav_menus'   => false,
			'exclude_from_search' => true,
			'has_archive'         => false,
			'rewrite'             => false,
			'supports'            => array( 'page-attributes' ), // niente titolo: si calcola dai campi; "Ordine" = menu_order
			'menu_icon'           => $c['icon'],
		) );
	}
} );

/** Nell'admin gli elenchi seguono l'ordine scelto (menu_order). */
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && array_key_exists( $q->get( 'post_type' ), mdio_cpts() ) && ! $q->get( 'orderby' ) ) {
		$q->set( 'orderby', array( 'menu_order' => 'ASC', 'ID' => 'ASC' ) );
	}
} );

/** Titolo automatico dai campi. */
function mdio_sync_title( $post_id ) {
	$type = get_post_type( $post_id );
	if ( ! $type || ! array_key_exists( $type, mdio_cpts() ) ) {
		return;
	}
	$title = mdio_auto_title( $type, $post_id );
	if ( '' === $title ) {
		$title = mdio_cpts()[ $type ]['singular'] . ' ' . $post_id;
	}
	if ( get_post_field( 'post_title', $post_id ) !== $title ) {
		wp_update_post( wp_slash( array( 'ID' => $post_id, 'post_title' => $title, 'post_name' => sanitize_title( $title ) ) ) );
	}
}
add_action( 'acf/save_post', function ( $post_id ) {
	if ( is_numeric( $post_id ) ) {
		mdio_sync_title( (int) $post_id );
	}
}, 30 );

/** Pagine opzioni: un menu "Contenuti MDIO" con una voce per documento. */
add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}
	$first = true;
	foreach ( mdio_docs() as $slug => $d ) {
		$args = array(
			'page_title'  => $d['title'],
			'menu_title'  => $d['menu'],
			'menu_slug'   => $d['slug'],
			'post_id'     => $d['ctx'],
			'capability'  => 'edit_posts',
			'update_button' => 'Salva modifiche',
			'updated_message' => 'Modifiche salvate',
		);
		if ( $first ) {
			$args['menu_title'] = 'Contenuti MDIO';
			$args['icon_url']   = 'dashicons-edit-page';
			$args['position']   = 3;
			$args['redirect']   = false;
			acf_add_options_page( $args );
			// Il sottomenu parte dalle pagine, poi gli elenchi: la prima voce è anche il link del menu.
			$first = false;
			add_action( 'admin_menu', function () use ( $d ) {
				global $submenu;
				if ( empty( $submenu['mdio-site'] ) ) {
					return;
				}
				$pages = array( array( $d['menu'], 'edit_posts', $d['slug'], $d['title'] ) );
				$lists = array();
				foreach ( $submenu['mdio-site'] as $item ) {
					if ( $item[2] === $d['slug'] ) {
						continue;
					}
					if ( 0 === strpos( $item[2], 'edit.php' ) ) {
						$lists[] = $item;
					} else {
						$pages[] = $item;
					}
				}
				$submenu['mdio-site'] = array_merge( $pages, $lists ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
			}, 999 );
		} else {
			$args['parent_slug'] = 'mdio-site';
			acf_add_options_sub_page( $args );
		}
	}
} );

function mdio_acf_fields( $fields, $top = true ) { // $top: true = un tab per sezione
	$out     = array();
	$prevtab = null;
	foreach ( $fields as $f ) {
		if ( $top ) {
			$tab = isset( $f['tab'] ) ? $f['tab'] : $f['l'];
			if ( $tab !== $prevtab ) {
				$out[]   = array(
					'key'       => $f['k'] . '__tab',
					'label'     => $tab,
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				);
				$prevtab = $tab;
			}
		}
		$out[] = mdio_acf_field( $f );
	}
	return $out;
}

function mdio_acf_field( $f ) {
	$instr = isset( $f['h'] ) ? esc_html( $f['h'] ) : '';
	if ( ! empty( $f['rich'] ) ) {
		$instr = trim( $instr . ' ' . MDIO_RICH_HINT );
	}
	$a = array(
		'key'          => $f['k'],
		'label'        => $f['l'],
		'name'         => $f['n'],
		'instructions' => $instr,
		'required'     => 0,
	);
	switch ( $f['t'] ) {
		case 'text':
			$a['type'] = 'text';
			break;
		case 'area':
			$a['type']      = 'textarea';
			$a['rows']      = 5;
			$a['new_lines'] = '';
			break;
		case 'bool':
			$a['type']          = 'true_false';
			$a['ui']            = 1;
			$a['ui_on_text']    = 'Sì';
			$a['ui_off_text']   = 'No';
			$a['default_value'] = 0;
			break;
		case 'num':
			$a['type'] = 'number';
			$a['step'] = 1;
			break;
		case 'list':
			$a['type']         = 'repeater';
			$a['layout']       = 'table';
			$a['button_label'] = 'Aggiungi';
			$a['sub_fields']   = array(
				array(
					'key'   => $f['k'] . '_valore',
					'label' => $f['item'],
					'name'  => 'valore',
					'type'  => 'text',
				),
			);
			break;
		case 'rep':
			$a['type']         = 'repeater';
			$a['layout']       = isset( $f['layout'] ) ? $f['layout'] : 'block';
			$a['button_label'] = 'Aggiungi ' . strtolower( isset( $f['item'] ) ? $f['item'] : 'riga' );
			$a['sub_fields']   = mdio_acf_fields( $f['f'], false );
			break;
		case 'grp':
			$a['type']       = 'group';
			$a['layout']     = 'block';
			$a['sub_fields'] = mdio_acf_fields( $f['f'], false );
			break;
		case 'x':
			$labels = array(
				'mdio_giornata'  => 'Giornate evento',
				'mdio_pacchetto' => 'Pacchetti',
				'mdio_faq'       => 'FAQ',
			);
			$a['type']    = 'message';
			$a['message'] = 'Questi contenuti si modificano dalla voce "' . $labels[ $f['cpt'] ] . '" del menu Contenuti MDIO.';
			$a['name']    = '';
			break;
	}
	return $a;
}

add_action( 'acf/include_fields', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}
	foreach ( mdio_docs() as $slug => $d ) {
		acf_add_local_field_group( array(
			'key'      => 'group_mdio_doc_' . str_replace( '-', '_', $slug ),
			'title'    => $d['title'],
			'fields'   => mdio_acf_fields( $d['fields'], true ),
			'location' => array( array( array( 'param' => 'options_page', 'operator' => '==', 'value' => $d['slug'] ) ) ),
			'style'    => 'seamless',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
		) );
	}
	foreach ( mdio_cpts() as $slug => $c ) {
		acf_add_local_field_group( array(
			'key'      => 'group_' . $slug,
			'title'    => $c['singular'],
			'fields'   => mdio_acf_fields( $c['fields'], ! empty( $c['tabs'] ) ),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => $slug ) ) ),
			'style'    => 'seamless',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
		) );
	}
} );
