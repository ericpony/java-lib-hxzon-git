

zul.wgt.Caption = zk.$extends(zul.LabelImageWidget, {
	
	domDependent_: true, 
	rerender: function () {
		var p = this.parent;
		if (p) {
			p.clearCache(); 
			if (p.$instanceof(zul.wgt.Groupbox) && p.isLegend()) {
				p.rerender();
				return;
			}
		}
		this.$supers('rerender', arguments);
	},
	getZclass: function () {
		var zcls = this._zclass;
		return zcls != null ? zcls: "z-caption";
	},
	domContent_: function () {
		var label = this.getLabel(),
			img = this.getImage(),
			title = this.parent ? this.parent._title: '';
		if (title) label = label ? title + ' - ' + label: title;
		label = zUtl.encodeXML(label);
		if (!img) return label;

		img = '<img src="' + img + '" align="absmiddle" />';
		return label ? img + ' ' + label: img;
	},
	updateDomContent_: function () { 
		var p = this.parent,
			cnt = this.domContent_(),
			dn = this.$n('cnt');
		if (dn)
			dn.innerHTML = (p && p.isLegend && p.isLegend()) || cnt ? cnt : '&nbsp;';
	},
	domClass_: function (no) {
		var sc = this.$supers('domClass_', arguments),
			parent = this.parent;
			
		if (!parent.$instanceof(zul.wgt.Groupbox))
			return sc;
			
		return sc + (parent._closable ? '': ' ' + this.getZclass() + '-readonly');
	},
	doClick_: function () {
		if (this.parent.$instanceof(zul.wgt.Groupbox))
			this.parent.setOpen(!this.parent.isOpen());
		this.$supers('doClick_', arguments);
	},
	
	
	_isCollapsibleVisible: function () {
		var parent = this.parent;
		return parent.isCollapsible && parent.isCollapsible();
	},
	
	_isCloseVisible: function () {
		var parent = this.parent;
		return parent.isClosable && parent.isClosable()
			&& !parent.$instanceof(zul.wgt.Groupbox);
	},
	
	_isMinimizeVisible: function () {
		var parent = this.parent;
		return parent.isMinimizable && parent.isMinimizable();
	},
	
	_isMaximizeVisible: function () {
		var parent = this.parent;
		return parent.isMaximizable && parent.isMaximizable();
	},
	
	
	
	getMarginSize_: function () {
		var parent = this.parent;
		return zk.safari && parent && parent.$instanceof(zul.wgt.Groupbox) && parent.isLegend() ?
			0: this.$supers('getMarginSize_', arguments);  
	},
	beforeMinFlex_: function (o) { 
		if (o == 'w')
			this.$n().width = '';
	}
});