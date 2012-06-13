
function (out) {
	var zcls = this.getZclass();
	out.push('<tr', this.domAttrs_({text:true}), '><td class="',
		zcls, '-img">', this.domImage_(), '</td><td class="',
		zcls, '-text">', this.domLabel_());

	var v;
	if (v = this._description)
		out.push('<br/><span class="', zcls, '-inner">',
			zUtl.encodeXML(v), '</span>');
	if (v = this._content)
		out.push('<span class="', zcls, '-cnt">', v, '</span>');

	out.push('</td></tr>');
}
