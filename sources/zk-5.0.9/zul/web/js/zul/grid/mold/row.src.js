
function (out) {
	out.push('<tr', this.domAttrs_(), '>');
	var	zcls = this.getZclass();
	for (var j = 0, w = this.firstChild; w; w = w.nextSibling, j++)
		this.encloseChildHTML_({child:w, index: j, zclass: zcls, cls: 'z-overflow-hidden', out: out});
	out.push('</tr>');	
}
