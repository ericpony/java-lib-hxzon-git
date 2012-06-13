

zul.inp.ComboWidget = zk.$extends(zul.inp.InputWidget, {
	_buttonVisible: true,

	$define: {
		
		
		buttonVisible: function (v) {
			var n = this.$n('btn'),
				zcls = this.getZclass();
			if (n) {
				if (!this.inRoundedMold()) {
					if (!this._inplace || !v)
						jq(n)[v ? 'show': 'hide']();
					else
						n.style.display = '';
					jq(this.getInputNode())[v ? 'removeClass': 'addClass'](zcls + '-right-edge');
				} else {
					var fnm = v ? 'removeClass': 'addClass';
					jq(n)[fnm](zcls + '-btn-right-edge');
					
					if (zk.ie6_) {						
						jq(n)[fnm](zcls + 
							(this._readonly ? '-btn-right-edge-readonly':'-btn-right-edge'));
						
						if (jq(this.getInputNode()).hasClass(zcls + "-text-invalid"))
							jq(n)[fnm](zcls + "-btn-right-edge-invalid");
					}
				}
				this.onSize();
			}
		},
		
		
		autodrop: null
	},
	setWidth: function () {
		this.$supers('setWidth', arguments);
		if (this.desktop) {
			this.onSize();
		}
	},
	onSize: function () {
		var width = this.getWidth();
		if (!width || width.indexOf('%') != -1)
			this.getInputNode().style.width = '';
		this.syncWidth();
	},
	
	onFloatUp: function (ctl) {
		if (jq(this.getPopupNode_()).is(':animated') || (!this._inplace && !this.isOpen()))
			return;
		var wgt = ctl.origin;
		if (!zUtl.isAncestor(this, wgt)) {
			if (this.isOpen())
				this.close({sendOnOpen: true});
			if (this._inplace) {
				var n = this.$n(),
					inplace = this.getInplaceCSS();
				
				if (jq(n).hasClass(inplace)) return;
				
				n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));
				jq(this.getInputNode()).addClass(inplace);
				jq(n).addClass(inplace);
				this.onSize();
				n.style.width = this.getWidth() || '';
			}
		}
	},
	onResponse: function (ctl, opts) {
		if ((opts.rtags.onOpen || opts.rtags.onChanging) && this.isOpen()) {
			if (zk.animating()) {
				var self = this;
				setTimeout(function() {self.onResponse(ctl, opts);}, 50);
				return;
			}
			var pp = this.getPopupNode_(),
				pz = this.getPopupSize_(pp);
			pp.style.height = pz[1];
			
			
			if (zk.ie8)
				pp.style.width = pz[0];
			this._fixsz(pz);
		}
	},
	
	setOpen: function (open, opts) {
		if (open) this.open(opts);
		else this.close(opts);
	},
	
	isOpen: function () {
		return this._open;
	},
	
	open: function (opts) {
		if (this._open) return;
		this._open = true;
		if (opts && opts.focus)
			this.focus();

		var pp = this.getPopupNode_(),
			inp = this.getInputNode();
		if (!pp) return;

		this.setFloating_(true, {node:pp});
		zWatch.fire('onFloatUp', this); 
		var topZIndex = this.setTopmost();

		var ppofs = this.getPopupSize_(pp);
		pp.style.width = ppofs[0];
		pp.style.height = "auto";
		pp.style.zIndex = topZIndex > 0 ? topZIndex : 1 ; 

		var pp2 = this.getPopupNode_(true);
		if (pp2) pp2.style.width = pp2.style.height = "auto";

		pp.style.position = "absolute"; 
		pp.style.display = "block";

		
		pp.style.visibility = "hidden";
		pp.style.left = "-10000px";

		
		
		
		
		
		var $pp = zk(pp);
		$pp.makeVParent();
		zWatch.fireDown('onVParent', this);

		
		pp.style.left = "";
		this._fixsz(ppofs);
		$pp.position(inp, "after_start");
		pp.style.display = "none";
		pp.style.visibility = "";

		this.slideDown_(pp);

		
		
		
		if (zk.gecko) {
			var rows = pp2 ? pp2.rows: null;
			if (rows) {
				var gap = pp.offsetHeight - pp.clientHeight;
				if (gap > 10 && pp.offsetHeight < 150) { 
					var hgh = 0;
					for (var j = rows.length; j--;)
						hgh += rows[j].offsetHeight;
					pp.style.height = (hgh + 20) + "px";
						
				}
			}
		}

		if (!this._shadow)
			this._shadow = new zk.eff.Shadow(pp,
				{left: -4, right: 4, top: -2, bottom: 3});

		if (opts && opts.sendOnOpen)
			this.fire('onOpen', {open:true, value: inp.value}, {rtags: {onOpen: 1}});
	},
	
	slideDown_: function (pp) {
		zk(pp).slideDown(this, {afterAnima: this._afterSlideDown, duration: 100});
	},
	
	slideUp_: function (pp) {
		pp.style.display = "none";
	},

	zsync: function () {
		this.$supers('zsync', arguments);
		if (!zk.css3 && this.isOpen() && this._shadow)
			this._shadow.sync();
	},
	_afterSlideDown: function (n) {
		if (!this.desktop) {
			
			zk(n).undoVParent(); 
			jq(n).remove();
		}
		if (this._shadow) this._shadow.sync();
	},
	
	getPopupNode_: function (inner) {
		return inner ? this.$n("cave"): this.$n("pp");
	},

	
	close: function (opts) {
		if (!this._open) return;

		var self = this;
		if (zk.animating()) {
			setTimeout(function() {self.close(opts);}, 50);
			return;
		}
		this._open = false;
		if (opts && opts.focus)
			this.focus();
		else
			jq(this.$n()).removeClass(this.getZclass() + '-focus');
		
		var pp = this.getPopupNode_();
		if (!pp) return;

		this.setFloating_(false);
		zWatch.fireDown("onHide", this);
		this.slideUp_(pp);

		zk.afterAnimate(function() {
			zk(pp).undoVParent();
			zWatch.fireDown('onVParent', self);
		}, -1);
		
		if (this._shadow) {
			this._shadow.destroy();
			this._shadow = null;
		}
		var n = this.$n('btn');
		if (n) jq(n).removeClass(this.getZclass() + '-btn-over');

		if (opts && opts.sendOnOpen)
			this.fire('onOpen', {open:false, value: this.getInputNode().value}, {rtags: {onOpen: 1}});

	},
	_fixsz: function (ppofs) {
		var pp = this.getPopupNode_();
		if (!pp) return;

		var pp2 = this.getPopupNode_(true);
		if (ppofs[1] == "auto" && pp.offsetHeight > 350) {
			pp.style.height = "350px";
		} else if (pp.offsetHeight < 10) {
			pp.style.height = "10px"; 
		}

		if (ppofs[0] == "auto") {
			var cb = this.$n();
			if (pp.offsetWidth < cb.offsetWidth) {
				pp.style.width = cb.offsetWidth + "px";
				if (pp2) pp2.style.width = "100%";
					
					
			} else {
				var wd = jq.innerWidth() - 20;
				if (wd < cb.offsetWidth) wd = cb.offsetWidth;
				if (pp.offsetWidth > wd) pp.style.width = wd;
			}
		}
	},

	dnPressed_: zk.$void, 
	upPressed_: zk.$void, 
	otherPressed_: zk.$void, 
	
	enterPressed_: function (evt) {
		this.close({sendOnOpen:true});
		this.updateChange_();
		evt.stop();
	},
	
	escPressed_: function (evt) {
		this.close({sendOnOpen:true});
		evt.stop();
	},

	
	getPopupSize_: function (pp) {
		return ['auto', 'auto'];
	},

	
	redraw_: function (out) {
		var uuid = this.uuid,
			zcls = this.getZclass(),
			isButtonVisible = this._buttonVisible;
			
		out.push('<i', this.domAttrs_({text:true}), '><input id="',
			uuid, '-real" class="', zcls, '-inp');
			
		if(!isButtonVisible)
			out.push(' ', zcls, '-right-edge');
			
		out.push('" autocomplete="off"',
			this.textAttrs_(), '/><i id="', uuid, '-btn" class="',
			zcls, '-btn');

		if (this.inRoundedMold()) {
			if (!isButtonVisible)
				out.push(' ', zcls, '-btn-right-edge');
			if (this._readonly)
				out.push(' ', zcls, '-btn-readonly');	
			if (zk.ie6_ && !isButtonVisible && this._readonly)
				out.push(' ', zcls, '-btn-right-edge-readonly');
		} else if (!isButtonVisible)
			out.push('" style="display:none');

		out.push('"></i>');

		this.redrawpp_(out);

		out.push('</i>');
	},
	
	redrawpp_: function (out) {
	},

	
	syncWidth: function () {
		zul.inp.RoundUtl.syncWidth(this, this.$n('btn'));
	},
	beforeParentMinFlex_: function (attr) { 
		if ('w' == attr)
			this.syncWidth();
	},
	doFocus_: function (evt) {
		var n = this.$n();
		if (this._inplace)
			n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));
			
		this.$supers('doFocus_', arguments);

		if (this._inplace) {
			if (jq(n).hasClass(this.getInplaceCSS())) {
				jq(n).removeClass(this.getInplaceCSS());
				this.onSize();
			}
		}
	},
	doBlur_: function (evt) {
		var n = this.$n();
		if (this._inplace && this._inplaceout)
			n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));

		this.$supers('doBlur_', arguments);

		if (this._inplace && this._inplaceout) {
			jq(n).addClass(this.getInplaceCSS());
			this.onSize();
			n.style.width = this.getWidth() || '';
		}
	},
	afterKeyDown_: function (evt,simulated) {
		if (!simulated && this._inplace)
			jq(this.$n()).toggleClass(this.getInplaceCSS(),  evt.keyCode == 13 ? null : false);
			
		return this.$supers('afterKeyDown_', arguments);
	},
	bind_: function () {
		this.$supers(zul.inp.ComboWidget, 'bind_', arguments);
		var btn, inp = this.getInputNode();
			
		if (this._inplace)
			jq(inp).addClass(this.getInplaceCSS());
			
		if (btn = this.$n('btn')) {
			this._auxb = new zul.Auxbutton(this, btn, inp);
			this.domListen_(btn, 'onClick', '_doBtnClick');
		}
		
		zWatch.listen({onSize: this, onFloatUp: this, onResponse: this});
		if (!zk.css3) jq.onzsync(this);
	},
	unbind_: function () {
		this.close();

		var btn = this.$n('btn');
		if (btn) {
			this._auxb.cleanup();
			this._auxb = null;
			this.domUnlisten_(btn, 'onClick', '_doBtnClick');
		}

		zWatch.unlisten({onSize: this, onFloatUp: this, onResponse: this});
		if (!zk.css3) jq.unzsync(this);
		
		this.$supers(zul.inp.ComboWidget, 'unbind_', arguments);
	},
	_doBtnClick: function (evt) {
		if (this.inRoundedMold() && !this._buttonVisible) return;
		if (!this._disabled && !zk.animating()) {		
			if (this._open) this.close({focus:true,sendOnOpen:true});
			else this.open({focus:true,sendOnOpen:true});	
		}
		evt.stop();
	},
	doKeyDown_: function (evt) {
		this._doKeyDown(evt);
		if (!evt.stopped)
			this.$supers('doKeyDown_', arguments);
	},
	doClick_: function (evt) {
		if (!this._disabled) {
			if (evt.domTarget == this.getPopupNode_())
				this.close({
					focus: true,
					sendOnOpen: true
				});
			else if (this._readonly && !this.isOpen() && this._buttonVisible)
				this.open({
					focus: true,
					sendOnOpen: true
				});
			this.$supers('doClick_', arguments);
		}
	},
	_doKeyDown: function (evt) {
		var keyCode = evt.keyCode,
			bOpen = this._open;
		if ((evt.target == this || !(evt.target.$instanceof(zul.inp.InputWidget)))
				&& (keyCode == 9 || (zk.safari && keyCode == 0))) { 
			if (bOpen) this.close({sendOnOpen:true});
			return;
		}

		if (evt.altKey && (keyCode == 38 || keyCode == 40)) {
			if (bOpen) this.close({sendOnOpen:true});
			else this.open({sendOnOpen:true});

			
			var opts = {propagation:true};
			if (zk.ie) opts.dom = true;
			evt.stop(opts);
			return;
		}

		
		if (bOpen && (keyCode == 13 || keyCode == 27)) { 
			if (keyCode == 13) this.enterPressed_(evt);
			else this.escPressed_(evt);
			return;
		}

		if (keyCode == 18 || keyCode == 27 || keyCode == 13
		|| (keyCode >= 112 && keyCode <= 123)) 
			return; 

		if (this._autodrop && !bOpen)
			this.open({sendOnOpen:true});

		if (keyCode == 38) this.upPressed_(evt);
		else if (keyCode == 40) this.dnPressed_(evt);
		else this.otherPressed_(evt);
	},
	onChildAdded_: _zkf = function (child) {
		if (this._shadow) this._shadow.sync();
	},
	onChildRemoved_: _zkf,
	onChildVisible_: _zkf
});
