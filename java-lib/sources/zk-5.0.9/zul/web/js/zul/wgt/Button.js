(function(){var d=zk.ie?function(i){if(i.desktop&&i._mold=="trendy"){var l=i.$n(),j=i.$n("box");j.rows[1].style.height="";j.style.height=!l.style.height||l.style.height=="auto"?"":"100%";if(l.style.height&&j.offsetHeight){var k=zk.parseInt(jq.css(j.rows[0].cells[0],"height","styleonly"));if(k!=j.rows[0].cells[0].offsetHeight){j.rows[1].style.height=jq.px0(j.offsetHeight-k-zk.parseInt(jq.css(j.rows[2].cells[0],"height","styleonly")))}}}}:zk.$void;var f=zk.ie?function(i){if(i.desktop&&i._mold=="trendy"){var j=i.$n().style.width;i.$n("box").style.width=!j||j=="auto"?"":"100%"}}:zk.$void;function e(j){if(!zk.ie&&j._mold=="trendy"){zWatch.listen({onSize:j})}var i;if(i=j._upload){j._uplder=new zul.Upload(j,null,i)}}function a(j){var i;if(i=j._uplder){if(!zk.ie&&j._mold=="trendy"){zWatch.unlisten({onSize:j})}j._uplder=null;i.destroy()}}var c=zk.safari||zk.gecko?function(j,i){if(j._fxcfg==1){if(jq.contains(j.$n(),i.domTarget)){j._fxcfg=2;if(j._fxctm){clearTimeout(j._fxctm)}j._fxctm=setTimeout(function(){if(j._fxcfg==2){j.doClick_(new zk.Event(j,"onClick",{}));j._fxctm=j._fxcfg=null}},50)}else{j._fxcfg=null}}}:zk.$void,h=zk.safari||zk.gecko?function(i){i._fxcfg=1}:zk.$void,g=zk.safari||zk.gecko?function(i){if(i._fxctm){clearTimeout(i._fxctm)}i._fxctm=i._fxcfg=null}:zk.$void;var b=zul.wgt.Button=zk.$extends(zul.LabelImageWidget,{_orient:"horizontal",_dir:"normal",_type:"button",$define:{href:null,target:null,dir:_zkf=function(){this.updateDomContent_()},orient:_zkf,type:_zkf,disabled:function(i){if(this.desktop){if(this._mold=="os"){var k=this.$n(),j=this.getZclass();if(j){jq(k)[(k.disabled=i)?"addClass":"removeClass"](j+"-disd")}}else{this.rerender()}}},image:function(i){if(this._mold=="trendy"){this.rerender()}else{var j=this.getImageNode();if(j){j.src=i||""}}},tabindex:function(i){var j=this.$n();if(j){(this.$n("btn")||j).tabIndex=i||""}},autodisable:null,upload:function(i){var j=this.$n();if(j&&!this._disabled){a(this);if(i&&i!="false"){e(this)}}}},setVisible:function(i){if(this._visible!=i){this.$supers("setVisible",arguments);if(this._mold=="trendy"){this.onSize()}}return this},focus_:function(i){if(!zk.focusBackFix||!this._upload){zk(this.$n("btn")||this.$n()).focus(i)}return true},domContent_:function(){var j=zUtl.encodeXML(this.getLabel()),i=this.getImage();if(!i){return j}i='<img src="'+i+'" align="absmiddle" />';var k="vertical"==this.getOrient()?"<br/>":" ";return this.getDir()=="reverse"?j+k+i:i+k+j},domClass_:function(k){var j=this.$supers("domClass_",arguments);if(this._disabled&&(!k||!k.zclass)){var i=this.getZclass();if(i){j+=(j?" ":"")+i+"-disd"}}return j},getZclass:function(){var i=this._zclass;return i!=null?i:this._mold!="trendy"?"z-button-os":"z-button"},bind_:function(){this.$supers(b,"bind_",arguments);var i;if(this._mold!="trendy"){i=this.$n()}else{if(this._disabled){return}zk(this.$n("box")).disableSelection();i=this.$n("btn");if(zk.ie){zWatch.listen({onSize:this})}}this.domListen_(i,"onFocus","doFocus_").domListen_(i,"onBlur","doBlur_");if(!this._disabled&&this._upload){e(this)}},unbind_:function(){a(this);var i=this._mold=="trendy",j=!i?this.$n():this.$n("btn");if(j){this.domUnlisten_(j,"onFocus","doFocus_").domUnlisten_(j,"onBlur","doBlur_")}if(zk.ie&&i){zWatch.unlisten({onSize:this})}this.$supers(b,"unbind_",arguments)},setWidth:zk.ie?function(i){this.$supers("setWidth",arguments);f(this)}:function(){this.$supers("setWidth",arguments)},setHeight:zk.ie?function(i){this.$supers("setHeight",arguments);d(this)}:function(){this.$supers("setHeight",arguments)},onSize:zk.ie?function(){d(this);f(this);if(this._uplder){this._uplder.sync()}}:function(){if(this._uplder){this._uplder.sync()}},doFocus_:function(i){if(this._mold=="trendy"){jq(this.$n("box")).addClass(this.getZclass()+"-focus")}this.$supers("doFocus_",arguments)},doBlur_:function(i){if(this._mold=="trendy"){jq(this.$n("box")).removeClass(this.getZclass()+"-focus")}this.$supers("doBlur_",arguments)},doClick_:function(i){g(this);if(!this._disabled){if(!this._upload){zul.wgt.ADBS.autodisable(this)}if(this._type!="button"){var k;if((k=this.$n("btn"))&&(k=k.form)){if(this._type!="reset"){zk(k).submit()}else{k.reset()}return}}this.fireX(i);if(!i.stopped){var j=this._href;if(j){zUtl.go(j,{target:this._target||(i.data.ctrlKey?"_blank":"")})}this.$super("doClick_",i,true)}}},doMouseOver_:function(){if(!this._disabled){jq(this.$n("box")).addClass(this.getZclass()+"-over")}this.$supers("doMouseOver_",arguments)},doMouseOut_:function(i){if(!this._disabled&&this!=b._curdn&&!(zk.ie&&jq.isAncestor(this.$n("box"),i.domEvent.relatedTarget||i.domEvent.toElement))){jq(this.$n("box")).removeClass(this.getZclass()+"-over")}this.$supers("doMouseOut_",arguments)},doMouseDown_:function(){h(this);if(!this._disabled){var i=this.getZclass();jq(this.$n("box")).addClass(i+"-clk").addClass(i+"-over");if(!zk.ie||!this._uplder){zk(this.$n("btn")).focus(30)}}zk.mouseCapture=this;this.$supers("doMouseDown_",arguments)},doMouseUp_:function(i){if(!this._disabled){c(this,i);var j=this.getZclass();jq(this.$n("box")).removeClass(j+"-clk").removeClass(j+"-over");if(zk.ie&&this._uplder){zk(this.$n("btn")).focus(30)}}this.$supers("doMouseUp_",arguments)},setFlexSize_:function(i){var j=this.$n();if(i.height!==undefined){if(i.height=="auto"){j.style.height=""}else{if(i.height!=""){j.style.height=jq.px0(this._mold=="trendy"?zk(j).revisedHeight(i.height,true):i.height)}else{j.style.height=this._height?this._height:""}}d(this)}if(i.width!==undefined){if(i.width=="auto"){j.style.width=""}else{if(i.width!=""){j.style.width=jq.px0(this._mold=="trendy"?zk(j).revisedWidth(i.width,true):i.width)}else{j.style.width=this._width?this._width:""}}f(this)}return{height:j.offsetHeight,width:j.offsetWidth}}});zul.wgt.ADBS=zk.$extends(zk.Object,{$init:function(i){this._ads=i},onResponse:function(){for(var i=this._ads,j;j=i.shift();){j.setDisabled(false)}zWatch.unlisten({onResponse:this})}},{autodisable:function(p){var l=p._autodisable,k,o;if(l){l=l.split(",");for(var i=l.length;i--;){var n=l[i].trim();if(n){var m;if(m=n.charAt(0)=="+"){n=n.substring(1)}n="self"==n?p:p.$f(n);if(n==p){o=p._uplder;p._uplder=null;p._autodisable_self=true}if(n&&!n._disabled){n.setDisabled(true);if(p.inServer){if(m){n.smartUpdate("disabled",true)}else{if(!k){k=[n]}else{k.push(n)}}}}}}}if(k){k=new zul.wgt.ADBS(k);if(o){o._aded=k;p._uplder=o}else{if(p.isListen("onClick",{asapOnly:true})){zWatch.listen({onResponse:k})}else{setTimeout(function(){k.onResponse()},800)}}}}})})();