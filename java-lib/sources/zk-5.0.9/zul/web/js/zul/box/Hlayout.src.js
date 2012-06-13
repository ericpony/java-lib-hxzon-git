

zul.box.Hlayout = zk.$extends(zul.box.Layout, {
	isVertical_: function () {
		return false;
	},
	getZclass: function () {
		return this._zclass == null ? "z-hlayout" : this._zclass;
	}
});