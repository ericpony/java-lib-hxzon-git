

zul.wnd.Panel = zk.$extends(zul.Widget, {
	_border: "none",
	_title: "",
	_open: true,
	_minheight: 100,
	_minwidth: 200,

	$init: function () {
		this.$supers('$init', arguments);
		this.listen({onMaximize: this, onClose: this, onMove: this, onSize: this.onSizeEvent}, -1000);
		this._skipper = new zul.wnd.PanelSkipper(this);
	},

	$define: {
		
		
		minheight: null, 
		
		
		minwidth: null, 
		
		
		sizable: function (sizable) {
			if (this.desktop) {
				if (sizable)
					this._makeSizer();
				else if (this._sizer) {
					this._sizer.destroy();
					this._sizer = null;
				}
			}
		},
		
		
		movable: _zkf = function () {
			this.rerender(this._skipper);
		},
		
		
		floatable: _zkf,
		
		
		maximizable: _zkf,
		
		
		minimizable: _zkf,
		
		
		collapsible: _zkf,
		
		
		closable: _zkf,
		
		
		border: function () {
			this.rerender(); 
		},
		
		
		title: function () {
			if (this.caption)
				this.caption.updateDomContent_(); 
			else
				this.rerender(this._skipper);
		},
		
		
		open: function (open, fromServer) {
			var node = this.$n();
			if (node) {
				var zcls = this.getZclass(),
					$body = jq(this.$n('body'));
				if ($body[0] && !$body.is(':animated')) {
					if (open) {
						jq(node).removeClass(zcls + '-colpsd');
						$body.zk.slideDown(this);
					} else {
						jq(node).addClass(zcls + '-colpsd');
						this._hideShadow();
						
						if (zk.ie6_ && !node.style.width)
							node.runtimeStyle.width = "100%";
						$body.zk.slideUp(this);
					}
					if (!fromServer) this.fire('onOpen', {open:open});
				}
			}
		},
		
		
		maximized: function (maximized, fromServer) {
			var node = this.$n();
			if (node) {
				var $n = zk(node),
					isRealVisible = $n.isRealVisible();
				if (!isRealVisible && maximized) return;
	
				var l, t, w, h, s = node.style, cls = this.getZclass();
				if (maximized) {
					jq(this.$n('max')).addClass(cls + '-maxd');
					this._hideShadow();
	
					if (this._collapsible && !this._open) {
						$n.jq.removeClass(cls + '-colpsd');
						var body = this.$n('body');
						if (body) body.style.display = "";
					}
					var floated = this.isFloatable(),
						$op = floated ? jq(node).offsetParent() : jq(node).parent();
					var sh = zk.ie6_ && $op[0].clientHeight == 0 ? $op[0].offsetHeight - $op.zk.borderHeight() : $op[0].clientHeight;
					
					if (zk.isLoaded('zkmax.layout') && this.parent.$instanceof(zkmax.layout.Portalchildren)) {
						var layout = this.parent.parent;
						if (layout.getMaximizedMode() == 'whole') {
							this._inWholeMode = true;
							var p = layout.$n(), ps = p.style;
							sh = zk.ie6_ && p.clientHeight == 0 ? p.offsetHeight - jq(p).zk.borderHeight() : p.clientHeight;
							var oldinfo = this._oldNodeInfo = { _scrollTop: p.parentNode.scrollTop };
							p.parentNode.scrollTop = 0;
							$n.makeVParent();
							zWatch.fireDown("onVParent", this);

							oldinfo._pos = s.position;
							oldinfo._ppos = ps.position;
							oldinfo._zIndex = s.zIndex;
							
							s.position = 'absolute';
							this.setFloating_(true);
							this.setTopmost();
							p.appendChild(node);
							ps.position = 'relative';
							if (!ps.height) {
								ps.height = jq.px0(sh);
								oldinfo._pheight = true;
							}
							if (zk.ie7_)
								zk(node).redoCSS();
						}
					}
					var floated = this.isFloatable(),
						$op = floated ? jq(node).offsetParent() : jq(node).parent();
					l = s.left;
					t = s.top;
					w = s.width;
					h = s.height;
	
					
					s.top = "-10000px";
					s.left = "-10000px";
	
					
					var sw = zk.ie6_ && $op[0].clientWidth == 0 ? $op[0].offsetWidth - $op.zk.borderWidth() : $op[0].clientWidth;
					
					if (!floated) {
						sw -= $op.zk.paddingWidth();
						sw = $n.revisedWidth(sw);
						sh -= $op.zk.paddingHeight();
						sh = $n.revisedHeight(sh);
					}
					s.width = jq.px0(sw);
					s.height = jq.px0(sh);
					this._lastSize = {l:l, t:t, w:w, h:h};
	
					
					s.top = "0";
					s.left = "0";

					
					w = s.width;
					h = s.height;
				} else {
					var max = this.$n('max'),
						$max = jq(max);
					$max.removeClass(cls + "-maxd").removeClass(cls + "-maxd-over");
					if (this._lastSize) {
						s.left = this._lastSize.l;
						s.top = this._lastSize.t;
						s.width = this._lastSize.w;
						s.height = this._lastSize.h;
						this._lastSize = null;
					}
					l = s.left;
					t = s.top;
					w = s.width;
					h = s.height;
					if (this._collapsible && !this._open) {
						jq(node).addClass(cls + "-colpsd");
						var body = this.$n('body');
						if (body) body.style.display = "none";
					}
					var body = this.panelchildren ? this.panelchildren.$n() : null;
					if (body)
						body.style.width = body.style.height = "";
						
					if (this._inWholeMode) {
						$n.undoVParent();
						zWatch.fireDown("onVParent", this);

						var oldinfo = this._oldNodeInfo;
						node.style.position = oldinfo ? oldinfo._pos : "";
						this.setZIndex((oldinfo ? oldinfo._zIndex : ""), {fire:true});
						this.setFloating_(false);
						var p = this.parent.parent.$n();
						p.style.position = oldinfo ? oldinfo._ppos : "";
						p.parentNode.scrollTop = oldinfo ? oldinfo._scrollTop : 0;
						if (oldinfo && oldinfo._pheight)
							p.style.height = "";
						this._oldNodeInfo = null;
						this._inWholeMode = false;
					}
				}
				if (!fromServer && isRealVisible) {
					this._visible = true;
					this.fire('onMaximize', {
						left: l,
						top: t,
						width: w,
						height: h,
						maximized: maximized,
						fromServer: fromServer
					});
				}
				if (isRealVisible) {
					
					
					zUtl.fireSized(this);
				}
			}
		},
		
		
		minimized: function (minimized, fromServer) {
			if (this._maximized)
				this.setMaximized(false);
				
			var node = this.$n();
			if (node) {
				var s = node.style, l = s.left, t = s.top, w = s.width, h = s.height;
				if (minimized) {
					zWatch.fireDown('onHide', this);
					jq(node).hide();
				} else {
					jq(node).show();
					zUtl.fireShown(this);
				}
				if (!fromServer) {
					this._visible = false;
					this.fire('onMinimize', {
						left: s.left,
						top: s.top,
						width: s.width,
						height: s.height,
						minimized: minimized
					});
				}
			}
		},
		
		tbar: function (val) {
			this.tbar = zk.Widget.$(val);
			if (this.bbar == this.tbar)
				this.bbar = null;
			if (this.fbar == this.tbar)
				this.fbar = null;
			this.rerender();
		},
		
		bbar: function (val) {
			this.bbar = zk.Widget.$(val);
			if (this.tbar == this.bbar)
				this.tbar = null;
			if (this.fbar == this.bbar)
				this.fbar = null;
			this.rerender();
		},
		
		fbar: function(val) {
			this.fbar = zk.Widget.$(val);
			if (this.tbar == this.fbar)
				this.tbar = null;
			if (this.bbar == this.fbar)
				this.bbar = null;
			this.rerender();
		}
	},

	
	setVisible: function (visible) {
		if (this._visible != visible) {
			if (this._maximized) {
				this.setMaximized(false);
			} else if (this._minimized) {
				this.setMinimized(false);
			}
			this.$supers('setVisible', arguments);
		}
	},
	setHeight: function () {
		this.$supers('setHeight', arguments);
		if (this.desktop)
			zUtl.fireSized(this);
	},
	setWidth: function () {
		this.$supers('setWidth', arguments);
		if (this.desktop)
			zUtl.fireSized(this);
	},
	setTop: function () {
		this._hideShadow();
		this.$supers('setTop', arguments);
		this.zsync();

	},
	setLeft: function () {
		this._hideShadow();
		this.$supers('setLeft', arguments);
		this.zsync();
	},
	updateDomStyle_: function () {
		this.$supers('updateDomStyle_', arguments);
		if (this.desktop)
			zUtl.fireSized(this);
	},
	
	addToolbar: function (name, toolbar) {
		switch (name) {
			case 'tbar':
				this.tbar = toolbar;
				break;
			case 'bbar':
				this.bbar = toolbar;
				break;
			case 'fbar':
				this.fbar = toolbar;
				break;
			default: return false; 
		}
		return this.appendChild(toolbar);
	},
	
	onClose: function () {
		if (!this.inServer || !this.isListen('onClose', {asapOnly: 1})) 
			this.parent.removeChild(this); 
	},
	onMove: function (evt) {
		this._left = evt.left;
		this._top = evt.top;
	},
	onMaximize: function (evt) {
		var data = evt.data;
		this._top = data.top;
		this._left = data.left;
		this._height = data.height;
		this._width = data.width;
	},
	onSizeEvent: function (evt) {
		var data = evt.data,
			node = this.$n(),
			s = node.style;
			
		this._hideShadow();
		if (data.width != s.width) {
			s.width = data.width;
		}
		if (data.height != s.height) {
			s.height = data.height;
			this._fixHgh();
		}
				
		if (data.left != s.left || data.top != s.top) {
			s.left = data.left;
			s.top = data.top;
			
			this.fire('onMove', zk.copy({
				left: node.style.left,
				top: node.style.top
			}, evt.data), {ignorable: true});
		}
		
		this.zsync();
		var self = this;
		setTimeout(function() {
			zUtl.fireSized(self);
		}, zk.ie6_ ? 800: 0);
	},
	setFlexSizeH_: function(n, zkn, height, isFlexMin) {
		if (isFlexMin) {
			height += this._titleHeight(n) +
				(this._rounded() ? jq(this.$n('body')).find(':last')[0].offsetHeight : 0);
		}
		this.$supers('setFlexSizeH_', arguments);
	},
	beforeSize: function() {
		
		if (this._maximized)
			this.$n().style.width="";
		
		
		if (!this._flexListened) 
			this.$n('body').style.width="";
	},
	
	resetSize_: function(orient) {
		
		
		this.$supers(zul.wnd.Panel, 'resetSize_', arguments);
		(this.$n('body')).style[orient == 'w' ? 'width': 'height'] = '';
	},
	
	onSize: (function() {
		function syncMaximized (wgt) {
			if (!wgt._lastSize) return;
			var node = wgt.$n(),
				$n = zk(node),
				floated = wgt.isFloatable(),
				$op = floated ? jq(node).offsetParent() : jq(node).parent(),
				s = node.style;
		
			
			var sw = zk.ie6_ && $op[0].clientWidth == 0 ? $op[0].offsetWidth - $op.zk.borderWidth() : $op[0].clientWidth;
			if (!floated) {
				sw -= $op.zk.paddingWidth();
				sw = $n.revisedWidth(sw);
			}
			s.width = jq.px0(sw);
			if (wgt._open) {
				var sh = zk.ie6_ && $op[0].clientHeight == 0 ? $op[0].offsetHeight - $op.zk.borderHeight() : $op[0].clientHeight;
				if (!floated) {
					sh -= $op.zk.paddingHeight();
					sh = $n.revisedHeight(sh);
				}
				s.height = jq.px0(sh);
			}
		}
		return function(ctl) {
			this._hideShadow();
			if (this._maximized)
				syncMaximized(this);
			
			if (this.tbar)
				ctl.fireDown(this.tbar);
			if (this.bbar)
				ctl.fireDown(this.bbar);
			if (this.fbar)
				ctl.fireDown(this.fbar);
			this._syncBodyWidth();
			this._fixHgh();
			this.zsync();
		};
	})(),
	onHide: function () {
		this._hideShadow();
	},
	_syncBodyWidth: zk.ie6_ ? function () {
		this.$n('body').style.width = this.$n().offsetWidth; 
	} : zk.$void,
	_fixHgh: function () {
		var pc;
		if (!(pc=this.panelchildren) || pc.z_rod || !this.isRealVisible()) return;
		var n = this.$n(),
			body = pc.$n(),
			hgh = n.style.height;
		
		
		
		if (hgh && hgh != "auto")
			zk(body).setOffsetHeight(this._offsetHeight(n));
		if (zk.ie6_) zk(body).redoCSS();
	},
	
	_rounded: _zkf = function () {
		return this._border.startsWith("rounded"); 
	},
	isFramable: _zkf, 
	
	_bordered: function () {
		var v;
		return (v = this._border) != "none" && v != "rounded";
	},
	_offsetHeight: function (n) {
		var h = n.offsetHeight - this._titleHeight(n);
		if (this._rounded()) {
			var body = this.panelchildren.$n(),
				bl = jq(this.$n('body')).find(':last')[0],
				title = this.$n('cap');
			h -= bl.offsetHeight;
			if (body)
				h -= zk(body.parentNode).padBorderHeight();
			if (title)
				h -= zk(title.parentNode).padBorderHeight();
		}
		h -= zk(n).padBorderHeight();
		var tb = this.$n('tb'),
			bb = this.$n('bb'),
			fb = this.$n('fb');
		if (tb) h -= tb.offsetHeight;
		if (bb) h -= bb.offsetHeight;
		if (fb) h -= fb.offsetHeight;
		return h;
	},
	_titleHeight: function (n) {
		var rounded = this._rounded(),
			cap = this.$n('cap'),
			top = rounded ? jq(n).find('> div:first-child')[0].offsetHeight: 0;
		return cap ? (rounded ? jq(n).find('> div:first-child').next()[0]: cap).offsetHeight + top: top;
	},
	onFloatUp: function (ctl) {
		if (!this._visible || !this.isFloatable())
			return; 

		for (var wgt = ctl.origin; wgt; wgt = wgt.parent) {
			if (wgt == this) {
				this.setTopmost();
				return;
			}
			if (wgt.isFloating_())
				return;
		}
	},
	getZclass: function () {
		return this._zclass == null ?  "z-panel" : this._zclass;
	},
	_makeSizer: function () {
		if (!this._sizer) {
			this.domListen_(this.$n(), 'onMouseMove');
			this.domListen_(this.$n(), 'onMouseOut');
			var Panel = this.$class;
			this._sizer = new zk.Draggable(this, null, {
				stackup: true, 
				draw: Panel._drawsizing,
				snap: Panel._snapsizing,
				starteffect: Panel._startsizing,
				ghosting: Panel._ghostsizing,
				endghosting: Panel._endghostsizing,
				ignoredrag: Panel._ignoresizing,
				endeffect: Panel._aftersizing});
		}
	},
	_initFloat: function () {
		var n = this.$n();
		if (!n.style.top || !n.style.left) {
			var xy = zk(n).revisedOffset();
			n.style.left = jq.px(xy[0]);
			n.style.top = jq.px(xy[1]);
		}

		n.style.position = "absolute";
		if (this.isMovable())
			this._initMove();

		this.zsync();

		if (this.isRealVisible())
			this.setTopmost();
	},
	_initMove: function (cmp) {
		var handle = this.$n('cap');
		if (handle && !this._drag) {
			jq(handle).addClass(this.getZclass() + '-header-move');
			var $Panel = this.$class;
			this._drag = new zk.Draggable(this, null, {
				handle: handle, stackup: true,
				starteffect: $Panel._startmove,
				ignoredrag: $Panel._ignoremove,
				endeffect: $Panel._aftermove});
		}
	},
	zsync: function () {
		this.$supers('zsync', arguments);

		if (!this.isFloatable()) {
			if (this._shadow) {
				this._shadow.destroy();
				this._shadow = null;
			}
		} else {
			var body = this.$n('body');
			if (body && zk(body).isRealVisible()) {
				if (!this._shadow) 
					this._shadow = new zk.eff.Shadow(this.$n(), {
						left: -4, right: 4, top: -2, bottom: 3
					});
					
				if (this._maximized || this._minimized || !this._visible) 
					this._hideShadow();
				else this._shadow.sync();
			}
		}
	},
	_hideShadow: function () {
		var shadow = this._shadow;
		if (shadow) shadow.hide();
	},
	
	bind_: function (desktop, skipper, after) {
		this.$supers(zul.wnd.Panel, 'bind_', arguments);

		zWatch.listen({onSize: this, onHide: this});

		
		if (zk.ie6_)
			zWatch.listen({beforeSize: this});
		else if (zk.ie7_) 
			zk(this.$n()).redoCSS();
		
		var uuid = this.uuid,
			$Panel = this.$class;

		if (this._sizable)
			this._makeSizer();
		
		if (this.isFloatable()) {
			zWatch.listen({onFloatUp: this});
			this.setFloating_(true);
			this._initFloat();
			if (!zk.css3)
				jq.onzsync(this); 
		}
		
		if (this._maximizable && this._maximized) {
			var self = this;
			after.push(function() {
				self._maximized = false;
				self.setMaximized(true, true);				
			});
		}
	},
	unbind_: function () {
		if (this._inWholeMode) {
			var node = this.$n(),
				oldinfo;
			zk(node).undoVParent(); 

			var p = this.parent;
			if (p && (p = p.parent) && (p = p.$n()) && (oldinfo = this._oldNodeInfo)) {
				p.style.position = oldinfo._ppos;
				p.parentNode.scrollTop = oldinfo._scrollTop;
			}
			this._inWholeMode = false;
		}
		zWatch.unlisten({onSize: this, onHide: this, onFloatUp: this});
		if (zk.ie6_)
			zWatch.unlisten({beforeSize: this});
		this.setFloating_(false);
		
		if (!zk.css3) jq.unzsync(this);

		if (this._shadow) {
			this._shadow.destroy();
			this._shadow = null;
		}
		if (this._drag) {
			this._drag.destroy();
			this._drag = null;
		}
		this.domUnlisten_(this.$n(), 'onMouseMove');
		this.domUnlisten_(this.$n(), 'onMouseOut');
		this.$supers(zul.wnd.Panel, 'unbind_', arguments);
	},
	_doMouseMove: function (evt) {
		if (this._sizer && (evt.target == this || evt.target == this.panelchildren)) {
			var n = this.$n(),
				c = this.$class._insizer(n, zk(n).revisedOffset(), evt.pageX, evt.pageY),
				handle = this.isMovable() ? this.$n('cap') : false,
				zcls = this.getZclass();
			if (!this._maximized && this._open && c) {
				if (this._backupCursor == undefined)
					this._backupCursor = n.style.cursor;
				n.style.cursor = c == 1 ? 'n-resize': c == 2 ? 'ne-resize':
					c == 3 ? 'e-resize': c == 4 ? 'se-resize':
					c == 5 ? 's-resize': c == 6 ? 'sw-resize':
					c == 7 ? 'w-resize': 'nw-resize';
				if (handle) jq(handle).removeClass(zcls + '-header-move');
			} else {
				n.style.cursor = this._backupCursor || '';
				if (handle) jq(handle).addClass(zcls + '-header-move');
			}
		}
	},
	_doMouseOut: function (evt) {
		this.$n().style.cursor = this._backupCursor || '';
	},
	doClick_: function (evt) {
		var maxBtn = this.$n('max'),
			minBtn = this.$n('min'),
			zcls = this.getZclass();
		
		switch (evt.domTarget) {
		case this.$n('close'):
			this.fire('onClose');
			break;
		case maxBtn:
			this.setMaximized(!this._maximized);
			jq(maxBtn).removeClass(zcls + '-max-over');
			break;
		case minBtn:
			this.setMinimized(!this._minimized);
			jq(minBtn).removeClass(zcls + '-min-over');
			break;
		case this.$n('exp'):
			var body = this.$n('body'),
				open = body ? zk(body).isVisible() : this._open;
				
			
			if (!open == this._open)
				this._open = open;
			this.setOpen(!open);
			break;
		default:
			this.$supers('doClick_', arguments);
			return;
		}
		evt.stop();
	},
	doMouseOver_: function (evt) {
		var zcls = this.getZclass();
		
		switch (evt.domTarget) {
		case this.$n('close'):
			jq(this.$n('close')).addClass(zcls + '-close-over');
			break;
		case this.$n('max'):
			var added = this._maximized ? ' ' + zcls + '-maxd-over' : '';
			jq(this.$n('max')).addClass(zcls + '-max-over' + added);
			break;
		case this.$n('min'):
			jq(this.$n('min')).addClass(zcls + '-min-over');
			break;
		case this.$n('exp'):
			jq(this.$n('exp')).addClass(zcls + '-exp-over');
			break;
		}
		this.$supers('doMouseOver_', arguments);
	},
	doMouseOut_: function (evt) {
		var zcls = this.getZclass();
		
		switch (evt.domTarget) {
		case this.$n('close'):
			jq(this.$n('close')).removeClass(zcls + '-close-over');
			break;
		case this.$n('max'):
			var $n = jq(this.$n('max'));
			if (this._maximized)
				$n.removeClass(zcls + '-maxd-over');
			$n.removeClass(zcls + '-max-over');
			break;
		case this.$n('min'):
			jq(this.$n('min')).removeClass(zcls + '-min-over');
			break;
		case this.$n('exp'):
			jq(this.$n('exp')).removeClass(zcls + '-exp-over');
			break;
		}
		this.$supers('doMouseOut_', arguments);
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		if (!no || !no.zclass) {
			var zcls = this.getZclass();
			var added = this._bordered() ? '' : zcls + '-noborder';
			if (added) scls += (scls ? ' ': '') + added;
			added = this._open ? '' : zcls + '-colpsd';
			if (added) scls += (scls ? ' ': '') + added;
		}
		return scls;
	},
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		if (child.$instanceof(zul.wgt.Caption))
			this.caption = child;
		else if (child.$instanceof(zul.wnd.Panelchildren))
			this.panelchildren = child;
		else if (child.$instanceof(zul.wgt.Toolbar)) {
			if (this.firstChild == child || (this.nChildren == (this.caption ? 2 : 1)))
				this.tbar = child;
			else if (this.lastChild == child && child.previousSibling.$instanceof(zul.wgt.Toolbar))
				this.fbar = child;
			else if (child.previousSibling.$instanceof(zul.wnd.Panelchildren))
				this.bbar = child;
		}
		this.rerender();
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);
		if (child == this.caption)
			this.caption = null;
		else if (child == this.panelchildren)
			this.panelchildren = null;
		else if (child == this.tbar)
			this.tbar = null;
		else if (child == this.bbar)
			this.bbar = null;
		else if (child == this.fbar)
			this.fbar = null;
		if (!this.childReplacing_)
			this.rerender();
	},
	onChildVisible_: function (child) {
		this.$supers('onChildVisible_', arguments);
		if((child == this.tbar || child == this.bbar || child == this.fbar) && this.$n())
			this._fixHgh();
	}
}, { 
	
	_startmove: function (dg) {
		dg.control._hideShadow();
		
		var el = dg.node;
		if(el.style.top && el.style.top.indexOf("%") >= 0)
			 el.style.top = el.offsetTop + "px";
		if(el.style.left && el.style.left.indexOf("%") >= 0)
			 el.style.left = el.offsetLeft + "px";
		
	},
	_ignoremove: function (dg, pointer, evt) {
		var wgt = dg.control;
		switch (evt.domTarget) {
		case wgt.$n('close'):
		case wgt.$n('max'):
		case wgt.$n('min'):
		case wgt.$n('exp'):
			return true; 
		}
		return false;
	},
	_aftermove: function (dg, evt) {
		dg.control.zsync();
	},
	
	_startsizing: zul.wnd.Window._startsizing,
	_ghostsizing: zul.wnd.Window._ghostsizing,
	_endghostsizing: zul.wnd.Window._endghostsizing,
	_insizer: zul.wnd.Window._insizer,
	_ignoresizing: function (dg, pointer, evt) {
		var el = dg.node,
			wgt = dg.control;
			
		if (wgt._maximized || !wgt._open || (evt.target != wgt && evt.target != wgt.panelchildren)) return true;

		var offs = zk(el).revisedOffset(),
			v = wgt.$class._insizer(el, offs, pointer[0], pointer[1]);
		if (v) {
			wgt._hideShadow();
			dg.z_dir = v;
			dg.z_box = {
				top: offs[1], left: offs[0] ,height: el.offsetHeight,
				width: el.offsetWidth, minHeight: zk.parseInt(wgt.getMinheight()),
				minWidth: zk.parseInt(wgt.getMinwidth())
			};
			dg.z_orgzi = el.style.zIndex;
			return false;
		}
		return true;
	},
	_snapsizing: zul.wnd.Window._snapsizing,
	_aftersizing: zul.wnd.Window._aftersizing,
	_drawsizing: zul.wnd.Window._drawsizing
});

zul.wnd.PanelSkipper = zk.$extends(zk.Skipper, {
	$init: function (p) {
		this._p = p;
	},
	skip: function (wgt, skipId) {
		var skip;
		if (skip = jq(skipId || (wgt.uuid + '-body'), zk)[0]) {
			skip.parentNode.removeChild(skip);
				
			return skip;
		}
	},
	restore: function () {
		this.$supers('restore', arguments);
		this._p.zsync();
	}
});


zul.wnd.PanelRenderer = {
	
	isFrameRequired: function (wgt) {
		return wgt._rounded();
	}
};
