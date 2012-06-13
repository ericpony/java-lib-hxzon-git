
(function () {

	var _fixStyle = zk.ie < 8 ? function (wgt) {
			if (wgt.desktop && wgt._spacing && wgt._bar)
				setTimeout(function () {
					var n;
					if ((n = wgt.$n()) && n.offsetWidth <= 2)
						n.style.backgroundPosition = "left top"; 
				}, 500);
		}: zk.$void,

		_shallFixPercent = zk.gecko ? function (wgt) {
			var s;
			return (s = wgt._spacing) && s.endsWith("%");
		}: zk.$void;


zul.wgt.Separator = zk.$extends(zul.Widget, {
	_orient: 'horizontal',

	$define: { 
		
		
		orient: function () {
			this.updateDomClass_();
		},
		
		
		bar: function () {
			this.updateDomClass_();
			_fixStyle(this);
		},
		
		
		spacing: function () {
			this.updateDomStyle_();
			_fixStyle(this);
		}
	},

	
	isVertical: function () {
		return this._orient == 'vertical';
	},

	
	bind_: function () {
		this.$supers(zul.wgt.Separator, 'bind_', arguments);
		_fixStyle(this);
	},

	getZclass: function () {
		var zcls = this._zclass,
			bar = this.isBar();
		return zcls ? zcls: "z-separator" +
			(this.isVertical() ? "-ver" + (bar ? "-bar" : "") :
				"-hor" + (bar ? "-bar" : ""))
	},
	domStyle_: function () {
		var s = this.$supers('domStyle_', arguments);
		if (!_shallFixPercent(this))
			return s;

		
		var v = zk.parseInt(this._spacing.substring(0, this._spacing.length - 1).trim());
		if (v <= 0) return s;
		v = v >= 2 ? (v / 2) + "%": "1%";

		return 'margin:' + (this.isVertical() ? '0 ' + v: v + ' 0')
			+ ';' + s;
	},
	getWidth: function () {
		var wd = this.$supers('getWidth', arguments);
		return !this.isVertical() || (wd != null && wd.length > 0)
			|| _shallFixPercent(this) ? wd: this._spacing;
		
	},
	getHeight: function () {
		var hgh = this.$supers('getHeight', arguments);
		return this.isVertical() || (hgh != null && hgh.length > 0)
			|| _shallFixPercent(this) ? hgh: this._spacing;
	}
});

})();