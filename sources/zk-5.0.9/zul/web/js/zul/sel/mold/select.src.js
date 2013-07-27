
function (out) {
	out.push('<select', this.domAttrs_(), '>');
	
	for (var w = this.firstChild; w; w = w.nextSibling) {
		if (w.$instanceof(zul.sel.Option) && w.isVisible()) w.redraw(out);
	}
		
	out.push('</select>');
}