// Run the script on DOM ready:
$(function(){
	$('input').inputToButton();
	//add icon
	var addButton = $('button.action-add');
	
	//split at non-breaking space
	
	var splitText = addButton.html();
	if(!splitText){
		var splitText = addButton.text();
	}
	splitText = splitText.split('&nbsp;');
	
	//add text hierarchy
	addButton.html('<strong>'+splitText[0]+'</strong> '+ splitText[1]);
	
	//add icon
	$('button').prepend('<span class="icon"></span>');
});