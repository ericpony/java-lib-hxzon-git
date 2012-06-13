
$(document).ready(function(e){
	$('.rollup-trigger').click(function(e){
		$(this).closest('.rollup').children().not('.rollup-trigger').toggleClass('hidden');
		$(this).parent().removeClass('hidden');
	});
});
