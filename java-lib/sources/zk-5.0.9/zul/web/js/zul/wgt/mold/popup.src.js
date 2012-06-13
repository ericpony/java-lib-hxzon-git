
function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		isFrameRequired = zul.wgt.PopupRenderer.isFrameRequired();
		
	out.push('<div', this.domAttrs_(), '>');
	
	if (isFrameRequired)
		out.push('<div class="', zcls, '-tl"><div class="', 
					zcls, '-tr"></div></div>');
	else if(this._fixarrow)	
		out.push('<div id=', uuid, '-p class="z-pointer"></div>');
		
	out.push('<div id="', uuid, '-body" class="', zcls, '-cl">');
	
	if (isFrameRequired)
		out.push('<div class="', zcls, '-cr"><div class="', zcls, '-cm">');
		
	out.push('<div id="', uuid, '-cave" class="', zcls, '-cnt">');
	this.prologHTML_(out);
	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);
	this.epilogHTML_(out);
	out.push('</div></div></div>');
	
	if (isFrameRequired)
		out.push('</div><div class="', zcls, '-bl"><div class="',
					zcls, '-br"></div></div></div>');
}