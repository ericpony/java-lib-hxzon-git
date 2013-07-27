
function (out) {
	var zcls = this.getZclass(),
		uuid = this.uuid,
		isRounded = this.inRoundedMold();
	if(this.isMultiline()) 
		out.push('<textarea', this.domAttrs_(), '>', this._areaText(), '</textarea>');
	else if(!isRounded)
		out.push('<input', this.domAttrs_(), '/>');
	else {
		out.push('<i', this.domAttrs_({text:true}), '>',
				'<input id="', uuid, '-real"', 'class="', zcls, '-inp"', 
				this.textAttrs_(), '/>', '<i id="', uuid, '-right-edge"',
				'class="', zcls, '-right-edge');
		
		out.push('"></i></i>');
	}
}