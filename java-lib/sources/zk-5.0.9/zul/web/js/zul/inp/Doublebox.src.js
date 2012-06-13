

zul.inp.Doublebox = zk.$extends(zul.inp.NumberInputWidget, {
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
			raw = info.raw,
			val = parseFloat(raw),
			valstr = ''+val,
			valind = valstr.indexOf('.'),
			rawind = raw.indexOf('.');

		if (isNaN(val) || valstr.indexOf('e') < 0) {
			if (rawind == 0) {
				raw = '0' + raw;
				++rawind;
			}

			if (rawind >= 0 && raw.substring(raw.substring(rawind+1)) && valind < 0) { 
				valind = valstr.length;
				valstr += '.';
			}

			var len = raw.length,	
				vallen = valstr.length;
		
			
			if (valind >=0 && valind < rawind) {
				vallen -= valind;
				len -= rawind;
				for(var zerolen = rawind - valind; zerolen-- > 0;)
					valstr = '0' + valstr;
			}

			
			if (vallen < len) {
				for(var zerolen = len - vallen; zerolen-- > 0;)
					valstr += '0';
			}

			if (isNaN(val) || (raw != valstr && raw != '-'+valstr && raw.indexOf('e') < 0)) 
				return {error: zk.fmt.Text.format(msgzul.NUMBER_REQUIRED, value)};
		}

		if (info.divscale) val = val / Math.pow(10, info.divscale);
		return val;
	},
	_allzero: function(val) {
		for(var len= val.length; len-- > 0; )
			if (val.charAt(len) != '0') return false;
		return true;
	},
	coerceToString_: function(value) {
		var fmt = this._format,
			symbols = this._localizedSymbols,
			DECIMAL = (symbols ? symbols: zk).DECIMAL;
		return value == null ? '' : fmt ? 
			zk.fmt.Number.format(fmt, value, this._rounding, symbols) : 
			DECIMAL == '.' ? (''+value) : (''+value).replace('.', DECIMAL);
	},
	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-doublebox" + (this.inRoundedMold() ? "-rounded": "");
	},
	getAllowedKeys_: function () {
		var symbols = this._localizedSymbols;
		return this.$supers('getAllowedKeys_', arguments)
			+ (symbols ? symbols: zk).DECIMAL + 'e';
		
	},
	bind_: function(){
		this.$supers(zul.inp.Doublebox, 'bind_', arguments);
		if (this.inRoundedMold())
			zWatch.listen({onSize: this});
	},	
	unbind_: function(){
		if (this.inRoundedMold())
			zWatch.unlisten({onSize: this});
		this.$supers(zul.inp.Doublebox, 'unbind_', arguments);
	}
});
