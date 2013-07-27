
function (out) {
	out.push('<button type="', this._type, '"', this.domAttrs_());
	var tabi = this._tabindex;
	if (this._disabled) out.push(' disabled="disabled"');
	if (tabi) out.push(' tabindex="', tabi, '"');
	out.push('>', this.domContent_(), '</button>');
}