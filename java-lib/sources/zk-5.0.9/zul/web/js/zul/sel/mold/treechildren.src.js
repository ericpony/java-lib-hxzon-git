
function (out) {
	if (this.parent.$instanceof(zul.sel.Tree)) {
		out.push('<tbody id="',this.parent.uuid,'-rows" ', this.domAttrs_({id: 1}), '>');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		out.push('</tbody>');
	} else
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
}
