
function (out) {
	if (this.treerow) this.treerow.redraw(out);
	if (this.treechildren) this.treechildren.redraw(out);
}
