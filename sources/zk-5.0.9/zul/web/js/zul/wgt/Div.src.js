

zul.wgt.Div = zk.$extends(zul.Widget, {
	$define: {
		
		
		align: function (v) {
			var n = this.$n();
			if (n)
				n.align = v;
		}
	},
	
	domAttrs_: function(no) {
		var align = this._align,
			attr = this.$supers('domAttrs_', arguments);
		return align != null ? attr + ' align="' + align + '"' : attr;
	}
});
