



(function () {
	
	var _tt_inf, _tt_tmClosing, _tt_tip, _tt_ref;
	function _tt_beforeBegin(ref) {
		if (_tt_tip && !_tt_tip.isOpen()) { 
			_tt_clearOpening_();
			_tt_clearClosing_();
			_tt_tip = _tt_ref = null;
		}

		var overTip = _tt_tip && zUtl.isAncestor(_tt_tip, ref);
		if (overTip) _tt_clearClosing_(); 
		return !overTip;
	}
	function _tt_begin(tip, ref, params) {
		if (_tt_tip != tip || _tt_ref != ref) {
			_tt_close_();
			_tt_inf = {
				tip: tip, ref: ref, params: params,
				timer: setTimeout(_tt_open_, params.delay !== undefined ? params.delay : zk.tipDelay)
			};
		} else
			_tt_clearClosing_();
	}
	function _tt_end(ref) {
		if (_tt_ref == ref || _tt_tip == ref) {
			_tt_clearClosing_(); 
			_tt_tmClosing = setTimeout(_tt_close_, 100);
			
		} else
			_tt_clearOpening_();
	}
	function _tt_clearOpening_() {
		var inf = _tt_inf;
		if (inf) {
			_tt_inf = null;
			clearTimeout(inf.timer);
		}
	}
	function _tt_clearClosing_() {
		var tmClosing = _tt_tmClosing;
		if (tmClosing) {
			_tt_tmClosing = null;
			clearTimeout(tmClosing);
		}
	}
	function _tt_open_() {
		var inf = _tt_inf;
		if (inf) {
			_tt_tip = inf.tip,
			_tt_ref = inf.ref;
			_tt_inf = null;

			var n = _tt_ref.$n();
			if (n && !zk(n).isRealVisible()) 
				return _tt_tip = _tt_ref = null;

			var params = inf.params,
				xy = params.x !== undefined ? [params.x, params.y]
							: zk.currentPointer;
			_tt_tip.open(_tt_ref, xy, params.position ? params.position : params.x === null ? "after_pointer" : null, {sendOnOpen:true});
		}
	}
	function _tt_close_() {
		_tt_clearOpening_();
		_tt_clearClosing_();

		var tip = _tt_tip;
		if (tip) {
			_tt_tip = _tt_ref = null;
			tip.close({sendOnOpen:true});
		}
	}
	function _setCtrlKeysErr(msg) {
		zk.error("setCtrlKeys: " + msg);
	}


zul.Widget = zk.$extends(zk.Widget, {
	
	getContext: function () {
		return this._context;
	},
	
	
	setContext: function (context) {
		if (zk.Widget.isInstance(context))
			context = 'uuid(' + context.uuid + ')';
		this._context = context;
		return this;
	},
	
	getPopup: function () {
		return this._popup;
	},
	
	
	setPopup: function (popup) {
		if (zk.Widget.isInstance(popup))
			popup = 'uuid(' + popup.uuid + ')';
		this._popup = popup;
		return this;
	},
	
	getTooltip: function () {
		return this._tooltip;
	},
	
	
	setTooltip: function (tooltip) {
		if (zk.Widget.isInstance(tooltip))
			tooltip = 'uuid(' + tooltip.uuid + ')';
		this._tooltip = tooltip;
		return this;
	},
	
	getCtrlKeys: function () {
		return this._ctrlKeys;
	},
	
	setCtrlKeys: function (keys) {
		if (this._ctrlKeys == keys) return;
		if (!keys) {
			this._ctrlKeys = this._parsedCtlKeys = null;
			return;
		}

		var parsed = [{}, {}, {}, {}, {}], 
			which = 0;
		for (var j = 0, len = keys.length; j < len; ++j) {
			var cc = keys.charAt(j); 
			switch (cc) {
			case '^':
			case '$':
			case '@':
				if (which)
					return _setCtrlKeysErr("Combination of Shift, Alt and Ctrl not supported: "+keys);
				which = cc == '^' ? 1: cc == '@' ? 2: 3;
				break;
			case '#':
				var k = j + 1;
				for (; k < len; ++k) {
					var c2 = keys.charAt(k);
					if ((c2 > 'Z' || c2 < 'A') 	&& (c2 > 'z' || c2 < 'a')
					&& (c2 > '9' || c2 < '0'))
						break;
				}
				if (k == j + 1)
					return _setCtrlKeysErr("Unexpected character "+cc+" in "+keys);

				var s = keys.substring(j+1, k).toLowerCase();
				if ("pgup" == s) cc = 33;
				else if ("pgdn" == s) cc = 34;
				else if ("end" == s) cc = 35;
				else if ("home" == s) cc = 36;
				else if ("left" == s) cc = 37;
				else if ("up" == s) cc = 38;
				else if ("right" == s) cc = 39;
				else if ("down" == s) cc = 40;
				else if ("ins" == s) cc = 45;
				else if ("del" == s) cc = 46;
				else if ("bak" == s) cc = 8;
				else if (s.length > 1 && s.charAt(0) == 'f') {
					var v = zk.parseInt(s.substring(1));
					if (v == 0 || v > 12)
						return _setCtrlKeysErr("Unsupported function key: #f" + v);
					cc = 112 + v - 1;
				} else
					return _setCtrlKeysErr("Unknown #"+s+" in "+keys);

				parsed[which][cc] = true;
				which = 0;
				j = k - 1;
				break;
			default:
				if (!which || ((cc > 'Z' || cc < 'A') 
				&& (cc > 'z' || cc < 'a') && (cc > '9' || cc < '0')))
					return _setCtrlKeysErr("Unexpected character "+cc+" in "+keys);
				if (which == 3)
					return _setCtrlKeysErr("$a - $z not supported (found in "+keys+"). Allowed: $#f1, $#home and so on.");

				if (cc <= 'z' && cc >= 'a')
					cc = cc.toUpperCase();
				parsed[which][cc.charCodeAt(0)] = true;
				which = 0;
				break;
			}
		}

		this._parsedCtlKeys = parsed;
		this._ctrlKeys = keys;
		return this;
	},

	_parsePopParams: function (txt) {
		var params = {},
			index = txt.indexOf(','),
			start = txt.indexOf('='),
			t = txt;
		if (start != -1)
			t = txt.substring(0, txt.substring(0, start).lastIndexOf(','));
		
		if (index != -1) {
			params.id = t.substring(0, index).trim();
			var t2 = t.substring(index + 1, t.length);
			if (t2)
				params.position = t2.trim();				
			
			zk.copy(params, zUtl.parseMap(txt.substring(t.length, txt.length)));
		} else
			params.id = txt.trim();
		
		if (params.x)
			params.x = zk.parseInt(params.x);
		if (params.y)
			params.y = zk.parseInt(params.y);
		if (params.delay)
			params.delay = zk.parseInt(params.delay);
		return params;
	},
	
	doClick_: function (evt, popupOnly) {
		if (!this.shallIgnoreClick_(evt) && !evt.contextSelected) {
			var params = this._popup ? this._parsePopParams(this._popup) : {},
				popup = this._smartFellow(params.id);
			if (popup) {
				evt.contextSelected = true;
				
				
				var self = this,
					xy = params.x !== undefined ? [params.x, params.y]
							: [evt.pageX, evt.pageY];
				setTimeout(function() {
					popup.open(self, xy, params.position ? params.position : null, {sendOnOpen:true});
				}, 0);
				evt.stop({dom:true});
			}
		}
		if (popupOnly !== true)
			this.$supers('doClick_', arguments);
	},
	doRightClick_: function (evt) {
		if (!this.shallIgnoreClick_(evt) && !evt.contextSelected) {
			var params = this._context ? this._parsePopParams(this._context) : {},
				ctx = this._smartFellow(params.id);
			if (ctx) {
				evt.contextSelected = true;
				
				
				var self = this,
					xy = params.x !== undefined ? [params.x, params.y]
							: [evt.pageX, evt.pageY];
				setTimeout(function() {
					ctx.open(self, xy, params.position ? params.position : null, {sendOnOpen:true}); 
				}, 0);
				evt.stop({dom:true}); 
			}
		}
		this.$supers('doRightClick_', arguments);
	},
	doTooltipOver_: function (evt) {
		if (!evt.tooltipped && _tt_beforeBegin(this)) {
			var params = this._tooltip ? this._parsePopParams(this._tooltip) : {},
				tip = this._smartFellow(params.id);
			if (tip) {
				evt.tooltipped = true;
					
				_tt_begin(tip, this, params);
			}
		}
		this.$supers('doTooltipOver_', arguments);
	},
	doTooltipOut_: function (evt) {
		_tt_end(this);
		this.$supers('doTooltipOut_', arguments);
	},
	_smartFellow: function (id) {
		return id ? id.startsWith('uuid(') && id.endsWith(')') ?
			zk.Widget.$(id.substring(5, id.length - 1)):
			this.$f(id, true): null;
	},
	
	afterKeyDown_: function (evt) {
		var keyCode = evt.keyCode, evtnm = "onCtrlKey", okcancel;
		switch (keyCode) {
		case 13: 
			var target = evt.domTarget, tn = jq.nodeName(target);
			if (tn == "textarea" || (tn == "button"
			
			&& (!target.id || !target.id.endsWith('-a')))
			|| (tn == "input" && target.type.toLowerCase() == "button"))
				return; 
			okcancel = evtnm = "onOK";
			break;
		case 27: 
			okcancel = evtnm = "onCancel";
			break;
		case 16: 
		case 17: 
		case 18: 
			return;
		case 45: 
		case 46: 
		case 8: 
			break;
		default:
			if ((keyCode >= 33 && keyCode <= 40) 
			|| (keyCode >= 112 && keyCode <= 123) 
			|| evt.ctrlKey || evt.altKey)
				break;
			return;
		}

		var target = evt.target, wgt = target;
		for (;; wgt = wgt.parent) {
			if (!wgt) return;
			if (!wgt.isListen(evtnm, {any:true})) continue;

			if (okcancel)
				break;

			var parsed = wgt._parsedCtlKeys;
			if (parsed
			&& parsed[evt.ctrlKey ? 1: evt.altKey ? 2: evt.shiftKey ? 3: 0][keyCode])
				break; 
		}

		
		
		setTimeout(function () {
			for (var w = target;; w = w.parent) {
				if (w.beforeCtrlKeys_ && w.beforeCtrlKeys_(evt))
					return;
				if (w == wgt) break;
			}
			wgt.fire(evtnm, zk.copy({reference: target}, evt.data));
		}, 0);

		evt.stop();
		if (jq.nodeName(evt.domTarget, "select"))
			evt.stop({dom:true, revoke: true}); 

		
		if (zk.ie && keyCode == 112) {
			zk._oldOnHelp = window.onhelp;
			window.onhelp = function () {return false;}
			setTimeout(function () {window.onhelp = zk._oldOnHelp; zk._oldOnHelp = null;}, 200);
		}
		return true; 
	},
	
	beforeCtrlKeys_: function (evt) {
	}
},{
	
	getOpenTooltip: function () {
		return _tt_tip && _tt_tip.isOpen() ? _tt_tip: null;
	}
});

})();