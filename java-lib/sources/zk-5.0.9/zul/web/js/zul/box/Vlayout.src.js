

zul.box.Vlayout = zk.$extends(zul.box.Layout, {
	getZclass: function () {
		return this._zclass == null ? "z-vlayout" : this._zclass;
	},
	isVertical_: function () {
		return true;
	}
});