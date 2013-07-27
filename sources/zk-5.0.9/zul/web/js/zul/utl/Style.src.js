

zul.utl.Style = zk.$extends(zk.Widget, {
	$define: {
    	
		
		src: function () {
			this._content = null;
			this.rerender(0);
		},
		
		
		content: function () {
			this._src = null;
			this.rerender(0);
		},
		
		
		media: function (v) {
			var n = this.$n('real');
			if (n) n.media = v;
		}
	}
});
if (zk.ie < 9)
	zul.utl.Style.prototype.bind_ = function () {
		this.$supers(zul.utl.Style, 'bind_', arguments);

		
		if (this._src) {
			var self = this;
			setTimeout(function () {
				var n = self.$n('real');
				if (n) n.href = self._src;
			});
		}
	};
