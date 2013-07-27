




zul.utl.Iframe = zk.$extends(zul.Widget, {
	_scrolling: "auto",

	$define: {
		src: function (v) {
			var n = this.$n();
			if (n) n.src = v || '';
		},
		
		
		scrolling: function (v) {
			if (!v) this._scrolling = v = "auto";
			var n = this.$n();
			if (n) {
				if (zk.ie || zk.safari)
					this.rerender();
				else
					n.scrolling = v;
			}
		},
		
		
		align: function (v) {
			var n = this.$n();
			if (n) n.align = v || '';
		},
		
		
		name: function (v) {
			var n = this.$n();
			if (n) n.name = v || '';
		},
		
		
		autohide: function (v) {
			var n = this.$n();
			if (n) jq(n).attr('z_autohide', v);
		}
	},
	
	bind_: function (desktop, skipper, after) {
		this.$supers(zul.utl.Iframe, 'bind_', arguments);
		if (this._src) {
			var self = this;
			after.push(function () {self.$n().src = self._src;});
		}
	},
	domAttrs_: function(no){
		var attr = this.$supers('domAttrs_', arguments)
				+ ' src="'+zjq.src0+'" frameborder="0"',
			v = this._scrolling;
		if ("auto" != v)
			attr += ' scrolling="' + ('true' == v ? 'yes': 'false' == v ? 'no': v) + '"';
		if (v = this._align) 
			attr += ' align="' + v + '"';
		if (v = this._name) 
			attr += ' name="' + v + '"';
		if (v = this._autohide) 
			attr += ' z_autohide="' + v + '"';
		return attr;
	}
});
