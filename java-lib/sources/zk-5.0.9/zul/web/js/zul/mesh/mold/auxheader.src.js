
function (out) {
	out.push('<th', this.domAttrs_(), '><div id="', this.uuid, '-cave" class="',
	this.getZclass(), '-cnt"', this.domTextStyleAttr_(), '>', this.domContent_());
	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);
	out.push('</div></th>');
}
