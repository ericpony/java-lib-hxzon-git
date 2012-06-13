
function (out) {
	var tag = this.isVertical() ? 'span': 'div';
	out.push('<', tag, this.domAttrs_(), '>&nbsp;</', tag, '>');
}