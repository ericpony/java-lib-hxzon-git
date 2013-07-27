

zul.wgt.Progressmeter = zk.$extends(zul.Widget, {
	_value: 0,

	$define: {
		
		
		value: function () {
			if(this.$n()) 
				this._fixImgWidth();
		}
	},

	
	getZclass: function () {
		var zcls = this._zclass;
		return zcls != null ? zcls: "z-progressmeter";
	},
	_fixImgWidth: _zkf = function() {
		var n = this.$n(), 
			img = this.$n("img");
		if (img) {
			if (zk.ie6_) img.style.width = ""; 
			
			if (zk(n).isRealVisible()) 
				jq(img).animate({
					width: Math.round((n.clientWidth * this._value) / 100) + "px"
				}, "slow");
			
		}
	},
	onSize: _zkf,
	bind_: function () {
		this.$supers(zul.wgt.Progressmeter, 'bind_', arguments); 
		this._fixImgWidth(this._value);
		zWatch.listen({onSize: this});
	},
	unbind_: function () {
		zWatch.unlisten({onSize: this});
		this.$supers(zul.wgt.Progressmeter, 'unbind_', arguments);
	},
	setWidth : function (val){
		this.$supers('setWidth', arguments);
		this._fixImgWidth();
	}
});

