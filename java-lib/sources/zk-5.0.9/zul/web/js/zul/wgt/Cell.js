zul.wgt.Cell=zk.$extends(zul.Widget,{_colspan:1,_rowspan:1,_rowType:0,_boxType:1,$define:{colspan:function(a){var b=this.$n();if(b){b.colSpan=a}},rowspan:function(a){var b=this.$n();if(b){b.rowSpan=a}},align:function(a){var b=this.$n();if(b){b.align=a}},valign:function(a){var b=this.$n();if(b){b.valign=a}}},_getParentType:function(){var a=zk.isLoaded("zul.grid")&&this.parent.$instanceof(zul.grid.Row);if(!a){return zk.isLoaded("zul.box")&&this.parent.$instanceof(zul.box.Box)?this._boxType:null}return this._rowType},_getRowAttrs:function(){return this.parent._childAttrs(this,this.getChildIndex())},_getBoxAttrs:function(){return this.parent._childInnerAttrs(this)},_colHtmlPre:function(){var a="",b=this.parent;if(zk.isLoaded("zkex.grid")&&b.$instanceof(zkex.grid.Group)&&this==b.firstChild){a+=b.domContent_()}return a},domAttrs_:function(e){var d=this.$supers("domAttrs_",arguments),b;if((b=this._colspan)!=1){d+=' colspan="'+b+'"'}if((b=this._rowspan)!=1){d+=' rowspan="'+b+'"'}if((b=this._align)){d+=' align="'+b+'"'}if((b=this._valign)){d+=' valign="'+b+'"'}var c,a=zUtl.parseMap(d," ",'"');switch(this._getParentType()){case this._rowType:c=zUtl.parseMap(this._getRowAttrs()," ",'"');break;case this._boxType:c=zUtl.parseMap(this._getBoxAttrs()," ",'"');break}if(c){zk.copy(c,a)}return" "+zUtl.mapToString(c)},getZclass:function(){return this._zclass==null?"z-cell":this._zclass},deferRedrawHTML_:function(a){a.push("<td",this.domAttrs_({domClass:1}),' class="z-renderdefer"></td>')}});