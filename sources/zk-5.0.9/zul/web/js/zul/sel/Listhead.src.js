

zul.sel.Listhead = zk.$extends(zul.mesh.HeadWidget, {
	
	getZclass: function () {
		return this._zclass == null ? "z-listhead" : this._zclass;
	}
});