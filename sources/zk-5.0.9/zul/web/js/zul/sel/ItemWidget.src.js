
(function () {
	function _toggleEffect(wgt, undo) {
		var self = wgt;
		setTimeout(function () {
			if (!self.desktop)
				return;
			
			var $n = jq(self.$n()),
				zcls = self.getZclass();
			if (undo) {
   				$n.removeClass(zcls + "-over-seld").removeClass(zcls + "-over");
   					
   					
			} else if (self._musin) {
				$n.addClass(self.isSelected() ? zcls + "-over-seld" : zcls + "-over");
				
				var mesh = self.getMeshWidget(),
					musout = mesh._musout;
				
				if (musout && $n[0] != musout.$n()) {
					jq(musout.$n()).removeClass(zcls + "-over-seld").removeClass(zcls + "-over");
					musout._musin = false;
					mesh._musout = null;
				}
			}
		});
	}

zul.sel.ItemWidget = zk.$extends(zul.Widget, {
	_checkable: true,
	$define: {
		
		
		checkable: function () {
			if (this.desktop)
				this.rerender();
		},
		
		
		disabled: function () {
			if (this.desktop)
				this.rerender();
		},
		
		
		value: null
	},
	
	setSelected: function (selected) {
		if (this._selected != selected) {
			var box = this.getMeshWidget();
			if (box)
				box.toggleItemSelection(this);
				
			this._setSelectedDirectly(selected);
		}
	},
	_setSelectedDirectly: function (selected) {
		var n = this.$n();
		if (n) {
			jq(n)[selected ? 'addClass' : 'removeClass'](this.getZclass() + '-seld');
			this._updHeaderCM();
		}
		this._selected = selected;
	},
	
	getLabel: function () {
		return this.firstChild ? this.firstChild.getLabel() : null; 
	},
	
	isSelected: function () {
		return this._selected;
	},
	
	isStripeable_: function () {
		return true;
	},
	
	getMeshWidget: function () {
		return this.parent;
	},
	_getVisibleChild: function (row) {
		for (var i = 0, j = row.cells.length; i < j; i++)
			if (zk(row.cells[i]).isVisible()) return row.cells[i];
		return row;
	},
	
	setVisible: function (visible) {
		if (this._visible != visible) { 
			this.$supers('setVisible', arguments);
			if (this.isStripeable_()) {
				var p = this.getMeshWidget();
				if (p) p.stripe();
			}
		}
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		if (!no || !no.zclass) {
			var zcls = this.getZclass();
			if (this.isDisabled())
				scls += (scls ? ' ': '') + zcls + '-disd';
			if (this.isSelected())
				scls += (scls ? ' ': '') + zcls + '-seld';
		}
		return scls;
	},
	
	_toggleEffect: function (undo) {
		_toggleEffect(this, undo);
	},
	focus_: function (timeout) {
		var mesh = this.getMeshWidget();
			mesh._focusItem = this;
		this._doFocusIn();
		mesh.focusA_(mesh.$n('a'), timeout);
		return true;
	},
	_doFocusIn: function () {
		var n = this.$n();
		if (n)
			jq(this._getVisibleChild(n)).addClass(this.getZclass() + "-focus");
		
		if (n = this.getMeshWidget())
			n._focusItem = this;			
	},
	_doFocusOut: function () {
		var n = this.$n();
		if (n) {
			var zcls = this.getZclass();
			jq(n).removeClass(zcls + "-focus");
			jq(n.cells).removeClass(zcls + "-focus");
		}
	},
	_updHeaderCM: function (bRemove) { 
		var box;
		if ((box = this.getMeshWidget()) && box._headercm && box._multiple) {
			if (bRemove) {
				box._updHeaderCM();
				return;
			}

			var zcls = zk.Widget.$(box._headercm).getZclass() + '-img-seld',
				$headercm = jq(box._headercm);

			if (!this.isSelected())
				$headercm.removeClass(zcls);
			else if (!$headercm.hasClass(zcls))
				box._updHeaderCM(); 
		}
	},
	
	beforeParentChanged_: function (newp) {
		if (!newp) 
			this._updHeaderCM(true);
		this.$supers("beforeParentChanged_", arguments);
	},
	
	afterParentChanged_: function () {
		if (this.parent) 
			this._updHeaderCM();
		this.$supers("afterParentChanged_", arguments);
	},

	
	doSelect_: function(evt) {
		if (this.isDisabled() || !this.isCheckable()) return;
		if (!evt.itemSelected) {
			this.getMeshWidget()._doItemSelect(this, evt);
			evt.itemSelected = true;
		}
		this.$supers('doSelect_', arguments);
	},
	doMouseOver_: function(evt) {
		if (this._musin || this.isDisabled()) return;
		this._musin = true;
		this._toggleEffect();
		evt.stop();
		this.$supers('doMouseOver_', arguments);
	},
	doMouseOut_: function(evt) {
		if (this.isDisabled() || (this._musin &&
					jq.isAncestor(this.$n(), evt.domEvent.relatedTarget ||
								evt.domEvent.toElement))) {
			
			this.getMeshWidget()._musout = this;
			return;
		}
		this._musin = false;
		this._toggleEffect(true);
		evt.stop({propagation: true});
		this.$supers('doMouseOut_', arguments);
	},
	doKeyDown_: function (evt) {
		var mate = this.getMeshWidget();
		if (!zk.gecko3 || !jq.nodeName(evt.domTarget, "input", "textarea"))
			zk(mate.$n()).disableSelection();
		mate._doKeyDown(evt);
		this.$supers('doKeyDown_', arguments);
	},
	doKeyUp_: function (evt) {
		var mate = this.getMeshWidget();
		zk(mate.$n()).enableSelection();
		mate._doKeyUp(evt);
		this.$supers('doKeyUp_', arguments);
	},
	deferRedrawHTML_: function (out) {
		out.push('<tr', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></tr>');
	}
});
})();