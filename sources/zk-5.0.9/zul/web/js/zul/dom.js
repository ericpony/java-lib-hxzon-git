(function(){var c=jq.alert,a={QUESTION:"z-msgbox z-msgbox-question",EXCLAMATION:"z-msgbox z-msgbox-exclamation",INFORMATION:"z-msgbox z-msgbox-information",ERROR:"z-msgbox z-msgbox-error",NONE:"z-msgbox z-msgbox-none"};function b(e,g){return new zul.wgt.Button({label:msgzul[e.toUpperCase()]||e,listeners:{onClick:function(f){if(typeof g=="function"){g.call(this,f)}this.$o().detach()}}})}function d(h){var g=[];for(var e in h){var i=h[e];g.push(b(e,typeof i=="function"?i:null))}if(!g.length){g.push(b("OK"))}return g}jq.alert=function(f,e){if(e&&e.mode=="os"){return c(f)}e=e||{};zk.load("zul.wnd,zul.wgt,zul.box",function(){var g=new zul.wnd.Window({closable:true,width:"250pt",title:e.title||zk.appName,border:"normal",children:[new zul.box.Box({mold:"horizontal",children:[new zul.wgt.Div({sclass:a[(e.icon||"").toUpperCase()]||a.INFORMATION}),new zul.wgt.Div({sclass:"z-messagebox",width:"210pt",children:[new zul.wgt.Label({value:f,multiline:true})]})]}),new zul.wgt.Separator({bar:true}),new zul.box.Box({mold:"horizontal",style:"margin-left:auto; margin-right:auto",children:d(e.button)})],mode:e.mode||"modal"});var h=e.desktop||zk.Desktop.$();if(h&&(h=h.firstChild)&&h.desktop){h.appendChild(g)}else{jq(document.body).append(g)}})};zAu.wrongValue_=function(g,f){var e=g.effects_;if(e.errMesg){e.errMesg.destroy();delete e.errMesg}if(f!==false){e.errMesg={destroy:zk.$void};zk.load("zul.inp",function(){if(e.errMesg){(e.errMesg=new zul.inp.Errorbox()).show(g,f)}})}}})();