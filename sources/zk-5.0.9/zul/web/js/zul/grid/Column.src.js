

zul.grid.Column = zk.$extends(zul.mesh.SortWidget, {
	
	getGrid: zul.mesh.HeaderWidget.prototype.getMeshWidget,

	$init: function () {
		this.$supers('$init', arguments);
		this.listen({onGroup: this}, -1000);
	},
	
	getMeshBody: function () {
		var grid = this.getGrid();
		return grid ? grid.rows : null;  
	},
	checkClientSort_: function (ascending) {
		var body;
		return !(!(body = this.getMeshBody()) || body.hasGroup()) &&
			this.$supers('checkClientSort_', arguments);
	},
	
	group: function (ascending, evt) {
		var dir = this.getSortDirection();
		if (ascending) {
			if ("ascending" == dir) return false;
		} else {
			if ("descending" == dir) return false;
		}

		var sorter = ascending ? this._sortAscending: this._sortDescending;
		if (sorter == "fromServer")
			return false;
		else if (sorter == "none") {
			evt.stop();
			return false;
		}
		
		var mesh = this.getMeshWidget();
		if (!mesh || mesh.isModel() || !zk.feature.pe || !zk.isLoaded('zkex.grid')) return false;
			
			
		var	body = this.getMeshBody();
		if (!body) return false;
		evt.stop();
		
		var desktop = body.desktop,
			node = body.$n();
		try {
			body.unbind();
			if (body.hasGroup()) {
				for (var gs = body.getGroups(), len = gs.length; --len >= 0;) 
					body.removeChild(gs[len]);
			}
			
			var d = [], col = this.getChildIndex();
			for (var i = 0, z = 0, it = mesh.getBodyWidgetIterator(), w; (w = it.next()); z++) 
				for (var k = 0, cell = w.firstChild; cell; cell = cell.nextSibling, k++) 
					if (k == col) {
						d[i++] = {
							wgt: cell,
							index: z
						};
					}
			
			var dsc = dir == "ascending" ? -1 : 1, fn = this.sorting, isNumber = sorter == "client(number)";
			d.sort(function(a, b) {
				var v = fn(a.wgt, b.wgt, isNumber) * dsc;
				if (v == 0) {
					v = (a.index < b.index ? -1 : 1);
				}
				return v;
			});
			
			
			for (;body.firstChild;)
				body.removeChild(body.firstChild);
			
			for (var previous, row, index = this.getChildIndex(), i = 0, k = d.length; i < k; i++) {
				row = d[i];
				if (!previous || fn(previous.wgt, row.wgt, isNumber) != 0) {
					
					var group, cell = row.wgt.parent.getChildAt(index);
					if (cell && cell.$instanceof(zul.wgt.Label)) {
						group = new zkex.grid.Group();
						group.appendChild(new zul.wgt.Label({
							value: cell.getValue()
						}));
					} else {
						var cc = cell.firstChild;
						if (cc && cc.$instanceof(zul.wgt.Label)) {
							group = new zkex.grid.Group();
							group.appendChild(new zul.wgt.Label({
								value: cc.getValue()
							}));
						} else {
							group = new zkex.grid.Group();
							group.appendChild(new zul.wgt.Label({
								value: msgzul.GRID_OTHER
							}));
						}
					}
					body.appendChild(group);
				}
				body.appendChild(row.wgt.parent);
				previous = row;
			}
			this._fixDirection(ascending);
		} finally {
			body.replaceHTML(node, desktop);
		}
		return true;
	},
	setLabel: function (label) {
		this.$supers('setLabel', arguments);
		if (this.parent)
			this.parent._syncColMenu();
	},
	setVisible: function (visible) {
		if (this.isVisible() != visible) {
			this.$supers('setVisible', arguments);
			if (this.parent)
				this.parent._syncColMenu();
		}
	},
	
	onGroup: function (evt) {
		var dir = this.getSortDirection();
		if ("ascending" == dir) this.group(false, evt);
		else if ("descending" == dir) this.group(true, evt);
		else if (!this.group(true, evt)) this.group(false, evt);
	},
	getZclass: function () {
		return this._zclass == null ? "z-column" : this._zclass;
	},
	bind_: function () {
		this.$supers(zul.grid.Column, 'bind_', arguments);
		var n = this.$n();
		this.domListen_(n, "onMouseOver")
			.domListen_(n, "onMouseOut");
		var btn = this.$n('btn');
		if (btn)
			this.domListen_(btn, "onClick");
	},
	unbind_: function () {
		var n = this.$n();
		this.domUnlisten_(n, "onMouseOver")
			.domUnlisten_(n, "onMouseOut");
		var btn = this.$n('btn');
		if (btn)
			this.domUnlisten_(btn, "onClick");
		this.$supers(zul.grid.Column, 'unbind_', arguments);
	},
	_doMouseOver: function(evt) {
		if (this.isSortable_() || (this.parent._menupopup && this.parent._menupopup != 'none')) {
			jq(this.$n()).addClass(this.getZclass() + "-over");
			zul.grid.Renderer.updateColumnMenuButton(this);
		}
	},
	_doMouseOut: function (evt) {
		if (this.isSortable_() || (this.parent._menupopup && this.parent._menupopup != 'none')) {
			var n = this.$n(), $n = jq(n),
				zcls = this.getZclass();
			if (!$n.hasClass(zcls + "-visi") &&
				(!zk.ie || !jq.isAncestor(n, evt.domEvent.relatedTarget || evt.domEvent.toElement)))
					$n.removeClass(zcls + "-over");
		}
	},
	_doClick: function (evt) {
		if (this.parent._menupopup && this.parent._menupopup != 'none') {
			var pp = this.parent._menupopup,
				n = this.$n(),
				btn = this.$n('btn'),
				zcls = this.getZclass();
				
			jq(n).addClass(zcls + "-visi");
			
			if (pp == 'auto' && this.parent._mpop)
				pp = this.parent._mpop;
			else
				pp = this.$f(this.parent._menupopup);

			if (zul.menu.Menupopup.isInstance(pp)) {
				var ofs = zk(btn).revisedOffset(),
					asc = this.getSortAscending() != 'none',
					desc = this.getSortDescending() != 'none';
				if (pp.$instanceof(zul.grid.ColumnMenupopup)) {
					pp.getAscitem().setVisible(asc);
					pp.getDescitem().setVisible(desc);
					if (pp.getGroupitem()) 
						pp.getGroupitem().setVisible((asc || desc));
					
					var sep = pp.getDescitem().nextSibling;
					if (sep) 
						sep.setVisible((asc || desc));
				} else {
					pp.listen({onOpen: [this.parent, this.parent._onMenuPopup]});
				}
				pp.open(btn, [ofs[0], ofs[1] + btn.offsetHeight - 4], null, {sendOnOpen: true});
			}
			evt.stop(); 
		}
	}
});
