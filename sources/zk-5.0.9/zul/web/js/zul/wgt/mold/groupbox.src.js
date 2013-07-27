
function (out, skipper) {
	out.push('<fieldset', this.domAttrs_(), '>');
	
	var cap = this.caption;
	if (cap) cap.redraw(out);

	this._redrawCave(out, skipper);

	out.push('</fieldset>');
}