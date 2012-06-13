

zul.sel.Listfooter = zk.$extends(zul.mesh.FooterWidget, {
	
	
	getListbox: function () {
		return this.getMeshWidget();
	},
	
	getListheader: function () {
		return this.getHeaderWidget();
	},
	
	getMaxlength: function () {
		var lc = this.getListheader();
		return lc ? lc.getMaxlength() : 0;
	},
	
	getZclass: function () {
		return this._zclass == null ? "z-listfooter" : this._zclass;
	},
	
	domLabel_: function () {
		return zUtl.encodeXML(this.getLabel(), {maxlength: this.getMaxlength()});
	}
});
