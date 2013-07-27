




zul.wgt.A = zk.$extends(zul.LabelImageWidget, {
	_dir: "normal",
	

	$define: {
		
		
		disabled: function () {
			this.rerender(); 
		},
		
		
		dir: _zkf = function () {
			var n = this.$n();
			if (n) n.innerHTML = this.domContent_();
		},
		
		
		href: function (v) {
			var n = this.$n();
			if (n) n.href = v || '';
		},
		
		
		target: function (v) {
			var n = this.$n();
			if (n) n.target = v || '';
		},
		
		
		tabindex: function (v) {
			var n = this.$n();
			if (n) n.tabIndex = v||'';
		}
	},

	
	getZclass: function(){
		var zcls = this._zclass;
		return zcls ? zcls : "z-a";
	},

	bind_: function(){
		this.$supers(zul.wgt.A, 'bind_', arguments);
		if (!this._disabled) {
			var n = this.$n();
			this.domListen_(n, "onFocus", "doFocus_")
				.domListen_(n, "onBlur", "doBlur_");
		}
	},
	unbind_: function(){
		var n = this.$n();
		this.domUnlisten_(n, "onFocus", "doFocus_")
			.domUnlisten_(n, "onBlur", "doBlur_");

		this.$supers(zul.wgt.A, 'unbind_', arguments);
	},
	domContent_: function(){
		var label = zUtl.encodeXML(this.getLabel()), img = this.getImage();
		if (!img) 
			return label;
		
		img = '<img src="' + img + '" align="absmiddle" />';
		return this.getDir() == 'reverse' ? label + img : img + label;
	},
	domClass_: function(no){
		var scls = this.$supers('domClass_', arguments);
		if (this._disabled && (!no || !no.zclass)) {
			var s = this.getZclass();
			if (s) 
				scls += (scls ? ' ' : '') + s + '-disd';
		}
		return scls;
	},
	domAttrs_: function(no){
		var attr = this.$supers('domAttrs_', arguments),
			v;
		if (v = this.getTarget())
			attr += ' target="' + v + '"';
		if (v = this.getTabindex()) 
			attr += ' tabIndex="' + v + '"';
		if (v = this.getHref()) 
			attr += ' href="' + v + '"';
		else 
			attr += ' href="javascript:;"';
		return attr;
	},
	doClick_: function(evt){
		if (this._disabled) 
			evt.stop(); 
		else {
			this.fireX(evt);
			if (!evt.stopped)
				this.$super('doClick_', evt, true);
		}
			
	}
});

