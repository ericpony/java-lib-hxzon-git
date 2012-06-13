
(function () {
	function _setOpen(wgt, open, opts) {
		var colps = wgt.getCollapse();
		if (!colps || "none" == colps) return; 

		var nd = wgt.$n('chdex'),
			vert = wgt.isVertical(),
			Splitter = wgt.$class,
			before = colps == "before",
			sib = before ? Splitter._prev(nd): Splitter._next(nd),
			sibwgt = zk.Widget.$(sib),
			fd = vert ? "height": "width", 
			diff = 0;
		if (sib) {
			if (!open)
				zWatch.fireDown('onHide', sibwgt);

			sibwgt.setDomVisible_(sib, open);
			sibwgt.parent._fixChildDomVisible(sibwgt, open);
			
			var c = vert && sib.cells.length ? sib.cells[0] : sib;
			diff = zk.parseInt(c.style[fd]);
			if (!before && sibwgt && !sibwgt.nextSibling) {
				var sp = wgt.$n('chdex2');
				if (sp) {
					sp.style.display = open ? '': 'none';
					diff += zk.parseInt(sp.style[fd]);
				}
			}
		}

		var sib2 = before ? Splitter._next(nd): Splitter._prev(nd);
		if (sib2) {
			var c = vert && sib2.cells.length ? sib2.cells[0] : sib2;
			diff = zk.parseInt(c.style[fd]) + (open ? -diff: diff);
			if (diff < 0) diff = 0;
			c.style[fd] = diff + "px";
		}
		if (sib && open)
			zUtl.fireShown(sibwgt);
		if (sib2)
			zUtl.fireSized(zk.Widget.$(sib2), -1); 

		wgt._fixNSDomClass();
		wgt._fixbtn();
		wgt._fixszAll();

		if (!opts || opts.sendOnOpen)
			wgt.fire('onOpen', {open:open});
			
	}

zul.box.Splitter = zk.$extends(zul.Widget, {
	_collapse: "none",
	_open: true,

	$define: {
		
		
		open: function(open, opts) {
			if (this.desktop)
				_setOpen(this, open, opts);
		}
	},

	
	isVertical: function () {
		var p = this.parent;
		return !p || p.isVertical();
	},
	
	getOrient: function () {
		var p = this.parent;
		return p ? p.getOrient(): "vertical";
	},

	
	getCollapse: function () {
		return this._collapse;
	},
	
	setCollapse: function(collapse) {
		if (this._collapse != collapse) {
			var bOpen = this._open;
			if (!bOpen)
				this.setOpen(true, {sendOnOpen:false}); 

			this._collapse = collapse;
			if (this.desktop) {
				this._fixbtn();
				this._fixsz();
			}

			if (!bOpen)
				this.setOpen(false, {sendOnOpen:false});
		}
	},

	
	getZclass: function () {
		var zcls = this._zclass,
			name = this.getMold() == "os" ? "z-splitter-os" : "z-splitter";
			
		return zcls ? zcls:	name + (this.isVertical() ? "-ver" : "-hor");
	},
	setZclass: function () {
		this.$supers('setZclass', arguments);
		if (this.desktop)
			this._fixDomClass(true);
	},

	bind_: function () {
		this.$supers(zul.box.Splitter, 'bind_', arguments);

		var box = this.parent;
		if (box && !box._splitterKid) box._bindWatch();

		zWatch.listen({onSize: this, beforeSize: this});

		this._fixDomClass();
			

		var node = this.$n(),
			Splitter = this.$class;

		if (!this.$weave) {
			var $btn = jq(this.$n('btn'));
			if (zk.ie)
				$btn.mouseover(Splitter.onover)
					.mouseout(Splitter.onout);
			$btn.click(Splitter.onclick);
		}

		this._fixbtn();

		this._drag = new zk.Draggable(this, node, {
			constraint: this.getOrient(), 
			ignoredrag: Splitter._ignoresizing,
			ghosting: Splitter._ghostsizing, 
			overlay: true, 
			zIndex: 12000,
			initSensitivity: 0,
			snap: Splitter._snap, 
			endeffect: Splitter._endDrag});

		this._shallClose = !this._open;
			
			
	},
	unbind_: function () {
		zWatch.unlisten({onSize: this, beforeSize: this});

		var Splitter = this.$class,
			btn;
		if (btn = this.$n('btn')) {
			var $btn = jq(btn);
			if (zk.ie)
				$btn.unbind("mouseover", Splitter.onover)
					.unbind("mouseout", Splitter.onout);
			$btn.unbind("click", Splitter.onclick);
		}

		this._drag.destroy();
		this._drag = null;
		this.$supers(zul.box.Splitter, 'unbind_', arguments);
	},

	
	_fixDomClass: function (inner) {
		var node = this.$n(),
			p = node.parentNode;
		if (p) {
			var vert = this.isVertical(),
				zcls = this.getZclass();;
			if (vert) p = p.parentNode; 
			if (p && p.id.endsWith("-chdex")) {
				p.className = zcls + "-outer";
				if (vert)
					node.parentNode.className = zcls + "-outer-td";
			}
		}
		if (inner) this._fixbtn();
	},
	_fixNSDomClass: function () {
		jq(this.$n())
			[this._open ? 'removeClass':'addClass'](this.getZclass()+"-ns");
	},
	_fixbtn: function () {
		var $btn = jq(this.$n('btn')),
			colps = this.getCollapse();
		if (!colps || "none" == colps) {
			$btn.hide();
		} else {
			var zcls = this.getZclass(),
				before = colps == "before";
			if (!this._open) before = !before;

			if (this.isVertical()) {
				$btn.removeClass(zcls + "-btn-" + (before ? "b" : "t"));
				$btn.addClass(zcls + "-btn-" + (before ? "t" : "b"));
			} else {
				$btn.removeClass(zcls + "-btn-" + (before ? "r" : "l"));
				$btn.addClass(zcls + "-btn-" + (before ? "l" : "r"));
			}
			$btn.show();
		}
	},
	_fixsz: _zkf = function () {
		if (!this.isRealVisible()) return;

		var node = this.$n(), pn = node.parentNode;
		if (pn) {
			var btn = this.$n('btn'),
				bfcolps = "before" == this.getCollapse();
			if (this.isVertical()) {
				
				
				
				
				if (bfcolps) {
					pn.vAlign = "top";
					pn.style.backgroundPosition = "top left";
				} else {
					pn.vAlign = "bottom";
					pn.style.backgroundPosition = "bottom left";
				}

				node.style.width = ""; 
				node.style.width = pn.clientWidth + "px"; 
				btn.style.marginLeft = ((node.offsetWidth - btn.offsetWidth) / 2)+"px";
			} else {
				if (bfcolps) {
					pn.align = "left";
					pn.style.backgroundPosition = "top left";
				} else {
					pn.align = "right";
					pn.style.backgroundPosition = "top right";
				}

				node.style.height = ""; 
				node.style.height =
					(zk.safari ? pn.parentNode.clientHeight: pn.clientHeight)+"px";
					
				btn.style.marginTop = ((node.offsetHeight - btn.offsetHeight) / 2)+"px";
			}
		}

		if (this._shallClose) { 
			delete this._shallClose;
			_setOpen(this, false, {sendOnOpen:false});
		}
	},
	onSize: _zkf,
	beforeSize: function () {
		this.$n().style[this.isVertical() ? "width": "height"] = "";
	},

	_fixszAll: function () {
		
		var box;
		for (var p = this; p = p.parent;)
			if (p.$instanceof(zul.box.Box))
				box = p;

		if (box) this.$class._fixKidSplts(box);
		else this._fixsz();
	}
},{
	onclick: function (evt) {
		var wgt = zk.Widget.$(evt);
		jq(wgt.$n('btn')).removeClass(wgt.getZclass() + "-btn-visi");
		wgt.setOpen(!wgt._open);
	},

	
	_ignoresizing: function (draggable, pointer, evt) {
		var wgt = draggable.control;
		if (!wgt._open || wgt.$n('btn') == evt.domTarget) return true;

		var run = draggable.run = {},
			node = wgt.$n(),
			nd = wgt.$n('chdex'),
			Splitter = zul.box.Splitter;
		run.prev = Splitter._prev(nd);
		run.next = Splitter._next(nd);
		if(!run.prev || !run.next) return true; 
		run.prevwgt = wgt.previousSibling;
		run.nextwgt = wgt.nextSibling;
		run.z_offset = zk(node).cmOffset();
		return false;
	},
	_ghostsizing: function (draggable, ofs, evt) {
		var $node = zk(draggable.node);
		jq(document.body).append(
			'<div id="zk_ddghost" style="font-size:0;line-height:0;background:#AAA;position:absolute;top:'
			+ofs[1]+'px;left:'+ofs[0]+'px;width:'
			+$node.offsetWidth()+'px;height:'+$node.offsetHeight()
			+'px;"></div>');
		return jq("#zk_ddghost")[0];
	},
	_endDrag: function (draggable) {
		var wgt = draggable.control,
			vert = wgt.isVertical(),
			node = wgt.$n(),
			Splitter = zul.box.Splitter,
			flInfo = Splitter._fixLayout(wgt),
			bfcolps = "before" == wgt.getCollapse(),
			run = draggable.run, diff, fd, w;

		if (vert) {
			diff = run.z_point[1];
			fd = "height";

			
			if (run.next && run.next.cells.length) run.next = run.next.cells[0];
			if (run.prev && run.prev.cells.length) run.prev = run.prev.cells[0];
		} else {
			diff = run.z_point[0];
			fd = "width";
		}
		if (!diff) return; 

		if (w = run.nextwgt) zWatch.fireDown('beforeSize', w);
		if (w = run.prevwgt) zWatch.fireDown('beforeSize', w);
		
		var ns = 0;
		if (w = run.next) {
			var s = zk.parseInt(w.style[fd]);
			s -= diff;
			if (s < 0) s = 0;
			w.style[fd] = s + "px";
			if (!bfcolps) w.style.overflow = 'hidden';
		}
		if (w = run.prev) {
			var s = zk.parseInt(w.style[fd]);
			s += diff;
			if (s < 0) s = 0;
			w.style[fd] = s + "px";
			if (bfcolps) w.style.overflow = 'hidden';
		}

		if (w = run.nextwgt)
			zUtl.fireSized(w, -1); 
		if (w = run.prevwgt)
			zUtl.fireSized(w, -1); 

		Splitter._unfixLayout(flInfo);
			
			

		wgt._fixszAll();
			
		draggable.run = null;
	},
	_snap: function (draggable, pos) {
		var run = draggable.run,
			wgt = draggable.control,
			x = pos[0], y = pos[1];
		if (wgt.isVertical()) {
			if (y <= run.z_offset[1] - run.prev.offsetHeight) {
				y = run.z_offset[1] - run.prev.offsetHeight;
			} else {
				var max = run.z_offset[1] + run.next.offsetHeight - wgt.$n().offsetHeight;
				if (y > max) y = max;
			}
		} else {
			if (x <= run.z_offset[0] - run.prev.offsetWidth) {
				x = run.z_offset[0] - run.prev.offsetWidth;
			} else {
				var max = run.z_offset[0] + run.next.offsetWidth - wgt.$n().offsetWidth;
				if (x > max) x = max;
			}
		}
		run.z_point = [x - run.z_offset[0], y - run.z_offset[1]];

		return [x, y];
	},

	_next: function (n) {
		return jq(n).next().next()[0];
	},
	_prev: function (n) {
		return jq(n).prev().prev()[0];
	},

	_fixKidSplts: function (wgt) {
		if (wgt.isVisible()) { 
			var Splitter = zul.box.Splitter;
			if (wgt.$instanceof(Splitter))
				wgt._fixsz();

			for (wgt = wgt.firstChild; wgt; wgt = wgt.nextSibling)
				Splitter._fixKidSplts(wgt);
		}
	}
});

if (zk.ie) {
	zul.box.Splitter.onover = function (evt) {
		var wgt = zk.Widget.$(evt);
		$(wgt.$n('btn')).addClass(wgt.getZclass() + '-btn-visi');
	};
	zul.box.Splitter.onout = function (evt) {
		var wgt = zk.Widget.$(evt);
		$(wgt.$n('btn')).removeClass(wgt.getZclass() + '-btn-visi');
	};
}

if (zk.opera) { 
	zul.box.Splitter._fixLayout = function (wgt) {
		var box = wgt.parent.$n();
		if (box.style.tableLayout != "fixed") {
			var fl = [box, box.style.tableLayout];
			box.style.tableLayout = "fixed";
			return fl;
		}
	};
	zul.box.Splitter._unfixLayout = function (fl) {
		if (fl) fl[0].style.tableLayout = fl[1];
	};
} else
	zul.box.Splitter._fixLayout = zul.box.Splitter._unfixLayout = zk.$void;

})();