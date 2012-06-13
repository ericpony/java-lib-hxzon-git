
function (out) {
	var zcls = this.getZclass();
	out.push('<th', this.domAttrs_(), '><div id="', this.uuid, '-cave" class="',
			zcls, '-cnt"', this.domTextStyleAttr_(), '><div class="', zcls, '-sort-img"></div>', this.domContent_());
	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);
	out.push('</div></th>');	
}
