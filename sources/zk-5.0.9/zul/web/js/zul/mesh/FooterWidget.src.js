

zul.mesh.FooterWidget = zk.$extends(zul.LabelImageWidget, {
	_span: 1,
	
	$define: {
		
    	
		span: function (v) {
			var n = this.$n();
			if (n) n.colSpan = v;
		},
		
    	
		align: function (v) {
			var n = this.$n();
			if (n) n.align = v;
		},
		
		
		valign: function (v) {
			var n = this.$n();
			if (n) n.vAlign = v;
		}
	},
	
	getMeshWidget: function () {
		return this.parent ? this.parent.parent : null;
	},
	
	getHeaderWidget: function () {
		var meshWidget = this.getMeshWidget();
		if (meshWidget) {
			var cs = meshWidget.getHeadWidget();
			if (cs)
				return cs.getChildAt(this.getChildIndex());
		}
		return null;
	},
	getAlignAttrs: function () {
		return (this._align ? ' align="' + this._align + '"' : '')
			+ (this._valign ? ' valign="' + this._valign + '"' : '') ;
	},
	
	domStyle_: function (no) {
		var style = '';
		if (zk.ie8 && this._align)
			style += 'text-align:' + this._align + ';';
		
		return style + this.$super('domStyle_', no);
	},
	domAttrs_: function () {
		var head = this.getHeaderWidget(),
			added;
		if (head)
			added = head.getColAttrs();
		if (this._align || this._valign)
			added = this.getAlignAttrs();
		return this.$supers('domAttrs_', arguments)
			+ (this._span > 1 ? ' colspan="' + this._span + '"' : '')
			+ (added ? ' ' + added : '');
	},
	deferRedrawHTML_: function (out) {
		out.push('<td', this.domAttrs_({domClass:1}), ' class="z-renderdefer"></td>');
	}
});