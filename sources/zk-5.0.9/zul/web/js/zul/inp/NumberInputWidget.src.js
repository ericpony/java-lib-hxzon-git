
(function () {
	var _allowKeys,
		globallocalizedSymbols = {};

	
	zk.load('zul.lang', function () {
		_allowKeys = "0123456789"+zk.MINUS+zk.PERCENT+(zk.groupingDenied ? '': zk.GROUPING);
	});

zul.inp.NumberInputWidget = zk.$extends(zul.inp.FormatWidget, {
	$define: { 
		
		
		rounding: null,
		localizedSymbols: [
			function (val) {
				if(val) {
					var ary = jq.evalJSON(val);
					if (!globallocalizedSymbols[ary[0]])
						globallocalizedSymbols[ary[0]] = ary[1];
					return globallocalizedSymbols[ary[0]];
				} 
				return val;
			},
			function () {
				var symbols = this._localizedSymbols;
				this._allowKeys = symbols ?
					"0123456789"+symbols.MINUS+symbols.PERCENT +
					(zk.groupingDenied ? '': symbols.GROUPING): null;
				this.rerender();
			}
		]
	},
	
	getAllowedKeys_: function () {
		return this._allowKeys || _allowKeys;
	},
	doKeyPress_: function(evt){
		if (!this._shallIgnore(evt, this.getAllowedKeys_()))
			this.$supers('doKeyPress_', arguments);
	}
});
})();