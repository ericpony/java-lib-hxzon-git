

zul.inp.FormatWidget = zk.$extends(zul.inp.InputWidget, {
	$define: { 
		
		
		format: function () {
			var inp = this.getInputNode();
			if (inp)
				inp.value = this.coerceToString_(this._value);
		}
	}
});
