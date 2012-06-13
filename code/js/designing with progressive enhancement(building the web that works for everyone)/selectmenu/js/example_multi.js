// Run the script on DOM ready:
$(function(){
	$('select').selectmenu({
		format: function(text){
			var pattern = /([\s\S]+)\-\- ([\s\S]+) (\([\s\S]+\))/;
			var replacement = '<span class="option-title">$1</span><span class="option-description">$2</span><span class="option-date">$3</span>';
			return text.replace(pattern, replacement);
		}
	});
});