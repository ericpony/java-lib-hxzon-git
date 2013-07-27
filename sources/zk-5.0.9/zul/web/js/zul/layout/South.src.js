

zul.layout.South = zk.$extends(_zkf = zul.layout.LayoutRegion, {
	_sumFlexHeight: true, 
	
	setWidth: zk.$void, 
	sanchor: 'b',

	$init: function () {
		this.$supers('$init', arguments);
		this._cmargins = [3, 0, 0, 3];
	},
	
	getPosition: function () {
		return zul.layout.Borderlayout.SOUTH;
	},
	
	getSize: _zkf.prototype.getHeight,
	
	setSize: _zkf.prototype.setHeight,

	_ambit2: function (ambit, mars, split) {
		ambit.w = mars.left + mars.right;
		ambit.h += split.offsetHeight;
		ambit.ts = ambit.y + ambit.h + mars.bottom; 
		ambit.y = ambit.h + mars.bottom;
	},
	_reszSp2: function (ambit, split) {
		ambit.h -= split.h;
		ambit.y += split.h;
		return {
			left: jq.px0(ambit.x),
			top: jq.px0(ambit.y - split.h),
			width: jq.px0(ambit.w)
		};
	}
});