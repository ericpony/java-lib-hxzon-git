
function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		noCenter = this.getPosition() != zul.layout.Borderlayout.CENTER,
		pzcls = this.parent.getZclass();
	out.push('<div id="', uuid,  '">', '<div id="', uuid, '-real"',
			this.domAttrs_({id: 1}), '>');
			
	if (this._title) {
		out.push('<div id="', uuid, '-cap" class="', zcls, '-header">');
		if (noCenter) {
			out.push('<div id="', uuid, '-btn" class="', pzcls,
					'-icon ', zcls, '-colps"');
			if (!this._collapsible)
				out.push(' style="display:none;"');
			out.push('></div>');
		}
		out.push(zUtl.encodeXML(this._title), '</div>');
	}
	out.push('<div id="', uuid, '-cave" class="', zcls, '-body">');
	
	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);
	
	out.push('</div></div>');
	
	if (noCenter) {
		out.push('<div id="', uuid, '-split" class="', zcls, '-splt"><span id="'
			, uuid, '-splitbtn" class="', zcls, '-splt-btn"');
		if (!this._collapsible)
			out.push(' style="display:none;"');
		out.push('></span></div>', '<div id="', uuid, '-colled" class="', zcls,
				'-colpsd" style="display:none"><div id="',
				uuid, '-btned" class="', pzcls, '-icon ', zcls, '-exp"');
		if (!this._collapsible)
			out.push(' style="display:none;"');
				
		out.push('></div></div>');
	}
	out.push('</div>');
}