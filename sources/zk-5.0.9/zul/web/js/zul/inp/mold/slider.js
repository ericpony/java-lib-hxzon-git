function(b){var e=this.getZclass(),d=this.isVertical(),a=this.inScaleMold()&&!d,c=this.uuid;if(a){b.push('<div id="',c,'" class="',e,'-tick" style="',this.domStyle_({height:true}),'">');this.uuid+="-real"}b.push("<div",this.domAttrs_(d?{width:true}:{height:true}),">");if(a){this.uuid=c}b.push('<div id="',c,'-inner" class="',e,'-center">','<div id="',c,'-btn" class="',e,'-btn">',"</div></div></div>");if(a){b.push("</div>")}};