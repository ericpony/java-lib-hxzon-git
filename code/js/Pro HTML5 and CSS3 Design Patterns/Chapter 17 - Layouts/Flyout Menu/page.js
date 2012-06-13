
$(document).ready(function(e){
	
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
	
});
