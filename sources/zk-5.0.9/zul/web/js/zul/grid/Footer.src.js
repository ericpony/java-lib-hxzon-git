

zul.grid.Footer = zk.$extends(zul.mesh.FooterWidget, {
	
	
	getGrid: function () {
		return this.getMeshWidget();
	},
	
	getColumn: function () {
		return this.getHeaderWidget();
	},
	getZclass: function () {
		return this._zclass == null ? "z-footer" : this._zclass;
	}
});