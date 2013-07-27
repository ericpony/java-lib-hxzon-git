
(function () {

	function _isPE() {
		return zk.feature.pe && zk.isLoaded('zkex.grid');
	}
	function _syncFrozen(wgt) {
		if ((wgt = wgt.getGrid()) && (wgt = wgt.frozen))
			wgt._syncFrozen();
	}

var Rows =

zul.grid.Rows = zk.$extends(zul.Widget, {
	_visibleItemCount: 0,
	$init: function () {
		this.$supers('$init', arguments);
		this._groupsInfo = [];
	},
	$define: {
		
		visibleItemCount: null
	},
	
	getGrid: function () {
		return this.parent;
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
	getZclass: function () {
		return this._zclass == null ? "z-rows" : this._zclass;
	},
	bind_: function (desktop, skipper, after) {
		this.$supers(Rows, 'bind_', arguments);
		zWatch.listen({onResponse: this});
		var w = this;
		after.push(zk.booted ? function(){setTimeout( function(){w.onResponse();},0)}: this.proxy(this.stripe));

		
		after.push(function () {
			_syncFrozen(w);
		});
	},
	unbind_: function () {
		zWatch.unlisten({onResponse: this});
		this.$supers(Rows, 'unbind_', arguments);
	},
	onResponse: function () {
		if (this.desktop){
			if (this._shallStripe) { 
				this.stripe();
				this.getGrid().onSize();
			}
			if(this._shallFixEmpty)
				this.getGrid().fixForEmpty_();
		}
	},
	_syncStripe: function () {
		this._shallStripe = true;
	},
	_syncEmptyState: function () {
		this._shallFixEmpty = true;
	},
	
	stripe: function () {
		var grid = this.getGrid(),
			scOdd = grid.getOddRowSclass();
		if (!scOdd) return;
		var n = this.$n();
		if (!n) return; 

		for (var j = 0, w = this.firstChild, even = !(this._offset & 1); w; w = w.nextSibling, ++j) {
			if (w.isVisible() && w.isStripeable_()) {
				
				for (;n.rows[j] && n.rows[j].id != w.uuid;++j);

				jq(n.rows[j])[even ? 'removeClass' : 'addClass'](scOdd);
				w.fire("onStripe");
				even = !even;
			}
		}
		this._shallStripe = false;
	},
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		if (_isPE() && child.$instanceof(zkex.grid.Group))
			this._groupsInfo.push(child);
		if(this.getGrid() && this.getGrid().fixForRowAdd_) 
			this.getGrid().fixForRowAdd_();
		this._syncStripe();
		this._syncEmptyState();
		if (this.desktop)
			_syncFrozen(this);
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);
		if (_isPE() && child.$instanceof(zkex.grid.Group))
			this._groupsInfo.$remove(child);
		if (!this.childReplacing_)
			this._syncStripe();
		this._syncEmptyState();
	},
	deferRedrawHTML_: function (out) {
		out.push('<tbody', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></tbody>');
	}
});
})();