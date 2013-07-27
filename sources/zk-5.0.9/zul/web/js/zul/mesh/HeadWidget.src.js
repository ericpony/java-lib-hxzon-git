
(function () {
	
	var _fixOnChildChanged = zk.opera ? function (head) {
		return (head = head.parent) && head.rerender(0); 
	}: zk.$void;

	function _syncFrozen(wgt) {
		if ((wgt = wgt.getMeshWidget()) && (wgt = wgt.frozen))
			wgt._syncFrozen();
	}

var HeadWidget =

zul.mesh.HeadWidget = zk.$extends(zul.Widget, {
	$init: function () {
		this.$supers('$init', arguments);
		this.listen({onColSize: this}, -1000);
	},

	$define: {
		
		
		sizable: function () {
			this.rerender(0);
		}
	},

	removeChildHTML_: function (child) {
		this.$supers('removeChildHTML_', arguments);
		if (!this.$instanceof(zul.mesh.Auxhead))
			for (var faker, fs = child.$class._faker, i = fs.length; i--;)
				jq(child.uuid + '-' + fs[i], zk).remove();
	},
	
	
	setVflex: function (v) { 
		v = false;
		this.$super(HeadWidget, 'setVflex', v);
	},
	
	setHflex: function (v) { 
		v = false;
		this.$super(HeadWidget, 'setHflex', v);
	},

	
	getMeshWidget: function () {
		return this.parent;
	},

	onColSize: function (evt) {
		var owner = this.parent;
		evt.column._width = evt.width;
		owner._innerWidth = owner.eheadtbl.width || owner.eheadtbl.style.width;
		owner.fire('onInnerWidth', owner._innerWidth);
		owner.fireOnRender(zk.gecko ? 200 : 60);
	},

	bind_: function (desktop, skipper, after) {
		this.$supers(HeadWidget, 'bind_', arguments);
		var w = this;
		after.push(function () {
			_syncFrozen(w);
		});
	},
	unbind_: function () {
		jq(this.hdfaker).remove();
		jq(this.bdfaker).remove();
		jq(this.ftfaker).remove();
		this.$supers(HeadWidget, 'unbind_', arguments);
	},
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		if (this.desktop) {
			if (!_fixOnChildChanged(this) && this.parent._fixHeaders())
				this.parent.onSize();
			_syncFrozen(this);
			this.parent._minWd = null;
		}
	},
	onChildRemoved_: function () {
		this.$supers('onChildRemoved_', arguments);
		if (this.desktop) {
			if (!_fixOnChildChanged(this) && !this.childReplacing_ &&
				this.parent._fixHeaders()) 
				this.parent.onSize();
			this.parent._minWd = null;
		}
	},
	beforeChildrenFlex_: function (hwgt) { 
		if (hwgt && !hwgt._flexFixed) {
			
			
			var wgt = this.parent,
				hdfaker = wgt.ehdfaker,
				bdfaker = wgt.ebdfaker,
				hdf = hdfaker ? hdfaker.firstChild : null,
				bdf = bdfaker ? bdfaker.firstChild : null,
				everFlex = false; 
			for(var h = this.firstChild; h; h = h.nextSibling) {
				if (h._nhflex > 0) { 
					everFlex = true;
					if (hdf) hdf.style.width = '';
					if (bdf) bdf.style.width = '';
				}
				if (hdf) hdf = hdf.nextSibling;
				if (bdf) bdf = bdf.nextSibling;
			}
			if (zk.ie < 8 && everFlex) { 
				if (hdf) hdf.style.width='0px';
				if (bdf) bdf.style.width='0px';
			}
		}
		return true;
	},
	afterChildrenFlex_: function (hwgt) { 
		var wgt = this.parent;
		if (wgt) {
			wgt._adjFlexWd();
			wgt._adjSpanWd(); 
			wgt._removeScrollbar(); 
		}
	},
	deferRedrawHTML_: function (out) {
		out.push('<tr', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></tr>');
	}
},{ 
	redraw: function (out) {
		out.push('<tr', this.domAttrs_(), ' align="left">');
		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
		out.push('</tr>');
	}
});

})();