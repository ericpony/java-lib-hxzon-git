function(b){var c=this.getZclass();b.push("<th",this.domAttrs_(),'><div id="',this.uuid,'-cave" class="',c,'-cnt"',this.domTextStyleAttr_(),'><div class="',c,'-sort-img"></div>',this.domContent_());for(var a=this.firstChild;a;a=a.nextSibling){a.redraw(b)}b.push("</div></th>")};