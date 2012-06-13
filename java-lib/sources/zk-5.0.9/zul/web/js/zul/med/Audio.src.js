
(function () {

	function _invoke(wgt, fn1, fn2, unbind) {
		
		if (unbind)
			_invoke2(wgt, fn1, fn2, unbind);
		else
			setTimeout(function () {
				_invoke2(wgt, fn1, fn2);
			}, 200);
	}
	function _invoke2(wgt, fn1, fn2, unbind) {
		var n = wgt.$n();
		if (n) {
			try { 
				n[fn1]();
			} catch (e) {
				try {
					n[fn2](); 
				} catch (e) {
					if (!unbind)
						jq.alert(msgzul.NO_AUDIO_SUPPORT+'\n'+e.message);
				}
			}
		}
	}

var Audio =

zul.med.Audio = zk.$extends(zul.Widget, {
	$define: {
		
		
		src: function () {
			this.rerender(); 
		},
		
		
		align: function (v) {
			var n = this.$n();
			if (n) n.align = v || '';
		},
		
		
		border: function (v) {
			var n = this.$n();
			if (n) n.border = v || '';
		},
		
		
		autostart: function (v) {
			var n = this.$n();
			if (n) n.autostart = v;
		},
		
		
		loop: function (v) {
			var n = this.$n();
			if (n) n.loop = v;
		}
	},
	
	play: function () {
		_invoke(this, 'play', 'Play');
	},
	
	stop: function (_unbind_) {
		_invoke(this, 'stop', 'Stop', _unbind_);
	},
	
	pause: function () {
		_invoke(this, 'pause', 'Pause');
	},

	unbind_: function () {
		this.stop(true);
		this.$supers(Audio, 'unbind_', arguments);
	},

	domAttrs_: function(no){
		var attr = this.$supers('domAttrs_', arguments)
				+ ' src="' + (this._src || '') + '"',
			v;
		if (v = this._align) 
			attr += ' align="' + v + '"';
		if (v = this._border) 
			attr += ' border="' + v + '"';
		attr += ' autostart="' + (this._autostart||false) + '"'; 
		if (v = this._loop) 
			attr += ' loop="' + v + '"';
		return attr;
	}
});

})();