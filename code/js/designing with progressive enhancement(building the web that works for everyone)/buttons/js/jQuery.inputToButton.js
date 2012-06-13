/*
 * --------------------------------------------------------------------
 * jQuery inputToButton plugin
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
*/
$.fn.inputToButton = function() {
  return $(this).each(function(){
    	if($(this).is('[type=button],[type=submit],[type=reset],[type=image]')){
	    	var button = $('<button type="'+ $(this).attr('type') +'">'+ $(this).val() +'</button>');
	    	button.attr({
	    		'id': $(this).attr('id'),
	    		'name': $(this).attr('name'),
	    		'class': $(this).attr('class'),
	    		'value': $(this).attr('value'),
	    		'title': $(this).attr('title')
	    	})
	    	if ($(this).data('events')) {
	    		$.each($(this).data('events'), function(eventname, bindings){ $.each(bindings, function(){ button.bind(eventname, this); }); });    	
	    	}; 

	    	//get hover classes by adding classes with -hover	
	    	var hoverClasses = $(this).attr('class').split(' ');
	    	$.each(hoverClasses,function(i){ hoverClasses[i]+='-hover'; });
	    	hoverClasses = hoverClasses.join(' ');
	    	
	    	button.hover(
    			function(){ $(this).addClass(hoverClasses); },
    			function(){ $(this).removeClass(hoverClasses); }
    		);
    		
    		$(this).replaceWith(button);
	    }	
    });
};