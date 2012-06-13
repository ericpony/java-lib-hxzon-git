

zul.mesh.Auxhead = zk.$extends(zul.mesh.HeadWidget, {
	
	getZclass: function () {
		return this._zclass == null ? "z-auxhead" : this._zclass;
	}
});
