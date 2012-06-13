
function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		rg = this.getRadiogroup();
	out.push('<span', this.domAttrs_(), '>', '<input type="radio" id="', uuid,
		'-real"', this.contentAttrs_(), '/><label for="', uuid, '-real"',
		this.domTextStyleAttr_(), ' class="', zcls, '-cnt">', this.domContent_(),
		'</label>', (rg && rg._orient == 'vertical' ? '<br/>' :''), '</span>');
}