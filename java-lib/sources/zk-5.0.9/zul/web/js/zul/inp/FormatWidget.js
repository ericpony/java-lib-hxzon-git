zul.inp.FormatWidget=zk.$extends(zul.inp.InputWidget,{$define:{format:function(){var a=this.getInputNode();if(a){a.value=this.coerceToString_(this._value)}}}});