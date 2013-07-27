
function (out) {
	out.push('<applet', this.domAttrs_(), '>');
	this._outParamHtml(out);
	out.push('</applet>');
}