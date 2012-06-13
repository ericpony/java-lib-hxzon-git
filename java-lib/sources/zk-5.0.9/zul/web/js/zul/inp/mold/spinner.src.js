
function (out) {
	var zcls = this.getZclass(),
		uuid = this.uuid,
		isRounded = this.inRoundedMold(),
		isButtonVisible = this._buttonVisible;
	
	out.push('<i', this.domAttrs_({text:true}), '>',
			'<input id="', uuid,'-real"', 'class="', zcls,'-inp');
			
	if(!isButtonVisible)
		out.push(' ', zcls, '-right-edge');
		
	out.push('"', this.textAttrs_(),'/>', '<i id="', uuid,'-btn"',
			'class="', zcls, '-btn');
	
	if (isRounded) {
		if (!isButtonVisible)
			out.push(' ', zcls, '-btn-right-edge');
		if (this._readonly)
			out.push(' ', zcls, '-btn-readonly');	
		if (zk.ie6_ && !isButtonVisible && this._readonly)
			out.push(' ', zcls, '-btn-right-edge-readonly');
	} else if (!isButtonVisible)
		out.push('" style="display:none');	
	
	out.push('">');
	
	zul.inp.Renderer.renderSpinnerButton(out, this);
	out.push('</i></i>');
	
}
