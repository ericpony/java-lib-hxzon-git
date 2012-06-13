/**
 * --------------------------------------------------------------------
 * jQuery selectmenu plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */
$.fn.selectmenu = function(settings){

	return $(this).each(function(){
		//reference to this
		var selectElement = $(this);
		
		//config
		var o = $.extend({
			maxHeight: 300,
			format: function(text){return text;}
		}, settings);
		
		//add role to body CHECK IF IT HAS A ROLE FIRST
		$('body').attr('role','application');
		
		//get select ID
		var selectElementId = selectElement.attr('id');
		
		//get initial selected index
		var initialSelectedIndex = selectElement[0].selectedIndex;
		
		//get the selected option's text value
		var selectedOptionText = selectElement.find('option').eq(initialSelectedIndex).text();
		var selectedOptionClass = selectElement.find('option').eq(initialSelectedIndex).attr('class') || '';
		
		//supporting regex
		var selectedOptionText = o.format(selectedOptionText);
		
		//get array of all select option classes, for quick removal
		var allOptionClasses = selectElement.find('option')
			//convert option classes to array
			.map(function(){ return $(this).attr('class') })
			//join array into string of classes separated by a space
			.get().join(' ');
			
		//create IDs for button, menu
		var buttonID = selectElement.attr('id') + '-button';
		var menuID = selectElement.attr('id') + '-menu';

		//create empty menu button 
		var button = $('<a class="custom-select" id="'+ selectElementId +'-button" role="button" href="#" aria-haspopup="true" aria-owns="'+ selectElementId +'-menu"></a>');
		
		//menu icon			
		var selectmenuStatus = $('<span class="custom-select-status">'+ selectedOptionText +'</span>').appendTo(button);
		var selectmenuIcon = $('<span class="custom-select-button-icon"></span>').appendTo(button);
		var roleText = $('<span class="custom-select-roletext"> select</span>').appendTo(button);
		
		//add selected option class
		button.addClass(selectedOptionClass);
		
		//insert button after select
		button.insertAfter(selectElement);
		
		//transfer tabindex from select, if it has one
		if(selectElement.is('[tabindex]')){ 
			button.attr('tabindex', selectElement.attr('tabindex')); 
		}
			
		//associate form label to new button
		$('label[for='+selectElement.attr('id')+']')
			.attr('for', buttonID)
			.bind('click', function(){
				button.focus();
				return false;
			});	
		
		//create menu ul
		var menu = $('<ul class="custom-select-menu" id="'+ selectElementId +'-menu" role="listbox" aria-hidden="true" aria-labelledby="'+ selectElementId +'-button"></ul>');
				
				
		//find all option elements in selectElement
		selectElement.find('option')
			//iterate through each option element, tracking the index
			.each(function(index){
				//create li with option's text and class attribute 
				var li = $('<li class="'+ $(this).attr('class') +'"><a href="#" tabindex="-1" role="option" aria-selected="false">'+  o.format($(this).text()) +'</a></li>');

				//check if option is selected
				if(index == initialSelectedIndex){
					//add selected attributes
					li.addClass('selected')
						.attr('aria-selected',true);
				}
				//append li to menu
				li.appendTo(menu);	
			});  			
			
		//append menu to end of page (still visual)		
		menu.appendTo('body');
		
		
		//set height of menu, if needed for overflow (in book, we can hardcode maxHeight to 300 here)
		if(menu.outerHeight() > o.maxHeight){
			menu.height(o.maxHeight);
		}
			
		//hide menu
		menu.addClass('custom-select-menu-hidden');	

			
			
			//EVENTS
			
		
			//custom events

		//custom show event
		menu.bind('show',function(){
			$(this)
				//reappend to body
				.appendTo('body')
				//remove hidden class
				.removeClass('custom-select-menu-hidden')
				//remove aria hidden attribute
				.attr('aria-hidden', false)
				//position the menu under the button
				.css({
					top: button.offset().top + button.height(),
					left: button.offset().left
				})
				//send focus to the selected option
				.find('.selected a').eq(0).focus();
			
				//add open class from button
			button.addClass('custom-select-open');	
		});
		
		

		
		//custom hide event
		menu.bind('hide',function(){
			//remove open class from button
			button.removeClass('custom-select-open');
			
			$(this)
				//remove hidden class
				.addClass('custom-select-menu-hidden')
				//remove aria hidden attribute
				.attr('aria-hidden', true);
		});
		
		//
		menu.bind('toggle', function(){
			//if the menu is hidden show it
			if(menu.is(':hidden')){
				menu.trigger('show');
			}
			else{
				menu.trigger('hide');
			}	
		});
		

		
		//event to update select menu with current selection (proxy to select)
		menu.find('a').bind('select',function(){		
			
			//deselect previous option in menu
			menu
				.find('li.selected')
				.removeClass('selected')
				.attr('aria-selected', false);
						
			//get new selected li's class attribute
			var newListItemClass = $(this).parent().attr('class');
			
			//update button icon class to match this li
			button.removeClass(allOptionClasses).addClass( newListItemClass );	
			
			//update button text this anchor's content
			selectmenuStatus.html( $(this).html() );
			
			//update this list item's selected attributes 
			$(this)
				.parent()
				.addClass('selected')
				.attr('aria-selected', true);
			
			//hide menu
			menu.trigger('hide');
				
			var changed = false;
				
			//update the native select with the new selection
			if(selectElement[0].selectedIndex != menu.find('a').index(this)){
				changed = true;
			}
			
			selectElement[0].selectedIndex = menu.find('a').index(this);
					
			if(changed){ $(this).trigger('change'); }
		});
		

		
		
	//specific events
		
		
			//apply click to button	
		button.mousedown(function(){
			menu.trigger('toggle');
			return false;	
		});
		
		
	
		
		//disable click event (use mousedown/up instead)
		button.click(function(){ return false; });
		
		
		//apply mouseup event to menu, for making selections	
		//allows us to drag and release
		menu.find('a').mouseup(function(event){
			$(this).trigger('select');
			//prevent browser scroll
			return false;
		});




		
		//bind click to document for hiding menu
		$(document).click(function(){ menu.trigger('hide'); });
		
		


		//hover and focus states
		menu.find('a').bind('mouseover focus',function(){ 
				//remove class from previous hover-focused option
				menu.find('.hover-focus').removeClass('hover-focus');
				//add class to this option 
				$(this).parent().addClass('hover-focus'); 
			})
			.bind('mouseout blur',function(){ 
				//remove class from this option
				$(this).parent().removeClass('hover-focus'); 
			});
			
			
			
		//keyboard events	
			
		
		//keydown events for menu
		menu.keydown(function(event){
			//switch logic based on which key was pressed
			switch(event.keyCode){
				//up or left arrow keys
				case 37:
				case 38:
					//if there's a previous option, focus it
					if( $(event.target).parent().prev().length  ){
						$(event.target).parent().prev().find('a').eq(0).focus();
					}	
					//prevent native scroll
					return false;
				break;
				//down or right arrow keys
				case 39:
				case 40:
					//if there's a next option, focus it
					if( $(event.target).parent().next().length ){
						$(event.target).parent().next().find('a').eq(0).focus();
					}	
					//prevent native scroll
					return false;
				break;
				//if enter or space is pressed in menu, trigger mouseup
				case 13:
				case 32:
					 $(event.target).trigger('select'); //should trigger select
					 button.eq(0).focus(); 
					 return false;
				break;
				//tab returns focus to the menu button, and then automatically shifts focus to the next focusable element on the page
				case 9:
					 menu.trigger('hide');
					 button.eq(0).focus(); 
				break;	 
			}
		
		});
		
		
	
		//if enter or space is pressed in menu, trigger mousedown
		button.keydown(function(event){
			//find selected list item in menu
			var currentSelectedLi = menu.find('li').eq( $('select')[0].selectedIndex );
			//handle different key events
			switch(event.keyCode){
				//up or left arrow keys
				case 37:
				case 38:
					//if there's a previous option, focus it
					if( currentSelectedLi.prev().length ){
						currentSelectedLi.prev().find('a').trigger('select');
					}		
					//prevent native scroll
					return false;
				break;
				//down or right arrow keys
				case 39:
				case 40:
					//if there's a next option, focus it
					if( currentSelectedLi.next().length ){
						currentSelectedLi.next().find('a').trigger('select');
					}	
					//prevent native scroll
					return false;
				break;
				//if enter or space is pressed in menu, trigger mousedown to select item
				case 13:
				case 32:
					menu.trigger('toggle');
					return false;
				break;	 
			}
		});
		

		
		
		/*define menu instance in select element's data*/
		selectElement.data('selectmenu', menu);
		


		//hide native select
		selectElement.addClass('select-hidden').attr('aria-hidden', true);
		
	
	});
};