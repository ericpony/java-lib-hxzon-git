
function (out) {
	out.push('<span', this.domAttrs_(), '>',
		(jq.isArray(this._content) ? "":this._content), '</span>');
}