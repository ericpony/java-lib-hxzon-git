
function (out) {
	var zcls = this.getZclass();
	out.push('<div ', this.domAttrs_(), '>', '<div class="', zcls, '-body ',
				zcls, '-', this.getAlign(), '" >', '<table id="', this.uuid,
				'-cnt" class="', zcls, '-cnt"', zUtl.cellps0, '><tbody>');
	if ('vertical' != this.getOrient()) {
		out.push("<tr>");
		for (var w = this.firstChild; w; w = w.nextSibling) {
			out.push('<td class="', zcls, '-hor">');
			w.redraw(out);
			out.push("</td>");
		}
		out.push("</tr>");
	} else {
		for (var w = this.firstChild; w; w = w.nextSibling) {
			out.push('<tr><td class="', zcls, '-ver">');
			w.redraw(out);
			out.push('</td></tr>');
		}
	}
	out.push('</tbody></table><div class="z-clear"></div></div></div>');
}
