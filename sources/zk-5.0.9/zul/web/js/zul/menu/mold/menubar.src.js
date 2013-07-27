
function (out) {
	var uuid = this.uuid;
	if ('vertical' == this.getOrient()) {
		out.push('<div', this.domAttrs_(), '><table id="', uuid, '-cave"',
				zUtl.cellps0, '>');
		for (var w = this.firstChild; w; w = w.nextSibling)
			this.encloseChildHTML_({out: out, child: w, vertical: true});
		out.push('</table></div>');
	} else {
		var zcls = this.getZclass(), scrollable;
		out.push('<div', this.domAttrs_(), '>')
		if (scrollable = this.checkScrollable()) {
			out.push('<div id="', uuid, '-left" class="', zcls, '-left"></div>',
					'<div id="', uuid, '-right" class="', zcls, '-right"></div>',
					'<div id="', uuid, '-body" class="', zcls, '-body">',
					'<div id="', uuid, '-cnt" class="', zcls, '-cnt">');
		}
		out.push('<table', zUtl.cellps0, '>', '<tr valign="bottom" id="', uuid, '-cave">');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		out.push('</tr></table>');
		if (scrollable)
			out.push('</div></div>');
		out.push('</div>');
	}
}