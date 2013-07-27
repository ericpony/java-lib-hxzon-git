
function (out) {
	var uuid = this.uuid, mapid = uuid + '-map';
	out.push('<span', this.domAttrs_({content:1}), '><a href="',
		this._doneURI(), '?', uuid, '" target="zk_hfr_"><img id="',
		uuid, '-real"', this.contentAttrs_(),
		'/></a><map name="', mapid, '" id="', mapid, '">');

	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);

	out.push('</map></span>');
}
