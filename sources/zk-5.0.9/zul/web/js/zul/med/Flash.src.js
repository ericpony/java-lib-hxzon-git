

zul.med.Flash = zk.$extends(zul.Widget, {
	_wmode: 'transparent',
	_quality: 'high',
	_autoplay: true,
	_loop: false,
	_version: '6,0,0,0',

	$define: {
		
		
		version: function () {
			this.rerender();
		},
		
		
		src: function (v) {
			var n = this._embedNode();
			if (n) n.movie = n.src = v || '';
		},
		
		
		wmode: function (wmode) {
			var n = this._embedNode();
			if (n) n.wmode = v || '';
		},
		
		
		bgcolor: function (v) {
			var n = this._embedNode();
			if (n) n.bgcolor = v || '';
		},
		
		
		quality: function (v) {
			var n = this._embedNode();
			if (n) n.quality = v || '';
		},
		
		
		autoplay: function (autoplay) {
			var n = this._embedNode();
			if (n) n.autoplay = v || '';
		},
		
		
		loop: function (v) {
			var n = this._embedNode();
			if (n) n.loop = v || '';
		}
	},
	doMouseDown_: function (e) {
		
		if (zk.ie)
			this.fire('onClick', e.data, e.opts);
		this.$supers('doMouseDown_', arguments);	
	},
	
	setHeight: function (height) {
		this._height = height;
		var n = this._embedNode();
		if (n) n.height = height ? height: '';
	},
	setWidth: function (width) {
		this._width = width;
		var n = this._embedNode();
		if (n) n.width = width ? width: '';
	},

	_embedNode: function () {
		return this.$n('emb');
	}
});
