zul.tab.Tab=zk.$extends(zul.LabelImageWidget,{$init:function(){this.$supers("$init",arguments);this.listen({onClose:this},-1000)},$define:{closable:_zkf=function(){this.rerender()},image:_zkf,disabled:_zkf,selected:function(a){this._sel()}},getTabbox:function(){return this.parent?this.parent.parent:null},getIndex:function(){return this.getChildIndex()},getZclass:function(){if(this._zclass!=null){return this._zclass}var b=this.getTabbox();if(!b){return"z-tab"}var a=b.getMold();return"z-tab"+(a=="default"?(b.isVertical()?"-ver":""):"-"+a)},getLinkedPanel:function(){var a;return(a=this.getTabbox())&&(a=a.getTabpanels())?a.getChildAt(this.getIndex()):null},_doCloseClick:function(a){if(!this._disabled){this.fire("onClose");a.stop()}},_toggleBtnOver:function(a){jq(a.domTarget).toggleClass(this.getZclass()+"-close-over")},_sel:function(d,f){var c=this.getTabbox();if(!c){return}var b=this.parent,a=c._selTab;if(a!=this||f){if(a&&c.inAccordionMold()){var e=this.getLinkedPanel();if(e){e._changeSel(a.getLinkedPanel())}}if(a&&a!=this){this._setSel(a,false,false,f)}this._setSel(this,true,d,f)}},_setSel:function(f,e,i,j){var b=this.getTabbox(),d=this.getZclass(),c=f.getLinkedPanel(),g=this.desktop;if(f.isSelected()==e&&i){return}if(e){b._selTab=f;var a;if(a=b.tabpanels){a._selPnl=c}}f._selected=e;if(!g){return}if(e){jq(f).addClass(d+"-seld")}else{jq(f).removeClass(d+"-seld")}if(c){c._sel(e,!j)}if(!b.inAccordionMold()){var h=this.parent;if(h){h._fixWidth()}}if(f==this){if(b.isVertical()){h._scrollcheck("vsel",this)}else{if(!b.inAccordionMold()){h._scrollcheck("sel",this)}}}if(i){this.fire("onSelect",{items:[this],reference:this.uuid})}},setHeight:function(a){this.$supers("setHeight",arguments);if(this.desktop){zUtl.fireSized(this.parent)}},setWidth:function(a){this.$supers("setWidth",arguments);if(this.desktop){zUtl.fireSized(this.parent)}},doClick_:function(a){if(this._disabled){return}this._sel(true);this.$supers("doClick_",arguments)},domClass_:function(c){var b=this.$supers("domClass_",arguments);if(!c||!c.zclass){var a=this.isDisabled()?this.getZclass()+"-disd":"";if(a){b+=(b?" ":"")+a}}return b},domContent_:function(){var b=zUtl.encodeXML(this.getLabel()),a=this.getImage();if(!b){b="&nbsp;"}if(!a){return b}a='<img src="'+a+'" align="absmiddle" class="'+this.getZclass()+'-img"/>';return b?a+" "+b:a},setVflex:function(a){if(a!="min"){a=false}this.$super(zul.tab.Tab,"setVflex",a)},setHflex:function(a){if(a!="min"){a=false}this.$super(zul.tab.Tab,"setHflex",a)},bind_:function(e,d,c){this.$supers(zul.tab.Tab,"bind_",arguments);var a=this.$n("close"),b=this;if(a){this.domListen_(a,"onClick","_doCloseClick");if(zk.ie6_){this.domListen_(a,"onMouseOver","_toggleBtnOver").domListen_(a,"onMouseOut","_toggleBtnOver")}}c.push(function(){b.parent._fixHgh()});c.push(function(){zk.afterMount(function(){if(b.isSelected()){b._sel(false,true)}})})},unbind_:function(){var a=this.$n("close");if(a){this.domUnlisten_(a,"onClick","_doCloseClick");if(zk.ie6_){this.domUnlisten_(a,"onMouseOver","_toggleBtnOver").domUnlisten_(a,"onMouseOut","_toggleBtnOver")}}this.$supers(zul.tab.Tab,"unbind_",arguments)},onClose:function(){if(this.getTabbox().inAccordionMold()){this.getTabbox()._syncSize()}},deferRedrawHTML_:function(b){var c=this.getTabbox(),a=c.inAccordionMold()?"div":"li";b.push("<",a,this.domAttrs_({domClass:1}),' class="z-renderdefer"></',a,">")}});zul.tab.TabRenderer={isFrameRequired:function(a){return true}};