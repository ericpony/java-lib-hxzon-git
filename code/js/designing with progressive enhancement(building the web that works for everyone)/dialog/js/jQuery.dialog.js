/**
 * --------------------------------------------------------------------
 * jQuery dialog plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */
$.fn.dialog = function(settings){
	//configurable options
	var o = $.extend({
		title: 'h1,h2,h3,h4,h5,h6,legend,label,p',
		focus: 'a,input,button,select,textarea,[tabindex]',
		buttons: false
	},settings);
	//return jquery	
	return $(this).each(function(){
		//add body role
		if( !$('body').is('[role]') ){ $('body').attr('role','application'); }
		
		//close any existing dialogs
		$('#dialog').trigger('close');
		
		//create screen
		var modalScreen = $('<div class="modal-screen"><iframe src="javascript:false;"></iframe></div>');
		//reinforce some styles for IE
		modalScreen
			.css('opacity', .9)
			.height($(window).height())
			.width($(window).width())
			.children(0).css('opacity',0);
			
		//dialog wrapper
		var dialog = $('<div id="dialog" role="dialog" aria-labelledby="dialog-title""></div>');
			
		//close link
		var close = $('<a href="#" class="dialog-close" role="button" aria-controls="dialog">Close</a>')
			.appendTo(dialog);
			
		//content div, 	
		var dialogContent = $('<div class="dialog-content"></div>')
			.append(this)
			.appendTo(dialog);
					
		//specify title
		dialog.find(o.title).eq(0)
			.attr('id', 'dialog-title');
			
		//buttons with events
		if(o.buttons){
			var dialogFooter = $('<div class="dialog-footer"></div>');
			for(var name in o.buttons){
				$('<button>'+ name +'</button>')
					.click(o.buttons[name])
					.appendTo(dialogFooter);
			}
			dialogFooter.appendTo(dialog);
		}	
		
		//events
		
		//custom close event
		dialog.bind('close',function(){
			modalScreen.remove();
			dialog.remove();
			$('body').removeClass('blocked');
			$(document).unbind('keydown.dialog focus.dialog');
		});	
		
		//close button click
		close.click(function(){ 
			dialog.trigger('close'); 
			return false;
		});
		
		//close on esc key
		$(document).bind('keydown.dialog', function(ev){
			if(ev.which == 27){ dialog.trigger('close'); }
		});
		
		//keep focus inside dialog while it's open
		$(document).bind('focus.dialog', function(ev){
			if(!$(ev.target).parents('#dialog').length){ dialog.find('a,input,button,select,textarea,[tabindex]')[0].focus();  }
		});
		
		//add blocked class to body, append modal and dialog	
		$('body').addClass('blocked').append(modalScreen).append( dialog );
		
		//direct focus to title
		if(dialogContent.find(o.focus).length){
			dialogContent.find(o.focus)[0].focus();
		}
		else if(o.buttons){
			dialogFooter.find('button')[0].focus();
		}
		else{
			close[0].focus();
		}
		
	});
		
};

//utility version, for url-based dialogs
$.dialog = function(url, settings){
	var o = $.extend({
		loadingText: 'Loading...',
		complete: false
	},settings);

	//create temp loader
	$('<span tabindex="-1">'+o.loadingText+'</span>').dialog({title: 'span', focus: 'span'});
	
	//differentiate url from selector 
	var splitUrl = url.split(' ');
	var justUrl = splitUrl[0];
	splitUrl.shift();
	if(splitUrl.length){ var subset = splitUrl.join(' '); }

	$.get(justUrl,function(response){
		var response = $('<div></div>').append(response);
		if(subset != ' '){ response = response.find(subset); }
		response.dialog(settings);
		if(o.complete){o.complete(response);}
	});	
};
