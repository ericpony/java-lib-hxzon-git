zul.wgt.Div=zk.$extends(zul.Widget,{$define:{align:function(a){var b=this.$n();if(b){b.align=a}}},domAttrs_:function(b){var c=this._align,a=this.$supers("domAttrs_",arguments);return c!=null?a+' align="'+c+'"':a}});