
(function () {

	function _initUpld(wgt) {
		zWatch.listen(zk.ie7_ ? {onSize: wgt} : {onShow: wgt});
		var v;
		if (v = wgt._upload)
			wgt._uplder = new zul.Upload(wgt, wgt._getUploadRef(), v);
	}
	
	function _cleanUpld(wgt) {
		var v;
		if (v = wgt._uplder) {
			zWatch.unlisten(zk.ie7_ ? {onSize: wgt} : {onShow: wgt});
			wgt._uplder = null;
			v.destroy();
		}
	}
	
(
zul.menu.Menuitem = zk.$extends(zul.LabelImageWidget, {
	_value: "",

	$define: {
		
		
		checkmark: _zkf = function () {
			this.rerender();
		},
		
		
		disabled: _zkf,
		
		
		href: _zkf,
		
		
		value: null,
		
		
		checked: function (checked) {
			if (checked)
				this._checkmark = checked;
			var n = this.$n('a');
			if (n && !this.isTopmost() && !this.getImage()) {
				var zcls = this.getZclass(),
					$n = jq(n);
				$n.removeClass(zcls + '-cnt-ck')
					.removeClass(zcls + '-cnt-unck');
				if (this._checkmark)
					$n.addClass(zcls + (checked ? '-cnt-ck' : '-cnt-unck'));
			}
		},
		
		
		autocheck: null,
		
		
		target: function (target) {
			var anc = this.$n('a');
			if (anc) {
				if (this.isTopmost())
					anc = anc.parentNode;
				anc.target = this._target;
			}
		},
		
		
		autodisable: null,
		
		
		upload: function (v) {
			var n = this.$n();
			if (n) {
				_cleanUpld(this);
				if (v && v != 'false') _initUpld(this);
			}
		}
	},
	
	isTopmost: function () {
		return this._topmost;
	},
	beforeParentChanged_: function (newParent) {
		this._topmost = newParent && !(newParent.$instanceof(zul.menu.Menupopup));
		this.$supers("beforeParentChanged_", arguments);
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		if (!no || !no.zclass) {
			var added = this.isDisabled() ? this.getZclass() + '-disd' : '';
			if (added) scls += (scls ? ' ': '') + added;
		}
		return scls;
	},
	getZclass: function () {
		return this._zclass == null ? "z-menu-item" : this._zclass;
	},
	domContent_: function () {
		var label = zUtl.encodeXML(this.getLabel()),
			img = '<span class="' + this.getZclass() + '-img"' +
				(this._image ? ' style="background-image:url(' + this._image + ')"' : '')
				+ '></span>';
		return label ? img + ' ' + label: img;
	},
	domStyle_: function (no) {
		var style = this.$supers('domStyle_', arguments);
		return this.isTopmost() ?
			style + 'padding-left:4px;padding-right:4px;': style;
	},
	
	getMenubar: zul.menu.Menu.prototype.getMenubar,
	bind_: function () {
		this.$supers(zul.menu.Menuitem, 'bind_', arguments);

		if (!this.isDisabled()) {
			if (this.isTopmost()) {
				var anc = this.$n('a');
				this.domListen_(anc, "onFocus", "doFocus_")
					.domListen_(anc, "onBlur", "doBlur_");
			}
			if (this._upload) _initUpld(this);
		}
	},
	unbind_: function () {
		if (!this.isDisabled()) {
			if (this._upload) _cleanUpld(this);
			if (this.isTopmost()) {
				var anc = this.$n('a');
				this.domUnlisten_(anc, "onFocus", "doFocus_")
					.domUnlisten_(anc, "onBlur", "doBlur_");
			}
		}

		this.$supers(zul.menu.Menuitem, 'unbind_', arguments);
	},

	doClick_: function (evt) {
		if (this._disabled)
			evt.stop();
		else {
			if (!this._canActivate(evt)) return;
			if (!this._upload)
				zul.wgt.ADBS.autodisable(this);

			var topmost = this.isTopmost(),
				anc = this.$n('a');

			if (topmost) {
				jq(anc).removeClass(this.getZclass() + '-body-over');
				anc = anc.parentNode;
			}
			if (anc.href.startsWith('javascript:')) {
				if (this.isAutocheck()) {
					this.setChecked(!this.isChecked());
					this.fire('onCheck', this.isChecked());
				}
				this.fireX(evt);
			} else {
				if (zk.ie && topmost && this.$n().id != anc.id)
					zUtl.go(anc.href, {target: anc.target});
					
					
					
				if (zk.gecko3 && topmost && this.$n().id != anc.id) {				
					zUtl.go(anc.href, {target: anc.target});
					evt.stop();
					
				}
			}
			if (!topmost)
				for (var p = this.parent; p; p = p.parent)
					if (p.$instanceof(zul.menu.Menupopup)) {
						
						if (!p.isOpen() || this._uplder )
							break;
						this._updateHoverImage(); 
						p.close({sendOnOpen:true});
					} else if (!p.$instanceof(zul.menu.Menu)) 
						break;
					else
						p._updateHoverImage(); 

			var menubar;
			if (zk.safari && (menubar=this.getMenubar()) && menubar._autodrop)
				menubar._noFloatUp = true;
				

			this.$class._rmActive(this);
			this.$super('doClick_', evt, true);
		}
	},
	_canActivate: function (evt) {
		return !this.isDisabled() && (!zk.ie || !this.isTopmost() || this._uplder
				|| jq.isAncestor(this.$n('a'), evt.domTarget));
	},
	_getUploadRef: function () {
		return this.isTopmost() ? this.$n() : this.$n('a');
	},
	doMouseOver_: function (evt) {
		var menubar = this.getMenubar();
		if (menubar) {
			menubar._bOver = true;
			menubar._noFloatUp = false;
		}
		if (!this.$class._isActive(this) && this._canActivate(evt)) {
			this.$class._addActive(this);
			if (zul.menu._nOpen || !this.isTopmost())
				zWatch.fire('onFloatUp', this); 
		}
		this.$supers('doMouseOver_', arguments);
	},
	doMouseOut_: function (evt) {
		var menubar = this.getMenubar();
		if (menubar) {
			menubar._bOver = false;
			menubar._closeOnOut();
		}
		if (!this.isDisabled()) {
			var deact = !zk.ie;
			if (!deact) {
				var n = this.$n('a'),
					xy = zk(n).revisedOffset(),
					x = evt.pageX,
					y = evt.pageY,
					diff = this.isTopmost() ? 1 : 0;
				deact = x - diff <= xy[0] || x > xy[0] + n.offsetWidth
					|| y - diff <= xy[1] || y > xy[1] + n.offsetHeight + (zk.ie ? -1 : 0);
			}
			if (deact)
				this.$class._rmActive(this);
		}
		this.$supers('doMouseOut_', arguments);
	},
	deferRedrawHTML_: function (out) {
		var tag = this.isTopmost() ? 'td' : 'li';
		out.push('<', tag, this.domAttrs_({domClass:1}), ' class="z-renderdefer"></', tag,'>');
	},
	
	getImageNode: function () {
		if (!this._eimg && (this._image || this._hoverImage)) {
			var n = this.$n();
			if (n) 
				this._eimg = this.$n('b') || this.$n('a').firstChild;
		}
		return this._eimg;
	}
}, {
	_isActive: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			cls = wgt.getZclass() + (top ? '-body-over' : '-over');
		return jq(n).hasClass(cls);
	},
	_addActive: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			cls = wgt.getZclass() + (top ? '-body-over' : '-over');
		jq(n).addClass(cls);
		if (!top && wgt.parent.parent.$instanceof(zul.menu.Menu))
			this._addActive(wgt.parent.parent);
	},
	_rmActive: function (wgt) {
		var top = wgt.isTopmost(),
			n = top ? wgt.$n('a') : wgt.$n(),
			cls = wgt.getZclass() + (top ? '-body-over' : '-over');
		jq(n).removeClass(cls);
	}
})).prototype[zk.ie7_ ? 'onSize': 'onShow'] = function () {
	if (this._uplder)
		this._uplder.sync();
};

})();