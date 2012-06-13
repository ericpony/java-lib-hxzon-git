
(function () {

	function _concatItem(group) {
		var sum = _concatItem0(group);
		sum.$addAll(group._externs);
		return sum;
	}
	function _concatItem0(cmp) {
		var sum = [];
		for (var wgt = cmp.firstChild; wgt; wgt = wgt.nextSibling) {			
			if (wgt.$instanceof(zul.wgt.Radio)) 
				sum.push(wgt);
			else if (!wgt.$instanceof(zul.wgt.Radiogroup)) 
				sum = sum.concat(_concatItem0(wgt));
		}
		return sum;
	}

	function _getAt(group, cur, index) {
		var r = _getAt0(group, cur, index);
		if (!r)
			for (var extns = group._externs, j = 0, l = extns.length; j < l; ++j)
				if (!_redudant(group, extns[j]) && cur.value++ == index)
					return extns[j];
		return r;
	}
	function _getAt0(cmp, cur, index) {
		for (var wgt = cmp.firstChild; wgt; wgt = wgt.nextSibling) {
			if (wgt.$instanceof(zul.wgt.Radio)) {
				if (cur.value++ == index) return wgt;
			} else if (!wgt.$instanceof(zul.wgt.Radiogroup)) {
				var r = _getAt0(wgt, cur, index);
				if (r != null) return r;
			}				
		}
	}

	function _fixSelIndex(group, cur) {
		var jsel = _fixSelIndex0(group, cur);
		if (jsel < 0)
			for (var extns = group._externs, j = 0, l = extns.length, radio; j < l; ++j)
				if (!_redudant(group, radio = extns[j])) {
					if (radio.isSelected())
						return cur.value;
					++cur.value;
				}
		return jsel;
	}
	function _fixSelIndex0(cmp, cur) {
		for (var wgt = cmp.firstChild; wgt; wgt = wgt.nextSibling) {
			if (wgt.$instanceof(zul.wgt.Radio)) {
				if (wgt.isSelected())
					return cur.value;
				++cur.value;
			} else if (!wgt.$instanceof(zul.wgt.Radiogroup)) {
				var jsel = _fixSelIndex0(wgt, cur);
				if (jsel >= 0) return jsel;
			}
		}
		return -1;
	}

	function _redudant(group, radio) {
		for (var p = radio; (p = p.parent) != null;)
			if (p.$instanceof(zul.wgt.Radiogroup))
				return p == group;
	}


zul.wgt.Radiogroup = zk.$extends(zul.Widget, {
	_orient: 'horizontal',
	_jsel: -1,

	$init: function () {
		this.$supers("$init", arguments);
		this._externs = [];
	},
	$define: { 
		
		
		orient: function () {
			this.rerender();
		},
		
		
		name: function (v) {
			for (var items = this.getItems(), i = items.length; i--;)
				items[i].setName(v);
		}
	},
	
	getItemAtIndex: function (index) {
		return index >= 0 ? _getAt(this, {value: 0}, index): null;
	},
	
	getItemCount: function () {
		return this.getItems().length;
	},
	
	getItems: function () {
		return _concatItem(this);
	},
	
	getSelectedIndex: function () {
		return this._jsel;
	},
	
	setSelectedIndex: function (jsel) {
		if (jsel < 0) jsel = -1;
		if (this._jsel != jsel) {
			if (jsel < 0) {
				getSelectedItem().setSelected(false);
			} else {
				getItemAtIndex(jsel).setSelected(true);
			}
		}
	},
	
	getSelectedItem: function () {
		return this._jsel >= 0 ? this.getItemAtIndex(this._jsel): null;
	},
	
	setSelectedItem: function (item) {
		if (item == null)
			this.setSelectedIndex(-1);
		else if (item.$instanceof(zul.wgt.Radio))
			item.setSelected(true);
	},
	appendItem: function (label, value) {
		var item = new zul.wgt.Radio();
		item.setLabel(label);
		item.setValue(value);
		this.appendChild(item);
		return item;
	},
	
	removeItemAt: function (index) {
		var item = this.getItemAtIndex(index);
		if (item && !this._rmExtern(item)) {
			var p = item.parent;
			if (p) p.removeChild(item);
		}
		return item;
	},

	
	_fixSelectedIndex: function () {
		this._jsel = _fixSelIndex(this, {value: 0});
	},
	_fixOnAdd: function (child) {
		if (this._jsel >= 0 && child.isSelected()) {
			child.setSelected(false); 
		} else {
			this._fixSelectedIndex();
		}
	},
	_fixOnRemove: function (child) {
		if (child.isSelected()) {
			this._jsel = -1;
		} else if (this._jsel > 0) { 
			this._fixSelectedIndex();
		}
	},

	_addExtern: function (radio) {
		this._externs.push(radio);
		if (!_redudant(this, radio))
			this._fixOnAdd(radio);
	},
	_rmExtern: function (radio) {
		if (this._externs.$remove(radio)) {
			if (!_redudant(this, radio))
				this._fixOnRemove(radio);
			return true;
		}
	}
});
})();