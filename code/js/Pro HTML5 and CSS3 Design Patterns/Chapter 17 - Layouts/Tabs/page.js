
$(document).ready(function(e){
	
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

