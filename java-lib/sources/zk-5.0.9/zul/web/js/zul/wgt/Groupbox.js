zul.wgt.Groupbox=zk.$extends(zul.Widget,{_open:true,_closable:true,$define:{open:function(b,a){var c=this.$n();if(c&&this._closable){if(this.isLegend()){if(!b){zWatch.fireDown("onHide",this)}jq(c)[b?"removeClass":"addClass"](this.getZclass()+"-colpsd");if(zk.ie6_){zk(this).redoCSS()}if(b){zUtl.fireShown(this)}}else{zk(this.getCaveNode())[b?"slideDown":"slideUp"](this)}if(!a){this.fire("onOpen",{open:b})}}},closable:_zkf=function(){this._updDomOuter()},contentStyle:_zkf,contentSclass:_zkf},isLegend:function(){return this._mold=="default"},_updDomOuter:function(){this.rerender(zk.Skipper.nonCaptionSkipper)},_contentAttrs:function(){var a=' class="',b=this._contentSclass;if(b){a+=b+" "}a+=this.getZclass()+'-cnt"';b=this._contentStyle;if(!this.isLegend()){if(this.caption){b="border-top:0;"+(b||"")}if(!this._open){b="display:none;"+(b||"")}}if(b){a+=' style="'+b+'"'}return a},_redrawCave:function(b,d){b.push('<div id="',this.uuid,'-cave"',this._contentAttrs(),">");if(!d){for(var a=this.firstChild,c=this.caption;a;a=a.nextSibling){if(a!=c){a.redraw(b)}}}b.push("</div>")},setHeight:function(){this.$supers("setHeight",arguments);if(this.desktop){this._fixHgh()}},_fixWdh:function(){var a=this.$n().style.width;if(a&&a.indexOf("px")>=0){var b;if(b=this.$n("cave")){b.style.width=a}}},_fixHgh:function(){var b=this.$n().style.height;if(b&&b!="auto"){var e;if(e=this.$n("cave")){if(zk.ie6_){e.style.height=""}var d=this,c=zk(e),a=function(){e.style.height=d.isLegend()?b:c.revisedHeight(c.vflexHeight(),true)+"px"};a();if(zk.gecko){setTimeout(a,0)}}}},getParentSize_:zk.ie6_?function(e){var f=zk(e),c,b,d=e.style;if(d.width.indexOf("px")>=0){b=zk.parseInt(d.width)}else{var g=this.$n(),a=g.style.display;g.style.display="none";b=f.revisedWidth(e.offsetWidth);g.style.display=a}if(d.height.indexOf("px")>=0){c=zk.parseInt(d.height)}return{height:c||f.revisedHeight(e.offsetHeight),width:b||f.revisedWidth(e.offsetWidth)}}:function(a){return this.$supers("getParentSize_",arguments)},onSize:function(){this._fixHgh();if(!this.isLegend()){setTimeout(this.proxy(this._fixShadow),500)}else{this._fixWdh()}},_fixShadow:function(){var a=this.$n("sdw");if(a){a.style.display=zk.parseInt(jq(this.$n("cave")).css("border-bottom-width"))?"":"none"}},updateDomStyle_:function(){this.$supers("updateDomStyle_",arguments);if(this.desktop){this.onSize()}},focus_:function(c){var b=this.caption;for(var a=this.firstChild;a;a=a.nextSibling){if(a!=b&&a.focus_(c)){return true}}return b&&b.focus_(c)},getZclass:function(){var a=this._zclass;return a?a:this.isLegend()?"z-fieldset":"z-groupbox"},bind_:function(){this.$supers(zul.wgt.Groupbox,"bind_",arguments);zWatch.listen({onSize:this})},unbind_:function(){zWatch.unlisten({onSize:this});this.$supers(zul.wgt.Groupbox,"unbind_",arguments)},onChildAdded_:function(a){this.$supers("onChildAdded_",arguments);if(a.$instanceof(zul.wgt.Caption)){this.caption=a}},onChildRemoved_:function(a){this.$supers("onChildRemoved_",arguments);if(a==this.caption){this.caption=null}},domClass_:function(){var a=this.$supers("domClass_",arguments);if(!this._open){if(a){a+=" "}a+=this.getZclass()+"-colpsd"}return a}});