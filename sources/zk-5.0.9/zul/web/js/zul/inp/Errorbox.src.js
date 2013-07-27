

zul.inp.Errorbox = zk.$extends(zul.wgt.Popup, {
	$init: function () {
		this.$supers('$init', arguments);
		this.setWidth("260px");
		this.setSclass('z-errbox');
	},
	
	show: function (owner, msg) {
		this.parent = owner; 
		this.parent.__ebox = this;
		this.msg = msg;
		jq(document.body).append(this);

		
		var self = this, cstp = owner._cst && owner._cst._pos;
		setTimeout(function() {
			if (self.parent) 
				self.open(owner, null, cstp || "end_before", 
						{dodgeRef: !cstp});
		}, 0);
		zWatch.listen({onHide: [this.parent, this.onParentHide]});
	},
	
	destroy: function () {
		if (this.parent) {
			zWatch.unlisten({onHide: [this.parent, this.onParentHide]});
			delete this.parent.__ebox;
		}
		this.close();
		this.unbind();
		jq(this).remove();
		this.parent = null;
	},
	onParentHide: function () {
		if (this.__ebox) {
			this.__ebox.setFloating_(false);
			this.__ebox.close();
		}
	},
	
	bind_: function () {
		this.$supers(zul.inp.Errorbox, 'bind_', arguments);

		var Errorbox = zul.inp.Errorbox;
		this._drag = new zk.Draggable(this, null, {
			starteffect: zk.$void,
			endeffect: Errorbox._enddrag,
			ignoredrag: Errorbox._ignoredrag,
			change: Errorbox._change
		});
		zWatch.listen({onScroll: this});
	},
	unbind_: function () {
		this._drag.destroy();
		zWatch.unlisten({onScroll: this});
		
		
		if (this.parent)
			zWatch.unlisten({onHide: [this.parent, this.onParentHide]});
		
		this.$supers(zul.inp.Errorbox, 'unbind_', arguments);
		this._drag = null;
	},
	
	onScroll: function (wgt) {
		if (wgt) { 
			this.position(this.parent, null, "end_before", {overflow:true});
			this._fixarrow();
		}
	},
	setDomVisible_: function (node, visible) {
		this.$supers('setDomVisible_', arguments);
		var stackup = this._stackup;
		if (stackup) stackup.style.display = visible ? '': 'none';
	},
	doMouseMove_: function (evt) {
		var el = evt.domTarget;
		if (el == this.$n('c')) {
			var y = evt.pageY,
				$el = jq(el),
				size = zk.parseInt($el.css('padding-right'))
				offs = $el.zk.revisedOffset();
			$el[y >= offs[1] && y < offs[1] + size ? 'addClass':'removeClass']('z-errbox-close-over');
		} else this.$supers('doMouseMove_', arguments);
	},
	doMouseOut_: function (evt) {
		var el = evt.domTarget;
		if (el == this.$n('c'))
			jq(el).removeClass('z-errbox-close-over');
		else
			this.$supers('doMouseOut_', arguments);
	},
	doClick_: function (evt) {
		var p = evt.domTarget;
		if (p == this.$n('c')) {
			if ((p = this.parent) && p.clearErrorMessage) {
				p.clearErrorMessage(true, true);
				p.focus(0); 
			} else
				zAu.wrongValue_(p, false);
		} else {
			this.$supers('doClick_', arguments);
			this.parent.focus(0);
		}
	},
	open: function () {
		this.$supers('open', arguments);
		this.setTopmost();
		this._fixarrow();
	},
	prologHTML_: function (out) {
		var id = this.uuid;
		out.push('<div id="', id);
		out.push('-a" class="z-errbox-left z-arrow" title="')
		out.push(zUtl.encodeXML(msgzk.GOTO_ERROR_FIELD));
		out.push('"><div id="', id, '-c" class="z-errbox-right z-errbox-close"><div class="z-errbox-center">');
		out.push(zUtl.encodeXML(this.msg, {multiline:true})); 
		out.push('</div></div></div>');
	},
	onFloatUp: function (ctl) {
		var wgt = ctl.origin;
		if (wgt == this) {
			this.setTopmost();
			return;
		}
		if (!wgt || wgt == this.parent || !this.isVisible())
			return;

		var top1 = this, top2 = wgt;
		while ((top1 = top1.parent) && !top1.isFloating_())
			if (top1 == wgt) 
				return;
		for (; top2 && !top2.isFloating_(); top2 = top2.parent)
			;
		if (top1 == top2) { 
			var n = wgt.$n();
			if (n) this._uncover(n);
		}
	},
	_uncover: function (el) {
		var elofs = zk(el).cmOffset(),
			node = this.$n(),
			nodeofs = zk(node).cmOffset();

		if (jq.isOverlapped(
		elofs, [el.offsetWidth, el.offsetHeight],
		nodeofs, [node.offsetWidth, node.offsetHeight])) {
			var parent = this.parent.$n(), y;
			var ptofs = zk(parent).cmOffset(),
				pthgh = parent.offsetHeight,
				ptbtm = ptofs[1] + pthgh;
			y = elofs[1] + el.offsetHeight <=  ptbtm ? ptbtm: ptofs[1] - node.offsetHeight;
				

			var ofs = zk(node).toStyleOffset(0, y);
			node.style.top = ofs[1] + "px";
			this._fixarrow();
		}
	},
	_fixarrow: function () {
		var parent = this.parent.$n(),
			node = this.$n(),
			arrow = this.$n('a'),
			ptofs = zk(parent).revisedOffset(),
			nodeofs = zk(node).revisedOffset();
		var dx = nodeofs[0] - ptofs[0], dy = nodeofs[1] - ptofs[1], dir;
		if (dx >= parent.offsetWidth - 2) {
			dir = dy < -10 ? "ld": dy >= parent.offsetHeight - 2 ? "lu": "l";
		} else if (dx < 0) {
			dir = dy < -10 ? "rd": dy >= parent.offsetHeight - 2 ? "ru": "r";
		} else {
			dir = dy < 0 ? "d": "u";
		}
		arrow.className = 'z-errbox-left z-arrow-' + dir;
	}
},{
	_enddrag: function (dg) {
		var errbox = dg.control;
		errbox.setTopmost();
		errbox._fixarrow();
	},
	_ignoredrag: function (dg, pointer, evt) {
		var c = dg.control.$n('c');
		return evt.domTarget == c && jq(c).hasClass('z-errbox-close-over');
	},
	_change: function (dg) {
		var errbox = dg.control,
			stackup = errbox._stackup;
		if (stackup) {
			var el = errbox.$n();
			stackup.style.top = el.style.top;
			stackup.style.left = el.style.left;
		}
		errbox._fixarrow();
	}
});
