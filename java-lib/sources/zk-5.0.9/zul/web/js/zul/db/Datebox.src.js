
(function () {
	function _initPopup () {
		this._pop = new zul.db.CalendarPop();
		this._tm = new zul.db.CalendarTime();
		this.appendChild(this._pop);
		this.appendChild(this._tm);
	}
	function _reposition(db, silent) {
		if (!db.$n()) return;
		var pp = db.$n("pp"),
			inp = db.getInputNode();

		if(pp) {
			zk(pp).position(inp, "after_start");
			db._pop.syncShadow();
			if (!silent)
				zk(inp).focus();
		}
	}
	function _blurInplace(db) {
		var n;
		if (db._inplace && db._inplaceout && (n = db.$n())
		&& !jq(n).hasClass(db.getInplaceCSS())) {
			jq(n).addClass(db.getInplaceCSS());
			db.onSize();
			n.style.width = db.getWidth() || '';
		}
	}
	function _equalDate(d1, d2) {
		return (d1 == d2) || (d1 && d2 && d1.getTime() == d2.getTime());
	}
	function _prepareTimeFormat(h, m, s) {
		var o =[];
		if (h) o.push(h);
		if (m) o.push(m);
		if (s) o.push(s);
		return o.join(":");
	}
	
var globallocalizedSymbols = {},
	_quotePattern = /\'/g, 
	Datebox =

zul.db.Datebox = zk.$extends(zul.inp.FormatWidget, {
	_buttonVisible: true,
	_lenient: true,
	$init: function() {
		this.$supers('$init', arguments);
		this.afterInit(_initPopup);
		this.listen({onChange: this}, -1000);
	},

	$define: {
		
		
		buttonVisible: function (v) {
			var n = this.$n('btn'),
				zcls = this.getZclass();
			if (n) {
				if (!this.inRoundedMold()) {
					if (!this._inplace || !v)
						jq(n)[v ? 'show': 'hide']();
					else
						n.style.display = '';
					jq(this.getInputNode())[v ? 'removeClass': 'addClass'](zcls + '-right-edge');
				} else {
					var fnm = v ? 'removeClass': 'addClass';
					jq(n)[fnm](zcls + '-btn-right-edge');

					if (zk.ie6_) {
						jq(n)[fnm](zcls +
							(this._readonly ? '-btn-right-edge-readonly':'-btn-right-edge'));

						if (jq(this.getInputNode()).hasClass(zcls + "-text-invalid"))
							jq(n)[fnm](zcls + "-btn-right-edge-invalid");
					}
				}
				this.onSize();
			}
		},
		
		
		format: function () {
			if (this._pop) {
				this._pop.setFormat(this._format);
				if (this._value)
					this._value = this._pop.getTime();
			}
			var inp = this.getInputNode();
			if (inp)
				inp.value = this.getText();
		},
		
		
		constraint: function (cst) {
			if (typeof cst == 'string' && cst.charAt(0) != '[')
				this._cst = new zul.inp.SimpleDateConstraint(cst, this);
			else
				this._cst = cst;
			if (this._cst) delete this._lastRawValVld; 
			if (this._pop) {
				this._pop.setConstraint(this._constraint);
				this._pop.rerender();
			}
		},
		
		
		timeZone: function (timezone) {
			this._timezone = timezone;
			this._setTimeZonesIndex();
		},
		
		
		timeZonesReadonly: function (readonly) {
			var select = this.$n('dtzones');
			if (select) select.disabled = readonly ? "disabled" : "";
		},
		
		
		displayedTimeZones: function (dtzones) {
			this._dtzones = dtzones.split(",");
		},
		
		
		lenient: null,
		localizedSymbols: [
			function (val) {
				if(val) {
					if (!globallocalizedSymbols[val[0]])
						globallocalizedSymbols[val[0]] = val[1];
					return globallocalizedSymbols[val[0]];
				}
				return val;
			},
			function () {
				
				
				if (this._tm)
					this._tm._localizedSymbols = this._localizedSymbols;
				if (this._pop)
					this._pop.setLocalizedSymbols(this._localizedSymbols);
			}
		]
	},
	_setTimeZonesIndex: function () {
		var select = this.$n('dtzones');
		if (select && this._timezone) {
			var opts = jq(select).children('option');
			for (var i = opts.length; i--;) {
				if (opts[i].text == this._timezone) select.selectedIndex = i;
			}
		}
	},
	onSize: function () {
		var width = this.getWidth();
		if (!width || width.indexOf('%') != -1)
			this.getInputNode().style.width = '';
		this.syncWidth();
	},

	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-datebox" + (this.inRoundedMold() ? "-rounded": "");
	},
	
	getTimeFormat: function () {
	
		var fmt = this._format,
			aa = fmt.indexOf('a'),
			hh = fmt.indexOf('h'),
			KK = fmt.indexOf('K'),
			HH= fmt.indexOf('HH'),
			kk = fmt.indexOf('k'),
			mm = fmt.indexOf('m'),
			ss = fmt.indexOf('s'),
			hasAM = aa > -1,
			
			hasHour1 = (hasAM || hh) ? hh > -1 || KK > -1 : false,
			hv,
			mv = mm > -1 ? 'mm' : '',
			sv = ss > -1 ? 'ss' : '';
		
		if (hasHour1) {
			var time = _prepareTimeFormat(hh < KK ? "KK" : "hh", mv, sv);
			if (aa == -1) 
				return time;
			else if ((hh != -1 && aa < hh) || (KK != -1 && aa < KK)) 
				return 'a ' + time;
			else
				return time + ' a';
		} else
			return _prepareTimeFormat(HH < kk ? 'kk' : HH > -1 ? 'HH' : '', mv, sv);
		
	},
	
	getDateFormat: function () {
		return this._format.replace(/[ahKHksm]/g, '');
	},
	
	setOpen: function(open, _focus_) {
		var pop;
		if (pop = this._pop)
			if (open) pop.open(!_focus_);
			else pop.close(!_focus_);
	},
	isOpen: function () {
		return this._pop && this._pop.isOpen();
	},
	coerceFromString_: function (val) {
		if (val) {
			var d = new zk.fmt.Calendar().parseDate(val, this.getFormat(), !this._lenient, this._value, this._localizedSymbols);
			if (!d) return {error: zk.fmt.Text.format(msgzul.DATE_REQUIRED + (this.localizedFormat.replace(_quotePattern, '')))};
			return d;
		}
		return null;
	},
	coerceToString_: function (val) {
		return val ? new zk.fmt.Calendar().formatDate(val, this.getFormat(), this._localizedSymbols) : '';
	},
	
	syncWidth: function () {
		zul.inp.RoundUtl.syncWidth(this, this.$n('btn'));
	},
	doFocus_: function (evt) {
		var n = this.$n();
		if (this._inplace)
			n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));

		this.$supers('doFocus_', arguments);

		if (this._inplace) {
			if (jq(n).hasClass(this.getInplaceCSS())) {
				jq(n).removeClass(this.getInplaceCSS());
				this.onSize();
			}
		}
	},
	doClick_: function (evt) {
		if (this._disabled) return;
		if (this._readonly && this._buttonVisible && this._pop && !this._pop.isOpen())
			this._pop.open();
		this.$supers('doClick_', arguments);
	},
	doBlur_: function (evt) {
		var n = this.$n();
		if (this._inplace && this._inplaceout)
			n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));

		this.$supers('doBlur_', arguments);

		_blurInplace(this);
	},
	doKeyDown_: function (evt) {
		this._doKeyDown(evt);
		if (!evt.stopped)
			this.$supers('doKeyDown_', arguments);
	},
	_doKeyDown: function (evt) {
		if (jq.nodeName(evt.domTarget, 'option', 'select'))
			return;
			
		var keyCode = evt.keyCode,
			bOpen = this._pop.isOpen();
		if (keyCode == 9 || (zk.safari && keyCode == 0)) { 
			if (bOpen) this._pop.close();
			return;
		}

		if (evt.altKey && (keyCode == 38 || keyCode == 40)) {
			if (bOpen) this._pop.close();
			else this._pop.open();

			
			var opts = {propagation:true};
			if (zk.ie) opts.dom = true;
			evt.stop(opts);
			return;
		}

		
		if (bOpen && (keyCode == 13 || keyCode == 27)) { 
			if (keyCode == 13) this.enterPressed_(evt);
			else this.escPressed_(evt);
			return;
		}

		if (keyCode == 18 || keyCode == 27 || keyCode == 13
		|| (keyCode >= 112 && keyCode <= 123)) 
			return; 

		if (this._pop.isOpen()) {
			var ofs = keyCode == 37 ? -1 : keyCode == 39 ? 1 : keyCode == 38 ? -7 : keyCode == 40 ? 7 : 0;
			if (ofs)
				this._pop._shift(ofs, {silent: true});
		}
	},
	
	enterPressed_: function (evt) {
		this._pop.close();
		this.updateChange_();
		evt.stop();
	},
	
	escPressed_: function (evt) {
		this._pop.close();
		evt.stop();
	},
	afterKeyDown_: function (evt, simulated) {
		if (!simulated && this._inplace)
			jq(this.$n()).toggleClass(this.getInplaceCSS(),  evt.keyCode == 13 ? null : false);

		return this.$supers('afterKeyDown_', arguments);
	},
	bind_: function (){
		this.$supers(Datebox, 'bind_', arguments);
		var btn, inp = this.getInputNode();

		if (this._inplace)
			jq(inp).addClass(this.getInplaceCSS());

		if (btn = this.$n('btn')) {
			this._auxb = new zul.Auxbutton(this, btn, inp);
			this.domListen_(btn, 'onClick', '_doBtnClick');
		}

		zWatch.listen({onSize: this});
		this._pop.setFormat(this.getDateFormat());
	},
	unbind_: function () {
		var btn;
		if (btn = this._pop)
			btn.close(true);

		if (btn = this.$n('btn')) {
			this._auxb.cleanup();
			this._auxb = null;
			this.domUnlisten_(btn, 'onClick', '_doBtnClick');
		}

		zWatch.unlisten({onSize: this});
		this.$supers(Datebox, 'unbind_', arguments);
	},
	_doBtnClick: function (evt) {
		if (this.inRoundedMold() && !this._buttonVisible) return;
		if (!this._disabled)
			this.setOpen(!jq(this.$n("pp")).zk.isVisible(), true);
		evt.stop();
	},
	_doTimeZoneChange: function (evt) {
		var select = this.$n('dtzones'),
			timezone = select.value;
		this.updateChange_();
		this.fire("onTimeZoneChange", {timezone: timezone}, {toServer:true}, 150);
		if (this._pop) this._pop.close();
	},
	onChange: function (evt) {
		if (this._pop)
			this._pop.setValue(evt.data.value);
	},
	
	getTimeZoneLabel: function () {
		return "";
	},

	redrawpp_: function (out) {
		out.push('<div id="', this.uuid, '-pp" class="', this.getZclass(),
			'-pp" style="display:none" tabindex="-1">');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);

		this._redrawTimezone(out);
		out.push('</div>');
	},
	_redrawTimezone: function (out) {
		var timezones = this._dtzones;
		if (timezones) {
			var cls = this.getZclass();
			out.push('<div class="', cls, '-timezone">');
			out.push(this.getTimeZoneLabel());
			out.push('<select id="', this.uuid, '-dtzones" class="', cls, '-timezone-body">');
			for (var i = 0, len = timezones.length; i < len; i++)
				out.push('<option value="', timezones[i], '" class="', cls, '-timezone-item">', timezones[i], '</option>');
			out.push('</select><div>');
		}
	}
});

