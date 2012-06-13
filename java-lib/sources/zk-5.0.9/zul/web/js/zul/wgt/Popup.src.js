

zul.wgt.Popup = zk.$extends(zul.Widget, {
	_visible: false,
	
	isOpen: function () {
		return this.isVisible();
	},
	
	
	open: function (ref, offset, position, opts) {
		var posInfo = this._posInfo(ref, offset, position),
			node = this.$n(),
			top = node.style.top,
			$n = jq(node);
		
		
		
		
		
		
		this._openInfo = arguments;

		$n.css({position: "absolute"}).zk.makeVParent();
		zWatch.fireDown("onVParent", this);

		if (posInfo)
			$n.zk.position(posInfo.dim, posInfo.pos, opts);
		
		this.setFloating_(true); 
		this.setVisible(true);
		this.setTopmost();
		
		if ((!opts || !opts.disableMask) && this.isListen("onOpen", {asapOnly:true})) {
			
			if (this.mask) this.mask.destroy(); 
			
			
			this.mask = new zk.eff.Mask({
				id: this.uuid + "-mask",
				anchor: node
			});
			
			
			
			zWatch.listen({onResponse: this});		
		}
		if (this.shallStackup_()) {
			if (!this._stackup)
				this._stackup = jq.newStackup(node, node.id + "-stk");
			else {
				var dst, src;
				(dst = this._stackup.style).top = (src = node.style).top;
				dst.left = src.left;
				dst.zIndex = src.zIndex;
				dst.display = "block";
			}
		}
		ref = zk.Widget.$(ref); 
		if (opts && opts.sendOnOpen) this.fire('onOpen', {open: true, reference: ref});
	},
	
	shallStackup_: function () {
		return zk.eff.shallStackup();
	},
	
	position: function (ref, offset, position, opts) {
		var posInfo = this._posInfo(ref, offset, position);
		if (posInfo)
			zk(this.$n()).position(posInfo.dim, posInfo.pos, opts);
	},
	_posInfo: function (ref, offset, position, opts) {
		var pos, dim;
		
		if (ref && position) {
			if (typeof ref == 'string')
				ref = zk.Widget.$(ref);
				
			if (ref) {
				var refn = zul.Widget.isInstance(ref) ? ref.$n() : ref;
				pos = position;
				dim = zk(refn).dimension(true);
			}
		} else if (jq.isArray(offset)) {
			dim = {
				left: zk.parseInt(offset[0]), top: zk.parseInt(offset[1]),
				width: 0, height: 0
			}
		}
		if (dim) return {pos: pos, dim: dim};
	},
	onResponse: function () {
		if (this.mask) this.mask.destroy();
		
		var openInfo = this._openInfo;
		if (openInfo) {
			this.position.apply(this, openInfo);
			this._openInfo = null;
		}
		zWatch.unlisten({onResponse: this});
		this.mask = null;
	},
	
	close: function (opts) {
		if (this._stackup)
			this._stackup.style.display = "none";
		
		this.setVisible(false);
		zk(this.$n()).undoVParent();
		zWatch.fireDown("onVParent", this);

		this.setFloating_(false);
		if (opts && opts.sendOnOpen) this.fire('onOpen', {open:false});
	},
	getZclass: function () {
		var zcls = this._zclass;
		return zcls != null ? zcls: "z-popup";
	},
	onFloatUp: function(ctl){
		if (!this.isVisible()) 
			return;
		var wgt = ctl.origin;
		
		for (var floatFound; wgt; wgt = wgt.parent) {
			if (wgt == this) {
				if (!floatFound) 
					this.setTopmost();
				return;
			}
			floatFound = floatFound || wgt.isFloating_();
		}
		this.close({sendOnOpen:true});
	},
	bind_: function () {
		this.$supers(zul.wgt.Popup, 'bind_', arguments);
		zWatch.listen({onFloatUp: this, onShow: this});
		this.setFloating_(true);
	},
	unbind_: function () {
		zk(this.$n()).undoVParent(); 
		if (this._stackup) {
			jq(this._stackup).remove();
			this._stackup = null;
		}
		if (this._openInfo)
			this._openInfo = null;
		zWatch.unlisten({onFloatUp: this, onShow: this});
		this.setFloating_(false);
		this.$supers(zul.wgt.Popup, 'unbind_', arguments);
	},
	onShow: function (ctl) {
		
		ctl.fire(this.firstChild);
		var openInfo = this._openInfo;
		if (openInfo) {
			this.position.apply(this, openInfo);
			
			
		}
		this._fixWdh();
		this._fixHgh();
	},
	_offsetHeight: function () {
		var node = this.$n(),
			isFrameRequired = zul.wgt.PopupRenderer.isFrameRequired(),
			h = node.offsetHeight - (isFrameRequired ? 1: 0), 
			bd = this.$n('body');
		
		if (isFrameRequired) {
			var tl = jq(node).find('> div:first-child')[0],
				bl = jq(node).find('> div:last')[0],
				n = this.getCaveNode().parentNode,
				bd = this.$n('body');
		
			h -= tl.offsetHeight;
			h -= bl.offsetHeight;
			h -= zk(n).padBorderHeight();
			h -= zk(bd).padBorderHeight();
		} else {
			h -= zk(bd).padBorderHeight();
		}
		
		return h;
	},
	_fixHgh: function () {
		var hgh = this.$n().style.height,
			c = this.getCaveNode();
		if (zk.ie6_ && ((hgh && hgh != "auto" )|| c.style.height)) c.style.height = "0px";
		if (hgh && hgh != "auto")
			zk(c).setOffsetHeight(this._offsetHeight());
		else 
			c.style.height = "auto";
	},
	_fixWdh: zk.ie7_ ? function () {
		if (!zul.wgt.PopupRenderer.isFrameRequired()) return;
		var node = this.$n(),
			wdh = node.style.width,
			cn = jq(node).children('div'),
			fir = cn[0],
			last = cn[cn.length - 1],
			n = this.$n('cave').parentNode;
		
		if (!wdh || wdh == "auto") { 
			var diff = zk(n.parentNode).padBorderWidth() + zk(n.parentNode.parentNode).padBorderWidth();
			if (fir) {
				fir.firstChild.style.width = jq.px0(n.offsetWidth - (zk(fir).padBorderWidth()
					+ zk(fir.firstChild).padBorderWidth() - diff));
			}
			if (last) {
				last.firstChild.style.width = jq.px0(n.offsetWidth - (zk(last).padBorderWidth()
					+ zk(last.firstChild).padBorderWidth() - diff));
			}
		} else {
			if (fir) fir.firstChild.style.width = "";
			if (last) last.firstChild.style.width = "";
		}
	}: zk.$void,
	setHeight: function (height) {
		this.$supers('setHeight', arguments);
		if (this.desktop)
			zUtl.fireShown(this);
	},
	setWidth: function (width) {
		this.$supers('setWidth', arguments);
		if (this.desktop)
			zWatch.fireDown('onShow', this);
	},
	prologHTML_: function (out) {
	},
	epilogHTML_: function (out) {
	}
});

zul.wgt.PopupRenderer = {
	
	isFrameRequired: function () {
		return true;
	}
};