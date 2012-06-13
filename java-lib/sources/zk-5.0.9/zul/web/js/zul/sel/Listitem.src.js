
(function () {

	function _isPE() {
		return zk.isLoaded('zkex.sel');
	}

zul.sel.Listitem = zk.$extends(zul.sel.ItemWidget, {
	
	getListbox: zul.sel.ItemWidget.prototype.getMeshWidget,
	
	getListgroup: function () {
		
		if (_isPE() && this.parent && this.parent.hasGroup())
			for (var w = this; w; w = w.previousSibling)
				if (w.$instanceof(zkex.sel.Listgroup)) return w;
				
		return null;
	},
	
	setLabel: function (val) {
		this._autoFirstCell().setLabel(val);
	},
	
	setImage: function (val) {
		this._autoFirstCell().setImage(val);
	},
	_autoFirstCell: function () {
		if (!this.firstChild)
			this.appendChild(new zul.sel.Listcell());
		return this.firstChild;
	},
	
	getZclass: function () {
		return this._zclass == null ? "z-listitem" : this._zclass;
	},
	domStyle_: function (no) {
		if (_isPE() && (this.$instanceof(zkex.sel.Listgroup) || this.$instanceof(zkex.sel.Listgroupfoot))
				|| (no && no.visible))
			return this.$supers('domStyle_', arguments);
			
		var style = this.$supers('domStyle_', arguments),
			group = this.getListgroup();
		return group && !group.isOpen() ? style + "display:none;" : style;
	},
	domClass_: function () {
		var cls = this.$supers('domClass_', arguments),
			list = this.getListbox();
		if (list && jq(this.$n()).hasClass(list = list.getOddRowSclass()))
			return cls + ' ' + list; 
		return cls;
	},
	replaceWidget: function (newwgt) {
		this._syncListitems(newwgt);
		this.$supers('replaceWidget', arguments);
	},
	_updHeaderCM: function (bRemove) {
		
		var box, lh;
		if (!this.isSelected() && (box = this.getListbox()) 
			&& box._headercm && box._multiple && 
				(lh = box.listhead) && (lh = lh.firstChild))
			lh._checked = false;
		this.$supers('_updHeaderCM', arguments);
	},
	_syncListitems: function (newwgt) {
		var box;
		if (box = this.getListbox()) {
			if (box.firstItem.uuid == newwgt.uuid)
				box.firstItem = newwgt;
			if (box.lastItem.uuid == newwgt.uuid)
				box.lastItem = newwgt;

			var items = box._selItems, b1, b2;
			if (b1 = this.isSelected())
				items.$remove(this);
			if (b2 = newwgt.isSelected())
				items.push(newwgt);
			if (b1 != b2)
				box._updHeaderCM();
		}
	}
});
})();