
(function () {

	function _isListgroup(wgt) {
		return zk.isLoaded('zkex.sel') && wgt.$instanceof(zkex.sel.Listgroup);
	}
	function _syncFrozen(wgt) {
		if (wgt && (wgt = wgt.frozen))
			wgt._syncFrozen();
	}

var Listbox =

zul.sel.Listbox = zk.$extends(zul.sel.SelectWidget, {
	_nrows: 0,
	
	groupSelect: false,
	$define:{
		emptyMessage:function(msg){
			if(this.desktop) jq("td",this.$n("empty")).html(msg);
		}
	},	
	$init: function () {
		this.$supers('$init', arguments);
		this._groupsInfo = [];
	},
	
	getGroupCount: function () {
		return this._groupsInfo.length;
	},
	
	getGroups: function () {
		return this._groupsInfo.$clone();
	},
	
	hasGroup: function () {
		return this._groupsInfo.length;
	},
	
	nextItem: function (p) {
		if (p)
			while ((p = p.nextSibling)
			&& !p.$instanceof(zul.sel.Listitem))
				;
		return p;
	},
	
	previousItem: function (p) {
		if (p)
			while ((p = p.previousSibling)
			&& !p.$instanceof(zul.sel.Listitem))
				;
		return p;
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
				this.stripe();
		}
		return this;
	},
	
	inSelectMold: function () {
		return "select" == this.getMold();
	},
	
	onSize: function () {
		this.$supers("onSize", arguments);
		this._syncSelInView();
	},
	bind_: function (desktop, skipper, after) {
		this.$supers(Listbox, 'bind_', arguments); 
		this._shallStripe = true;
		var w = this;
		after.push(zk.booted ? function(){setTimeout(function(){w.onResponse();},0)}: this.proxy(this.stripe));
		after.push(function () {
			_syncFrozen(w);
		});
		this._shallScrollIntoView = true;
		
		
		if (zk.ie6_ && this.getSelectedIndex() > -1)
			zk(this).redoCSS();
	},
	_syncSelInView: function () {
		if (this._shallScrollIntoView) {
			var index = this.getSelectedIndex();
			if (index >= 0) { 
				var si;
				for (var it = this.getBodyWidgetIterator(); index-- >= 0;) 
					si = it.next();
				if (si) {
					zk(si).scrollIntoView(this.ebody);
					this._tmpScrollTop = this.ebody.scrollTop;
				}
			}
			
			this._shallScrollIntoView = false;
		}
	},
	_doScroll: function () {
		
		
		if (this._tmpScrollTop) {
			this.ebody.scrollTop = this._tmpScrollTop; 
			this._tmpScrollTop = null;
		}
		this.$super(zul.sel.Listbox, '_doScroll');
	},
	onResponse: function () {
		if (this.desktop) {
			if (this._shallStripe)
				this.stripe();
			if (this._shallFixEmpty) 
				this._fixForEmpty();
		}
		this.$supers('onResponse', arguments);
	},
	_syncStripe: function () {
		this._shallStripe = true;
	},
	
	stripe: function () {
		var scOdd = this.getOddRowSclass();
		if (!scOdd) return;
		var odd = this._offset & 1;
		for (var j = 0, even = !odd, it = this.getBodyWidgetIterator(), w; (w = it.next()); j++) {
			if (w.isVisible() && w.isStripeable_()) {
				jq(w.$n())[even ? 'removeClass' : 'addClass'](scOdd);
				even = !even;
			}
		}
		this._shallStripe = false;
		return this;
	},
	rerender: function () {
		this.$supers('rerender', arguments);
		this._syncStripe();		
		return this;
	},

	
	getFocusCell: function (el) {
		var tbody = this.getCaveNode();
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
	getCaveNode: function () {
		return this.$n('rows') || this.$n('cave');
	},	
	insertChildHTML_: function (child, before, desktop) {
		if (before = before && (!child.$instanceof(zul.sel.Listitem) || before.$instanceof(zul.sel.Listitem)) ? before.getFirstNode_(): null)
			jq(before).before(child.redrawHTML_());
		else
			jq(this.getCaveNode()).append(child.redrawHTML_());
		child.bind(desktop);
	},
	getZclass: function () {
		return this._zclass == null ? "z-listbox" : this._zclass;
	},
	insertBefore: function (child, sibling, ignoreDom) {
		if (this.$super('insertBefore', child, sibling,
		ignoreDom || (!this.z_rod && !child.$instanceof(zul.sel.Listitem)))) {
			this._fixOnAdd(child, ignoreDom);
			return true;
		}
	},
	appendChild: function (child, ignoreDom) {
		if (this.$super('appendChild', child,
		ignoreDom || (!this.z_rod && !child.$instanceof(zul.sel.Listitem)))) {
			if (!this.insertingBefore_)
				this._fixOnAdd(child, ignoreDom);
			return true;
		}
	},
	_fixOnAdd: function (child, ignoreDom, stripe, ignoreAll) {
		var noRerender;
		if (child.$instanceof(zul.sel.Listitem)) {
			if (_isListgroup(child))
				this._groupsInfo.push(child);
			if (!this.firstItem || !this.previousItem(child))
				this.firstItem = child;
			if (!this.lastItem || !this.nextItem(child))
				this.lastItem = child;
			++this._nrows;
			
			if (child.isSelected() && !this._selItems.$contains(child))
				this._selItems.push(child);
			noRerender = stripe = true;
		} else if (child.$instanceof(zul.sel.Listhead)) {
			this.listhead = child;
		} else if (child.$instanceof(zul.mesh.Paging)) {
			this.paging = child;
		} else if (child.$instanceof(zul.sel.Listfoot)) {
			this.listfoot = child;
		} else if (child.$instanceof(zul.mesh.Frozen)) {
			this.frozen = child;
		}
		
		this._syncEmpty();
		
		if (!ignoreAll) {
			if (!ignoreDom && !noRerender)
				return this.rerender();
			if (stripe)
				this._syncStripe();
			if (!ignoreDom)
				this._syncSize();
			if (this.desktop)
				_syncFrozen(this);
		}
	},
	removeChild: function (child, ignoreDom) {
		if (this.$super('removeChild', child, ignoreDom)) {
			this._fixOnRemove(child, ignoreDom);
			return true;
		}
	},
	_fixOnRemove: function (child, ignoreDom) {
		var stripe;
		if (child == this.listhead)
			this.listhead = null;
		else if (child == this.paging)
			this.paging = null;
		else if (child == this.frozen)
			this.frozen = null;
		else if (child == this.listfoot)
			this.listfoot = null;
		else if (!child.$instanceof(zul.mesh.Auxhead)) {
			if (child == this.firstItem) {
				for (var p = this.firstChild, Listitem = zul.sel.Listitem;
				p && !p.$instanceof(Listitem); p = p.nextSibling)
					;
				this.firstItem = p;
			}
			if (child == this.lastItem) {
				for (var p = this.lastChild, Listitem = zul.sel.Listitem;
				p && !p.$instanceof(Listitem); p = p.previousSibling)
					;
				this.lastItem = p;
			}
			if (_isListgroup(child))
				this._groupsInfo.$remove(child);
			--this._nrows;
			
			if (child.isSelected())
				this._selItems.$remove(child);
			stripe = true;
		}
		this._syncEmpty();
		if (!ignoreDom) { 
			if (stripe) this._syncStripe();
			this._syncSize();
		}
	},
	
	redrawEmpty_: function (out) {
		var cols = (this.listhead && this.listhead.nChildren) || 1 , 
			uuid = this.uuid, zcls = this.getZclass();
		out.push('<tbody id="',uuid,'-empty" class="',zcls,'-empty-body" ', 
		((!this._emptyMessage || this._nrows) ? ' style="display:none"' : '' ),
			'><tr><td colspan="', cols ,'">' , this._emptyMessage ,'</td></tr></tbody>');
	},
	_syncEmpty: function () {
		this._shallFixEmpty = true;
	},
	_fixForEmpty: function () {
		if (this.desktop) {
			if(this._nrows)
				jq(this.$n("empty")).hide();
			else
				jq(this.$n("empty")).show();
		}
	},
	onChildReplaced_: function (oldc, newc) {
		this.$supers('onChildReplaced_', arguments);

		if (oldc) this._fixOnRemove(oldc, true);
		if (newc) this._fixOnAdd(newc, true, false, true); 

		if ((oldc && oldc.$instanceof(zul.sel.Listitem))
		|| (newc && newc.$instanceof(zul.sel.Listitem)))
			this._syncStripe();
		this._syncSize();
		if (this.desktop)
			_syncFrozen(this);
	},
	
	getHeadWidgetClass: function () {
		return zul.sel.Listhead;
	},
	
	itemIterator: _zkf = function (opts) {
		return new zul.sel.ItemIter(this, opts);
	},
	
	getBodyWidgetIterator: _zkf,
	_updHeaderCM: function () {
		
		var lh;
		if (this._headercm && this._multiple 
			&& (lh = this.listhead) && (lh = lh.firstChild))
			lh._checked = this._isAllSelected();
		this.$supers('_updHeaderCM', arguments);
	}
});

zul.sel.ItemIter = zk.$extends(zk.Object, {
	
	$init: function (box, opts) {
		this.box = box;
		this.opts = opts;
	},
	_init: function () {
		if (!this._isInit) {
			this._isInit = true;
			var p = this.box.firstItem;
			if(this.opts && this.opts.skipHidden)
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
			q = p ? p.parent.nextItem(p) : null;
		if (this.opts && this.opts.skipHidden)
			for (; q && !q.isVisible(); q = q.parent.nextItem(q)) {}
		if (p) 
			this.p = q;
		return p;
	}
});

})();
