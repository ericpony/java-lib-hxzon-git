/**
 * --------------------------------------------------------------------
 * jQuery starRating plugin
 * Author: Maggie Costello Wachs maggie@filamentgroup.com, Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */
jQuery.fn.starRating = function(){
	return $(this).each(function(currentIndex){	
		if( $(this).is('[type=radio]') ){
			//save reference to input
			var input = $(this);
			
			// get the associated label using the input's id
			var label = $('label[for='+input.attr('id')+']');
			
			// add a title attribute with the label text
			label.attr('title', label.text());
			
			//save reference to currentIndex	
			label.data('index', currentIndex);		
			
			// wrap the input + label in a div 
			input.add(label).wrapAll('<div class="rating-option"></div>');
			
			// find all inputs in this set using the shared name attribute
			var radioSet = $('input[name='+input.attr('name')+']');			
					
			// toggle the 'hover' class for browsers that don't support the :hover pseudo class on labels
			label.hover(
				function(){
					radioSet.each(function(){
						var thisLabel = $('label[for='+$(this).attr('id')+']');
						if(thisLabel.data('index') <= currentIndex) { thisLabel.addClass('hover'); }
					});					
				},
				function(){
					radioSet.each(function(){ 
						$('label[for='+$(this).attr('id')+']').removeClass('hover'); 
					});	
				}
			);
			
			//bind custom event, trigger it, bind click,focus,blur events					
			input.bind('updateState', function(){	
				if ( $(this).is(':checked') ) {						
					radioSet.each(function(){
						var thisLabel = $('label[for='+$(this).attr('id')+']').removeClass('hover checked');
						if(thisLabel.data('index') <= currentIndex) {
							thisLabel.addClass('checked');
						}
					});				
				};  		
			})
			.trigger('updateState')
			.click(function(){ 
				$(this).trigger('updateState'); 
				var form = $(this).parents('form');
				$.ajax({
					type: form.attr('method'),
					url: form.attr('action'),
					data: form.serialize()
				});	
			})
			.focus(function(){ 
				label.addClass('focus'); 
			})
			.blur(function(){ 
				label.removeClass('focus'); 
			});			
		};
	});
};


	
	
