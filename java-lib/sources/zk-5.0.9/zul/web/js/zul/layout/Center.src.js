

zul.layout.Center = zk.$extends(zul.layout.LayoutRegion, {
	_sumFlexWidth: true, 
	_maxFlexHeight: true, 
	
	
	setHeight: zk.$void,      
	
	setWidth: zk.$void,       
	
	setVisible: zk.$void,     
	
	getSize: zk.$void,        
	
	setSize: zk.$void,        
	
	setCmargins: zk.$void,    
	
	setSplittable: zk.$void,  
	
	setOpen: zk.$void,        
	
	setCollapsible: zk.$void, 
	
	setMaxsize: zk.$void,     
	
	setMinsize: zk.$void,     
	doMouseOver_: zk.$void,   
	doMouseOut_: zk.$void,    
	doClick_: zk.$void,       
	
	getPosition: function () {
		return zul.layout.Borderlayout.CENTER;
	}
});