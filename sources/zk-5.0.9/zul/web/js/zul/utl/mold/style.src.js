
function (out) {
	var src, v;
	
	out.push('<div style="display:none" id="', this.uuid, '">&#160;');
	if (src = this._src)
		out.push('<link id="', this.uuid, '-real" rel="stylesheet" type="text/css" href="', src, '"');
	else
		out.push('<style id="', this.uuid, '-real"');

	if (v = this._media)
		out.push(' media="', v, '"');
	out.push(this.domAttrs_({id:true}));

	if (src)
		out.push('/>');
	else {
		out.push('>');
		if (v = this._content)
			out.push(v);
		out.push('</style>');
	}
	out.push('</div>');
}
