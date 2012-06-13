

zul.grid.Foot = zk.$extends(zul.Widget, {
	
	getGrid: function () {
		return this.parent;
	},
	getZclass: function () {
		return this._zclass == null ? "z-foot" : _zclass;
	},
	
	setVflex: function (v) { 
		v = false;
		this.$super(zul.grid.Foot, 'setVflex', v);
	},
	
	setHflex: function (v) { 
		v = false;
		this.$super(zul.grid.Foot, 'setHflex', v);
	},
	deferRedrawHTML_: function (out) {
		out.push('<tr', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></tr>');
	}
});