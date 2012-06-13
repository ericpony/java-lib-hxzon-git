
function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		innerWidth = this.getInnerWidth(),
		width = innerWidth == '100%' ? ' width="100%"' : '',
		wdStyle =  innerWidth != '100%' ? 'width:' + innerWidth : '',
		inPaging = this.inPagingMold(), pgpos,
		tag = zk.ie || zk.gecko ? 'a' : 'button';
		
	out.push('<div', this.domAttrs_(), '>');
	
	if (inPaging && this.paging) {
		pgpos = this.getPagingPosition();
		if (pgpos == 'top' || pgpos == 'both') {
			out.push('<div id="', uuid, '-pgit" class="', zcls, '-pgi-t">');
			this.paging.redraw(out);
			out.push('</div>');
		}
	}
	
	if (this.treecols) {
		out.push('<div id="', uuid, '-head" class="', zcls, '-header">',
				'<table', width, zUtl.cellps0,
				' style="table-layout:fixed;', wdStyle,'">');
		this.domFaker_(out, '-hdfaker', zcls);
		
		for (var hds = this.heads, j = 0, len = hds.length; j < len;)
			hds[j++].redraw(out);
	
		out.push('</table></div><div class="', zcls, '-header-bg"></div>');
	}
	out.push('<div id="', uuid, '-body" class="', zcls, '-body');
	if (this._autopaging)
		out.push(' ', zcls, '-autopaging');
	out.push('"><table', width,	zUtl.cellps0, ' style="table-layout:fixed;', wdStyle,'">');
	
	if (this.treecols)
		this.domFaker_(out, '-bdfaker', zcls);
		
	if (this.treechildren)
		this.treechildren.redraw(out);
	
	out.push('</table><', tag, ' id="', uuid,
		'-a" tabindex="-1" onclick="return false;" href="javascript:;" class="z-focus-a"></',
		tag, '>');
	out.push("</div>");
	
	if (this.treefoot) {
		out.push('<div id="', uuid, '-foot" class="', zcls, '-footer">',
				'<table', width, zUtl.cellps0, ' style="table-layout:fixed;', wdStyle,'">');
		if (this.treecols) 
			this.domFaker_(out, '-ftfaker', zcls);
			
		this.treefoot.redraw(out);
		out.push('</table></div>');
	}
	if (pgpos == 'bottom' || pgpos == 'both') {
		out.push('<div id="', uuid, '-pgib" class="', zcls, '-pgi-b">');
		this.paging.redraw(out);
		out.push('</div>');
	}
	out.push('</div>');
}
