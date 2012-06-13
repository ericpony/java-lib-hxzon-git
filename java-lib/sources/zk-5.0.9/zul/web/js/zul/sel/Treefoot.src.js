

zul.sel.Treefoot = zk.$extends(zul.Widget, {
	
	getTree: function () {
		return this.parent;
	},
	getZclass: function () {
		return this._zclass == null ? "z-treefoot" : this._zclass;
	},
	
	setVflex: function (v) { 
		v = false;
		this.$super(zul.sel.Treefoot, 'setVflex', v);
	},
	
	setHflex: function (v) { 
		v = false;
		this.$super(zul.sel.Treefoot, 'setHflex', v);
	},
	deferRedrawHTML_: function (out) {
		out.push('<tr', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></tr>');
	}
});
