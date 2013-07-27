
function (out) {
	out.push('<a ', this.domAttrs_(), '>', this.domContent_());

	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);

	out.push('</a>');
}
