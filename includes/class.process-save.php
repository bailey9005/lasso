<?php

/**
*
*	Main class responsible for saving the post object
*
*	@since 1.0
*/
class lassoProcessSaving {

	function __construct(){

		add_action( 'wp_ajax_process_save_content', 				array($this, 'process_save_content' ));
		add_action( 'wp_ajax_process_publish_content', 				array($this, 'process_save_content' ));

	}

	/**
	*
	*	Process the post save
	*
	*	@since 1.0
	*/
	function process_save_content(){

		check_ajax_referer('lasso_editor','nonce'); 

		if ( isset( $_POST['post_id'] ) ) {

			// only run for logged in users and check caps
			if( !lasso_editor_user_can_edit() )
				return;

			// main variables being passed through include the postid and content
			$postid = isset( $_POST['post_id'] ) ? $_POST['post_id'] : null;
			$content = isset( $_POST['content'] ) ? $_POST['content'] : null;

			$save_to_post_disabled = lasso_editor_get_option('post_save_disabled','lasso_editor_advanced');

			if ( isset( $_POST['action'] ) && $_POST['action'] == 'process_save_content' ) {

				if ( 'off' == $save_to_post_disabled || empty( $save_to_post_disabled ) ) {

					$args = array(
						'ID'           => (int) $postid,
			  			'post_content' => $content
					);
					wp_update_post( $args );

				}

				// run save action
				do_action( 'lasso_post_saved', $postid, $content, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			} elseif ( isset( $_POST['action'] ) && $_POST['action'] == 'process_publish_content' ) {

				if ( 'off' == $save_to_post_disabled || empty( $save_to_post_disabled ) ) {

					$args = array(
						'ID'           => (int) $postid,
			  			'post_content' => $content,
			  			'post_status'	=> 'publish'
					);
					wp_update_post( $args );

				}

				do_action( 'lasso_post_published', $postid, $content, get_current_user_ID() );

				// send back success
				wp_send_json_success();

			}

		}
		die();
	}


}
new lassoProcessSaving;



