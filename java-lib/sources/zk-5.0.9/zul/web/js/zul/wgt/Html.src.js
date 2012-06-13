

zul.wgt.Html = zk.$extends(zul.Widget, {
	_content: '',
	$define: {
		
		
		content: function (v) {
			var n = this.$n();
			if (n) n.innerHTML = v|| '';
		}
	},
	bind_: function () {
		this.$supers(zul.wgt.Html, "bind_", arguments);
		if (jq.isArray(this._content)) 
			for (var ctn = this._content, n = this.$n(), j = 0; j < ctn.length; ++j)
				n.appendChild(ctn[j]);
	},
	unbind_: function () {
		if (jq.isArray(this._content)) 
			for (var n = this.$n(); n.firstChild;)
				n.removeChild(n.firstChild);
		this.$supers(zul.wgt.Html, "unbind_", arguments);
	}
});
