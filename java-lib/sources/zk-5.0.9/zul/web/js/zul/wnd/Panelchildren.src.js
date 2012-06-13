

zul.wnd.Panelchildren = zk.$extends(zul.Widget, {
	
	setHeight: zk.$void,      
	
	setWidth: zk.$void,       

	
	getZclass: function () {
		return this._zclass == null ?  "z-panel-children" : this._zclass;
	},
	domClass_: function (no) {
		var scls = this.$supers('domClass_', arguments);
		if (!no || !no.zclass) {
			var zcls = this.getZclass();
			var added = !this.parent.getTitle() && !this.parent.caption ?
				zcls + '-noheader' : '';				
			if (added) scls += (scls ? ' ': '') + added;
			added = this.parent._bordered() ? '' : zcls + '-noborder';
			if (added) scls += (scls ? ' ': '') + added;
		}
		return scls;
	},
	updateDomStyle_: function () {
		this.$supers('updateDomStyle_', arguments);
		if (this.desktop)
			zUtl.fireSized(this.parent);
	},
	
	getParentSize_: function (p) {
		return {
			height: this.parent._offsetHeight(this.parent.$n()),
			width: zk(p).revisedWidth(p.offsetWidth)
		};
	}
});