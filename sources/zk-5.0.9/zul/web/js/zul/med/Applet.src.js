




zul.med.Applet = zk.$extends(zul.Widget, {
	$init: function() {
		this._params = {};
		this.$supers('$init', arguments);
	},

	$define: {
		
		
		code: _zkf = function () {
			this.rerender();
		},
		
		
		codebase: _zkf,
		
		
		archive: _zkf,
		
		
		mayscript: function (v) {
			var n;
			if (n = this.$n())
				n.mayscript = v;
		},
		
		
		align: function (v) {
			var n;
			if (n = this.$n())
				n.align = v;
		},
		
		
		hspace: function (v) {
			var n;
			if (n = this.$n())
				n.hspace = v;
		},
		
		
		vspace: function (v) {
			var n;
			if (n = this.$n())
				n.vspace = v;
		}
	},
	
	invoke: zk.ie ? function() {
		var n = this.$n(),
			len = arguments.length;
		if (n && len >= 1) {
			var single = len < 3,
				begin = single ? '(' : '([',
				end = single ? ')' : '])',
				expr = "n." + arguments[0] + begin;
			for (var j = 1; j < len;) {
				if (j != 1) expr += ',';
				var s = arguments[j++];
				expr += '"' + (s ? s.replace('"', '\\"'): '') + '"';
			}
			try {
				eval(expr + end); 
			} catch (e) {
				zk.error("Failed to invoke applet's method: "+expr+'\n'+e.message);
			}
		}
	}: function(){
		var n = this.$n();
		if (n && arguments.length >= 1) {
			var fn = arguments[0],
				func = n[fn];
			if (!func) {
				zk.error("Method not found: "+fn);
				return;
			}
			try {
				var args = [],
					arrayArg = [];
				if (arguments.length < 3) {
					if (arguments[1]) 
						args.push(arguments[1]);
				} else {
					for (var j = 1, len = arguments.length; j < len;) 
						arrayArg.push(arguments[j++]);
					args.push(arrayArg);
				}
				func.apply(n, args);
			} catch (e) {
				zk.error("Failed to invoke applet's method: "+fn+'\n'+e.message);
			}
		}
	},
	
	getField: function (name) {
		var n = this.$n();
		return n ? n[name]: null;
	},
	
	setField: function (name, value) {
		var n = this.$n();
		if (n)
			try {
				n[name] = value;
			} catch(e) {
				zk.error("Failed to set applet's field: "+ name+'\n'+e.message);
			}
	},
	
	setParam: function (nm, val) {
		if (arguments.length == 1) {
			val = nm[1];
			nm = nm[0];
		}
		if (val != null) this._params[nm] = val;
		else delete this._params[nm];
	},
	
	setParams: function (m) {
		this._params = m;
	},
	
	
	domAttrs_: function(no){
		return this.$supers('domAttrs_', arguments)
				+ ' code="' + (this._code || '') + '"'
				+ zUtl.appendAttr("codebase", this._codebase)
				+ zUtl.appendAttr("archive", this._archive)
				+ zUtl.appendAttr("align", this._align)
				+ zUtl.appendAttr("hspace", this._hspace)
				+ zUtl.appendAttr("vspace", this._vspace)
				+ zUtl.appendAttr("mayscript", this._mayscript);
	},
	domStyle_: function (no) {
		return this.$supers('domStyle_', arguments)
			+ "visibility:visible;"; 
	},

	_outParamHtml: function (out) {
		var params = this._params;
		for (var nm in params)
			out.push('<param name="', zUtl.encodeXML(nm), '" value="', zUtl.encodeXML(params[nm]), '"/>');
	}
});
