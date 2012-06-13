

zul.sel.Treerow = zk.$extends(zul.Widget, {
	
	getTree: function () {
		return this.parent ? this.parent.getTree() : null;
	},
	
	getLevel: function () {
		return this.parent ? this.parent.getLevel(): 0;
	},
	
	getLinkedTreechildren: function () {
		return this.parent ? this.parent.treechildren : null;
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments),
			p = this.parent;
		if (p && (!no || !no.zclass)) {
			var zcls = this.getZclass();
			if (p.isDisabled())
				scls += (scls ? ' ': '') + zcls + '-disd';
			if (p.isSelected())
				scls += (scls ? ' ': '') + zcls + '-seld';
		}
		return scls;
	},
	getZclass: function () {
		return this._zclass == null ? "z-treerow" : this._zclass;
	},
	domTooltiptext_ : function () {
		return this._tooltiptext || this.parent._tooltiptext || this.parent.parent._tooltiptext;
	},
	
	domStyle_: function (no) {
		
		return ((this.parent && !this.parent._isRealVisible() && this.isVisible()) ?
				'display:none;' : '') + this.$supers('domStyle_', arguments);
	},
	
	removeChild: function (child) {
		for (var w = child.firstChild; w;) {
			var n = w.nextSibling; 
			child.removeChild(w); 
			w = n;
		}
		this.$supers('removeChild', arguments);
	},
	
	doClick_: function(evt) {
		var ti = this.parent;
		if (evt.domTarget == this.$n('open')) {
			ti.setOpen(!ti._open);
			evt.stop();
		} else if (!ti.isDisabled())
			this.$supers('doClick_', arguments);
	},
	deferRedrawHTML_: function (out) {
		out.push('<tr', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></tr>');
	}
});