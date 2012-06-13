

zul.wgt.Groupbox = zk.$extends(zul.Widget, {
	_open: true,
	_closable: true,

	$define: { 
		
		
		open: function (open, fromServer) {
			var node = this.$n();
			if (node && this._closable) {
				if (this.isLegend()) { 
					if (!open) zWatch.fireDown('onHide', this);
					jq(node)[open ? 'removeClass': 'addClass'](this.getZclass() + "-colpsd");
					if (zk.ie6_) 
						zk(this).redoCSS();
					if (open)
						zUtl.fireShown(this);
				} else {
					zk(this.getCaveNode())[open?'slideDown':'slideUp'](this);
				}
				if (!fromServer) this.fire('onOpen', {open:open});
			}
		},
		
		
		closable: _zkf = function () {
			this._updDomOuter();
		},
		
		
		contentStyle: _zkf,
		
		
		contentSclass: _zkf
	},
	
	isLegend: function () {
		return this._mold == 'default';
	},

	_updDomOuter: function () {
		this.rerender(zk.Skipper.nonCaptionSkipper);
	},
	_contentAttrs: function () {
		var html = ' class="', s = this._contentSclass;
		if (s) html += s + ' ';
		html += this.getZclass() + '-cnt"';

		s = this._contentStyle;
		if (!this.isLegend()) {
			if (this.caption) s = 'border-top:0;' + (s||'');
			if (!this._open) s = 'display:none;' + (s||'');
		}
		if (s) html += ' style="' + s + '"';
		return html;
	},
	_redrawCave: function (out, skipper) { 
		out.push('<div id="', this.uuid, '-cave"', this._contentAttrs(), '>');
	
		if (!skipper)
			for (var w = this.firstChild, cap = this.caption; w; w = w.nextSibling)
				if (w != cap)
					w.redraw(out);

		out.push('</div>');
	},

	setHeight: function () {
		this.$supers('setHeight', arguments);
		if (this.desktop) this._fixHgh();
	},
	_fixWdh: function () {
		var wdh = this.$n().style.width;
		if (wdh && wdh.indexOf('px') >= 0) {
			var n;
			if (n = this.$n('cave')) {
				n.style.width = wdh;
			}
		}
	},
	_fixHgh: function () {
		var hgh = this.$n().style.height;
		if (hgh && hgh != "auto") {
			var n;
			if (n = this.$n('cave')) {
				if (zk.ie6_) n.style.height = "";
				var wgt = this,
					$n = zk(n),
					fix = function() {
					n.style.height = wgt.isLegend()? hgh:
						$n.revisedHeight($n.vflexHeight(), true)
						+ "px";
				};
				fix();
				if (zk.gecko) setTimeout(fix, 0);
					
					
			}
		}
	},
	getParentSize_: zk.ie6_ ? function (p) {
		var zkp = zk(p),
			hgh,
			wdh,
			s = p.style;
		if (s.width.indexOf('px') >= 0) {
			wdh = zk.parseInt(s.width);
		} else {
			
			var n = this.$n(),
				oldVal = n.style.display;
			n.style.display = 'none';
			wdh = zkp.revisedWidth(p.offsetWidth);
			n.style.display = oldVal;
		}
		if (s.height.indexOf('px') >= 0) {
			hgh = zk.parseInt(s.height);
		}
		return {height: hgh || zkp.revisedHeight(p.offsetHeight),
					width: wdh || zkp.revisedWidth(p.offsetWidth)};
	} : function(p) {
		return this.$supers('getParentSize_', arguments);
	},
	
	onSize: function () {
		this._fixHgh();
		if (!this.isLegend()) {
			setTimeout(this.proxy(this._fixShadow), 500);
			
		} else {
			this._fixWdh();
		} 
	},
	_fixShadow: function () {
		var sdw = this.$n('sdw');
		if (sdw)
			sdw.style.display =
				zk.parseInt(jq(this.$n('cave')).css("border-bottom-width")) ? "": "none";
				
	},
	updateDomStyle_: function () {
		this.$supers('updateDomStyle_', arguments);
		if (this.desktop) this.onSize();
	},

	
	focus_: function (timeout) {
		var cap = this.caption;
		for (var w = this.firstChild; w; w = w.nextSibling)
			if (w != cap && w.focus_(timeout))
				return true;
		return cap && cap.focus_(timeout);
	},
	getZclass: function () {
		var zcls = this._zclass;
		return zcls ? zcls: this.isLegend() ? "z-fieldset": "z-groupbox";
	},
	bind_: function () {
		this.$supers(zul.wgt.Groupbox, 'bind_', arguments);
		
		
		zWatch.listen({onSize: this});
	},
	unbind_: function () {
		
		
		zWatch.unlisten({onSize: this});
		this.$supers(zul.wgt.Groupbox, 'unbind_', arguments);
	},
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		if (child.$instanceof(zul.wgt.Caption))
			this.caption = child;
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);
		if (child == this.caption)
			this.caption = null;
	},

	domClass_: function () {
		var html = this.$supers('domClass_', arguments);
		if (!this._open) {
			if (html) html += ' ';
			html += this.getZclass() + '-colpsd';
		}
		return html;
	}
});
