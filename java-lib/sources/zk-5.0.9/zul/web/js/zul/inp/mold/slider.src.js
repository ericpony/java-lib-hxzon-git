

function (out) {
	var zcls = this.getZclass(),
		isVer = this.isVertical(),
		isScale = this.inScaleMold() && !isVer,
		uuid = this.uuid;
		
	if(isScale){
		out.push('<div id="', uuid, '" class="', zcls, '-tick" style="', 
				this.domStyle_({height:true}), '">');
		this.uuid += '-real'; 
	}
	
	out.push('<div', this.domAttrs_(isVer ? {width:true} : {height:true}), '>');
	
	if(isScale)
		this.uuid = uuid;
	
	out.push('<div id="', uuid, '-inner" class="', zcls, '-center">',
			'<div id="', uuid, '-btn" class="', zcls, '-btn">',
			'</div></div></div>');
	
	if(isScale)
		out.push('</div>');
}