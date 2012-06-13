
(function () {

	function _isListgroup(wgt) {
		return zk.isLoaded('zkex.sel') && wgt.$instanceof(zkex.sel.Listgroup);
	}	
	function _isListgroupfoot(wgt) {
		return zk.isLoaded('zkex.sel') && wgt.$instanceof(zkex.sel.Listgroupfoot);
	}	

zul.sel.Listcell = zk.$extends(zul.LabelImageWidget, {
	_colspan: 1,
	$define: {
    	
    	
		colspan: [
			function (colspan) {
				return colspan > 1 ? colspan: 1;
			},
			function () {
				var n = this.$n();
				if (n) n.colSpan = this._colspan;
			}]
	},
	setLabel: function () {
		this.$supers('setLabel', arguments);
		if (this.desktop) {
	 		if (_isListgroup(this.parent))
				this.parent.rerender();
			else if (this.parent.$instanceof(zul.sel.Option))
				this.getListbox().rerender(); 
		}
	},
	
	getListbox: function () {
		var p = this.parent;
		return p ? p.parent: null;
	},

	
	getZclass: function () {
		return this._zclass == null ? "z-listcell" : this._zclass;
	},
	getTextNode: function () {
		return jq(this.$n()).find('>div:first')[0];
	},
	
	getMaxlength: function () {
		var box = this.getListbox();
		if (!box) return 0;
		if (box.getMold() == 'select')
			return box.getMaxlength();
		var lc = this.getListheader();
		return lc ? lc.getMaxlength() : 0;
	},
	
	getListheader: function () {
		var box = this.getListbox();
		if (box && box.listhead) {
			var j = this.getChildIndex();
			if (j < box.listhead.nChildren)
				return box.listhead.getChildAt(j);
		}
		return null;
	},
	domLabel_: function () {
		return zUtl.encodeXML(this.getLabel(), {maxlength: this.getMaxlength()});
	},
	domContent_: function () {
		var s1 = this.$supers('domContent_', arguments),
			s2 = this._colHtmlPre();
		return s1 ? s2 ? s2 + '&nbsp;' + s1: s1: s2;
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		if ((!no || !no.zclass)
		&& (_isListgroup(this.parent) || _isListgroupfoot(this.parent))) {
			var zcls = this.parent.getZclass();
			scls += ' ' + zcls + '-inner';
		}
		return scls;
	},
	_colHtmlPre: function () {
		var s = '',
			box = this.getListbox(),
			p = this.parent,
			zcls = p.getZclass();
		if (box != null && p.firstChild == this) {
			var isGrp = _isListgroup(p);
			
			if (box.isCheckmark() && !_isListgroupfoot(p) &&
					(!isGrp || box.groupSelect)) {
				var chkable = p.isCheckable(),
					multi = box.isMultiple(),
					img = zcls + '-img';
				s += '<span id="' + p.uuid + '-cm" class="' + img + ' ' + img
					+ (multi ? '-checkbox' : '-radio');
				
				if (!chkable || p.isDisabled())
					s += ' ' + img + '-disd';
				
				s += '"';
				if (!chkable)
					s += ' style="visibility:hidden"';
					
				s += '></span>';
			}
			
			if (isGrp) {
				s += '<span id="' + p.uuid + '-img" class="' + zcls + '-img ' + zcls
					+ '-img-' + (p._open ? 'open' : 'close') + '"></span>';
			}
			if (s) return s;
		}
		return (!this.getImage() && !this.getLabel() && !this.firstChild) ? "&nbsp;": '';
	},
	doFocus_: function (evt) {
		this.$supers('doFocus_', arguments);
		
		
		var box, frozen, tbody, td, tds, node;
		if ((box = this.getListbox()) && box.efrozen && 
			(frozen = zk.Widget.$(box.efrozen.firstChild) && 
			(node = this.$n()))) {
			box._moveToHidingFocusCell(node.cellIndex);
		}
	},
	doMouseOver_: function(evt) {
		if (zk.gecko && (this._draggable || this.parent._draggable)
		&& !jq.nodeName(evt.domTarget, "input", "textarea")) {
			var n = this.$n();
			if (n) n.firstChild.style.MozUserSelect = "none";
		}
		this.$supers('doMouseOver_', arguments);
	},
	doMouseOut_: function(evt) {
		if (zk.gecko && (this._draggable || this.parent._draggable)) {
			var n = this.$n();
			if (n) n.firstChild.style.MozUserSelect = "none";
		}
		this.$supers('doMouseOut_', arguments);
	},
	domAttrs_: function () {
		var head = this.getListheader(),
			added;
		if (head)
			added = head.getColAttrs();
		return this.$supers('domAttrs_', arguments)
			+ (this._colspan > 1 ? ' colspan="' + this._colspan + '"' : '')
			+ (added ? ' ' + added : '');
	},
	
	domStyle_: function (no) {
		var style = this.$supers('domStyle_', arguments),
			head = this.getListheader();
		if (head && !head.isVisible())
			style += "display:none;";
		return style;
	},
	bindChildren_: function () {
		var p;
		if (!(p = this.parent) || !p.$instanceof(zul.sel.Option))
			this.$supers("bindChildren_", arguments);
	},
	unbindChildren_: function () {
		var p;
		if (!(p = this.parent) || !p.$instanceof(zul.sel.Option))
			this.$supers("unbindChildren_", arguments);
	},
	deferRedrawHTML_: function (out) {
		out.push('<td', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></td>');
	}
	
});
})();