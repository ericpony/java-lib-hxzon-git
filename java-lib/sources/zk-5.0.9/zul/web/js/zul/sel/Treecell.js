zul.sel.Treecell=zk.$extends(zul.LabelImageWidget,{setWidth:zk.$void,_colspan:1,$define:{colspan:[function(a){return a>1?a:1},function(){var a=this.$n();if(a){a.colSpan=this._colspan}}]},getTree:function(){return this.parent?this.parent.getTree():null},domStyle_:function(c){var b=this.$super("domStyle_",zk.copy(c,{width:true})),a=this.getTreecol();return this.isVisible()&&a&&!a.isVisible()?b+"display:none;":b},getTreecol:function(){var a=this.getTree();if(a&&a.treecols){var b=this.getChildIndex();if(b<a.treecols.nChildren){return a.treecols.getChildAt(b)}}return null},getLevel:function(){return this.parent?this.parent.getLevel():0},getMaxlength:function(){var a=this.getTreecol();return a?a.getMaxlength():0},domLabel_:function(){return zUtl.encodeXML(this.getLabel(),{maxlength:this.getMaxlength()})},getTextNode:function(){return this.getCaveNode()},domContent_:function(){var b=this.$supers("domContent_",arguments),a=this._colHtmlPre();return b?a?a+"&nbsp;"+b:b:a},_syncIcon:function(){this.rerender();var a;if(a=this.parent){a.clearCache()}},_colHtmlPre:function(){if(this.parent.firstChild==this){var i=this.parent.parent,m=i.getTree(),h=[];if(m){if(m.isCheckmark()){var d=i.isCheckable(),f=m.isMultiple(),a=i.getZclass(),e=a+"-img";h.push('<span id="',this.parent.uuid,'-cm" class="',e," ",e,(f?"-checkbox":"-radio"));if(!d||i.isDisabled()){h.push(" ",e,"-disd")}h.push('"');if(!d){h.push(' style="visibility:hidden"')}h.push("></span>")}}var g=m?m.getZclass():"",l=this._getTreeitems(i,m);for(var c=0,b=l.length;c<b;++c){this._appendIcon(h,g,c==0||this._isLastVisibleChild(l[c])?zul.sel.Treecell.SPACER:zul.sel.Treecell.VBAR,false)}if(i.isContainer()){this._appendIcon(h,g,i.isOpen()?l.length==0?zul.sel.Treecell.ROOT_OPEN:this._isLastVisibleChild(i)?zul.sel.Treecell.LAST_OPEN:zul.sel.Treecell.TEE_OPEN:l.length==0?zul.sel.Treecell.ROOT_CLOSE:this._isLastVisibleChild(i)?zul.sel.Treecell.LAST_CLOSE:zul.sel.Treecell.TEE_CLOSE,true)}else{this._appendIcon(h,g,l.length==0?zul.sel.Treecell.FIRSTSPACER:this._isLastVisibleChild(i)?zul.sel.Treecell.LAST:zul.sel.Treecell.TEE,false)}return h.join("")}else{return !this.getImage()&&!this.getLabel()&&!this.nChildren?"&nbsp;":null}},_isLastVisibleChild:function(c){var b=c.parent;for(var a=b.lastChild;a;a=a.previousSibling){if(a._isVisibleInTree()){return a==c}}return false},_getTreeitems:function(d,a){var b=[];for(;;){var c=d.parent;if(!c){break}d=c.parent;if(!d||d==a){break}b.unshift(d)}return b},getZclass:function(){return this._zclass==null?"z-treecell":this._zclass},_appendIcon:function(e,c,a,b){e.push('<span class="');if(a==zul.sel.Treecell.TEE||a==zul.sel.Treecell.LAST||a==zul.sel.Treecell.VBAR||a==zul.sel.Treecell.SPACER){e.push(c+"-line ",c,"-",a,'"')}else{e.push(c+"-ico ",c,"-",a,'"')}if(b){var d=this.parent.parent;if(d&&d.treerow){e.push(' id="',d.treerow.uuid,'-open"')}}e.push("></span>")},getWidth:function(){var a=this.getTreecol();return a?a.getWidth():null},domAttrs_:function(){var a=this.getTreecol(),b;if(a){b=a.getColAttrs()}return this.$supers("domAttrs_",arguments)+(this._colspan>1?' colspan="'+this._colspan+'"':"")+(b?" "+b:"")},updateDomContent_:function(){this.$supers("updateDomContent_",arguments);if(this.parent){this.parent.clearCache()}},deferRedrawHTML_:function(a){a.push("<td",this.domAttrs_({domClass:1}),' class="z-renderdefer"></td>')}},{ROOT_OPEN:"root-open",ROOT_CLOSE:"root-close",LAST_OPEN:"last-open",LAST_CLOSE:"last-close",TEE_OPEN:"tee-open",TEE_CLOSE:"tee-close",TEE:"tee",LAST:"last",VBAR:"vbar",SPACER:"spacer",FIRSTSPACER:"firstspacer"});