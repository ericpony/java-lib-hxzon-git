
(function () {
	function _updCells(tch, jcol) {
		if (tch)
			for (var w = tch.firstChild, tr; w; w = w.nextSibling) {
				if ((tr = w.treerow) && jcol < tr.nChildren) 
					tr.getChildAt(jcol).rerender(0);

				_updCells(w.treechildren, jcol); 
			}
	}
	
	function _sort0(treechildren, col, dir, sorting, isNumber) {
		var d = []
		for (var i = 0, z = 0, w = treechildren.firstChild; w; w = w.nextSibling, z++) {
			if (w.treechildren) 
				_sort0(w.treechildren, col, dir, sorting, isNumber);
			for (var k = 0, cell = w.getFirstCell(); cell; cell = cell.nextSibling, k++)
				if (k == col) {
					d[i++] = {
						wgt: cell,
						index: z
					};
				}
		}
		var dsc = dir == "ascending" ? -1 : 1;
		d.sort(function(a, b) {
			var v = sorting(a.wgt, b.wgt, isNumber) * dsc;
			if (v == 0) {
				v = (a.index < b.index ? -1 : 1);
			}
			return v;
		});
		for (var i = 0, k = d.length; i < k; i++) {
			treechildren.appendChild(d[i].wgt.parent.parent);
		}
	}


zul.sel.Treecol = zk.$extends(zul.mesh.SortWidget, {
	
	getTree: zul.mesh.HeaderWidget.prototype.getMeshWidget,
	
	getMeshBody: function () {
		var tree = this.getTree();
		return tree ? tree.treechildren : null;  
	},
	checkClientSort_: function (ascending) {
		var tree;
		return !(!this.getMeshBody() || !(tree = this.getTree()) || ('paging' == tree._mold))
				&& this.$supers('checkClientSort_', arguments);
	},
	replaceCavedChildrenInOrder_: function (ascending) {
		var mesh = this.getMeshWidget(),
			body = this.getMeshBody(),
			desktop = body.desktop;
		try {
			body.unbind();
			_sort0(body, this.getChildIndex(), this.getSortDirection(), this.sorting, 
				(this[ascending ? '_sortAscending': '_sortDescending'] == 'client(number)'));
			this._fixDirection(ascending);
		} finally {
			var old = mesh._syncingbodyrows;
			mesh._syncingbodyrows = true;
			try {
				mesh.clearCache();
				jq(mesh.$n('rows')).replaceWith(body.redrawHTML_());
				body.bind(desktop);
				mesh._bindDomNode();
			} finally {
				mesh._syncingbodyrows = old;
			}
		}
	},
	$define: {
		
		
		maxlength: [function (v) {
			return !v || v < 0 ? 0 : v; 
		}, function () {
			if (this.desktop) {
				this.rerender(0);
				this.updateCells_();
			}
		}]
	},
	updateCells_: function () {
		var tree = this.getTree();
		if (tree) {
			var jcol = this.getChildIndex(),
				tf = tree.treefoot;

			_updCells(tree.treechildren, jcol);

			if (tf && jcol < tf.nChildren)
				tf.getChildAt(jcol).rerender(0);
		}
	},
	getZclass: function () {
		return this._zclass == null ? "z-treecol" : this._zclass;
	},
	bind_: function () {
		this.$supers(zul.sel.Treecol, 'bind_', arguments);
		var n;
		if (n = this.$n())
			this.domListen_(n, 'onMouseOver', '_doSortMouseEvt')
				.domListen_(n, 'onMouseOut', '_doSortMouseEvt');
	},
	unbind_: function () {
		var n;
		if (n = this.$n())
			this.domUnlisten_(n, 'onMouseOver', '_doSortMouseEvt')
				.domUnlisten_(n, 'onMouseOut', '_doSortMouseEvt');
		this.$supers(zul.sel.Treecol, 'unbind_', arguments);
	},
	_doSortMouseEvt: function (evt) {
		var sort = this.getSortAscending();
		if (sort != 'none')
			jq(this.$n())[evt.name == 'onMouseOver' ? 'addClass' : 'removeClass'](this.getZclass() + '-sort-over');
	},
	
	domLabel_: function () {
		return zUtl.encodeXML(this.getLabel(), {maxlength: this._maxlength});
	}
});

})();