

zul.sel.Select = zk.$extends(zul.Widget, {
	_selectedIndex: -1,
	
	_rows: 0,
	$init: function () {
		this.$supers('$init', arguments);
		this._selItems = [];
	},
	$define: {
		
		
		multiple: function (multiple) {
			var n = this.$n();
			if (n) n.multiple = multiple ? 'multiple' : '';
		},
		
		
		disabled: function (disabled) {
			var n = this.$n();
			if (n) n.disabled = disabled ? 'disabled' : '';
		},
		
		
		selectedIndex: function (selectedIndex) {
			var i = 0, j = 0, w, n = this.$n();
			this.clearSelection();
			for (w = this.firstChild; w && i < selectedIndex; w = w.nextSibling, i++) {
				if (w.$instanceof(zul.sel.Option)) {
    				if (!w.isVisible())
    					j++;
				} else i--;			
			}
				
			selectedIndex -= j;
			if (n)
				n.selectedIndex = selectedIndex;

			if (selectedIndex > -1 && w && w.$instanceof(zul.sel.Option)) {
				w.setSelected(true);
				this._selItems.push(w);
			}
		},
		
		
		tabindex: function (tabindex) {
			var n = this.$n();
			if (n) n.tabindex = tabindex||'';
		},
		
		
		name: function (name) {
			var n = this.$n();
			if (n) n.name = name;
		},
		
		
		rows: function (rows) {
			var n = this.$n();
			if (n) n.size = rows;
		},
		
		
		maxlength: function (maxlength) {
			if (this.desktop)
				this.rerender();
		}
	},
	
	toggleItemSelection: function (item) {
		if (item.isSelected()) this._removeItemFromSelection(item);
		else this._addItemToSelection(item);
	},
	
	selectItem: function (item) {
		if (!item)
			this.setSelectedIndex(-1);
		else if (this._multiple || !item.isSelected())
			this.setSelectedIndex(item.getChildIndex());
	},
	_addItemToSelection: function (item) {
		if (!item.isSelected()) {
			if (!this._multiple) {
				this.selectItem(item);
			} else {
				var index = item.getChildIndex();
				if (index < this._selectedIndex || this._selectedIndex < 0) {
					this._selectedIndex = index;
				}
				item._setSelectedDirectly(true);
				this._selItems.push(item);
			}
		}
	},
	_removeItemFromSelection: function (item) {
		if (item.isSelected()) {
			if (!this._multiple) {
				this.clearSelection();
			} else {
				item._setSelectedDirectly(false);
				this._selItems.$remove(item);				
			}
		}
	},
	
	clearSelection: function () {
		if (this._selItems.length) {
			var item;
			for(;(item = this._selItems.pop());)
				item._setSelectedDirectly(false);
			this._selectedIndex = -1;
		}
	},
	domAttrs_: function () {
		var v;
		return this.$supers('domAttrs_', arguments)
			+ (this.isDisabled() ? ' disabled="disabled"' :'')
			+ (this.isMultiple() ? ' multiple="multiple"' : '')
			+ ((v=this.getSelectedIndex()) > -1 ? ' selectedIndex="' + v + '"': '')
			+ ((v=this.getTabindex()) ? ' tabindex="' + v + '"': '')
			+ ((v=this.getRows()) > 0 ? ' size="' + v + '"': '')
			+ ((v=this.getName()) ? ' name="' + v + '"': '');
	},
	bind_: function () {
		this.$supers(zul.sel.Select, 'bind_', arguments);

		var n = this.$n();
		this.domListen_(n, 'onChange')
			.domListen_(n, 'onFocus', 'doFocus_')
			.domListen_(n, 'onBlur', 'doBlur_');

		if (!zk.gecko) {
			var fn = [this,  this._fixSelIndex];
			zWatch.listen({onRestore: fn, onVParent: fn});
		}

		this._fixSelIndex();
	},
	unbind_: function () {
		var n = this.$n();
		this.domUnlisten_(n, 'onChange')
			.domUnlisten_(n, 'onFocus', 'doFocus_')
			.domUnlisten_(n, 'onBlur', 'doBlur_')
			.$supers(zul.sel.Select, 'unbind_', arguments);

		var fn = [this,  this._fixSelIndex];
		zWatch.unlisten({onRestore: fn, onVParent: fn});
	},
	_fixSelIndex: function () {
		if (this._selectedIndex < 0)
			this.$n().selectedIndex = -1;
	},
	_doChange: function (evt) {		
		var data = [], reference, n = this.$n();
		if (this._multiple) {
			var opts = n.options, changed;
			for (var j = 0, ol = opts.length; j < ol; ++j) {
				var opt = opts[j],
					o = zk.Widget.$(opt.id),
					v = opt.selected;
				if (o && o._selected != v) {
					o.setSelected(v);
					changed = true;
				}
				if (v) {
					data.push(opt.id);
					if (!reference) reference = opt.id;
				}
			}
			if (!changed)
				return;
		} else {
			var v = n.selectedIndex;
			if (zk.opera) n.selectedIndex = v; 
			if (this._selectedIndex == v)
				return;

			this.setSelectedIndex(v);
			data.push(reference = n.options[v].id);
		}

		this.fire('onSelect', {items: data, reference: reference});
	},
	
	doBlur_: function (evt) {
		this._doChange(evt);
		return this.$supers('doBlur_', arguments); 		
	},
	
	beforeCtrlKeys_: function (evt) {
		this._doChange(evt);
	},
	onChildAdded_: function () {
		this.rerender();
	},
	onChildRemoved_: function () {
		if (!this.childReplacing_)
			this.rerender();
	}
});
