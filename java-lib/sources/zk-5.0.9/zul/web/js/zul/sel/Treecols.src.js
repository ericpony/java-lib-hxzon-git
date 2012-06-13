

zul.sel.Treecols = zk.$extends(zul.mesh.HeadWidget, {
	
	getTree: function () {
		return this.parent;
	},
	setVisible: function (visible) {
		if (this._visible != visible) {
			this.$supers('setVisible', arguments);
			this.getTree().rerender();
		}
	},
	getZclass: function () {
		return this._zclass == null ? "z-treecols" : this._zclass;
	}
});
