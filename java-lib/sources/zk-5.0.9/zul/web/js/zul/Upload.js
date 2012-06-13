(function(){function e(q,l,n){var m=q.getKey(l),p=q.uploaders[m];if(p){p.destroy(n)}delete q.uploaders[m]}function j(q,m,p){var l=q.getKey(q.sid),n=new zul.Uploader(q,l,m,p);zul.Upload.start(n);q.uploaders[l]=n}function b(n,l,m){j(n,l,m);n.sid++;n.initContent()}function f(l){var u=this,m=u._ctrl,t=m._wgt,q=t.desktop,r=zk.ajaxURI("/upload",{desktop:q,au:true})+"?uuid="+t.uuid+"&dtid="+q.uuid+"&sid="+m.sid+(m.maxsize!==""?"&maxsize="+m.maxsize:"")+(m.isNative?"&native=true":""),o=u.form;o.action=r;var s=o.parentNode;s.parentNode.removeChild(s);m._formDetached=true;b(u._ctrl,o,u.value)}if(zk.opera){var i=[],d;function c(){for(var l=i.length;l--;){i[l].sync()}}function h(l){if(!i.length){d=setInterval(c,1500)}i.push(l)}function k(l){i.$remove(l);if(d&&!i.length){clearInterval(d);d=null}}}zul.Upload=zk.$extends(zk.Object,{sid:0,$init:function(s,q,r){this.uploaders={};var n;for(var o=r.split(","),p=0,m=o.length;p<m;p++){var l=o[p].trim();if(l.startsWith("maxsize=")){this.maxsize=l.match(new RegExp(/maxsize=([^,]*)/))[1]}else{if(l=="native"){this.isNative=true}else{if(l!="true"){n=l}}}}this._clsnm=n||"";this._wgt=s;this._parent=q;this.initContent()},sync:function(){if(!this._formDetached){var t=this._wgt,l=t.$n(),p=this._parent,s=p?p.lastChild:l.nextSibling,n=s.firstChild.firstChild,q=zk(l).revisedOffset(),m=jq(s).css({top:"0",left:"0"}).zk.revisedOffset(),o=n.offsetWidth-l.offsetWidth,r=s.style;r.top=(q[1]-m[1])+"px";r.left=q[0]-m[0]-o+"px";n.style.height=l.offsetHeight+"px";n.style.clip="rect(auto,auto,auto,"+o+"px)"}},initContent:function(){var r=this._wgt,n=this._parent,q=r.$n(),p=r.desktop,m='<span class="z-upload"><form enctype="multipart/form-data" method="POST"><input name="file" type="file" hidefocus="true" style="height:'+q.offsetHeight+'px"/></form></span>';if(n){jq(n).append(m)}else{jq(r).after(m)}delete this._formDetached;if(!r._autodisable_self){this.sync()}var l=this._outer=n?n.lastChild:q.nextSibling,o=l.firstChild.firstChild;if(zk.opera){l.style.position="absolute";h(this)}o.z$proxy=q;o._ctrl=this;jq(o).change(f)},destroy:function(){if(zk.opera){k(this)}jq(this._outer).remove();this._wgt=this._parent=null;for(var l in this.uploaders){var m=this.uploaders[l];if(m){delete this.uploaders[l];m.destroy()}}},getKey:function(l){return(this._wgt?this._wgt.uuid:"")+"_uplder_"+l},cancel:function(l){e(this,l)},finish:function(l){e(this,l,true)}},{error:function(o,m,l){var n=zk.Widget.$(m);if(n){jq.alert(o,{desktop:n.desktop,icon:"ERROR"});zul.Upload.close(m,l)}},close:function(m,l){var n=zk.Widget.$(m);if(!n||!n._uplder){return}n._uplder.cancel(l)},sendResult:function(m,o,l){var n=zk.Widget.$(m);if(!n||!n._uplder){return}n._uplder.finish(l);zAu.send(new zk.Event(n.desktop,"updateResult",{contentId:o,wid:n.uuid,sid:l}))},isFinish:function(o){for(var m=(typeof o=="string"?o:o.uuid)+"_uplder_",n=zul.Upload.files,l=n.length;l--;){if(n[0].id.startsWith(m)){return false}}return true},start:function(m){var l=zul.Upload.files;if(m){l.push(m)}if(l[0]&&!l[0].isStart){l[0].isStart=true;l[0].start()}},destroy:function(n){for(var m=zul.Upload.files,l=m.length;l--;){if(m[l].id==n.id){m.splice(l,1);break}}zul.Upload.start()},files:[]});zul.Uploader=zk.$extends(zk.Object,{$init:function(m,q,n,p){this.id=q;this.flnm=p;this._upload=m;this._form=n;this._parent=n.parentNode;this._sid=m.sid;this._wgt=m._wgt;var o,l=this;if(!m._clsnm){o=new zul.UploadViewer(this,p)}else{zk.$import(m._clsnm,function(r){o=new r(l,p)})}this.viewer=o},getWidget:function(){return this._wgt},destroy:function(l){this.end(l);if(this._form){jq(this._form.parentNode).remove();jq("#"+this.id+"_ifm").remove()}this._form=this._upload=this._wgt=null},start:function(){var r=this._wgt,p=this.id+"_ifm";document.body.appendChild(this._parent);if(!jq("#"+p).length){jq.newFrame(p)}this._form.target=p;this._form.submit();this._form.style.display="none";var o=zk.ajaxURI("/upload",{desktop:r.desktop,au:true}),n=r.desktop.id,l=this,q="cmd=uploadInfo&dtid="+n+"&wid="+r.uuid+"&sid="+this._sid;if(zul.Uploader._tmupload){clearInterval(zul.Uploader._tmupload)}function m(){jq.ajax({type:"POST",url:o,data:q,success:function(s){var t=s.split(",");if(s.startsWith("error:")){l._echo=true;zul.Uploader.clearInterval(l.id);if(r){l.cancel();zul.Upload.error(s.substring(6,s.length),r.uuid,l._sid)}}else{if(!l.update(zk.parseInt(t[0]),zk.parseInt(t[1]))){zul.Uploader.clearInterval(l.id)}}},complete:function(u,s){var t;if((t=u.getResponseHeader("ZK-Error"))=="404"||t=="410"||s=="error"||s==410){zul.Uploader.clearInterval(l.id);var w=l.getWidget();if(w){l.cancel();zul.Upload.error(msgzk.FAILED_TO_RESPONSE,w.uuid,l._sid)}return}}})}m.id=this.id;zul.Uploader.clearInterval=function(s){if(m.id==s){clearInterval(zul.Uploader._tmupload);zul.Uploader._tmupload=undefined}};zul.Uploader._tmupload=setInterval(m,1000);zul.wgt.ADBS.autodisable(r)},cancel:function(){zul.Uploader.clearInterval(this.id);if(this._upload){this._upload.cancel(this._sid)}},update:function(l,m){var n=this.getWidget();if(!n||m<=0){if(this._echo){this.end()}else{return true}}else{if(zul.Uploader._tmupload){this._echo=true;if(l>=0&&l<=100){this.viewer.update(l,m)}return l>=0&&l<100}}return false},end:function(n){this.viewer.destroy(n);zul.Upload.destroy(this);this._echo=true;var p,l,m,o;if((p=this._wgt)&&(l=this._upload)&&(m=l._aded)){p._uplder=null;m.onResponse();l._aded=null;p._uplder.destroy();if((o=l._parent)&&!jq(o).parents("html").length){l._parent=p._getUploadRef();l.initContent()}p._uplder=l;p._uplder.sync();delete p._autodisable_self}}});function g(m,n){var l=zul.UploadViewer.flman;if(!l||!l.desktop){if(l){l.detach()}zul.UploadViewer.flman=l=new zul.UploadManager();m.getWidget().getPage().appendChild(l)}l.removeFile(m);l.addFile(m)}function a(l,m){if(zul.UploadManager){return g(l,m)}zk.load("zul.wgt,zul.box",function(){zul.UploadManager=zk.$extends(zul.wgt.Popup,{$init:function(){this.$supers("$init",arguments);this._files={};this.setSclass("z-fileupload-manager")},onFloatUp:function(n){var o=n.origin;if(!this.isVisible()){return}this.setTopmost()},getFileItem:function(n){return this._files[n]||zk.Widget.$(n)},addFile:function(p){var r=p.id,q=p.flnm,o=this.getFileItem(r);if(!o){o=new zul.wgt.Div({uuid:r,children:[new zul.wgt.Label({value:q+":"}),new zul.box.Box({mold:"horizontal",children:[new zul.wgt.Progressmeter({id:r,sclass:"z-fileupload-progress"}),new zul.wgt.Div({sclass:"z-fileupload-rm",listeners:{onClick:function(){var s=r.substring(0,r.indexOf("_uplder_"));zul.Uploader.clearInterval(r);var t=zk.Widget.$(s);if(t){t._uplder.cancel(r.substring(r.lastIndexOf("_")+1,r.length))}}}})]}),new zul.wgt.Label({id:r+"_total"}),new zul.wgt.Separator()]});try{this.appendChild(o)}catch(n){}this._files[r]=o}return o},updateFile:function(p,q,n){var r=p.id,o=this.getFileItem(r);if(!o){return}o.$f(r).setValue(q);o.$f(r+"_total").setValue(n)},removeFile:function(q){var s=q.id,o=this.getFileItem(s);if(o){o.detach()}delete this._files[s];var r=true;for(var n in this._files){if(!(r=false)){break}}if(r){this.close()}},open:function(o,n){this.$super("open",o,null,n||"after_start",{sendOnOpen:false,disableMask:true})}});g(l,m)})}zul.UploadViewer=zk.$extends(zk.Object,{$init:function(l,m){this._uplder=l;a(l,m)},update:function(m,n){var l=zul.UploadViewer.flman;if(l){if(!l.isOpen()){l.open(this._uplder.getWidget())}l.updateFile(this._uplder,m,msgzk.FILE_SIZE+Math.round(n/1024)+msgzk.KBYTES)}},destroy:function(){var l=zul.UploadViewer.flman;if(l){l.removeFile(this._uplder)}}})})();