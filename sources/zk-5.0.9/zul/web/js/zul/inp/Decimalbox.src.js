

zul.inp.Decimalbox = zk.$extends(zul.inp.NumberInputWidget, {
	$define: { 
		
		
		scale: null
	},
	onSize: function() {
		var width = this.getWidth();
		if (!width || width.indexOf('%') != -1)
			this.getInputNode().style.width = '';
		this.syncWidth();
	},

	
	syncWidth: function () {
		zul.inp.RoundUtl.syncWidth(this, this.$n('right-edge'));
	},
	coerceFromString_: function (value) {
		if (!value) return null;

		var info = zk.fmt.Number.unformat(this._format, value, false, this._localizedSymbols),
			val = new zk.BigDecimal(info.raw),
			sval = val.$toString();
		if (info.raw != sval && info.raw != '-'+sval) 
			return {error: zk.fmt.Text.format(msgzul.NUMBER_REQUIRED, value)};
		if (info.divscale) val.setPrecision(val.getPrecision() + info.divscale);
		if (this._scale > 0) 
			val = zk.fmt.Number.setScale(val, this._scale, this._rounding);
		return val;
	},
	coerceToString_: function(value) {
		var fmt = this._format;
		return value != null ? typeof value == 'string' ? value : 
			fmt ? zk.fmt.Number.format(fmt, value.$toString(), this._rounding, this._localizedSymbols)
			: value.$toLocaleString() : '';
	},
	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-decimalbox" + (this.inRoundedMold() ? "-rounded": "");
	},
	marshall_: function(val) {
		return val ? val.$toString() : val;
	},
	unmarshall_: function(val) {
		return val ? new zk.BigDecimal(val) : val; 
	},
	getAllowedKeys_: function () {
		var symbols = this._localizedSymbols;
		return this.$supers('getAllowedKeys_', arguments)
			+ (symbols ? symbols: zk).DECIMAL; 
	},
	bind_: function(){
		this.$supers(zul.inp.Decimalbox, 'bind_', arguments);
		if (this.inRoundedMold())
			zWatch.listen({onSize: this});
	},	
	unbind_: function(){
		if (this.inRoundedMold())
			zWatch.unlisten({onSize: this});
		this.$supers(zul.inp.Decimalbox, 'unbind_', arguments);
	}
});
