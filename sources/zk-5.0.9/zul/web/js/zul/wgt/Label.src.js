

zul.wgt.Label = zk.$extends(zul.Widget, {
	_value: '',
	_maxlength: 0,

	$define: {
		
		
		value: _zkf = function () {
			var n = this.$n();
			if (n) n.innerHTML = this.getEncodedText();
		},
		
		
		multiline: _zkf,
		
		
		pre: _zkf,
		
		
		maxlength: _zkf
	},
	
	getEncodedText: function () {
		return zUtl.encodeXML(this._value, {multiline:this._multiline,pre:this._pre, maxlength: this._maxlength});
	},

	
	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-label";
	}
});
