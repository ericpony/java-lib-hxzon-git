

zul.layout.West = zk.$extends(_zkf = zul.layout.LayoutRegion, {
	_sumFlexWidth: true, 
	_maxFlexHeight: true, 

	
	setHeight: zk.$void, 
	sanchor: 'l',
	
	$init: function () {
		this.$supers('$init', arguments);
		this._cmargins = [0, 3, 3, 0];
	},
	
	getPosition: function () {
		return zul.layout.Borderlayout.WEST;
	},
	
	getSize: _zkf.prototype.getWidth,
	
	setSize: _zkf.prototype.setWidth,

	_ambit2: function (ambit, mars, split) {
		ambit.w += split.offsetWidth;
		ambit.h = mars.top + mars.bottom;
		ambit.ts = ambit.x + ambit.w + mars.right; 
	},
	_reszSp2: function (ambit, split) {
		ambit.w -= split.w;
		return {
			left: jq.px0(ambit.x + ambit.w),
			top: jq.px0(ambit.y),
			height: jq.px0(ambit.h)
		};
	}
});
