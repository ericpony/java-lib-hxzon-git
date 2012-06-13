/**
 * --------------------------------------------------------------------
 * jQuery tree plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */
$.fn.tooltip = function(){
	//add body role
	if( !$('body').is('[role]') ){ $('body').attr('role','application'); }
	return $(this).each(function(){
		if( $(this).is('[data-hrefpreview],[title],[href^=#]') ){
		
			//generate a unique ID for the tooltip
			var ttID = 'tooltip-'+ Math.round( Math.random() * 10000 );
			//create tooltip container
			var tooltip = $('<div class="tooltip" role="tooltip" id="'+ttID+'"></div>');			
			
			//populate tooltip with content, depending on source
			if( $(this).is('[data-hrefpreview]') ){ //use ajax to retrieve data if data-hrefpreview attr is present
				tooltip.load( $(this).attr('data-hrefpreview') );
			}
			else if( $(this).is('[href^=#]') ){ //if local anchor, grab referenced content
				tooltip.append( $( $(this).attr('href') ) );
			}
			else if( $(this).is('[title]') ){ //if title attr is present, use that
				tooltip.text( $(this).attr('title') );
			}
			
			
			//apply attrs and events to tooltipped element			
			$(this)
				.removeAttr('title') //remove redundant title attr
				.attr('aria-describedby', ttID) //associate tooltip with element for screenreaders
				.mouseover(function(e){
					tooltip
						.appendTo('body')
						.removeClass('tooltip-hidden')
						.attr('aria-hidden',false)
						.css({
							top: e.pageY - tooltip.outerHeight(),
							left: e.pageX + 20
						});
				})	
				.mouseout(function(){
					tooltip.addClass('tooltip-hidden').attr('aria-hidden',true);
				});
			
			//find an associated form field and set its describedby attr as well for a11y
			$('#' + $(this).attr('for')).attr('aria-describedby', ttID);		
			
			//append the tooltip to the page with hidden class applied
			tooltip
				.addClass('tooltip-hidden')
				.attr('aria-hidden',true)
				.appendTo('body');				
		}
	});
};