var CalendarPop =
zul.db.CalendarPop = zk.$extends(zul.db.Calendar, {
	$init: function () {
		this.$supers('$init', arguments);
		this.listen({onChange: this}, -1000);
	},
	setFormat: function (fmt) {
		this._fmt = fmt;
	},
	setLocalizedSymbols: function (symbols) {
		this._localizedSymbols = symbols;
	},
	rerender: function () {
		this.$supers('rerender', arguments);
		if (this.desktop) this.syncShadow();
	},
	close: function (silent) {
		var db = this.parent,
			pp = db.$n("pp");

		if (!pp || !zk(pp).isVisible()) return;
		if (this._shadow) this._shadow.hide();

		var zcls = db.getZclass();
		pp.style.display = "none";
		pp.className = zcls + "-pp";

		jq(pp).zk.undoVParent();
		db.setFloating_(false);

		var btn = this.$n("btn");
		if (btn)
			jq(btn).removeClass(zcls + "-btn-over");

		if (silent)
			db.updateChange_();
		else
			zk(db.getInputNode()).focus();
	},
	isOpen: function () {
		return zk(this.parent.$n("pp")).isVisible();
	},
	open: function(silent) {
		var db = this.parent,
			dbn = db.$n(), pp = db.$n("pp");
		if (!dbn || !pp)
			return;

		db.setFloating_(true, {node:pp});
		zWatch.fire('onFloatUp', db); 
		var topZIndex = this.setTopmost();
		this._setView("day");
		var zcls = db.getZclass();

		pp.className = dbn.className + " " + pp.className;
		jq(pp).removeClass(zcls);

		pp.style.width = pp.style.height = "auto";
		pp.style.position = "absolute"; 
		
		pp.style.display = "block";
		pp.style.zIndex = topZIndex > 0 ? topZIndex : 1;

		
		
		jq(pp).zk.makeVParent();

		if (pp.offsetHeight > 200) {
			
			pp.style.width = "auto"; 
		} else if (pp.offsetHeight < 10) {
			pp.style.height = "10px"; 
		}
		if (pp.offsetWidth < dbn.offsetWidth) {
			pp.style.width = dbn.offsetWidth + "px";
		} else {
			var wd = jq.innerWidth() - 20;
			if (wd < dbn.offsetWidth)
				wd = dbn.offsetWidth;
			if (pp.offsetWidth > wd)
				pp.style.width = wd;
		}
		var inp = db.getInputNode();
		zk(pp).position(inp, "after_start");

		setTimeout(function() {
			_reposition(db, silent);
		}, 150);
		
		
		var fmt = db.getTimeFormat(),
			
			value = new zk.fmt.Calendar(zk.fmt.Date.parseDate(inp.value, db._format, false, db._value, this._localizedSymbols), this._localizedSymbols).toUTCDate()
				|| (inp.value ? db._value: zUtl.today(fmt));
		
		if (value)
			this.setValue(value);
		if (fmt) {
			var tm = db._tm;
			tm.setVisible(true);
			tm.setFormat(fmt);
			tm.setValue(value || new Date());
			tm.onSize();
		} else {
			db._tm.setVisible(false);
		}
	},
	syncShadow: function () {
		if (!this._shadow)
			this._shadow = new zk.eff.Shadow(this.parent.$n('pp'), {
				left: -4, right: 4, top: 2, bottom: 3});
		this._shadow.sync();
	},
	onChange: function (evt) {
		var date = this.getTime(),
			db = this.parent,
			fmt = db.getTimeFormat(),
			oldDate = db.getValue(),
			readonly = db.isReadonly();

		if (oldDate)
			date = new Date(date.getFullYear(), date.getMonth(),
				date.getDate(), oldDate.getHours(),
				oldDate.getMinutes(), oldDate.getSeconds(), oldDate.getMilliseconds());
			
			

		if (fmt) {
			var tm = db._tm,
				time = tm.getValue();
			date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
		}
		
		db.getInputNode().value = db.coerceToString_(date);

		if (this._view == 'day' && evt.data.shallClose !== false) {
			this.close();
			db._inplaceout = true;
			
			
			evt.data.value = date;
			if(!_equalDate(date, oldDate))
				db.updateChange_();
		}
		evt.stop();
	},
	onFloatUp: function (ctl) {
		var db = this.parent;
		if (!zUtl.isAncestor(db, ctl.origin)) {
			this.close(true);
			db._inplaceout = true;
			_blurInplace(db);
		}
	},
	bind_: function () {
		this.$supers(CalendarPop, 'bind_', arguments);
		this._bindTimezoneEvt();

		zWatch.listen({onFloatUp: this});
	},
	unbind_: function () {
		zWatch.unlisten({onFloatUp: this});
		this._unbindfTimezoneEvt();
		if (this._shadow) {
			this._shadow.destroy();
			this._shadow = null;
		}
		this.$supers(CalendarPop, 'unbind_', arguments);
	},
	_bindTimezoneEvt: function () {
		var db = this.parent;
		var select = db.$n('dtzones');
		if (select) {
			select.disabled = db.isTimeZonesReadonly() ? "disable" : "";
			db.domListen_(select, 'onChange', '_doTimeZoneChange');
			db._setTimeZonesIndex();
		}
	},
	_unbindfTimezoneEvt: function () {
		var db = this.parent,
			select = db.$n('dtzones');
		if (select)
			db.domUnlisten_(select, 'onChange', '_doTimeZoneChange');
	},
	_setView: function (val) {
		if (this.parent.getTimeFormat())
			this.parent._tm.setVisible(val == 'day');
		this.$supers('_setView', arguments);
	}
});
zul.db.CalendarTime = zk.$extends(zul.db.Timebox, {
	$init: function () {
		this.$supers('$init', arguments);
		this.listen({onChanging: this}, -1000);
	},
	onChanging: function (evt) {
		var db = this.parent,
			date = this.coerceFromString_(evt.data.value), 
			oldDate = db.getValue();
		if (oldDate) {
			oldDate = new Date(oldDate); 
			oldDate.setHours(date.getHours());
			oldDate.setMinutes(date.getMinutes());
			oldDate.setSeconds(date.getSeconds());
			oldDate.setMilliseconds(date.getMilliseconds());
			date = oldDate;
		}
		db.getInputNode().value = evt.data.value
			= db.coerceToString_(date);

		db.fire(evt.name, evt.data); 
		if (this._view == 'day' && evt.data.shallClose !== false) {
			this.close();
			db._inplaceout = true;
		}
		evt.stop();
	}
});
})();
