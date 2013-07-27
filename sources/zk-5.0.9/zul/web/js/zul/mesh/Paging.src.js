
(function () {
	function _rerenderIfBothPaging(wgt) {
		if (wgt.isBothPaging()) {
			wgt.parent.rerender(0);
			return true;
		}
	}
	
	
	function _isUnsignedInteger(s) {
		  return (s.toString().search(/^[0-9]+$/) == 0);
	}


zul.mesh.Paging = zk.$extends(zul.Widget, {
	_pageSize: 20,
	_totalSize: 0,
	_pageCount: 1,
	_activePage: 0,
	_pageIncrement: 10,

	$define: { 
    	
    	
		totalSize: function () {
			this._updatePageNum();
			if (this._detailed) {
				if (!_rerenderIfBothPaging(this)) {
					var info = this.$n("info");
					if (info) info.innerHTML = this.infoText_();
				}
			}
		},
		
		
		pageIncrement: _zkf = function () {
			this.rerender(0);
		},
		
		
		detailed: _zkf,
		
		
		pageCount: _zkf, 
		
		
		activePage: _zkf,
		
		
		pageSize: function () {
			this._updatePageNum();
		},
		
		
		autohide: function () {
			if (this._pageCount == 1) this.rerender(0);
		}
	},
	setStyle: function () {
		this.$supers('setStyle', arguments);
		_rerenderIfBothPaging(this)
	},
	setSclass: function () {
		this.$supers('setSclass', arguments);
		_rerenderIfBothPaging(this);
	},
	setWidth: function () {
		this.$supers('setWidth', arguments);
		_rerenderIfBothPaging(this);
	},
	setHeight: function () {
		this.$supers('setHeight', arguments);
		_rerenderIfBothPaging(this);
	},
	setLeft: function () {
		this.$supers('setLeft', arguments);
		_rerenderIfBothPaging(this);
	},
	setTop: function () {
		this.$supers('setTop', arguments);
		_rerenderIfBothPaging(this);
	},
	setTooltiptext: function () {
		this.$supers('setTooltiptext', arguments);
		_rerenderIfBothPaging(this);
	},
	replaceHTML: function () {
		if (!_rerenderIfBothPaging(this))
			this.$supers('replaceHTML', arguments);
	},
	
	isBothPaging: function () {
		return this.parent && this.parent.getPagingPosition
					&& "both" == this.parent.getPagingPosition();
	},
	_updatePageNum: function () {
		var v = Math.floor((this._totalSize - 1) / this._pageSize + 1);
		if (v == 0) v = 1;
		if (v != this._pageCount) {
			this._pageCount = v;
			if (this._activePage >= this._pageCount)
				this._activePage = this._pageCount - 1;
			if (this.desktop && this.parent) {
				if (!_rerenderIfBothPaging(this)) {
					this.rerender();

					
					if (this.parent.$instanceof(zul.mesh.MeshWidget)) {
						var n = this.parent.$n();

						
						if (n && n._lastsz)
							n._lastsz = null;
						this.parent.onSize();
					}
				}
			}
		}
	},
	
	infoText_: function () {
		var lastItem = (this._activePage+1) * this._pageSize;
		return "[ " + (this._activePage * this._pageSize + 1) + ("os" != this.getMold() ?
			" - " + (lastItem > this._totalSize ? this._totalSize : lastItem) : "")+ " / " + this._totalSize + " ]";
	},
	_infoTags: function () {
		if (this._totalSize == 0)
			return "";
		var lastItem = (this._activePage+1) * this._pageSize,
			out = [];
		out.push('<div id="', this.uuid ,'-info" class="', this.getZclass(), '-info">', this.infoText_(), '</div>');
		return out.join('');
	},
	_innerTags: function () {
		var out = [];

		var half = Math.round(this._pageIncrement / 2),
			begin, end = this._activePage + half - 1;
		if (end >= this._pageCount) {
			end = this._pageCount - 1;
			begin = end - this._pageIncrement + 1;
			if (begin < 0) begin = 0;
		} else {
			begin = this._activePage - half;
			if (begin < 0) begin = 0;
			end = begin + this._pageIncrement - 1;
			if (end >= this._pageCount) end = this._pageCount - 1;
		}
		var zcs = this.getZclass();
		if (this._activePage > 0) {
			if (begin > 0) 
				this.appendAnchor(zcs, out, msgzul.FIRST, 0);
			this.appendAnchor(zcs, out, msgzul.PREV, this._activePage - 1);
		}

		var bNext = this._activePage < this._pageCount - 1;
		for (; begin <= end; ++begin) {
			if (begin == this._activePage) {
				this.appendAnchor(zcs, out, begin + 1, begin, true);
			} else {
				this.appendAnchor(zcs, out, begin + 1, begin);
			}
		}

		if (bNext) {
			this.appendAnchor(zcs, out, msgzul.NEXT, this._activePage + 1);
			if (end < this._pageCount - 1) 
				this.appendAnchor(zcs, out, msgzul.LAST, this._pageCount - 1);
		}
		if (this._detailed)
			out.push('<span id="', this.uuid ,'-info">', this.infoText_(), "</span>");
		return out.join('');
	},
	appendAnchor: function (zclass, out, label, val, seld) {
		var zcls = zclass + "-cnt" + (seld ? " " + zclass + "-seld" : ""),
			isInt = _isUnsignedInteger(label);
		zclass += '-cnt' + (seld ? '-seld' : '');
		if (isInt)
			out.push('<div class="', zclass, '-l"><div class="', zclass, '-r"><div class="', zclass, '-m">');
		out.push('<a class="', zcls, '" href="javascript:;" onclick="zul.mesh.Paging.go(this,',
				val, ')">', label, '</a>');
		if (isInt)
			out.push('</div></div></div>');
	},
	_doMouseEvt: function (evt) {
		var zcls = this.getZclass() + '-cnt-l';
		jq(evt.domTarget).parents('.' + zcls)[evt.name == 'onMouseOver' ? 'addClass' : 'removeClass'](zcls + '-over');
	},
	getZclass: function () {
		var added = "os" == this.getMold() ? "-os" : "";
		return this._zclass == null ? "z-paging" + added : this._zclass;
	},
	isVisible: function () {
		var visible = this.$supers('isVisible', arguments);
		return visible && (this._pageCount > 1 || !this._autohide);
	},
	bind_: function () {
		this.$supers(zul.mesh.Paging, 'bind_', arguments);
		
		if (this.getMold() == 'os') {
			var childs = jq(this.$n()).find('div a'),
				i = childs.length;
				
			while (i-- > 0) {
				this.domListen_(childs[i], 'onMouseOver', '_doMouseEvt')
					.domListen_(childs[i], 'onMouseOut', '_doMouseEvt');
			}
			return;
		}
		var uuid = this.uuid,
			inputs = jq.$$(uuid, 'real'),
			zcls = this.getZclass(),
			Paging = this.$class;

		if (!this.$weave)
			for (var i = inputs.length; i--;)
				jq(inputs[i]).keydown(Paging._domKeyDown)
					.blur(Paging._domBlur);

		for (var postfix = ['first', 'prev', 'last', 'next'], k = postfix.length; k--; ) {
			var btn = jq.$$(uuid, postfix[k]);
			for (var j = btn.length; j--;) {
				if (!this.$weave)
					jq(btn[j]).mouseover(Paging._domMouseOver)
						.mouseout(Paging._domMouseOut)
						.bind('zmousedown', Paging._domMouseDown)
						.click(Paging['_dom' + postfix[k] + 'Click']);

				if (this._pageCount == 1)
					jq(btn[j]).addClass(zcls + "-btn-disd");
				else if (postfix[k] == 'first' || postfix[k] == 'prev') {
					if (this._activePage == 0) jq(btn[j]).addClass(zcls + "-btn-disd");
				} else if (this._activePage == this._pageCount - 1) {
					jq(btn[j]).addClass(zcls + "-btn-disd");
				}
			}
		}
	},
	unbind_: function () {
		if (this.getMold() != "os") {
			var uuid = this.uuid, inputs = jq.$$(uuid, 'real'), Paging = this.$class;

			for (var i = inputs.length; i--;)
				jq(inputs[i]).unbind("keydown", Paging._domKeyDown)
					.unbind("blur", Paging._domBlur);

			for (var postfix = ['first', 'prev', 'last', 'next'], k = postfix.length; k--;) {
				var btn = jq.$$(uuid, postfix[k]);
				for (var j = btn.length; j--;) {
					jq(btn[j]).unbind("mouseover", Paging._domMouseOver)
						.unbind("mouseout", Paging._domMouseOut)
						.unbind("zmousedown", Paging._domMouseDown)
						.unbind("click", Paging['_dom' + postfix[k] + 'Click']);
				}
			}
		} else {
			var childs = jq(this.$n()).find('div a'),
				i = childs.length;
				
			while (i-- > 0) {
				this.domUnlisten_(childs[i], 'onMouseOver', '_doMouseEvt')
					.domUnlisten_(childs[i], 'onMouseOut', '_doMouseEvt');
			}
		}
		this.$supers(zul.mesh.Paging, 'unbind_', arguments);
	}
}, { 
	
	go: function (anc, pgno) {
		var wgt = zk.Widget.isInstance(anc) ? anc : zk.Widget.$(anc);
		if (wgt && wgt.getActivePage() != pgno)
			wgt.fire('onPaging', pgno);
	},
	_domKeyDown: function (evt) {
		var inp = evt.target,
			wgt = zk.Widget.$(inp);
		if (inp.disabled || inp.readOnly)
			return;

		var code =evt.keyCode;
		switch(code){
		case 48:case 96:
		case 49:case 97:
		case 50:case 98:
		case 51:case 99:
		case 52:case 100:
		case 53:case 101:
		case 54:case 102:
		case 55:case 103:
		case 56:case 104:
		case 57:case 105:
			break;
		case 37:
			break;
		case 38: case 33: 
			wgt.$class._increase(inp, wgt, 1);
			evt.stop();
			break;
		case 39:
			break;
		case 40: case 34: 
			wgt.$class._increase(inp, wgt, -1);
			evt.stop();
			break;
		case 36:
			wgt.$class.go(wgt,0);
			evt.stop();
			break;
		case 35:
			wgt.$class.go(wgt, wgt._pageCount - 1);
			evt.stop();
			break;
		case 9: case 8: case 46: 
			break;
		case 13: 
			wgt.$class._increase(inp, wgt, 0);
			wgt.$class.go(wgt, inp.value-1);
			evt.stop();
			break;
		default:
			if (!(code >= 112 && code <= 123) 
			&& !evt.ctrlKey && !evt.altKey)
				evt.stop();
		}
	},
	_domBlur: function (evt) {
		var inp = evt.target,
			wgt = zk.Widget.$(inp);
		if (inp.disabled || inp.readOnly)
			return;

		wgt.$class._increase(inp, wgt, 0);
		wgt.$class.go(wgt, inp.value-1);
		evt.stop();
	},
	_increase: function (inp, wgt, add){
		var value = zk.parseInt(inp.value);
		value += add;
		if (value < 1) value = 1;
		else if (value > wgt._pageCount) value = wgt._pageCount;
		inp.value = value;
	},
	_domfirstClick: function (evt) {
		var wgt = zk.Widget.$(evt),
			zcls = wgt.getZclass();

		if (wgt.getActivePage() != 0) {
			wgt.$class.go(wgt, 0);
			var uuid = wgt.uuid;
			for (var postfix = ['first', 'prev'], k = postfix.length; k--;)
				for (var btn = jq.$$(uuid, postfix[k]), i = btn.length; i--;)
					jq(btn[i]).addClass(zcls + "-btn-disd");
		}
	},
	_domprevClick: function (evt) {
		var wgt = zk.Widget.$(evt),
			ap = wgt.getActivePage(),
			zcls = wgt.getZclass();

		if (ap > 0) {
			wgt.$class.go(wgt, ap - 1);
			if (ap - 1 == 0) {
				var uuid = wgt.uuid;
				for (var postfix = ['first', 'prev'], k = postfix.length; k--;)
					for (var btn = jq.$$(uuid, postfix[k]), i = btn.length; i--;)
						jq(btn[i]).addClass(zcls + "-btn-disd");
			}
		}
	},
	_domnextClick: function (evt) {
		var wgt = zk.Widget.$(evt),
			ap = wgt.getActivePage(),
			pc = wgt.getPageCount(),
			zcls = wgt.getZclass();

		if (ap < pc - 1) {
			wgt.$class.go(wgt, ap + 1);
			if (ap + 1 == pc - 1) {
				var uuid = wgt.uuid;
				for (var postfix = ['last', 'next'], k = postfix.length; k--;)
					for (var btn = jq.$$(uuid, postfix[k]), i = btn.length; i--;)
						jq(btn[i]).addClass(zcls + "-btn-disd");
			}
		}
	},
	_domlastClick: function (evt) {
		var wgt = zk.Widget.$(evt),
			pc = wgt.getPageCount(),
			zcls = wgt.getZclass();

		if (wgt.getActivePage() < pc - 1) {
			wgt.$class.go(wgt, pc - 1);
			var uuid = wgt.uuid;
			for (var postfix = ['last', 'next'], k = postfix.length; k--;)
				for (var btn = jq.$$(uuid, postfix[k]), i = btn.length; i--;)
					jq(btn[i]).addClass(zcls + "-btn-disd");
		}
	},
	_domMouseOver: function (evt) {
		var target = evt.target,
			$table = jq(target).parents("table:first"),
			zcls = zk.Widget.$(target).getZclass();
		if (!$table.hasClass(zcls + "-btn-disd")) 
			$table.addClass(zcls + "-btn-over");
	},
	_domMouseOut: function (evt) {
		var target = evt.target,
			$table = jq(target).parents("table:first"),
			wgt = zk.Widget.$(target);
		if(!zk.ie || !jq.isAncestor($table[0], evt.relatedTarget || evt.toElement))
			$table.removeClass(wgt.getZclass() + "-btn-over");
	},
	_domMouseDown: function (evt) {
		var target = evt.target,
			$table = jq(target).parents("table:first"),
			wgt = zk.Widget.$(target),
			zcls = wgt.getZclass();
		if (!$table.hasClass(zcls + "-btn-disd")) {
			$table.addClass(zcls + "-btn-clk");
			wgt.$class._downbtn = $table[0];
			jq(document).bind('zmouseup', wgt.$class._domMouseUp);
		}
	},
	_domMouseUp: function (evt) {
		if (zul.mesh.Paging._downbtn) {
			var zcls = zk.Widget.$(zul.mesh.Paging._downbtn).getZclass();
			jq(zul.mesh.Paging._downbtn).removeClass(zcls + "-btn-clk");
		}
		zul.mesh.Paging._downbtn = null;
		jq(document).unbind("zmouseup", zul.mesh.Paging._domMouseUp);
	}
});

})();