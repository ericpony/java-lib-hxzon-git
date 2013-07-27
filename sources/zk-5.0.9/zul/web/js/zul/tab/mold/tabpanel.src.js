
function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		tabbox = this.getTabbox();
	if (tabbox.inAccordionMold()) {
		var tab = this.getLinkedTab();
		
		out.push('<div class="', zcls, '-outer" id="', uuid, '">');
		if (tab)
			tab.redraw(out);
		out.push('<div id="', uuid, '-cave"', this.domAttrs_({id:1}), '>');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		out.push('</div></div>');

	} else {
		out.push('<div', this.domAttrs_(), '>');
		if (tabbox.isHorizontal())
			out.push('<div id="', uuid, '-cave" class="', zcls, '-cnt">');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		if (tabbox.isHorizontal())
			out.push('</div>');
		out.push('</div>');
	}
}