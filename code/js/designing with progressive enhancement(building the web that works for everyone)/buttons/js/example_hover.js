// Run the script on DOM ready:
$(function(){
	$('input').each(function(){
	
		//this just borrows the logic from the inputToButton script, 
		//which re-applies all of the input's classes with a -hover suffix on mouseover,
		//then removes them on mouseout (workaround for double-classing)
    	var hoverClasses = $(this).attr('class').split(' ');
    	$.each(hoverClasses,function(i){
    		hoverClasses[i]+='-hover';
    	});
    	hoverClasses = hoverClasses.join(' ');
    	
    	//apply hover classes
		$(this).hover(
    			function(){ $(this).addClass(hoverClasses); },
    			function(){ $(this).removeClass(hoverClasses); }
    		);
	})
});