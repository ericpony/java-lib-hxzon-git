
function (out) {
    out.push('<div ', this.domAttrs_(), '>');
	for (var w = this.firstChild; w; w = w.nextSibling)
		this.encloseChildHTML_(w, out);
    out.push('</div>');
}