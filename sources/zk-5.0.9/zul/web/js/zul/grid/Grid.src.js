




zul.grid.Renderer = {
	
	updateColumnMenuButton: function (col) {
		var btn;
		if (btn = col.$n('btn')) btn.style.height = col.$n().offsetHeight - 1 + "px";
	}
};


zul.grid.Grid = zk.$extends(zul.mesh.MeshWidget, {
	$define:{
		emptyMessage:function(msg){
			if(this.desktop) jq("td",this.$n("empty")).html(msg);
		}
	},
		
	getCell: function (row, col) {
		var rows;
		if (!(rows = this.rows)) return null;
		if (rows.nChildren <= row) return null;

		var row = rows.getChildAt(row);
		return row.nChildren <= col ? null: row.getChildAt(col);
	},
	
	getOddRowSclass: function () {
		return this._scOddRow == null ? this.getZclass() + "-odd" : this._scOddRow;
	},
	
	setOddRowSclass: function (scls) {
		if (!scls) scls = null;
		if (this._scOddRow != scls) {
			this._scOddRow = scls;
			var n = this.$n();
			if (n && this.rows)
				this.rows.stripe();
		}
		return this;
	},
	rerender: function () {
		this.$supers('rerender', arguments);
		if (this.rows)
			this.rows._syncStripe();
		return this;
	},
	
	getFocusCell: function (el) {
		var tbody = this.rows.$n();
		if (jq.isAncestor(tbody, el)) {
			var tds = jq(el).parents('td'), td;
			for (var i = 0, j = tds.length; i < j; i++) {
				td = tds[i];
				if (td.parentNode.parentNode == tbody) {
					return td;
				}
			}
		}
	},
	getZclass: function () {
		return this._zclass == null ? "z-grid" : this._zclass;
	},
	insertBefore: function (child, sibling, ignoreDom) {
		if (this.$super('insertBefore', child, sibling, !this.z_rod)) {
			this._fixOnAdd(child, ignoreDom, ignoreDom);
			return true;
		}
	},
	appendChild: function (child, ignoreDom) {
		if (this.$super('appendChild', child, !this.z_rod)) {
			if (!this.insertingBefore_)
				this._fixOnAdd(child, ignoreDom, ignoreDom);
			return true;
		}
	},
	_fixOnAdd: function (child, ignoreDom, _noSync) {
		if (child.$instanceof(zul.grid.Rows)) {
			this.rows = child;
			this.fixForEmpty_();
		} else if (child.$instanceof(zul.grid.Columns)) 
			this.columns = child;
		else if (child.$instanceof(zul.grid.Foot)) 
			this.foot = child;
		else if (child.$instanceof(zul.mesh.Paging)) 
			this.paging = child;
		else if (child.$instanceof(zul.mesh.Frozen)) 
			this.frozen = child;

		if (!ignoreDom)
			this.rerender();
		if (!_noSync)
			this._syncSize();  
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);

		var isRows;
		if (child == this.rows) {
			this.rows = null;
			isRows = true;
			this.fixForEmpty_();
		} else if (child == this.columns) 
			this.columns = null;
		else if (child == this.foot) 
			this.foot = null;
		else if (child == this.paging) 
			this.paging = null;
		else if (child == this.frozen) 
			this.frozen = null;

		if (!isRows && !this.childReplacing_) 
			this._syncSize();
	},
	
	_isEmpty: function () {
		return this.rows ? this.rows.nChildren : false; 
	},
	
	redrawEmpty_: function (out) {
		var cols = this.columns ? this.columns.nChildren : 1,
			uuid = this.uuid, zcls = this.getZclass();
		out.push('<tbody id="',uuid,'-empty" class="',zcls,'-empty-body" ', 
		( !this._emptyMessage || this._isEmpty()  ? ' style="display:none"' : '' ),
			'><tr><td colspan="', cols ,'">' , this._emptyMessage ,'</td></tr></tbody>');
	},
	
	fixForEmpty_: function () {
		if (this.desktop) {
			if(this._isEmpty())
				jq(this.$n("empty")).hide();
			else
				jq(this.$n("empty")).show();
		}
	},	
	onChildAdded_: function(child) {
		this.$supers('onChildAdded_', arguments);
		if (this.childReplacing_) 
			this._fixOnAdd(child, true); 
		
	},
	insertChildHTML_: function (child, before, desktop) {
		if (child.$instanceof(zul.grid.Rows)) {
			this.rows = child;
			var fakerows = this.$n('rows');
			if (fakerows) {
				jq(fakerows).replaceWith(child.redrawHTML_());
				child.bind(desktop);
				this.ebodyrows = child.$n().rows;
				return;
			} else {
				var tpad = this.$n('tpad');
				if (tpad) {
					jq(tpad).after(child.redrawHTML_());
					child.bind(desktop);
					this.ebodyrows = child.$n().rows;
					return;
				} else if (this.ebodytbl) {
					jq(this.ebodytbl).append(child.redrawHTML_());
					child.bind(desktop);
					this.ebodyrows = child.$n().rows;
					return;
				}
			}
		}

		this.rerender();
	},
	
	getHeadWidgetClass: function () {
		return zul.grid.Columns;
	},
	
	getBodyWidgetIterator: function (opts) {
		return new zul.grid.RowIter(this, opts);
	}
});

zul.grid.RowIter = zk.$extends(zk.Object, {
	
	$init: function (grid, opts) {
		this.grid = grid;
		this.opts = opts;
	},
	_init: function () {
		if (!this._isInit) {
			this._isInit = true;
			var p = this.grid.rows ? this.grid.rows.firstChild: null;
			if (this.opts && this.opts.skipHidden)
				for (; p && !p.isVisible(); p = p.nextSibling) {}
			this.p = p;
		}
	},
	 
	hasNext: function () {
		this._init();
		return this.p;
	},
	
	next: function () {
		this._init();
		var p = this.p,
			q = p ? p.nextSibling : null;
		if (this.opts && this.opts.skipHidden)
			for (; q && !q.isVisible(); q = q.nextSibling) {}
		if (p) 
			this.p = q;
		return p;
	}
});