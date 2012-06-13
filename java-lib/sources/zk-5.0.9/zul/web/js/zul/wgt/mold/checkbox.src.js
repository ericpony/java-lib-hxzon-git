
function (out) {
	var uuid = this.uuid, zcls = this.getZclass(), content = this.domContent_();
	out.push('<span', this.domAttrs_(), '>', '<input type="checkbox" id="', uuid,
			'-real"', this.contentAttrs_(), '/><label ');
		
	
	
	
	if(!(zk.ie < 8) || jq.trim(content))
		out.push('for="', uuid, '-real"');
	
	out.push(this.domTextStyleAttr_(), 
			' class="', zcls, '-cnt">', this.domContent_(),	'</label></span>');
			
}