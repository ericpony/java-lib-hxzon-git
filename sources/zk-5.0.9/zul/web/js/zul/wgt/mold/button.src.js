
function (out) {
	var zcls = this.getZclass(),
		tabi = this._tabindex,
		uuid = this.uuid;
	tabi = tabi ? ' tabindex="' + tabi + '"': '';

	var btn = '<button type="' + this._type + '" id="' + uuid + '-btn" class="' + zcls + '"',
		s = this.isDisabled();
	if (s) btn += ' disabled="disabled"';
	if (tabi && (zk.gecko || zk.safari)) btn += tabi;
	btn += '></button>';

	var wd = "100%", hgh = "100%";
	if (zk.ie && !zk.ie8) {
		
		if (!this._width) wd = "";
		if (!this._height) hgh = "";
	}
	out.push('<span', this.domAttrs_(),
			'><table id="', uuid, '-box" style="width:', wd, ';height:', hgh, '"', zUtl.cellps0,
			(tabi && !zk.gecko && !zk.safari ? tabi : ''),
			'><tr><td class="', zcls, '-tl">', (!zk.ie ? btn : ''),
			'</td><td class="', zcls, '-tm"></td>', '<td class="', zcls,
			'-tr"></td></tr>', '<tr><td class="', zcls, '-cl">',
			(zk.ie ? btn : ''),
			'</td><td class="', zcls, '-cm"',
			this.domTextStyleAttr_(), '>', this.domContent_(),
			'</td><td class="', zcls, '-cr"><div></div></td></tr>',
			'<tr><td class="', zcls, '-bl"></td>',
			'<td class="', zcls, '-bm"></td>',
			'<td class="', zcls, '-br"></td></tr></table></span>');
}