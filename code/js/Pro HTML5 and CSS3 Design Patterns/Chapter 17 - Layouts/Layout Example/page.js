$(document).ready(function(e){
	
	/* MENU */
	$('.menu').click(function(e){
		$('.dropdown', $(this)).toggleClass('hidden');
	});
	
	$('.menu').mouseover(function(e){
		$('.dropdown', $(this)).removeClass('hidden');
	});
	
	$('.menu').mouseout(function(e){
		$('.dropdown', $(this)).addClass('hidden');
	});
	
	$('.menu li, .menu h3').mouseover(function(e){
		$(this).addClass('hover');
	});
	$('.menu li, .menu h3').mouseout(function(e){
		$(this).removeClass('hover');
	});
	
	$('.menu li.flyout-trigger').mouseover(function(e){
		$('> .submenu', $(this)).removeClass('hidden');
	});
	
	$('.menu li.flyout-trigger').mouseout(function(e){
		$('> .submenu', $(this)).addClass('hidden');
	});
	
	/* ROLLUP */
	$('.rollup-trigger').click(function(e){
		$(this).closest('.rollup').children().not('.rollup-trigger').toggleClass('hidden');
		$(this).parent().removeClass('hidden');
	});
	
	
	/* TABS */
	$('ul.tabs li').click(function(e){
		$('ul.tabs li.selected').removeClass('selected');
		$(this).toggleClass('selected');
	});
	
	$('ul.tabs li .tab-label').mouseover(function(e){
		$(this).addClass('hover');
	});
	
	$('ul.tabs li .tab-label').mouseout(function(e){
		$(this).removeClass('hover');
	});
	
	$('ul.tabs .tab-label a').click(function(e){
		e.preventDefault();
		$(this).blur();
	});
	
	
});

