

zul.inp.Bandbox = zk.$extends(zul.inp.ComboWidget, {
	
	getPopupSize_: function (pp) {
		var bp = this.firstChild, 
			w, h;
		if (bp) {
			w = bp._hflex == 'min' && bp._hflexsz ? jq.px0(bp._hflexsz) : bp.getWidth();
			h = bp._vflex == 'min' && bp._vflexsz ? jq.px0(bp._vflexsz) : bp.getHeight();
		}
		return [w||'auto', h||'auto'];
	},
	getZclass: function () {
		var zcs = this._zclass;
		return zcs != null ? zcs: "z-bandbox" + (this.inRoundedMold() ? "-rounded": "");
	},
	getCaveNode: function () {
		return this.$n('pp') || this.$n();
	},
	redrawpp_: function (out) {
		out.push('<div id="', this.uuid, '-pp" class="', this.getZclass(),
		'-pp" style="display:none" tabindex="-1">');

		for (var w = this.firstChild; w; w = w.nextSibling)
			w.redraw(out);
	
		out.push('</div>');
	},
	
	open: function (opts) {
		if (!this.firstChild) { 
			
			if (opts && opts.sendOnOpen)
				this.fire('onOpen', {open:true, value: this.getInputNode().value}, {rtags: {onOpen: 1}});
			return;
		}
		this.$supers('open', arguments);
	},
	enterPressed_: function (evt) {
		
		if(evt.domTarget == this.getInputNode())
			this.$supers('enterPressed_', arguments);
	},
	doKeyUp_: function(evt) {
		
		if(evt.domTarget == this.getInputNode())
			this.$supers('doKeyUp_', arguments);
	}
});
