(function(){var a=zk.gecko2_?function(d){var f=d.originalEvent;if(f){f.z$target=f.currentTarget}}:null;function c(d){var e=d.domEvent;return e&&jq.nodeName(e.target,"label")}var b=zul.wgt.Checkbox=zk.$extends(zul.LabelImageWidget,{_checked:false,$define:{disabled:function(d){var e=this.$n("real");if(e){e.disabled=d}},checked:function(d){var e=this.$n("real");if(e){e.checked=d}},name:function(d){var e=this.$n("real");if(e){e.name=d||""}},tabindex:function(d){var e=this.$n("real");if(e){e.tabIndex=d||""}},value:function(d){var e=this.$n("real");if(e){e.value=d||""}}},focus_:function(d){zk(this.$n("real")||this.$n()).focus(d);return true},getZclass:function(){var d=this._zclass;return d!=null?d:"z-checkbox"},contentAttrs_:function(){var e="",d;if(d=this.getName()){e+=' name="'+d+'"'}if(this._disabled){e+=' disabled="disabled"'}if(this._checked){e+=' checked="checked"'}if(d=this._tabindex){e+=' tabindex="'+d+'"'}if(d=this.getValue()){e+=' value="'+d+'"'}return e},bind_:function(e){this.$supers(b,"bind_",arguments);var d=this.$n("real");if(d.checked!=d.defaultChecked){d.checked=d.defaultChecked}if(zk.gecko2_){jq(d).click(a)}this.domListen_(d,"onFocus","doFocus_").domListen_(d,"onBlur","doBlur_")},unbind_:function(){var d=this.$n("real");if(zk.gecko2_){jq(d).unbind("click",a)}this.domUnlisten_(d,"onFocus","doFocus_").domUnlisten_(d,"onBlur","doBlur_");this.$supers(b,"unbind_",arguments)},doSelect_:function(d){if(!c(d)){this.$supers("doSelect_",arguments)}},doClick_:function(d){if(!c(d)){var f=this.$n("real"),e=f.checked;if(e!=this._checked){this.setChecked(e).fireOnCheck_(e)}if(zk.safari){zk(f).focus()}return this.$supers("doClick_",arguments)}},fireOnCheck_:function(d){this.fire("onCheck",d)},beforeSendAU_:function(e,d){if(d.name!="onClick"){this.$supers("beforeSendAU_",arguments)}},getTextNode:function(){return jq(this.$n()).find("label:first")[0]}})})();