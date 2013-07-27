

zul.wgt.Area = zk.$extends(zk.Widget, {
	$define: {
		
		
		shape: function (v) {
			var n = this.$n();
			if (n) n.shape = v || '';
		},
		
		
		coords: function (coords) {
			var n = this.$n();
			if (n) n.coords = v || '';
		}
	},

	
	doClick_: function (evt) {
		if (zul.wgt.Imagemap._toofast()) return;

		var area = this.id || this.uuid;
		this.parent.fire('onClick', {area: area}, {ctl:true});
		evt.stop();
	},

	domAttrs_: function (no) {
		var attr = this.$supers('domAttrs_', arguments)
			+ ' href="javascript:;"', v;
		if (v = this._coords) 
			attr += ' coords="' + v + '"';
		if (v = this._shape) 
			attr += ' shape="' + v + '"';
		return attr;
	}
});
