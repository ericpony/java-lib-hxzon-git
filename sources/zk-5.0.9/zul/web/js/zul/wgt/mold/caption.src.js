
function (out) {
	var parent = this.parent,
		uuid = this.uuid,
		cnt = this.domContent_();
	if (parent.isLegend && parent.isLegend()) {
		out.push('<legend', this.domAttrs_(), '><span id="', uuid, '-cnt">', cnt);
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		out.push('</span></legend>');
		return;
	}

	var zcls = this.getZclass(),
		puuid = parent.uuid,
		pzcls = parent.getZclass();
	out.push('<table', this.domAttrs_(), zUtl.cellps0,
			' width="100%"><tr valign="middle"><td id="', uuid, '-cnt" align="left" class="',
			zcls, '-l">', (cnt?cnt:'&nbsp;'), 
			'</td><td align="right" class="', zcls,
			'-r" id="', uuid, '-cave">');
	for (var w = this.firstChild; w; w = w.nextSibling)
		w.redraw(out);

	out.push('</td>');
	if (this._isCollapsibleVisible())
		out.push('<td width="16"><div id="', puuid, '-exp" class="',
				pzcls, '-icon ', pzcls, '-exp"></div></td>');
	if (this._isMinimizeVisible())
		out.push('<td width="16"><div id="', puuid, '-min" class="',
				pzcls, '-icon ', pzcls, '-min"></div></td>');
	if (this._isMaximizeVisible()) {
		out.push('<td width="16"><div id="', puuid, '-max" class="',
				pzcls, '-icon ', pzcls, '-max');
		if (parent.isMaximized())
			out.push(' ', pzcls, '-maximized');
		out.push('"></div></td>');
	}
	if (this._isCloseVisible())
		out.push('<td width="16"><div id="', puuid, '-close" class="',
				pzcls, '-icon ', pzcls, '-close"></div></td>');

	out.push('</tr></table>');
}