

zul.sel.Option = zk.$extends(zul.Widget, {
	_selected: false,
	$define: {
    	
    	
		disabled: function (disabled) {
			var n = this.$n();
			if (n) n.disabled = disabled ? 'disabled' : '';
		},
		
		
		value: null
	},
	
	focus: function (timeout) {
		var p = this.parent;
		if (p) p.focus(timeout);
	},

	
	setVisible: function (visible) {
		if (this._visible != visible) {
			this._visible = visible;
			if (this.desktop)
				this.parent.rerender();
		}
	},
	
	setSelected: function (selected) {
		selected = selected || false;
		if (this._selected != selected) {
			if (this.parent)
				this.parent.toggleItemSelection(this);
			this._setSelectedDirectly(selected);
		}
	},
	_setSelectedDirectly: function (selected) {
		var n = this.$n();
		if (n) n.selected = selected ? 'selected' : '';
		this._selected = selected;
	},
	
	isSelected: function () {
		return this._selected;
	},
	
	getLabel: function () {
		return this.firstChild ? this.firstChild.getLabel() : null; 
	},
	
	getMaxlength: function () {
		return this.parent ? this.parent.getMaxlength() : 0;
	},
	domLabel_: function () {
		return zUtl.encodeXML(this.getLabel(), {maxlength: this.getMaxlength()});
	},
	domAttrs_: function () {
		var value = this.getValue();
		return this.$supers('domAttrs_', arguments) + (this.isDisabled() ? ' disabled="disabled"' :'') +
		(this.isSelected() ? ' selected="selected"' : '') + (value ? ' value="' + value + '"': '');
	},
	replaceWidget: function (newwgt) {
		this._syncItems(newwgt);
		this.$supers('replaceWidget', arguments);
	},
	_syncItems: function (newwgt) {
		if (this.parent && this.isSelected()) {
			var items = this.parent._selItems;
			if (items && items.$remove(this))
				items.push(newwgt);
		}
	}
});