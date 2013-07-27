
function (out) {
	delete this._splitterKid; 
	for (var w = this.firstChild; w; w = w.nextSibling)
		if (w.$instanceof(zul.box.Splitter)) {
			this._splitterKid = true;
			break;
		}
	this._configPack();
	
	out.push('<table', this.domAttrs_(), zUtl.cellps0, '><tr');
	
	var	v = this.getAlign();
	if (v && v != 'stretch') out.push(' valign="', zul.box.Box._toValign(v), '"');
	
	
	out.push('><td id="', this.uuid, '-frame" style="width:100%;height:100%"');
	
	if (!this._isStretchPack() && this._pack2) out.push(' align="', zul.box.Box._toHalign(this._pack2), '"');
	out.push('><table id="', this.uuid, '-real"', zUtl.cellps0, 'style="text-align:left');
	if (!this.isSizedByContent()) out.push(';table-layout:fixed');
	if (v == 'stretch') out.push(';height:100%');
	if (this._isStretchPack()) out.push(';width:100%');

	
	out.push('"><tr valign="', v && v != 'stretch' ? zul.box.Box._toValign(v) : 'top', '">');
	
	for (var w = this.firstChild; w; w = w.nextSibling)
		this.encloseChildHTML_(w, false, out);

	out.push('</tr></table></td></tr></table>');
}