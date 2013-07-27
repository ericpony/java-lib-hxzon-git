
function (out) {
	var uuid = this.uuid,
		zcls = this.getZclass(),
		innerWidth = this.getInnerWidth(),
		wdAttr = innerWidth == '100%' ? ' width="100%"' : '',
		wdStyle =  innerWidth != '100%' ? 'width:' + innerWidth : '',
		inPaging = this.inPagingMold(), pgpos,
		tag = zk.ie || zk.gecko ? "a" : "button";

	out.push('<div', this.domAttrs_(), '>');

	if (inPaging && this.paging) {
		pgpos = this.getPagingPosition();
		if (pgpos == 'top' || pgpos == 'both') {
			out.push('<div id="', uuid, '-pgit" class="', zcls, '-pgi-t">');
			this.paging.redraw(out);
			out.push('</div>');
		}
	}

	if(this.listhead){
		out.push('<div id="', uuid, '-head" class="', zcls, '-header">',
			'<table', wdAttr, zUtl.cellps0,
			' style="table-layout:fixed;', wdStyle,'">');
		this.domFaker_(out, '-hdfaker', zcls);
		
		for (var hds = this.heads, j = 0, len = hds.length; j < len;)
			hds[j++].redraw(out);
	
		out.push('</table></div><div class="', zcls, '-header-bg"></div>');
	}
	out.push('<div id="', uuid, '-body" class="', zcls, '-body');
	if (this._autopaging)
		out.push(' ', zcls, '-autopaging');
	out.push('"');
	var hgh = this.getHeight();
	if (hgh) out.push(' style="overflow:hidden;height:', hgh, '"');
	
	
	out.push('><table', wdAttr, zUtl.cellps0, ' id="', uuid, '-cave"', ' style="table-layout:fixed;', wdStyle,'"');		
	out.push('>');
	
	if(this.listhead)
		this.domFaker_(out, '-bdfaker', zcls);

	if (this.domPad_ && !inPaging)
		this.domPad_(out, '-tpad');
	out.push('<tbody id="',uuid,'-rows">');
	for (var item = this.firstItem; item; item = this.nextItem(item))
		item.redraw(out);
	out.push('</tbody>');
	if (this.domPad_ && !inPaging)
		this.domPad_(out, '-bpad');
	
	this.redrawEmpty_(out);

	out.push('</table><', tag, ' id="', uuid,
		'-a" tabindex="-1" onclick="return false;" href="javascript:;" class="z-focus-a"></',
		tag, '>', "</div>");

	if (this.listfoot) {
		out.push('<div id="', uuid, '-foot" class="', zcls, '-footer">',
			'<table', wdAttr, zUtl.cellps0, ' style="table-layout:fixed;', wdStyle,'">');
		if (this.listhead) 
			this.domFaker_(out, '-ftfaker', zcls);
			
		this.listfoot.redraw(out);
		out.push('</table></div>');
	}

	if (this.frozen) {
		out.push('<div id="', uuid, '-frozen" class="', zcls, '-frozen">');
		this.frozen.redraw(out);
		out.push('</div>');
	}
	
	if (pgpos == 'bottom' || pgpos == 'both') {
		out.push('<div id="', uuid, '-pgib" class="', zcls, '-pgi-b">');
		this.paging.redraw(out);
		out.push('</div>');
	}
	out.push('</div>');
}