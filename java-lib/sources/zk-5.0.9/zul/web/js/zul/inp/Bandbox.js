zul.inp.Bandbox=zk.$extends(zul.inp.ComboWidget,{getPopupSize_:function(b){var d=this.firstChild,a,c;if(d){a=d._hflex=="min"&&d._hflexsz?jq.px0(d._hflexsz):d.getWidth();c=d._vflex=="min"&&d._vflexsz?jq.px0(d._vflexsz):d.getHeight()}return[a||"auto",c||"auto"]},getZclass:function(){var a=this._zclass;return a!=null?a:"z-bandbox"+(this.inRoundedMold()?"-rounded":"")},getCaveNode:function(){return this.$n("pp")||this.$n()},redrawpp_:function(b){b.push('<div id="',this.uuid,'-pp" class="',this.getZclass(),'-pp" style="display:none" tabindex="-1">');for(var a=this.firstChild;a;a=a.nextSibling){a.redraw(b)}b.push("</div>")},open:function(a){if(!this.firstChild){if(a&&a.sendOnOpen){this.fire("onOpen",{open:true,value:this.getInputNode().value},{rtags:{onOpen:1}})}return}this.$supers("open",arguments)},enterPressed_:function(a){if(a.domTarget==this.getInputNode()){this.$supers("enterPressed_",arguments)}},doKeyUp_:function(a){if(a.domTarget==this.getInputNode()){this.$supers("doKeyUp_",arguments)}}});