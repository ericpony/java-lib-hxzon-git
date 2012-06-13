$(function(){
	$('#option-login').click(function(){
		$.dialog( $(this).attr('href')+' #login', {
			complete: function(response){
				response.find('a.alt-option').click(function(){
					$.dialog($(this).attr('href')+' #forgot');
					return false;
				});
			}	
		});
		return false;
	});
	
});