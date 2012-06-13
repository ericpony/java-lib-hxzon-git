

zul.wgt.Include = zk.$extends(zul.Widget, {
	$init: function () {
		this._fellows = {};
		this.$supers('$init', arguments);
	},

	$define: {
		
		
		comment: null
	},

	
	domStyle_: function (no) {
		var style = this.$supers('domStyle_', arguments);
		if (!this.previousSibling && !this.nextSibling) {
		
			if ((!no || !no.width) && !this.getWidth())
				style += 'width:100%;';
			if ((!no || !no.height) && !this.getHeight())
				style += 'height:100%;';
		}
		return style;
	},
	bind_: function () {
		this.$supers(zul.wgt.Include, "bind_", arguments);
		var ctn;
		if (ctn = this._childjs) {
			ctn();
			this._childjs = this._xcnt = null;
				
		}

		if (jq.isArray(ctn = this._xcnt)) 
			for (var n = this.$n(), j = 0; j < ctn.length; ++j)
				n.appendChild(ctn[j]);
	},
	unbind_: function () {
		if (jq.isArray(this._xcnt)) 
			for (var n = this.$n(); n.firstChild;)
				n.removeChild(n.firstChild);
		this.$supers(zul.wgt.Include, "unbind_", arguments);
	}
});
