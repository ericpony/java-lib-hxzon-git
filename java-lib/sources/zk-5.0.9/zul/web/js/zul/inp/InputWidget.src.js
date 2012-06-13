



(function () {
	function _onChangeData(wgt, val, selbk) {
		var inf = {value: val,
			start: zk(wgt.getInputNode()).getSelectionRange()[0]}
		if (selbk) inf.bySelectBack =  true;
		return inf;
	}
	function _startOnChanging(wgt) {
		_stopOnChanging(wgt);
		wgt._tidChg = setTimeout(
			wgt.proxy(_onChanging), zul.inp.InputWidget.onChangingDelay);
	}
	function _stopOnChanging(wgt, onBlur) {
		if (wgt._tidChg) {
			clearTimeout(wgt._tidChg);
			wgt._tidChg = null;
		}
		if (onBlur) {
			if (zul.inp.InputWidget.onChangingForced && wgt.isListen("onChanging"))
				_onChanging.call(wgt, -1); 
			_clearOnChanging(wgt);
		}
	}
	function _clearOnChanging(wgt) {
		wgt._lastChg = wgt.valueEnter_ = wgt.valueSel_ = null;
	}
	function _onChanging(timeout) {
		
		var inp = this.getInputNode(),
			val = this.valueEnter_ || inp.value;
		if (this._lastChg != val) {
			this._lastChg = val;
			var valsel = this.valueSel_;
			this.valueSel_ = null;
			this.fire('onChanging', _onChangeData(this, val, valsel == val), 
				{ignorable:1, rtags: {onChanging: 1}}, timeout||5);
		}
	}

	var _keyIgnorable = zk.ie ? function () {return true;}:
		zk.opera ? function (code) {
			return code == 32 || code > 46; 
		}: function (code) {
			return code >= 32;
		},

		_fixInput = zk.ie ? function (wgt) { 
			setTimeout(function () { 
				if (wgt == zk.currentFocus)
					zjq.fixInput(wgt.getInputNode());
			}, 0);
		}: zk.$void;


zul.inp.Renderer = {
	
	renderSpinnerButton: function (out, wgt) {
	}
};

zul.inp.RoundUtl = {
	
	syncWidth: function (wgt, rightElem) {
		var node = wgt.$n();
		if (!zk(node).isRealVisible() || (!wgt._inplace && !node.style.width))
			return;

		var inp = wgt.getInputNode();
		
		if (!node.style.width && wgt._inplace && 
			(wgt._buttonVisible == undefined
				|| wgt._buttonVisible)) {
			node.style.width = jq.px0(this.getOuterWidth(wgt, true));
		}
		
		if (zk.ie6_ && node.style.width)
			inp.style.width = '0px';
	
		var	width = this.getOuterWidth(wgt, wgt.inRoundedMold());
		
		inp.style.width = jq.px0(zk(inp).revisedWidth(width - (rightElem ? rightElem.offsetWidth : 0)));
	},
	getOuterWidth: function(wgt, rmInplace) {
		var node = wgt.$n(),
			$n = jq(node),
			$inp = jq(wgt.getInputNode()),
			inc = wgt.getInplaceCSS(),
			shallClean = !node.style.width && wgt._inplace;
		
		if (rmInplace && shallClean) {
    		$n.removeClass(inc);
    		$inp.removeClass(inc);
		}
		var	width = zk(node).revisedWidth(
				node[zk.opera ? 'clientWidth': 'offsetWidth']) 
				+ (zk.opera ? zk(node).borderWidth(): 0);
		if (rmInplace && shallClean) {
    		$n.addClass(inc);
    		$inp.addClass(inc);
		}
		return width;
	}
	
};
var InputWidget =

zul.inp.InputWidget = zk.$extends(zul.Widget, {
	_maxlength: 0,
	_cols: 0,
	
	_type: 'text',
	$define: {
		
		
		name: function (name) {
			var inp = this.getInputNode();
			if (inp)
				inp.name = name;
		},
		
		
		disabled: function (disabled) {
			var inp = this.getInputNode();
			if (inp) {
				inp.disabled = disabled;
				var zcls = this.getZclass(),
					fnm = disabled ? 'addClass': 'removeClass';
				jq(this.$n())[fnm](zcls + '-disd');
				jq(inp)[fnm](zcls + '-text-disd');
			}
		},
		
		
		readonly: function (readonly) {
			var inp = this.getInputNode();
			if (inp) {
				_fixInput(this);

				var zcls = this.getZclass(),
					fnm = readonly ? 'addClass': 'removeClass';
				
				inp.readOnly = readonly;
				jq(this.$n())[fnm](zcls + '-real-readonly'); 
				jq(inp)[fnm](zcls + '-readonly');
				
				if (!this.inRoundedMold()) return;
				
				var btn = this.$n('btn');
				jq(btn)[fnm](zcls + '-btn-readonly');
				
				if (zk.ie6_) {
					jq(btn)[fnm](zcls + (this._buttonVisible ? '-btn-readonly':
													'-btn-right-edge-readonly'));
					jq(this.$n('right-edge'))[fnm](zcls + '-right-edge-readonly');
				}
			}
		},
		
		
		cols: function (cols) {
			var inp = this.getInputNode();
			if (inp)
				if (this.isMultiline()) inp.cols = cols;
				else inp.size = cols;
		},
		
		
		maxlength: function (maxlength) {
			var inp = this.getInputNode();
			if (inp && !this.isMultiline())
				inp.maxLength = maxlength;
		},
		
		
		tabindex: function (tabindex) {
			var inp = this.getInputNode();
			if (inp)
				inp.tabIndex = tabindex||'';
		},
		
		
		inplace: function (inplace) {
			this.rerender();
		}
	},
	
	getInplaceCSS: function () {
		return this._inplace ? this.getZclass() + '-inplace' : '';
	},
	
	select: function (start, end) {
		zk(this.getInputNode()).setSelectionRange(start, end);
	},
	
	getType: function () {
		return this._type;
	},
	
	isMultiline: function() {
		return false;
	},
	
	inRoundedMold: function(){
		return this._mold == "rounded";
	},

	
	getText: function () {
		return this.coerceToString_(this.getValue());
	},
	
	setText: function (txt) {
		this.setValue(this.coerceFromString_(txt));
	},

	
	getValue: function () {
		return this._value;
	},
	
	setValue: function (value, fromServer) {
		var vi;
		if (fromServer) this.clearErrorMessage(true);
		else {
			if (value == this._lastRawValVld)
				return; 

 			vi = this._validate(value);
 			value = vi.value;
	 	}

		_clearOnChanging(this);

		
		
		if ((!vi || !vi.error) && (fromServer || !this._equalValue(this._value, value))) {
			this._value = value;
			var inp = this.getInputNode();
			if (inp)
				this._defValue = this._lastChg = inp.value = value = this.coerceToString_(value);
		}
	},
	
	set_value: function (value, fromServer) {
		this.setValue(this.unmarshall_(value), fromServer);
	},
	
	getInputNode: _zkf = function () {
		return this.$n('real') || this.$n();
	},
	getTextNode: _zkf,
	domAttrs_: function (no) {
		var attr = this.$supers('domAttrs_', arguments);
		if (!no || !no.text)
			attr += this.textAttrs_();
		return attr;
	},
	
	textAttrs_: function () {
		var html = '', v;
		if (this.isMultiline()) {
			v = this._cols;
			if (v > 0) html += ' cols="' + v + '"';
		} else {
			html += ' value="' + this._areaText() + '"';
			html += ' type="' + this._type + '"';
			v = this._cols;
			if (v > 0) html += ' size="' + v + '"';
			v = this._maxlength;
			if (v > 0) html += ' maxlength="' + v + '"';
		}
		v = this._tabindex;
		if (v) html += ' tabindex="' + v +'"';
		v = this._name;
		if (v) html += ' name="' + v + '"';
		if (this._disabled) html += ' disabled="disabled"';
		if (this._readonly) html += ' readonly="readonly"';
		
		var s = jq.filterTextStyle(this.domStyle_({width: true, height: true, top: true, left: true}));
		if (s) html += ' style="' + s + '"';
		
		return html;
	},
	_onChanging: _onChanging,
	_areaText: function () {
		return zUtl.encodeXML(this.coerceToString_(this._value));
	},
	
	setConstraint: function (cst) {
		if (typeof cst == 'string' && cst.charAt(0) != '[')
			this._cst = new zul.inp.SimpleConstraint(cst);
		else
			this._cst = cst;
		if (this._cst) delete this._lastRawValVld; 
	},
	
	getConstraint: function () {
		return this._cst;
	},
	doMouseOut_: function () {
		this._inplaceout = true;
		this.$supers('doMouseOut_', arguments);
	},
	doMouseOver_: function () {
		this._inplaceout = false;
		this.$supers('doMouseOver_', arguments);
	},
	doFocus_: function (evt) {
		this.$supers('doFocus_', arguments);

		var inp = this.getInputNode();
		if (inp) this._lastChg = inp.value;

		if (evt.domTarget.tagName) { 
			jq(this.$n()).addClass(this.getZclass() + '-focus');
			if (this._inplace) {
				jq(this.getInputNode()).removeClass(this.getInplaceCSS());
				if (!this._inplaceout)
					this._inplaceout = true;
			}
			
			
			if (this._errbox) {
				var self = this, cstp = self._cst && self._cst._pos;
				setTimeout(function () {
					if (self._errbox)
						self._errbox.open(self, null, cstp || "end_before", 
								{dodgeRef: !cstp}); 
				});
			}
		}
	},
	doBlur_: function (evt) {
		_stopOnChanging(this, true);
		
		jq(this.$n()).removeClass(this.getZclass() + '-focus');
		if (!zk.alerting && this.shallUpdate_(zk.currentFocus)) {
			this.updateChange_();
			this.$supers('doBlur_', arguments);
		}
		if (this._inplace && this._inplaceout)
			jq(this.getInputNode()).addClass(this.getInplaceCSS());
	},

	_doSelect: function (evt) { 
		if (this.isListen('onSelection')) {
			var inp = this.getInputNode(),
				sr = zk(inp).getSelectionRange(),
				b = sr[0], e = sr[1];
			this.fire('onSelection', {start: b, end: e,
				selected: inp.value.substring(b, e)});
		}
	},
	
	shallUpdate_: function (focus) {
		return !focus || !zUtl.isAncestor(this, focus);
	},
	
	getErrorMesssage: function () {
		return this._errmsg;
	},
	
	setErrorMessage: function (msg) {
		this.clearErrorMessage(true, true);
		this._markError(msg, null, true);
	},
	
	clearErrorMessage: function (revalidate, remainError) {
		var w = this._errbox;
		if (w) {
			this._errbox = null;
			w.destroy();
		}
		if (!remainError) {			
			var zcls = this.getZclass();
			this._errmsg = null;
			jq(this.getInputNode()).removeClass(zcls + "-text-invalid");
			if(zk.ie6_ && this.inRoundedMold()) {
				jq(this.$n('btn')).removeClass(zcls + "-btn-right-edge-invalid");
				jq(this.$n('right-edge')).removeClass(zcls + "-right-edge-invalid");
			}
			
		}
		if (revalidate)
			delete this._lastRawValVld; 
	},
	
	coerceFromString_: function (value) {
		return value;
	},
	
	coerceToString_: function (value) {
		return value || '';
	},
	_markError: function (msg, val, noOnError) {
		this._errmsg = msg;
		
		var zcls = this.getZclass();
		if (this.desktop) { 
			jq(this.getInputNode()).addClass(zcls + "-text-invalid");
			if(zk.ie6_ && this.inRoundedMold()) {
				if(!this._buttonVisible)
					jq(this.$n('btn')).addClass(zcls + "-btn-right-edge-invalid");
				jq(this.$n('right-edge')).addClass(zcls + "-right-edge-invalid");
			}

			var cst = this._cst, errbox;
			if (cst != "[c") {
				if (cst && (errbox = cst.showCustomError))
					errbox = errbox.call(cst, this, msg);

				if (!errbox) this._errbox = this.showError_(msg);
			}

			if (!noOnError)
				this.fire('onError', {value: val, message: msg});
		}
	},
	
	validate_: function (val) {
		var cst;
		if (cst = this._cst) {
			if (typeof cst == "string") return false; 
			var msg = cst.validate(this, val);
			if (!msg && cst.serverValidate) return false; 
			return msg;
		}
	},
	_validate: function (value) {
		zul.inp.validating = true;
		try {
			var val = value, msg;
			if (typeof val == 'string' || val == null) {
				val = this.coerceFromString_(val);
				if (val && (msg = val.error)) {
					this.clearErrorMessage(true);
					if (this._cst == "[c") 
						return {error: msg, server: true};
					this._markError(msg, val);
					return val;
				}
			}

			
			if (!this.desktop) this._errmsg = null;
			else {
				var em = this._errmsg;
				this.clearErrorMessage(true);
				msg = this.validate_(val);
				if (msg === false) {
					this._lastRawValVld = value;
					return {value: val, server: true};
				}
				if (msg) {
					this._markError(msg, val);
					return {error: msg};
				}
				this._lastRawValVld = value;
				if (em)
					this.fire('onError', {value: val});
			}
			return {value: val};
		} finally {
			zul.inp.validating = false;
		}
	},
	_shallIgnore: function (evt, keys) {
		var code = (zk.ie||zk.opera) ? evt.keyCode : evt.charCode;
		if (!evt.altKey && !evt.ctrlKey && _keyIgnorable(code)
		&& keys.indexOf(String.fromCharCode(code)) < 0) {
			evt.stop();
			return true;
		}
	},
	
	showError_: function (msg) {
		var eb = new zul.inp.Errorbox();
		eb.show(this, msg);
		return eb;
	},
	_equalValue: function(a, b) {
		return a == b || this.marshall_(a) == this.marshall_(b);
	},
	marshall_: function(val) {
		return val;
	},
	unmarshall_: function(val) {
		return val;
	},
	
	updateChange_: function () {
		if (zul.inp.validating) return false; 

		var inp = this.getInputNode(),
			value = inp.value;
		if (value == this._lastRawValVld)
			return false; 

		var wasErr = this._errmsg,
			vi = this._validate(value);
		if (!vi.error || vi.server) {
			var upd;
			if (!vi.error) {
				
				this._lastRawValVld = inp.value = value = this.coerceToString_(vi.value);
					
					
				upd = wasErr || !this._equalValue(vi.value, this._value);
				if (upd) {
					this._value = vi.value; 
					this._defValue = value;
				}
			}
			if (upd || vi.server)
				this.fire('onChange', _onChangeData(this, this.marshall_(vi.value)),
					vi.server ? {toServer:true}: null, 90);
		}
		return true;
	},
	
	fireOnChange: function (opts) {
		this.fire('onChange', _onChangeData(this, this.marshall_(this.getValue())), opts);
	},

	_resetForm: function () {
		var inp = this.getInputNode();
		if (inp.value != inp.defaultValue) { 
			var wgt = this;
			setTimeout(function () {wgt.updateChange_();}, 0);
				
		}
	},

	
	focus_: function (timeout) {
		zk(this.getInputNode()).focus(timeout);
		return true;
	},
	domClass_: function (no) {
		var sc = this.$supers('domClass_', arguments),
			zcls = this.getZclass();
		if ((!no || !no.zclass) && this._disabled)
			sc += ' ' + zcls + '-disd';
		
		if ((!no || !no.input) && this._inplace)
			sc += ' ' + this.getInplaceCSS();
			
		
		if ((!no || !no.zclass) && this._readonly)
			sc += ' ' + zcls + '-real-readonly';
			
		return sc;
	},
	bind_: function () {
		this.$supers(InputWidget, 'bind_', arguments);
		var n = this.getInputNode(),
			zcls = this.getZclass();

		this._defValue = n.value;

		if (this._readonly)
			jq(n).addClass(zcls + '-readonly');
		
		if (this._disabled)
			jq(n).addClass(zcls + '-text-disd');
			
		this.domListen_(n, "onFocus", "doFocus_")
			.domListen_(n, "onBlur", "doBlur_")
			.domListen_(n, "onSelect");

		if (n = n.form)
			jq(n).bind("reset", this.proxy(this._resetForm));
	},
	unbind_: function () {
		this.clearErrorMessage(true);

		var n = this.getInputNode();
		this.domUnlisten_(n, "onFocus", "doFocus_")
			.domUnlisten_(n, "onBlur", "doBlur_")
			.domUnlisten_(n, "onSelect");

		if (n = n.form)
			jq(n).unbind("reset", this.proxy(this._resetForm));

		this.$supers(InputWidget, 'unbind_', arguments);
	},
	resetSize_: function(orient) {
		var n;
		if (this.$n() != (n = this.getInputNode()))
			n.style[orient == 'w' ? 'width': 'height'] = '';
		this.$supers('resetSize_', arguments);
	},
	doKeyDown_: function (evt) {
		var keyCode = evt.keyCode;
		if (this._readonly && keyCode == 8 && evt.target == this) {
			evt.stop(); 
			return;
		}
			
		if (!this._inplaceout)
			this._inplaceout = keyCode == 9;
		if (keyCode == 9 && !evt.altKey && !evt.ctrlKey && !evt.shiftKey
		&& this._tabbable) {
			var inp = this.getInputNode(),
				$inp = zk(inp),
				sr = $inp.getSelectionRange(),
				val = inp.value;
			val = val.substring(0, sr[0]) + '\t' + val.substring(sr[1]);
			inp.value = val;

			val = sr[0] + 1;
			$inp.setSelectionRange(val, val);

			evt.stop();
			return;
		}

		_stopOnChanging(this); 

		this.$supers('doKeyDown_', arguments);
	},
	doKeyUp_: function () {
		
		if (this.isMultiline()) {
			var maxlen = this._maxlength;
			if (maxlen > 0) {
				var inp = this.getInputNode(), val = inp.value;
				if (val != this._defValue && val.length > maxlen)
					inp.value = val.substring(0, maxlen);
			}
		}

		if (this.isListen("onChanging"))
			_startOnChanging(this);

		this.$supers('doKeyUp_', arguments);
	},
	afterKeyDown_: function (evt,simulated) {
		if (!simulated && this._inplace) {
			if (!this._multiline && evt.keyCode == 13) {
				var $inp = jq(this.getInputNode()), inc = this.getInplaceCSS();
				if ($inp.toggleClass(inc).hasClass(inc)) 
					$inp.zk.setSelectionRange(0, $inp[0].value.length);
			} else
				jq(this.getInputNode()).removeClass(this.getInplaceCSS());
		}
		if (evt.keyCode != 13 || !this.isMultiline())
			return this.$supers('afterKeyDown_', arguments);
	},
	beforeCtrlKeys_: function (evt) {
		this.updateChange_();
	}
},{
	
	onChangingDelay: 350,
	
	onChangingForced: true
});
})();