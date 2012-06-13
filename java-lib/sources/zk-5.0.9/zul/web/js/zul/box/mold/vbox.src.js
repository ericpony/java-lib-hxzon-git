
function (out) {
	delete this._splitterKid; 
	for (var w = this.firstChild; w; w = w.nextSibling)
		if (w.$instanceof(zul.box.Splitter)) {
			this._splitterKid = true;
			break;
		}
	this._configPack();
	
	out.push('<table', this.domAttrs_(), zUtl.cellps0, '><tr');
	
	if (!this._isStretchPack() && this._pack2) out.push(' valign="', zul.box.Box._toValign(this._pack2), '"');
	out.push('><td id="', this.uuid, '-frame" style="width:100%');
	
	
	
	if (zk.ie || zk.safari) out.push(';height:100%');
	out.push('"');
	
	var v = this.getAlign();
	if (v && v != 'stretch') out.push(' align="', zul.box.Box._toHalign(v), '"');
	out.push('><table id="', this.uuid, '-real"', zUtl.cellps0, 'style="text-align:left');
	if (v == 'stretch' || (zk.safari && (v == null || v == 'start'))) out.push(';width:100%');
	if (this._isStretchPack()) out.push(';height:100%');
	out.push('">');

	for (var w = this.firstChild; w; w = w.nextSibling)
		this.encloseChildHTML_(w, false, out);

	out.push('</table></td></tr></table>');
}