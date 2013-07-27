
function (out) {
	var tagnm = this.isPopup() ? "li" : "td";
	out.push('<',tagnm, this.domAttrs_(), '><span class="', this.getZclass(),
			'-inner">&nbsp;</span></',tagnm,'>');
}
