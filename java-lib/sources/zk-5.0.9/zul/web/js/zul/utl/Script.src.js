

zul.utl.Script = zk.$extends(zk.Widget, {
	$define: {
    	
    	
		content: function (cnt) {
			if (cnt) {
				this._fn = typeof cnt == 'function' ? cnt: new Function(cnt);
				if (this.desktop) 
					this._exec();
			} else
				this._fn = null;
		},
		
		
		src: function (src) {
			if (src) {
				this._srcrun = false;
				if (this.desktop)
					this._exec();
			}
		},
		
		
		charset: null
	},

	_exec: function () {
		var pkgs = this.packages; 
		if (!pkgs) return this._exec0();

		this.packages = null; 
		zk.load(pkgs);

		if (zk.loading)
			zk.afterLoad(this.proxy(this._exec0));
		else
			this._exec0();
	},
	_exec0: function () {
		var wgt = this, fn = this._fn;
		if (fn) {
			this._fn = null; 
			zk.afterMount(function () {fn.apply(wgt);});
		}
		if (this._src && !this._srcrun) {
			this._srcrun = true; 
			zk.loadScript(this._src, null, this._charset);
		}
	},

	
	redraw: function () {
	},
	bind_: function () {
		this.$supers(zul.utl.Script, 'bind_', arguments);
		this._exec();
	}
});
