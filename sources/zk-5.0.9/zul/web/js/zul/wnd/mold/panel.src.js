
function (out, skipper) {
	var zcls = this.getZclass(),
		uuid = this.uuid,
		title = this.getTitle(),
		caption = this.caption,
		isFrameRequired = zul.wnd.PanelRenderer.isFrameRequired(this),
		rounded = this._rounded(),
		noborder = !this._bordered(), 
		noheader = !caption && !title;
		
	out.push('<div', this.domAttrs_(), '>');
	if (caption || title) {
		if (isFrameRequired) {
			out.push('<div class="', zcls, '-tl"><div class="', zcls, '-tr"></div></div>');
			out.push('<div class="', zcls, '-hl"><div class="', zcls, '-hr"><div class="', zcls, '-hm">');
		}
		out.push('<div id="', uuid, '-cap" class="', zcls, '-header ');
			if (!rounded && noborder) {
				out.push(zcls, '-header-noborder');		
			}
		out.push('">');
		if (!caption) {
			if (this._closable)
				out.push('<div id="', uuid, '-close" class="', zcls, '-icon ',
						zcls, '-close"></div>');
			if (this._maximizable) {
				out.push('<div id="', uuid, '-max" class="', zcls, '-icon ', zcls, '-max');
				if (this._maximized)
					out.push(' ', zcls, '-maxd');
				out.push('"></div>');
			}
			if (this._minimizable)
				out.push('<div id="', uuid, '-min" class="', zcls, '-icon ',
						zcls, '-min"></div>');
			if (this._collapsible)
				out.push('<div id="', uuid, '-exp" class="', zcls, '-icon ',
						zcls, '-exp"></div>');
			out.push(zUtl.encodeXML(title));
		} else caption.redraw(out);
		
		out.push('</div>');
		
		if (isFrameRequired) out.push('</div></div></div>');
	} else if (rounded)
		out.push('<div class="', zcls,'-tl ', zcls,'-tl-gray"><div class="' ,zcls ,'-tr ', zcls,'-tr-gray"></div></div>');
	
	out.push('<div id="', uuid, '-body" class="', zcls, '-body"');
	if (!this._open) 
		out.push(' style="display:none;"');
	out.push('>');
	
	if (!skipper) {
		if (rounded) {
			out.push('<div class="', zcls, '-cl"><div class="', zcls,
					'-cr"><div class="', zcls, '-cm');
			if (noheader) {
				out.push(' ', zcls, '-noheader');
			}
			out.push('">');		
		}
		if (this.tbar) {
			out.push('<div id="', uuid, '-tb" class="', zcls, '-top');
			
			if (noborder)
				out.push(' ', zcls, '-top-noborder');
			
			if (noheader)
				out.push(' ', zcls, '-noheader');
			
			out.push('">');
			this.tbar.redraw(out);
			out.push('</div>');
		}
		if (this.panelchildren)
			this.panelchildren.redraw(out);
			
		if (this.bbar) {
			out.push('<div id="', uuid, '-bb" class="', zcls, '-btm');
			
			if (noborder)
				out.push(' ', zcls, '-btm-noborder');
				
			if (noheader)
				out.push(' ', zcls, '-noheader');
			
			out.push('">');
			this.bbar.redraw(out);
			out.push('</div>');
		}
		
		if (rounded) {
			out.push('</div></div></div><div class="', zcls, '-fl');
			
			if (!this.fbar) out.push(' ', zcls, '-nobtm2');
			
			out.push('"><div class="', zcls, '-fr"><div class="', zcls, '-fm">');
		}
		if (this.fbar) {
			out.push('<div id="', uuid, '-fb" class="', zcls, '-btm2">');
			this.fbar.redraw(out);
			out.push('</div>');
		}
		if (rounded) 
			out.push('</div></div></div><div class="', zcls ,'-bl"><div class="', zcls ,'-br"></div></div>');
	} 
	out.push('</div></div>');
}