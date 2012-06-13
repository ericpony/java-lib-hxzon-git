
function (out) {
	out.push('<div', this.domAttrs_(), '>');
	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);
	if (this._comment)
		out.push('<!--\n');
	if ((w=this._xcnt) && !jq.isArray(w)) 
		out.push(w); 
	if (this._comment)
		out.push('\n-->');
	out.push('</div>');
}
