

zul.inp.Bandpopup = zk.$extends(zul.Widget, {
	
	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-bandpopup";
	},
	afterChildrenMinFlex_: function(orient) {
		if (orient == 'w') {
			var bandbox = this.parent,
				pp = bandbox && bandbox.$n('pp');
			if (pp) {
				pp.style.width = jq.px0(this._hflexsz);
				zk(pp)._updateProp(['width']);
			}
		}
	}
});
