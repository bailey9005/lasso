(function( $ ) {

	$(document).ready(function(){

		/////////////////
		/// MODAL LOGIC
		///////////////////

		// method to destroy the modal
		var destroyModal = function(){
			$('body').removeClass('lasso-modal-open');
			$('#lasso--post-settings__modal, #lasso--modal__overlay').remove();
		}

		// modal click
		$('#lasso--post-settings').live('click',function(e){

			e.preventDefault();

			// add a body class
			$('body').toggleClass('lasso-modal-open');

			// append teh modal markup ( lasso_editor_component_modal() )
			$('body').append(lasso_editor.component_modal);

			/////////////////
			/// UI SLIDER INIT AND METHODS
			///////////////////

			// return the right value
			var statusReturn = function( value ) {

				var out;

				if ( 100 == value ) {
					out = 'draft';
				} else if ( 200 == value ) {
					out = 'publish';
				} else if ( 'draft' == value ) {
					out = 100;
				} else if ( 'publish' == value ) {
					out = 200;
				}
				return out;
			}

			// init slider
		    $('#lasso--slider').slider({
		      	value:statusReturn(lasso_editor.post_status),
		      	min: 100,
		      	max: 200,
		      	step: 100,
		      	animate:'fast',
		      	slide: function( event, ui ) {
		        	$('input[name="status"]').val( statusReturn(ui.value) );

		        	$('.lasso--postsettings__footer').slideDown()

		        	if ( 100 == ui.value ) {
		        		$('.story-status').removeClass('story-status-publish').addClass('story-status-draft')
		        	} else if ( 200 == ui.value ) {
		        		$('.story-status').removeClass('story-status-draft').addClass('story-status-publish')
		        	}
		      	}
		    });
		    $('input[name="status"]').val( statusReturn( $( "#lasso--slider" ).slider('value') ) );

		    // if any changes happen then show the footer
		    $('.lasso--modal__trigger-footer').on('keyup',function(){
			  	$('.lasso--postsettings__footer').slideDown()
			});

			modalResizer()

		});

		// destroy modal if clicking close or overlay
		$('#lasso--modal__close, #lasso--modal__overlay, .lasso--postsettings-cancel').live('click',function(e){
			e.preventDefault();
			destroyModal();
		});

		/////////////////
		/// EXIT SETTINGS
		///////////////////
		$(document).keyup(function(e) {

			if ( 27 == e.keyCode ) {

				destroyModal();
			}

		});

		/////////////
		// SAVE SETTINGS
		//////////////
		var form;

		$('#lasso--postsettings__form').live('submit', function(e) {

			e.preventDefault();

			var $this = $(this);

			$(this).find('input[type="submit"]').val(lasso_editor.strings.saving);

			var data = $this.serialize();

			/////////////
			//	DO TEH SAVE
			/////////////
			$.post( lasso_editor.ajaxurl, data, function(response) {

				//console.log(response);

				if( true == response.success ) {

					$('input[type="submit"]').addClass('saved');
					$('input[type="submit"]').val(lasso_editor.strings.saved);
					location.reload();

					window.location.replace(lasso_editor.permalink);

				} else {

					alert('error');

				}


			});

		});

	});

})( jQuery );