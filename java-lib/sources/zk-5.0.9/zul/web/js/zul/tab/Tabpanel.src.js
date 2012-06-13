

zul.tab.Tabpanel = zk.$extends(zul.Widget, {
	
	getTabbox: function() {
		return this.parent ? this.parent.parent : null;
	},
	isVisible: function() {
		return this.$supers('isVisible', arguments) && this.isSelected();
	},
	getZclass: function() {
		if (this._zclass != null)
			return this._zclass;
			
		var tabbox = this.getTabbox();
		if (!tabbox) return 'z-tabpanel';
		
		var mold = tabbox.getMold();
		return 'z-tabpanel' + (mold == "default" ? (tabbox.isVertical() ? '-ver' : '') : '-' + mold);
	},
	
	getLinkedTab: function() {
		var tabbox =  this.getTabbox();
		if (!tabbox) return null;
		
		var tabs = tabbox.getTabs();
		return tabs ? tabs.getChildAt(this.getIndex()) : null;
	},
	
	getIndex:function() {
		return this.getChildIndex();
	},
	
	isSelected: function() {
		var tab = this.getLinkedTab();
		return tab && tab.isSelected();
	},
	
	_changeSel: function (oldPanel) {
		if (oldPanel) {
			var cave = this.$n('cave');
			if (cave && !cave.style.height && (oldPanel = oldPanel.$n('cave')))
				cave.style.height = oldPanel.style.height;
		}
	},
	_sel: function (toSel, animation) { 
		var accd = this.getTabbox().inAccordionMold();
		if (accd && animation) {
			var p = this.$n("cave");
			zk(p)[toSel ? "slideDown" : "slideUp"](this);
		} else {
			var $pl = jq(accd ? this.$n("cave") : this.$n()),
				vis = $pl.zk.isVisible();
			if (toSel) {
				if (!vis) {
					$pl.show();
					zUtl.fireShown(this);
				}
			} else if (vis) {
				zWatch.fireDown('onHide', this);
				$pl.hide();
			}
		}
	},
	_fixPanelHgh: function() {
		var tabbox = this.getTabbox();
		var tbx = tabbox.$n(),
		hgh = tbx.style.height;
		if (hgh && hgh != "auto") {
			if (!tabbox.inAccordionMold()) {
				var n = this.$n(),
					isHor = tabbox.isHorizontal();
				hgh = isHor ?
					zk(n.parentNode).vflexHeight(): n.parentNode.clientHeight;
					
				if (zk.ie8)
					hgh -= 1; 
				zk(n).setOffsetHeight(hgh);

				
				if (zk.ie6_ && isHor) {
					var s = this.$n('cave').style,
					z = s.zoom;
					s.zoom = 1;
					s.zoom = z;
				}
			} else {
				var n = this.$n(),
					hgh = zk(tbx).revisedHeight(tbx.offsetHeight);
				hgh = zk(n.parentNode).revisedHeight(hgh);
				
				
				if (zk.opera) {
					var parent;
					if ((parent = tbx.parentNode) && tbx.style.height == '100%')
						hgh = zk(parent).revisedHeight(parent.offsetHeight);
				}
				
				for (var e = n.parentNode.firstChild; e; e = e.nextSibling)
					if (e != n)
						hgh -= e.offsetHeight;
				hgh -= n.firstChild.offsetHeight;
				hgh = zk(n = n.lastChild).revisedHeight(hgh);
				if (zk.ie8)
					hgh -= 1; 
				var cave = this.getCaveNode(),
					s = cave.style;
				s.height = jq.px0(hgh);
			}
		}
	},
	domClass_: function () {
		var cls = this.$supers('domClass_', arguments);
		if (this.getTabbox().inAccordionMold())
			cls += ' ' + this.getZclass() + '-cnt';
		return cls;
	},
	onSize: function() {
		var tabbox = this.getTabbox();
		if (tabbox.inAccordionMold() && !zk(this.$n("cave")).isVisible())
			return;
		this._fixPanelHgh();		
		
		
		if (zk.ie && !zk.ie8) zk(tabbox.$n()).redoCSS();
	},

	
	setVflex: function (v) { 
		if (v != 'min') v = false;
		this.$super(zul.tab.Tabpanel, 'setVflex', v);
	},
	
	setHflex: function (v) { 
		if (v != 'min') v = false;
		this.$super(zul.tab.Tabpanel, 'setHflex', v);
	},
	bind_: function() {
		this.$supers(zul.tab.Tabpanel, 'bind_', arguments);
		zWatch.listen({onSize: this});
	},
	unbind_: function () {
		zWatch.unlisten({onSize: this});
		this.$supers(zul.tab.Tabpanel, 'unbind_', arguments);
	}
});