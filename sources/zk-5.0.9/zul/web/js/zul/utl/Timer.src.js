

zul.utl.Timer = zk.$extends(zk.Widget, {
	_running: true,
	_delay: 0,

	$define: {
    	
    	
		repeats: _zkf = function () {
			if (this.desktop) this._sync();
		},
		
		
		delay: _zkf,
		
		
		running: _zkf
	},
	
	play: function () {
		this.setRunning(true);
	},
	
	stop: function () {
		this.setRunning(false);
	},

	_sync: function () {
		this._stop();
		this._play();
	},
	_play: function () {
		if (this._running) {
			var fn = this.proxy(this._tmfn);
			if (this._repeats) {
				this._iid = setInterval(fn, this._delay);
				zAu.onError(this.proxy(this._onErr));
			} else
				this._tid = setTimeout(fn, this._delay);
		}
	},
	_stop: function () {
		var id = this._iid;
		if (id) {
			this._iid = null;
			clearInterval(id)
		}
		id = this._tid;
		if (id) {
			this._tid = null;
			clearTimeout(id);
		}
		zAu.unError(this.proxy(this._onErr));
	},
	_onErr: function (req, errCode) {
		if (errCode == "410" || errCode == "404")
			this._stop();
	},
	_tmfn: function () {
		if (!this._repeats) this._running = false;
		this.fire('onTimer', null, {ignorable: true});
	},

	
	redraw: function () {
	},
	bind_: function () {
		this.$supers(zul.utl.Timer, 'bind_', arguments);
		if (this._running) this._play();
	},
	unbind_: function () {
		this._stop();
		this.$supers(zul.utl.Timer, 'unbind_', arguments);
	}
});
