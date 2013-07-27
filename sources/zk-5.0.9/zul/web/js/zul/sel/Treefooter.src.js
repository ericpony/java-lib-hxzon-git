

zul.sel.Treefooter = zk.$extends(zul.mesh.FooterWidget, {
	
	getTree: function () {
		return this.getMeshWidget();
	},
	
	getTreecol: function () {
		return this.getHeaderWidget();
	},
	
	getMaxlength: function () {
		var tc = this.getTreecol();
		return tc ? tc.getMaxlength() : 0;
	},
	
	getZclass: function () {
		return this._zclass == null ? "z-treefooter" : this._zclass;
	},
	
	domLabel_: function () {
		return zUtl.encodeXML(this.getLabel(), {maxlength: this.getMaxlength()});
	}
});
