
function (out) {
	var zcls = this.getZclass();
	out.push('<div', this.domAttrs_(), '><div class="',
		zcls, '-body"><div ', this.domTextStyleAttr_(), 
		'class="', zcls, '-cnt">', this.domContent_(),
		'</div></div></div>');
}
