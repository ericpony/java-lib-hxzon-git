
function (out) {
	out.push('<div ', this.domAttrs_(), '>');
	if (this.tabs) this.tabs.redraw(out);
	if (this.tabpanels) this.tabpanels.redraw(out);
	if (this.isVertical())
		out.push('<div class="z-clear"></div>');
	out.push("</div>");
}