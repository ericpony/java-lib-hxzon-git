
function (out) {
	out.push('<div', this.domAttrs_(), '><span id="',
			this.uuid,'-img"', 'class="', this.getZclass(),'-img"></span></div>');
}