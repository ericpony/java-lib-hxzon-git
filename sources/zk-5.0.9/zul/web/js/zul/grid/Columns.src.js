

zul.grid.Columns = zk.$extends(zul.mesh.HeadWidget, {
	_menupopup: "none",
	_columnshide: true,
	_columnsgroup: true,

	$define: {
		
		
		columnshide: _zkf = function () {
			if (this.desktop)
				this._initColMenu();
		},
		
		
		columnsgroup: _zkf,
		
		
		menupopup: function () {
			if (this._menupopup != 'auto')
				this._mpop = null;
			this.rerender();		
		}
	},
	
	getGrid: function () {
		return this.parent;
	},
	rerender: function () {
		if (this.desktop) {
			if (this.parent)
				this.parent.rerender();
			else 
				this.$supers('rerender', arguments);
		}
		return this;
	},
	
	setPopup: function (mpop) {
		if (zk.Widget.isInstance(mpop)) {
			this._menupopup = mpop;
			this._mpop = null;
		}
		return this;
	},
	getZclass: function () {
		return this._zclass == null ? "z-columns" : this._zclass;
	},
	bind_: function (dt, skipper, after) {
		this.$supers(zul.grid.Columns, 'bind_', arguments);
		zWatch.listen({onResponse: this});
		var w = this;
		if (this._menupopup == 'auto') {
			after.push(function() {
				w._initColMenu();
			});
		}
	},
	unbind_: function () {
		zWatch.unlisten({onResponse: this});
		if (this._mpop) {
			this._mpop.parent.removeChild(this._mpop);
			this._shallColMenu = this._mpop = null;
		}
		this.$supers(zul.grid.Columns, 'unbind_', arguments);
	},
	onResponse: function () {
		if (this._shallColMenu)
			this.syncColMenu();
	},
	_syncColMenu: function () {
		this._shallColMenu = true;
	},
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		this._syncColMenu();
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);
		if (!this.childReplacing_)
			this._syncColMenu();
	},
	_initColMenu: function () {
		if (this._mpop)
			this._mpop.parent.removeChild(this._mpop);
		this._mpop = new zul.grid.ColumnMenupopup({columns: this});
	},
	
	syncColMenu: function () {
		this._shallColMenu = false;
		if (this._mpop) 
			this._mpop.syncColMenu();
	},
	_onColVisi: function (evt) {
		var item = evt.currentTarget,
			pp = item.parent;
			
		pp.close({sendOnOpen: true});
		var checked = 0;
		for (var w = pp.firstChild; w; w = w.nextSibling) {
			if (w.$instanceof(zul.menu.Menuitem) && w.isChecked())
				checked++;
		}
		if (checked == 0)
			item.setChecked(true);
			
		var col = zk.Widget.$(item._col);
		if (col && col.parent == this)
			col.setVisible(item.isChecked());
	},
	_onGroup: function (evt) {
		this._mref.fire('onGroup');
	},
	_onAsc: function (evt) {
		this._mref.fire('onSort', true); 
	},
	_onDesc: function (evt) {
		this._mref.fire('onSort', false); 
	},
	_onMenuPopup: function (evt) {
		if (this._mref) {
			var zcls = this._mref.getZclass(),
				n = this._mref.$n();
			jq(n).removeClass(zcls + '-visi').removeClass(zcls + '-over');
		}
		this._mref = evt.data.reference; 
	}
});

zul.grid.ColumnMenupopup = zk.$extends(zul.menu.Menupopup, {
	$define: {
		columns: null
	},
	
	$init: function () {
		this.$supers('$init', arguments);
		this.afterInit(this._init);
	},
	
	getAscitem: function () {
		return this._asc;
	},
	
	getDescitem: function () {
		return this._desc;
	},
	
	getGroupitem: function () {
		return this._group;
	},
	_init: function () {
		var w = this._columns,
			zcls = w.getZclass();

		this.listen({onOpen: [w, w._onMenuPopup]});
		
		if (zk.feature.pe && w.isColumnsgroup()) {
			if (!zk.isLoaded('zkex.grid'))
				zk.load('zkex.grid');
			var group = new zul.menu.Menuitem({label: msgzul.GRID_GROUP});
				group.setSclass(zcls + '-menu-grouping');
				group.listen({onClick: [w, w._onGroup]});
			this.appendChild(group);
			this._group = group;
		}
		var asc = new zul.menu.Menuitem({label: msgzul.GRID_ASC});
			asc.setSclass(zcls + '-menu-asc');
			asc.listen({onClick: [w, w._onAsc]});
		this._asc = asc;
		this.appendChild(asc);
		
		var desc = new zul.menu.Menuitem({label: msgzul.GRID_DESC});
		desc.setSclass(zcls + '-menu-dsc');
		desc.listen({onClick: [w, w._onDesc]});
		this._desc = desc;
		this.appendChild(desc);
		this.syncColMenu();
		w.getPage().appendChild(this);
	},
	
	syncColMenu: function () {
		var w = this._columns;
		for (var c = this.lastChild, p; c != this._desc;) {
			p = c.previousSibling;
			this.removeChild(c);
			c = p;
		}
		if (w && w.isColumnshide()) {
			var sep = new zul.menu.Menuseparator();
			this.appendChild(sep);
			for (var item, c = w.firstChild; c; c = c.nextSibling) {
				item = new zul.menu.Menuitem({
					label: c.getLabel(),
					autocheck: true,
					checkmark: true,
					checked: c.isVisible()
				});
				item._col = c.uuid;
				item.listen({onClick: [w, w._onColVisi]});
				this.appendChild(item);
			}
		}
	}
});