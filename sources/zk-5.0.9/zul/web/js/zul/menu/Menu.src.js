
(function () {
	function _toggleClickableCSS(wgt, remove) {
		if (wgt.isListen('onClick')) {
			if (remove) 
				jq(wgt.$n()).removeClass(wgt.getZclass() + '-body-clk-over');
			else 
				jq(wgt.$n()).addClass(wgt.getZclass() + '-body-clk-over');
		}
	}
	

zul.menu.Menu = zk.$extends(zul.LabelImageWidget, {
	$define: {
		
		
		content: function (content) {
			if (!content || content.length == 0) return;
			
			if (!this._contentHandler) {
				if (zk.feature.pe) {
					var self = this;
					zk.load('zkex.inp', null, function () { 
						self._contentHandler = new zkex.inp.ContentHandler(self, content);
					});
					return;
				}
				this._contentHandler = new zul.menu.ContentHandler(this, content);
			} else
				this._contentHandler.setContent(content);
		},
		image: function () {
			this.rerender();
		}
	},
	domContent_: function () {
		var label = zUtl.encodeXML(this.getLabel()),
			img = ['<span id="', this.uuid, '-img" class="', this.getZclass(), '-img"'];
			
		img.push(this._image ? ' style="background-image:url(' + this._image + ')"' : '', '></span>', label ? ' ' + label : '');
		return img.join('');
	},
	
	isTopmost: function () {
		return this._topmost;
	},
	beforeParentChanged_: function (newParent) {
		this._topmost = newParent && !(newParent.$instanceof(zul.menu.Menupopup));
		this.$supers("beforeParentChanged_", arguments);
	},
	getZclass: function () {
		return this._zclass == null ? "z-menu" : this._zclass;
	},
	domStyle_: function (no) {
		var style = this.$supers('domStyle_', arguments);
		return this.isTopmost() ?
			style + 'padding-left:4px;padding-right:4px;': style;
	},
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		if (child.$instanceof(zul.menu.Menupopup)) {
			this.menupopup = child;

			if (this._contentHandler)
				this._contentHandler.destroy();
		}
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);
		if (child == this.menupopup) {
			this.menupopup = null;

			if (this._contentHandler)
				this._contentHandler.setContent(this._content);
		}
	},
	
	getMenubar: function () {
		for (var p = this.parent; p; p = p.parent)
			if (p.$instanceof(zul.menu.Menubar))
				return p;
		return null;
	},
	onShow: function () {
		if (this._contentHandler)
			this._contentHandler.onShow();
	},
	onFloatUp: function (ctl) {
		if (this._contentHandler)
			this._contentHandler.onFloatUp(ctl);
	},
	onHide: function () {
		if (this._contentHandler)
			this._contentHandler.onHide();
	},
	bind_: function () {
		this.$supers(zul.menu.Menu, 'bind_', arguments);

		var anc = this.$n('a'),
			type = this._contentType;
		if (!this.isTopmost()) {
			var	n = this.$n();
			this.domListen_(anc, "onFocus", "doFocus_")
				.domListen_(anc, "onBlur", "doBlur_")
				.domListen_(n, "onMouseOver")
				.domListen_(n, "onMouseOut");
		} else {
			this.domListen_(anc, "onMouseOver")
				.domListen_(anc, "onMouseOut");
			if (this.isListen('onClick')) {
				jq(this.$n()).addClass(this.getZclass() + '-body-clk');
			}
		}

		if (this._contentHandler)
			this._contentHandler.bind();
	},
	unbind_: function () {
		if (!this.isTopmost()) {
			var anc = this.$n('a'),
				n = this.$n();
			this.domUnlisten_(anc, "onFocus", "doFocus_")
				.domUnlisten_(anc, "onBlur", "doBlur_")
				.domUnlisten_(n, "onMouseOver")
				.domUnlisten_(n, "onMouseOut");
		} else {
			var anc = this.$n('a');
			this.domUnlisten_(anc, "onMouseOver")
				.domUnlisten_(anc, "onMouseOut");
		}

		if (this._contentHandler)
			this._contentHandler.unbind();

		this.$supers(zul.menu.Menu, 'unbind_', arguments);
	},
	
	_getArrowWidth: function () {
		return 15;
	},
	doClick_: function (evt) {
		var node = this.$n();
		if (this.menupopup) {
			jq(this.$n('a')).addClass(this.getZclass() + '-body-seld');
			this.menupopup._shallClose = false;
			if (this.isTopmost())
				this.getMenubar()._lastTarget = this;
			if (this.isListen('onClick')) {
				var arrowWidth = this._getArrowWidth(), 
					clk = this.isTopmost()? jq(node).find('TABLE'): jq(node),
					offsetWidth = zk(clk).offsetWidth(),
					clickArea = offsetWidth - arrowWidth,
					ofs = zk(clk).revisedOffset(),
					clickOffsetX = evt.domEvent.clientX - ofs[0];

				if (clickOffsetX > clickArea) {
					this._togglePopup();
					evt.stop();
				} else {
					jq(this.$n('a')).removeClass(this.getZclass() + '-body-seld');
					this.fireX(evt);
				}		
			} else {
				this._togglePopup();
			}
		} else {
			var content = this._contentHandler;
			if (content && !content.isOpen())
				content.onShow();
		}

	},
	doMouseOver_: function () {
		if (!this.isTopmost()) {
			var content = this._contentHandler;
			if (content && !content.isOpen())
				content.onShow();
		}
		this.$supers('doMouseOver_', arguments);
	},
	_togglePopup: function () {
		if (!this.menupopup.isOpen()){
			if(this.isTopmost())
				_toggleClickableCSS(this);
			this.menupopup.open();
		}
		else if (this.isTopmost()) 
			this.menupopup.close({sendOnOpen: true});
		else
			zk(this.menupopup.$n('a')).focus(); 
	},
	_doMouseOver: function (evt) { 
		var menubar = this.getMenubar();
		if (menubar) {
			menubar._bOver = true;
			menubar._noFloatUp = false;
		}
		if (this.$class._isActive(this)) return;

		var	topmost = this.isTopmost();
		if(topmost)
			_toggleClickableCSS(this);
		if (topmost && zk.ie && !jq.isAncestor(this.$n('a'), evt.domTarget))
				return; 

		if (this.menupopup)
			this.menupopup._shallClose = false;
		if (!topmost) {
			zWatch.fire('onFloatUp', this); 
			if (this.menupopup && !this.menupopup.isOpen()) this.menupopup.open();
		} else {
			if (this.menupopup && menubar._autodrop) {
				menubar._lastTarget = this;
				zWatch.fire('onFloatUp', this); 
				if (!this.menupopup.isOpen()) this.menupopup.open();
			} else {
				var target = menubar._lastTarget;
				if (target && target != this && menubar._lastTarget.menupopup
						&& menubar._lastTarget.menupopup.isVisible()) {
					menubar._lastTarget.menupopup.close({sendOnOpen:true});
					this.$class._rmActive(menubar._lastTarget);
					menubar._lastTarget = this;
					if (this.menupopup) this.menupopup.open();
				}
			}
		}
		this.$class._addActive(this);
	},
	_doMouseOut: function (evt) { 
		var menubar = this.getMenubar();
		if (menubar) menubar._bOver = false;
		this._updateHoverImage(); 
		if (!zk.ie && jq.isAncestor(this.$n('a'), evt.domEvent.relatedTarget || evt.domEvent.toElement))
			return; 
	
		var topmost = this.isTopmost(),
			menupopup = this.menupopup;
		if (topmost) { 
			this.$class._rmOver(this);
			if (menupopup && menubar._autodrop) {
				if (menupopup.isOpen())
					menupopup._shallClose = true; 
				menubar._closeOnOut();
			}
		} else if (!menupopup || !menupopup.isOpen())
			this.$class._rmActive(this);
		else if (menupopup && menubar && menubar._autodrop)
			menubar._closeOnOut();
	},
	
	getImageNode: function () {
		if (!this._eimg && (this._image || this._hoverImage)) {
			var n = this.$n();
			if (n) 
				this._eimg = this.$n('b');
		}
		return this._eimg;
	}
}, {
	_isActive: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			menupopup = wgt.menupopup,
			cls = wgt.getZclass();
		cls += top ? menupopup && menupopup.isOpen() ? '-body-seld' : '-body-over' : '-over';
		return jq(n).hasClass(cls);
	},
	_addActive: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			menupopup = wgt.menupopup,
			cls = wgt.getZclass();
		cls += top ? menupopup && menupopup.isOpen() ? '-body-seld' : '-body-over' : '-over';
		jq(n).addClass(cls);
		if (!top && wgt.parent.parent.$instanceof(zul.menu.Menu))
			this._addActive(wgt.parent.parent);
	},
	_rmActive: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			zcls = wgt.getZclass(),
			cls = zcls;
		cls += top ? wgt.menupopup.isOpen() ? '-body-seld' : '-body-over' : '-over';
		var anode = jq(n);
		anode.removeClass(cls);
		if(!(anode.hasClass(zcls + '-body-seld') || anode.hasClass(zcls + '-body-over')))
			_toggleClickableCSS(wgt, true);
	},
	_rmOver: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			zcls = wgt.getZclass(),
			cls = zcls + (top ? '-body-over' : '-over');
		var anode = jq(n);
		anode.removeClass(cls);
		if(!anode.hasClass(zcls + '-body-seld'))
			_toggleClickableCSS(wgt, true);
	}
});

