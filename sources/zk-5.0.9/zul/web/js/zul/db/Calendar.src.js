



(function () {
	
	var _doFocus = zk.gecko ? function (n, timeout) {
			if (timeout)
				setTimeout(function () {
					zk(n).focus();
				});
			else
				zk(n).focus();
		} : function (n) {
			zk(n).focus();
		};

	function _newDate(year, month, day, bFix) {
		var v = new Date(year, month, day);
		return bFix && v.getMonth() != month ?
			new Date(year, month + 1, 0): v;
	}


zul.db.Renderer = {
	
	cellHTML: function (cal, y, m, day, monthofs) {
		return day;
	},
	
	beforeRedraw: function (cal) {
	},
	
	disabled: function (cal, y, m, v, today) {
		var d = new Date(y, m, v, 0, 0, 0, 0),
			constraint;
		
		if ((constraint = cal._constraint)&& typeof constraint == 'string') {
			
			
			if ((constraint.indexOf("no past") > -1 && (d - today) / 86400000 < 0) ||
			    (constraint.indexOf("no future") > -1 && (today - d) / 86400000 < 0) ||
			    (constraint.indexOf("no today") > -1 && today - d == 0))
					return true;
		}
		
		var result = false;
		if (cal._beg && (result = (d - cal._beg) / 86400000 < 0))
			return result;
		if (cal._end && (result = (cal._end - d) / 86400000 < 0))
			return result;
		return result;
	}
};
var Calendar =

zul.db.Calendar = zk.$extends(zul.Widget, {
	_view : "day", 
	
	$init: function () {
		this.$supers('$init', arguments);
		this.listen({onChange: this}, -1000);
	},
	$define: {
		
		
		value: function() {
			this.rerender();
		},
		
		
		constraint: function() {
			var constraint = this._constraint || '';
			if (typeof this._constraint != 'string') return;
			if (constraint.startsWith("between")) {
				var j = constraint.indexOf("and", 7);
				if (j < 0 && zk.debugJS) 
					zk.error('Unknown constraint: ' + constraint);
				this._beg = new zk.fmt.Calendar(null, this._localizedSymbols).parseDate(constraint.substring(7, j), 'yyyyMMdd');
				this._end = new zk.fmt.Calendar(null, this._localizedSymbols).parseDate(constraint.substring(j + 3), 'yyyyMMdd');
				if (this._beg.getTime() > this._end.getTime()) {
					var d = this._beg;
					this._beg = this._end;
					this._end = d;
				}
				
				this._beg.setHours(0, 0, 0, 0);
				this._end.setHours(0, 0, 0, 0);
			} else if (constraint.startsWith("before")) {
				this._end = new zk.fmt.Calendar(null, this._localizedSymbols).parseDate(constraint.substring(6), 'yyyyMMdd');
				this._end.setHours(0, 0, 0, 0);
			} else if (constraint.startsWith("after")) {
				this._beg = new zk.fmt.Calendar(null, this._localizedSymbols).parseDate(constraint.substring(5), 'yyyyMMdd');
				this._beg.setHours(0, 0, 0, 0);
			}
		},
		
		
		name: function () {
			if (this.efield)
				this.efield.name = this._name;
		}
	},
	
	redraw: function () {
		zul.db.Renderer.beforeRedraw(this);
		this.$supers("redraw", arguments);
	},
	onChange: function (evt) {
		this._updFormData(evt.data.value);
	},
	doKeyDown_: function (evt) {
		var keyCode = evt.keyCode,
			ofs = keyCode == 37 ? -1 : keyCode == 39 ? 1 : keyCode == 38 ? -7 : keyCode == 40 ? 7 : 0;
		if (ofs) {
			this._shift(ofs);
		} else 
			this.$supers('doKeyDown_', arguments);
	},
	_shift: function (ofs, opts) {
		var oldTime = this.getTime();	
		
		switch(this._view) {
		case 'month':
		case 'year':
			if (ofs == 7)
				ofs = 4;
			else if (ofs == -7)
				ofs = -4;
			break;
		case 'decade':
			if (ofs == 7)
				ofs = 4;
			else if (ofs == -7)
				ofs = -4;
			ofs *= 10;
			
			var y = oldTime.getFullYear();
			if (y + ofs < 1900 || y + ofs > 2100)
				return;

		}		
		this._shiftDate(this._view, ofs);
		var newTime = this.getTime();
		switch(this._view) {
		case 'day':
			if (oldTime.getYear() == newTime.getYear() &&
				oldTime.getMonth() == newTime.getMonth()) {
				this._markCal(opts);
			} else 
				this.rerender();
			break;
		case 'month':
			if (oldTime.getYear() == newTime.getYear())
				this._markCal(opts);
			else
				this.rerender();
			break;
		default:			
			this.rerender();

		}
	},
	
	getFormat: function () {
		return this._fmt || "yyyy/MM/dd";
	},
	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-calendar";
	},
	_updFormData: function (val) {
		val = new zk.fmt.Calendar().formatDate(val, this.getFormat(), this._localizedSymbols);
		if (this._name) {
			val = val || '';
			if (!this.efield)
				this.efield = jq.newHidden(this._name, val, this.$n());
			else
				this.efield.value = val;
		}
	},
	focus_: function (timeout) {
		if (this._view != 'decade') 
			this._markCal({timeout: timeout});
		else {
			var anc;
			if (anc = this.$n('a'))
				_doFocus(anc, true);
		}
		return true;
	},
	bind_: function (){
		this.$supers(Calendar, 'bind_', arguments);
		var node = this.$n(),
			title = this.$n("title"),
			mid = this.$n("mid"),
			tdl = this.$n("tdl"),
			tdr = this.$n("tdr"),
			zcls = this.getZclass();
		jq(title).hover(
			function () {
				jq(this).toggleClass(zcls + "-title-over");
			},
			function () {
				jq(this).toggleClass(zcls + "-title-over");
			}
		);
		if (this._view != 'decade') 
			this._markCal({silent: true});

		this.domListen_(title, "onClick", '_changeView')
			.domListen_(mid, "onClick", '_clickDate')
			.domListen_(tdl, "onClick", '_clickArrow')
			.domListen_(tdl, "onMouseOver", '_doMouseEffect')
			.domListen_(tdl, "onMouseOut", '_doMouseEffect')
			.domListen_(tdr, "onClick", '_clickArrow')
			.domListen_(tdr, "onMouseOver", '_doMouseEffect')
			.domListen_(tdr, "onMouseOut", '_doMouseEffect')
			.domListen_(mid, "onMouseOver", '_doMouseEffect')
			.domListen_(mid, "onMouseOut", '_doMouseEffect')
			.domListen_(node, 'onMousewheel');

		this._updFormData(this.getTime());
	},
	unbind_: function () {
		var node = this.$n(),
			title = this.$n("title"),
			mid = this.$n("mid"),
			tdl = this.$n("tdl"),
			tdr = this.$n("tdr");
		this.domUnlisten_(title, "onClick", '_changeView')
			.domUnlisten_(mid, "onClick", '_clickDate')
			.domUnlisten_(tdl, "onClick", '_clickArrow')			
			.domUnlisten_(tdl, "onMouseOver", '_doMouseEffect')
			.domUnlisten_(tdl, "onMouseOut", '_doMouseEffect')
			.domUnlisten_(tdr, "onClick", '_clickArrow')
			.domUnlisten_(tdr, "onMouseOver", '_doMouseEffect')
			.domUnlisten_(tdr, "onMouseOut", '_doMouseEffect')
			.domUnlisten_(mid, "onMouseOver", '_doMouseEffect')
			.domUnlisten_(mid, "onMouseOut", '_doMouseEffect')
			.domUnlisten_(node, 'onMousewheel')
			.$supers(Calendar, 'unbind_', arguments);
		this.efield = null;
	},
	rerender: function () {
		if (this.desktop) {
			var s = this.$n().style,
				w = s.width,
				h = s.height,
				result = this.$supers('rerender', arguments);
			s = this.$n().style;
			s.width = w;
			s.height = h;
			return result;
		}
	},
	_clickArrow: function (evt) {		
		var node = evt.domTarget.id.indexOf("-ly") > 0 ? this.$n("tdl") :
				   evt.domTarget.id.indexOf("-ry") > 0 ?  this.$n("tdr") :
				   evt.domTarget;
		if (jq(node).hasClass(this.getZclass() + '-icon-disd'))
			return;
		this._shiftView(node.id.indexOf("-tdl") > 0 ? -1 : 1);
	},
	_shiftView: function (ofs) {
		switch(this._view) {
		case "day" :
			this._shiftDate("month", ofs);
			break;
		case "month" :
			this._shiftDate("year", ofs);
			break;
		case "year" :
			this._shiftDate("year", ofs*10);
			break;
		case "decade" :
			this._shiftDate("year", ofs*100);

		}
		this.rerender();
	},
	_doMousewheel: function (evt, intDelta) {		
		if (jq(this.$n(-intDelta > 0 ? "tdr": "tdl")).hasClass(this.getZclass() + '-icon-disd'))
			return;
		this._shiftView(intDelta > 0 ? -1: 1);
		evt.stop();
	},
	_doMouseEffect: function (evt) {
		var	ly = this.$n("ly"),
			ry = this.$n("ry"), 
			$node = evt.domTarget == ly ? jq(this.$n("tdl")) :
					evt.domTarget == ry ? jq(this.$n("tdr")) : jq(evt.domTarget),
			zcls = this.getZclass();
		
		if ($node.hasClass(zcls + '-disd'))
			return;
			
		if ($node.is("."+zcls+"-seld")) {
			$node.removeClass(zcls + "-over")
				.toggleClass(zcls + "-over-seld");
		} else {
			$node.toggleClass(zcls + "-over");
		}
	},
	
	getTime: function () {
		return this._value || zUtl.today(this.getFormat());
	},
	_setTime: function (y, m, d, hr, mi) {
		var dateobj = this.getTime(),
			year = y != null ? y  : dateobj.getFullYear(),
			month = m != null ? m : dateobj.getMonth(),
			day = d != null ? d : dateobj.getDate();
		this._value = _newDate(year, month, day, d == null);
		this.fire('onChange', {value: this._value});
	},
	_clickDate: function (evt) {
		var target = evt.domTarget, val;
		for (; target; target = target.parentNode)
			try { 
				if ((val = jq(target).attr("_dt")) !== undefined) {
					val = zk.parseInt(val);
					break;
				}
			} catch (e) {
				continue; 
			}
		this._chooseDate(target, val);
		var anc;
		if (anc = this.$n('a'))
			_doFocus(anc, true);

		evt.stop();
	},
	_chooseDate: function (target, val) {
		if (target && !jq(target).hasClass(this.getZclass() + '-disd')) {
			var cell = target,
				dateobj = this.getTime();
			switch(this._view) {
			case "day" :
				var oldTime = this.getTime();
				this._setTime(null, cell._monofs != null && cell._monofs != 0 ?
						dateobj.getMonth() + cell._monofs : null, val);
				var newTime = this.getTime();
				if (oldTime.getYear() == newTime.getYear() &&
					oldTime.getMonth() == newTime.getMonth()) {
						this._markCal();
				} else
					this.rerender();
				break;
			case "month" :
				this._setTime(null, val);
				this._setView("day");
				break;
			case "year" :
				this._setTime(val);
				this._setView("month");
				break;
			case "decade" :
				
				this._setTime(val);
				this._setView("year");

			}
		}
	},
	_shiftDate: function (opt, ofs) {
		var dateobj = this.getTime(),
			year = dateobj.getFullYear(),
			month = dateobj.getMonth(),
			day = dateobj.getDate(),
			nofix;
		switch(opt) {
		case "day" :
			day += ofs;
			nofix = true;
			break;
		case "month" :
			month += ofs;
			break;
		case "year" :
			year += ofs;
			break;
		case "decade" :
			year += ofs;

		}
		this._value = _newDate(year, month, day, !nofix);
		this.fire('onChange', {value: this._value, shallClose: false});
	},
	_changeView : function (evt) {
		var tm = this.$n("tm"),
			ty = this.$n("ty"),
			tyd = this.$n("tyd"),
			title = this.$n("title");
		if (evt.domTarget == tm)
			this._setView("month");
		else if (evt.domTarget == ty)
			this._setView("year");
		else if (evt.domTarget == tyd )
			this._setView("decade");
		else if (tm != null && evt.domTarget == title)
			this._setView("month");
		evt.stop();
	},
	_setView : function (view) {
		if (view != this._view) {
			this._view = view;
			this.rerender();
		}
	},
	_markCal: function (opts) {
		var	zcls = this.getZclass(),
		 	seldate = this.getTime(),
		 	m = seldate.getMonth(),
			y = seldate.getFullYear();

		if (this._view == 'day') {
			var d = seldate.getDate(),
				v = new Date(y, m, 1).getDay()- zk.DOW_1ST,
				last = new Date(y, m + 1, 0).getDate(), 
				prev = new Date(y, m, 0).getDate(), 
				today = zUtl.today(); 
			if (v < 0) v += 7;
			for (var j = 0, cur = -v + 1; j < 6; ++j) {
				var week = this.$n("w" + j);
				if (week != null) {
					for (var k = 0; k < 7; ++k, ++cur) {
						v = cur <= 0 ? prev + cur: cur <= last ? cur: cur - last;
						if (k == 0 && cur > last)
							week.style.display = "none";
						else {
							if (k == 0) week.style.display = "";
							var $cell = jq(week.cells[k]),
								monofs = cur <= 0 ? -1: cur <= last ? 0: 1,
								bSel = cur == d;
								
							$cell[0]._monofs = monofs;
							$cell.css('textDecoration', '').
								removeClass(zcls+"-seld");
								
							if (bSel) {
								$cell.addClass(zcls+"-seld");
								if ($cell.hasClass(zcls + "-over"))
									$cell.addClass(zcls + "-over-seld");;
							} else
								$cell.removeClass(zcls+"-seld");
								
							
							$cell[monofs ? 'addClass': 'removeClass']("z-outside")
								[zul.db.Renderer.disabled(this, y, m + monofs, v, today) ? 
								'addClass': 'removeClass'](zcls+"-disd").
								html(zul.db.Renderer.cellHTML(this, y, m + monofs, v, monofs)).
								attr('_dt', v);
						}
					}
				}
			}
		} else {
			var isMon = this._view == 'month',
				field = isMon ? 'm': 'y',
				index = isMon? m: y % 10 + 1,
				node;
				
			for (var j = 0; j < 12; ++j)
				if (node = this.$n(field + j))
					jq(node)[index == j ? 'addClass': 'removeClass'](zcls+"-seld");
		}
		var anc;
		if ((anc = this.$n('a')) && (!opts || !opts.silent))
			_doFocus(anc, opts && opts.timeout );
	}
});
})();