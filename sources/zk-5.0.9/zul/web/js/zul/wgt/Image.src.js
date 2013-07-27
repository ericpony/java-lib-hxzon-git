

zul.wgt.Image = zk.$extends(zul.Widget, {
	$define: {
		
		
		src: function (v) {
			var n = this.getImageNode();
			if (n) n.src = v || '';
		},
		
		
		hover: null,
		
		
		align: function (v) {
			var n = this.getImageNode();
			if (n) n.align = v || '';
		},
		
		
		hspace: function (v) {
			var n = this.getImageNode();
			if (n) n.hspace = v;
		},
		
		
		vspace: function (v) {
			var n = this.getImageNode();
			if (n) n.vspace = v;
		}
	},
	
	getImageNode: function () {
		return this.$n();
	},

	
	doMouseOver_: function () {
		var hover = this._hover;
		if (hover) {
			var img = this.getImageNode();
			if (img) img.src = hover;
		}
		this.$supers('doMouseOver_', arguments);
	},
	doMouseOut_: function () {
		if (this._hover) {
			var img = this.getImageNode();
			if (img) img.src = this._src || '';
		}
		this.$supers('doMouseOut_', arguments);
	},
	domAttrs_: function (no) {
		var attr = this.$supers('domAttrs_', arguments);
		if (!no || !no.content)
			attr += this.contentAttrs_();
		return attr;
	},
	
	contentAttrs_: function () {
		var attr = ' src="' + (this._src || '') + '"', v;
		if (v = this._align) 
			attr += ' align="' + v + '"';
		if (v = this._hspace) 
			attr += ' hspace="' + v + '"';
		if (v = this._vspace) 
			attr += ' vspace="' + v + '"';
		return attr;
	}
});