zul.menu.ContentHandler = zk.$extends(zk.Object, {
	 $init: function(wgt, content) {
		this._wgt = wgt;
		this._content = content;
	 },
	 setContent: function (content) {
	 	if (this._content != content || !this._pp) {
			this._content = content;
			this._wgt.rerender();	
		}
	 },
	 redraw: function (out) {
	 	var wgt = this._wgt,
			zcls = wgt.getZclass();

	 	out.push('<div id="', wgt.uuid, '-cnt-pp" class="', zcls,
		'-cnt-pp" style="display:none"><div class="', zcls,'-cnt-body">', this._content, '</div></div>');
	 },
	 bind: function () {
	 	var wgt = this._wgt;
	 	if (!wgt.menupopup) {
			wgt.domListen_(wgt.$n(), 'onClick', 'onShow');
			zWatch.listen({onFloatUp: wgt, onHide: wgt});
		}
		
		this._pp = jq('#' + wgt.uuid + '-' + 'cnt-pp')[0];
	 },
	 unbind: function () {
	 	var wgt = this._wgt;
	 	if (!wgt.menupopup) {
			if (this._shadow) {
				this._shadow.destroy();
				this._shadow = null;
			}
			wgt.domUnlisten_(wgt.$n(), 'onClick', 'onShow');
			zWatch.unlisten({onFloatUp: wgt, onHide: wgt});
		}

		this._pp = null;
	 },
	 isOpen: function () {
		 var pp = this._pp;
		 return (pp && zk(pp).isVisible());
	 },
	 onShow: function () {
	 	var wgt = this._wgt,
			pp = this._pp;
		if (!pp) return;
			
		pp.style.width = pp.style.height = "auto";
		pp.style.position = "absolute";
		pp.style.overflow = "auto";
		pp.style.display = "block";
		pp.style.zIndex = "88000";
			
		jq(pp).zk.makeVParent();
		zWatch.fireDown("onVParent", this);

		zk(pp).position(wgt.$n(), this.getPosition());
		this.syncShadow();
	 },
	 onHide: function () {
		var pp = this._pp;
		if (!pp || !zk(pp).isVisible()) return;

		pp.style.display = "none";
		jq(pp).zk.undoVParent();
		zWatch.fireDown("onVParent", this);

		this.hideShadow();
	 },
	 onFloatUp: function (ctl) {
		if (!zUtl.isAncestor(this._wgt, ctl.origin))
			this.onHide();
	 },
	 syncShadow: function () {
	 	if (!this._shadow)
			this._shadow = new zk.eff.Shadow(this._wgt.$n("cnt-pp"), {stackup:(zk.useStackup === undefined ? zk.ie6_: zk.useStackup)});
		this._shadow.sync();
	 },
	 hideShadow: function () {
	 	this._shadow.hide();
	 },
	 destroy: function () {
	 	this._wgt.rerender();
	 },
	 getPosition: function () {
	 	var wgt = this._wgt;
		if (wgt.isTopmost()) {
			var bar = wgt.getMenubar();
			if (bar)
				return 'vertical' == bar.getOrient() ? 'end_before' : 'after_start';
		}
		return 'end_before';
	},
	deferRedrawHTML_: function (out) {
		var tag = this.isTopmost() ? 'td' : 'li';
		out.push('<', tag, this.domAttrs_({domClass:1}), ' class="z-renderdefer"></', tag,'>');
	}
});})();