

zul.inp.Spinner = zk.$extends(zul.inp.NumberInputWidget, {
	_value: 0,
	_step: 1,
	_buttonVisible: true,
	$define: {
		
		
		step: _zkf = function(){},
		
		
		buttonVisible: function(v){			
			var n = this.$n("btn"),
				zcls = this.getZclass();
			if (!n) return;
			if (!this.inRoundedMold()) {
				if (!this._inplace || !v)
					jq(n)[v ? 'show': 'hide']();
				else
					n.style.display = '';
				jq(this.getInputNode())[v ? 'removeClass': 'addClass'](zcls + '-right-edge');
			} else {
				var fnm = v ? 'removeClass': 'addClass';
				jq(n)[fnm](zcls + '-btn-right-edge');				
				
				if (zk.ie6_) {
					jq(n)[fnm](zcls + 
						(this._readonly ? '-btn-right-edge-readonly': '-btn-right-edge'));
						
					if (jq(this.getInputNode()).hasClass(zcls + "-text-invalid"))
							jq(n)[fnm](zcls + "-btn-right-edge-invalid");
				}
			}
			this.onSize();
		}
	},
	getZclass: function () {
		var zcls = this._zclass;
		return zcls != null ? zcls: "z-spinner" + (this.inRoundedMold() ? "-rounded": "");
	},
	isButtonVisible: function(){
		return _buttonVisible;
	},
	
	intValue: function (){
		return this.$supers('getValue', arguments);
	},
	setConstraint: function (constr){
		if (typeof constr == 'string' && constr.charAt(0) != '[') {
			var constraint = new zul.inp.SimpleSpinnerConstraint(constr);
			this._min = constraint._min;
			this._max = constraint._max;
			this.$supers('setConstraint', [constraint]);
		} else
			this.$supers('setConstraint', arguments);
	},
	coerceFromString_: function (value) {
		if (!value) return null;

		var info = zk.fmt.Number.unformat(this._format, value, false, this._localizedSymbols),
			val = parseInt(info.raw, 10);
		if (info.raw != ''+val && info.raw != '-'+val)
			return {error: zk.fmt.Text.format(msgzul.INTEGER_REQUIRED, value)};

		if (info.divscale) val = Math.round(val / Math.pow(10, info.divscale));
		return val;
	},
	coerceToString_: function (value) {
		var fmt = this._format;
		return fmt ? zk.fmt.Number.format(fmt, value, this._rounding, this._localizedSymbols)
				: value != null ? ''+value: '';
	},
	onSize: function () {
		var width = this.getWidth();
		if (!width || width.indexOf('%') != -1)
			this.getInputNode().style.width = '';
		this.syncWidth();
	},
	onHide: zul.inp.Textbox.onHide,
	validate: zul.inp.Intbox.validate,
	doKeyDown_: function(evt){
		var inp = this.inp;
		if (inp.disabled || inp.readOnly)
			return;
	
		switch (evt.keyCode) {
		case 38:
			this.checkValue();
			this._increase(true);
			evt.stop();
			return;
		case 40:
			this.checkValue();
			this._increase(false);
			evt.stop();
			return;
		}
		this.$supers('doKeyDown_', arguments);
	},
	_ondropbtnup: function (evt) {
		var zcls = this.getZclass();
		
		jq(this._currentbtn).removeClass(zcls + "-btn-clk");
		if (!this.inRoundedMold()) {
			jq(this._currentbtn).removeClass(zcls + "-btn-up-clk");
			jq(this._currentbtn).removeClass(zcls + "-btn-down-clk");
		}
		this.domUnlisten_(document.body, "onZMouseUp", "_ondropbtnup");
		this._currentbtn = null;
	},
	_btnDown: function(evt){
		var isRounded = this.inRoundedMold();
		if (isRounded && !this._buttonVisible) return;
		
		var inp;
		if(!(inp = this.inp) || inp.disabled) return;
		
		var btn = this.$n("btn"),
			zcls = this.getZclass();
			
		if (!zk.dragging) {
			if (this._currentbtn)
				this.ondropbtnup(evt);
			jq(btn).addClass(zcls + "-btn-clk");
			this.domListen_(document.body, "onZMouseUp", "_ondropbtnup");
			this._currentbtn = btn;
		}
		
		this.checkValue();
		
		var ofs = zk(btn).revisedOffset(),
			isOverUpBtn = (evt.pageY - ofs[1]) < btn.offsetHeight/2;
		
		if (isOverUpBtn) { 
			this._increase(true);
			this._startAutoIncProc(true);
		} else {	
			this._increase(false);
			this._startAutoIncProc(false);
		}
		
		var sfx = isRounded? "" : 
						isOverUpBtn? "-up":"-down";
		if ((btn = this.$n("btn" + sfx)) && !isRounded) {
			jq(btn).addClass(zcls + "-btn" + sfx + "-clk");
			this._currentbtn = btn;
		}
		
		
		evt.stop();
	},
	
	checkValue: function(){
		var inp = this.inp,
			min = this._min,
			max = this._max;

		if(!inp.value) {
			if(min && max)
				inp.value = (min<=0 && 0<=max) ? 0: min;
			else if (min)
				inp.value = min<=0 ? 0: min;
			else if (max)
				inp.value = 0<=max ? 0: max;
			else
				inp.value = 0;
		}
	},
	_btnUp: function(evt){
		if (this.inRoundedMold() && !this._buttonVisible) return;
		var inp = this.inp;
		if(inp.disabled) return;

		this._onChanging();
		this._stopAutoIncProc();
		
		if (zk.ie) {
			var len = inp.value.length;
			zk(inp).setSelectionRange(len, len);
		}
		inp.focus();
	},
	_btnOut: function(evt){
		if (this.inRoundedMold() && !this._buttonVisible) return;
		if (this.inp && !this.inp.disabled && !zk.dragging)
			jq(this.$n("btn")).removeClass(this.getZclass()+"-btn-over");
			
		var inp = this.inp;
		if(inp.disabled) return;

		this._stopAutoIncProc();
	},
	_btnOver: function(evt){
		if (this.inRoundedMold() && !this._buttonVisible) return;
		if (this.inp && !this.inp.disabled && !zk.dragging)
			jq(this.$n("btn")).addClass(this.getZclass()+"-btn-over");
	},
	_increase: function (is_add){
		var inp = this.inp,
			value = parseInt(inp.value, 10);
		if (is_add)
			result = value + this._step;
		else
			result = value - this._step;

		
		if ( result > Math.pow(2,31)-1 )	result = Math.pow(2,31)-1;
		else if ( result < -Math.pow(2,31) ) result = -Math.pow(2,31);

		
		if (this._max!=null && result > this._max) result = value;
		else if (this._min!=null && result < this._min) result = value;

		inp.value = result;
		
		this._onChanging();
		
	},
	_clearValue: function(){
		var real = this.inp;
		real.value = this._defValue = "";
		return true;
	},
	_startAutoIncProc: function (isup){
		var widget = this;
		if(this.timerId)
			clearInterval(this.timerId);

		this.timerId = setInterval(function(){widget._increase(isup)}, 200);
	},
	_stopAutoIncProc: function (){
		if(this.timerId)
			clearTimeout(this.timerId);

		this.timerId = null;
	},
	
	syncWidth: function () {
		zul.inp.RoundUtl.syncWidth(this, this.$n('btn'));
	},
	doFocus_: function (evt) {
		var n = this.$n();
		if (this._inplace)
			n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));
			
		this.$supers('doFocus_', arguments);

		if (this._inplace) {
			if (jq(n).hasClass(this.getInplaceCSS())) {
				jq(n).removeClass(this.getInplaceCSS());
				this.onSize();
			}
		}
	},
	doBlur_: function (evt) {
		var n = this.$n();
		if (this._inplace && this._inplaceout)
			n.style.width = jq.px0(zk(n).revisedWidth(n.offsetWidth));

		this.$supers('doBlur_', arguments);

		if (this._inplace && this._inplaceout) {
			jq(n).addClass(this.getInplaceCSS());
			this.onSize();
			n.style.width = this.getWidth() || '';
		}
	},
	afterKeyDown_: function (evt,simulated) {
		if (!simulated && this._inplace)
			jq(this.$n()).toggleClass(this.getInplaceCSS(),  evt.keyCode == 13 ? null : false);
			
		return this.$supers('afterKeyDown_', arguments);
	},
	bind_: function () {
		this.$supers(zul.inp.Spinner, 'bind_', arguments); 
		this.timeId = null;
		var inp = this.inp = this.$n("real"), btn;
		
		if (this._inplace)
			jq(inp).addClass(this.getInplaceCSS());
		
		if(btn = this.$n("btn"))
			this.domListen_(btn, "onZMouseDown", "_btnDown")
				.domListen_(btn, "onZMouseUp", "_btnUp")
				.domListen_(btn, "onMouseOut", "_btnOut")
				.domListen_(btn, "onMouseOver", "_btnOver");

		zWatch.listen({onSize: this});
	},
	unbind_: function () {
		if(this.timerId){
			clearTimeout(this.timerId);
			this.timerId = null;
		}
		zWatch.unlisten({onSize: this});
		var btn = this.$n("btn");
		if(btn)
			this.domUnlisten_(btn, "onZMouseDown", "_btnDown")
				.domUnlisten_(btn, "onZMouseUp", "_btnUp")
				.domUnlisten_(btn, "onMouseOut", "_btnOut")
				.domUnlisten_(btn, "onMouseOver", "_btnOver");

		this.$supers(zul.inp.Spinner, 'unbind_', arguments);
	}
	
});