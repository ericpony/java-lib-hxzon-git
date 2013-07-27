



(function () {
	var _shallFocusBack;
	
	function _setFakerWd(i, wd, hdfaker, bdfaker, ftfaker, headn) {
		bdfaker.cells[i].style.width = zk(bdfaker.cells[i]).revisedWidth(wd) + "px";
		hdfaker.cells[i].style.width = bdfaker.cells[i].style.width;
		if (ftfaker) ftfaker.cells[i].style.width = bdfaker.cells[i].style.width;
		if (headn) {
			var cpwd = zk(headn.cells[i]).revisedWidth(zk.parseInt(hdfaker.cells[i].style.width));
			headn.cells[i].style.width = cpwd + "px";
			var cell = headn.cells[i].firstChild;
			cell.style.width = zk(cell).revisedWidth(cpwd) + "px";
		}
	}
	function _calcMinWd(wgt) {
		var wgtn = wgt.$n(),
			ws = wgtn ? wgtn.style.whiteSpace : ""; 
		if (wgtn) {
			if (zk.ie8_)
				wgt._wsbak = ws; 
			if (zk.ie < 8)
				jq(wgtn).addClass('z-word-nowrap'); 
			else
				wgtn.style.whiteSpace = 'nowrap'; 
		}
		var eheadtblw,
			efoottblw,
			ebodytblw,
			eheadtblfix,
			efoottblfix,
			ebodytblfix,
			hdfaker = wgt.ehdfaker,
			bdfaker = wgt.ebdfaker,
			ftfaker = wgt.eftfaker,
			head = wgt.head,
			headn = head ? head.$n() : null,
			fakerflex = head ? head.$n('hdfakerflex') : null,
			hdfakerws = [],
			bdfakerws = [],
			ftfakerws = [],
			hdws = [],
			hdcavews = [];
			
		if (wgt.eheadtbl && headn) {
			wgt.ehead.style.width = '';
			eheadtblw = wgt.eheadtbl.width;
			wgt.eheadtbl.width = '';
			wgt.eheadtbl.style.width = '';
			eheadtblfix = wgt.eheadtbl.style.tableLayout;
			wgt.eheadtbl.style.tableLayout = '';
			for (var i = hdfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
				var hdfakercell = hdfaker.cells[i],
					headcell = headn.cells[i],
					headcave = headcell.firstChild;
				hdfakerws[i] = hdfakercell.style.width;
				hdfakercell.style.width = '';
				hdws[i] = headcell.style.width;
				headcell.style.width = '';
				hdcavews[i] = headcave.style.width;
				headcave.style.width = '';
			}
		}
		if (headn)
			headn.style.width = '';
		if (wgt.efoottbl) {
			wgt.efoot.style.width = '';
			efoottblw = wgt.efoottbl.width;
			wgt.efoottbl.width = '';
			wgt.efoottbl.style.width = '';
			efoottblfix = wgt.efoottbl.style.tableLayout;
			wgt.efoottbl.style.tableLayout = '';
			for (var i = ftfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
				var ftcell = ftfaker.cells[i];
				ftfakerws[i] = ftcell.style.width;
				ftcell.style.width = '';
			}
		}
		if (wgt.ebodytbl) {
			wgt.ebody.style.width = '';
			ebodytblw = wgt.ebodytbl.width;
			wgt.ebodytbl.width = '';
			wgt.ebodytbl.style.width = '';
			ebodytblfix = wgt.ebodytbl.style.tableLayout;
			wgt.ebodytbl.style.tableLayout = '';
			if (bdfaker)
				for (var i = bdfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
					var bdcell = bdfaker.cells[i];
					bdfakerws[i] = bdcell.style.width;
					bdcell.style.width = '';
				}
		}

		
		var wds = [],
			width = 0,
			w = head ? head = head.lastChild : null,
			headWgt = wgt.getHeadWidget(),
			max = 0, maxj;
		if (bdfaker && w) {
			for (var i = bdfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
				var wd = bdwd = bdfaker.cells[i].offsetWidth,
					$cv = zk(w.$n('cave')),
					hdwd = w && w.isVisible() ? ($cv.textSize()[0] + $cv.padBorderWidth() + zk(w.$n()).padBorderWidth()) : 0,
					ftwd = ftfaker && zk(ftfaker.cells[i]).isVisible() ? ftfaker.cells[i].offsetWidth : 0,
					header;
				if ((header = headWgt.getChildAt(i)) && header.getWidth())
					hdwd = Math.max(hdwd, hdfaker.cells[i].offsetWidth);
				if (hdwd > wd) wd = hdwd;
				if (ftwd > wd) wd = ftwd;
				wds[i] = wd;
				if (zk.ie < 8 && max < wd) {
					max = wd;
					maxj = i;
				} else if (zk.ff > 4 || zk.ie == 9) {
					++wds[i];
				}
				if (zk.ie < 8) 
					wds[i] += 2;
				width += wds[i]; 
				if (w) w = w.previousSibling;
			}
			
		} else {
			var tr;
			if (tr = _getSigRow(wgt)) {
				for (var cells = tr.cells, i = cells.length; i--;) {
					var wd = cells[i].offsetWidth;
					wds[i] = wd;
					if (zk.ie < 8 && max < wd) {
						max = wd;
						maxj = i;
					} else if (zk.ff > 4 || zk.ie == 9) 
						++wds[i];
					if (zk.ie < 8) 
						wds[i] += 2;
					width += wds[i]; 
				}
			}
		}

		if (wgt.eheadtbl && headn) {
			wgt.eheadtbl.width = eheadtblw||'';
			wgt.eheadtbl.style.tableLayout = eheadtblfix||'';
			for (var i = hdfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
				hdfaker.cells[i].style.width = hdfakerws[i];
				var headcell = headn.cells[i],
					headcave = headcell.firstChild;
				headcell.style.width = hdws[i];
				headcave.style.width = hdcavews[i];
			}
		}
		if (wgt.efoottbl) {
			wgt.efoottbl.width = efoottblw||'';
			wgt.efoottbl.style.tableLayout = efoottblfix||'';
			for (var i = ftfaker.cells.length - (fakerflex ? 1 : 0); i--;)
				ftfaker.cells[i].style.width = ftfakerws[i];
		}
		if (wgt.ebodytbl) {
			wgt.ebodytbl.width = ebodytblw||'';
			wgt.ebodytbl.style.tableLayout = ebodytblfix||'';
			if (bdfaker)
				for (var i = bdfaker.cells.length - (fakerflex ? 1 : 0); i--;)
					bdfaker.cells[i].style.width = bdfakerws[i];
		}

		if (wgtn) {
			if (zk.ie < 8)
				jq(wgtn).removeClass('z-word-nowrap'); 
			else if (!zk.ie8_) 
				wgtn.style.whiteSpace = ws;
		}
		return {width: width, wds: wds};
	}
	function _fixBodyMinWd(wgt, fixMesh) {
		
		var sbc = wgt.isSizedByContent(),
			meshmin = wgt._hflex == 'min';
		if (!wgt.head && (meshmin || sbc)) {
			var bdw = zk(wgt.$n()).padBorderWidth();
				wd = _getMinWd(wgt) + bdw, 
				tr = wgt.ebodytbl,
				wds = wgt._minWd.wds,
				wlen = wds.length;
			if (fixMesh && meshmin)
				wgt.setFlexSize_({width:wd}, true);
			if (!(tr = tr.firstChild) || !(tr = tr.firstChild))
				return; 
			for (var c = tr.firstChild, i = 0; c && (i < wlen); c = c.nextSibling)
				c.style.width = (zk.safari ? wds[i++] : zk(c).revisedWidth(wds[i++])) + "px";
			if (sbc && !meshmin) {
				
				var bdfx = tr.lastChild,
					bdfxid = wgt.uuid + '-bdflex';
				if (!bdfx || bdfx.id != bdfxid) {
					jq(tr).append('<td id="' + bdfxid + '"></td>');
					bdfx = tr.lastChild;
				}
			}
		}
	}
	function _fixPageSize(wgt, rows) {
		var ebody = wgt.ebody;
		if (!ebody)
			return; 
		var max = ebody.offsetHeight;
		if (zk(ebody).hasHScroll()) 
			max -= jq.scrollbarWidth();
		if (max == wgt._prehgh) return false; 
		wgt._prehgh = max;
		var ebodytbl = wgt.ebodytbl,
			etbparent = ebodytbl.offsetParent,
			etbtop = ebodytbl.offsetTop,
			hgh = 0, 
			row,
			j = 0;
		for (var it = wgt.getBodyWidgetIterator({skipHidden:true}), 
				len = rows.length, w; (w = it.next()) && j < len; j++) {
			row = rows[j];
			var top = row.offsetTop - (row.offsetParent == etbparent ? etbtop : 0);
			if (top > max) {
				--j;
				break;
			}
			hgh = top;
		}
		if (row) { 
			if (top <= max) { 
				hgh = hgh + row.offsetHeight;
				j = Math.floor(j * max / hgh);
			}
			
			if (j == 0) j = 1; 
			if (j != wgt.getPageSize()) {
				wgt.fire('onPageSize', {size: j});
				return true;
			}
		}
	}
	function _syncbodyrows(wgt) {
		var bds = wgt.ebodytbl.tBodies;
		wgt.ebodyrows = wgt.ebodytbl.tBodies[bds.length > 3 ? wgt.ehead ? 2 : 1 : wgt.ehead ? 1 : 0].rows;
		
	}
	function _adjMinWd(wgt) {
		if (wgt._hflex == 'min') {
			var w = _getMinWd(wgt);
			wgt._hflexsz = w + zk(wgt).padBorderWidth(); 
			wgt.$n().style.width = jq.px0(w);
		}
	}
	function _getMinWd(wgt) {
		wgt._calcMinWds();
		var bdfaker = wgt.ebdfaker,
			hdtable = wgt.eheadtbl,
			bdtable = wgt.ebodytbl,
			wd,
			wds = [],
			width,
			_minwds = wgt._minWd.wds;
		if (wgt.head && bdfaker) {
			width = 0;
			for (var w = wgt.head.firstChild, i = 0; w; w = w.nextSibling) {
				if (zk(bdfaker.cells[i]).isVisible()) {
					wd = wds[i] = w._hflex == 'min' ? _minwds[i] : (w._width && w._width.indexOf('px') > 0) ? 
							zk.parseInt(w._width) : bdfaker.cells[i].offsetWidth;
					width += wd;
				}
				++i;
			}
		} else
			width = wgt._minWd.width; 
		return width + (zk.ie < 8 ? 1 : 0);
	}
	function _getSigRow(wgt) {
		
		var rw = wgt.getBodyWidgetIterator().next(),
			tr = rw ? rw.$n() : null;
		if (!tr)
			return;
		for (var maxtr = tr, len, max = maxtr.cells.length; tr; tr = tr.nextSibling)
			if ((len = tr.cells.length) > max) {
				maxtr = tr;
				max = len;
			}
		return maxtr;
	}
	function _cpCellWd(wgt) {
		var dst = wgt.efoot.firstChild.rows[0],
			srcrows = wgt.ebodyrows;
		if (!dst || !srcrows || !srcrows.length || !dst.cells.length)
			return;
		var ncols = dst.cells.length,
			src, maxnc = 0;
		for (var j = 0, it = wgt.getBodyWidgetIterator({skipHidden:true}), w; (w = it.next());) {
			if (wgt._modal && !w._loaded) 
				continue;

			var row = srcrows[j++], $row = zk(row),
				cells = row.cells, nc = $row.ncols(),
				valid = cells.length == nc && $row.isVisible();
				
			if (valid && nc >= ncols) {
				maxnc = ncols;
				src = row;
				break;
			}
			if (nc > maxnc) {
				src = valid ? row: null;
				maxnc = nc;
			} else if (nc == maxnc && !src && valid) {
				src = row;
			}
		}
		if (!maxnc) return;
	
		var fakeRow = !src;
		if (fakeRow) { 
			src = document.createElement("TR");
			src.style.height = "0px";
				
			for (var j = 0; j < maxnc; ++j)
				src.appendChild(document.createElement("TD"));
			srcrows[0].parentNode.appendChild(src);
		}
	
		
		
		for (var j = maxnc; j--;)
			dst.cells[j].style.width = "";
	
		var sum = 0;
		for (var j = maxnc; j--;) {
			var d = dst.cells[j], s = src.cells[j];
			if (zk.opera) {
				sum += s.offsetWidth;
				d.style.width = zk(s).revisedWidth(s.offsetWidth);
			} else {
				d.style.width = s.offsetWidth + "px";
				if (maxnc > 1) { 
					var v = s.offsetWidth - d.offsetWidth;
					if (v != 0) {
						v += s.offsetWidth;
						if (v < 0) v = 0;
						d.style.width = v + "px";
					}
				}
			}
		}
		if (zk.opera && wgt.isSizedByContent())
			dst.parentNode.parentNode.style.width = sum + "px";
		if (fakeRow)
			src.parentNode.removeChild(src);
	}


zul.mesh.MeshWidget = zk.$extends(zul.Widget, {
	_pagingPosition: "bottom",
	_prehgh: -1,
	_minWd: null, 
	$init: function () {
		this.$supers('$init', arguments);
		this.heads = [];
	},

	_innerWidth: "100%",
	_currentTop: 0,
	_currentLeft: 0,

	$define: {
		
		
		pagingPosition: _zkf = function () {
			this.rerender();
		},
		
		
		sizedByContent: _zkf,
		
		
		span: function(v) {
			var x = (true === v || 'true' == v) ? -65500 : (false === v || 'false' == v) ? 0 : (zk.parseInt(v) + 1);
			this._nspan = x < 0 && x != -65500 ? 0 : x;
			this.rerender();
		},
		
		
		autopaging: _zkf,
		
		
		paginal: _zkf,
		
		
		model: null,
		
		
		innerWidth: function (v) {
			if (v == null) this._innerWidth = v = "100%";
			if (this.eheadtbl) this.eheadtbl.style.width = v;
			if (this.ebodytbl) this.ebodytbl.style.width = v;
			if (this.efoottbl) this.efoottbl.style.width = v;
		}
	},
	
	getPageSize: function () {
		return (this.paging || this._paginal).getPageSize();
	},
	
	setPageSize: function (pgsz) {
		(this.paging || this._paginal).setPageSize(pgsz);
	},
	
	getPageCount: function () {
		return (this.paging || this._paginal).getPageCount();
	},
	
	getActivePage: function () {
		return (this.paging || this._paginal).getActivePage();
	},
	
	setActivePage: function (pg) {
		(this.paging || this._paginal).setActivePage(pg);
	},
	
	inPagingMold: function () {
		return "paging" == this.getMold();
	},

	setHeight: function (height) {
		this.$supers('setHeight', arguments);
		if (this.desktop) {
			if (zk.ie6_ && this.ebody)
				this.ebody.style.height = height;
			
			this._setHgh(height);
			this.onSize();
		}
	},
	setWidth: function (width) {
		this.$supers('setWidth', arguments);
		if (this.eheadtbl) this.eheadtbl.style.width = "";
		if (this.efoottbl) this.efoottbl.style.width = "";
		if (this.desktop)
			this.onSize();
	},
	setStyle: function (style) {
		if (this._style != style) {
			this.$supers('setStyle', arguments);
			if (this.desktop)
				this.onSize();
		}
	},

	
	getHeadWidget: function () {
		return this.head;
	},
	
	getFocusCell: function (el) {
	},
	_moveToHidingFocusCell: function (index) { 
		
		var td, frozen;
		if (this.head && (td = this.head.getChildAt(index).$n()) && parseInt(td.style.width) == 0 && 
			(frozen = zk.Widget.$(this.efrozen.firstChild)) &&
			(index = index - frozen.getColumns()) >= 0) {
			frozen.setStart(index);
			_shallFocusBack = true;
		}
	},
	_restoreFocus: function () { 
		if (_shallFocusBack && zk.currentFocus) {
			_shallFocusBack = false;
			zk.currentFocus.focus();
		}
	},

	bind_: function () {
		this.$supers(zul.mesh.MeshWidget, 'bind_', arguments);
		if (zk.ie < 8 && this.isVflex()) { 
			
			
			var hgh = this.$n().style.height;
			if (!hgh || hgh == "auto") this.$n().style.height = "99%"; 
		}
		this._bindDomNode();
		if (this._hflex != 'min')
			this._fixHeaders();
		if (this.ebody) {
			this.domListen_(this.ebody, 'onScroll');
			this.ebody.style.overflow = ''; 
			if (this.efrozen)
				jq(this.ebody).addClass('z-word-nowrap').css('overflow-x', 'hidden');
		}
		zWatch.listen({onSize: this, beforeSize: this, onResponse: this});
		var paging;
		if (zk.ie7_ && (paging = this.$n('pgib')))
			zk(paging).redoCSS();
	},
	unbind_: function () {
		if (this.ebody)
			this.domUnlisten_(this.ebody, 'onScroll');

		zWatch.unlisten({onSize: this, beforeSize: this, onResponse: this});
		
		this.$supers(zul.mesh.MeshWidget, 'unbind_', arguments);
	},
	clearCache: function () {
		this.$supers('clearCache', arguments);
		this.ebody = this.ehead = this.efoot = this.efrozen = this.ebodytbl
			= this.eheadtbl = this.efoottbl = this.ebodyrows
			= this.ehdfaker = this.ebdfaker = null;
	},

	
	syncSize: function () {
		if (this.desktop) {
			this.clearCachedSize_();
			if (this._hflex == 'min') {
				zFlex.onFitSize.apply(this);
			} else {
				this._calcMinWds();
				this._fixHeaders();
				this.onSize();
			}
		}
	},
	onResponse: function () {
		if (this._shallSize)
			this.syncSize();
	},
	_syncSize: function () {
		
		if (this.desktop)
			this._shallSize = true;
	},
	_fixHeaders: function (force) { 
		if (this.head && this.ehead) {
			var empty = true,
				flex = false,
				hdsmin = (this._hflex == 'min') || this.isSizedByContent();
			for (var i = this.heads.length; i-- > 0;)
				for (var w = this.heads[i].firstChild; w; w = w.nextSibling) {
					if (hdsmin && !w._width && !w._nhflex) {
						
						w._hflex = 'min';
						w._nhflex = -65500; 
						w._nhflexbak = true;
					}
					if (!flex && w._nhflex)
						flex = true;
					if (w.getLabel() || w.getImage() || w.nChildren)
						empty = false;
				}
			var old = this.ehead.style.display,
				tofix = (force || empty) && flex && this.isRealVisible();
			this.ehead.style.display = empty ? 'none' : '';
			
			for (var w = this.head.firstChild; w; w = w.nextSibling) {
				if (tofix && w._nhflex)
					w.fixFlex_();
				if (w._nhflexbak) {
					delete w._hflex;
					delete w._nhflex;
					delete w._nhflexbak;
				}
			}
			return old != this.ehead.style.display;
		}
	},
	_adjFlexWd: function () { 
		var head = this.head;
		if (!head) return;
		var hdfaker = this.ehdfaker,
			bdfaker = this.ebdfaker,
			ftfaker = this.eftfaker,
			headn = head.$n(),
			i = 0;
		for (var w = head.firstChild, wd; w; w = w.nextSibling) {
			if ((wd = w._hflexWidth) !== undefined)
				_setFakerWd(i, wd, hdfaker, bdfaker, ftfaker, headn);
			++i;
		}
		_adjMinWd(this);
	},
	_bindDomNode: function () { 
		for (var n = this.$n().firstChild; n; n = n.nextSibling)
			switch(n.id) {
			case this.uuid + '-head':
				this.ehead = n;
				this.eheadtbl = jq(n).find('>table:first')[0];
				break;
			case this.uuid + '-body':
				this.ebody = n;
				this.ebodytbl = jq(n).find('>table:first')[0];
				break;
			case this.uuid + '-foot':
				this.efoot = n;
				this.efoottbl = jq(n).find('>table:first')[0];
				break;
			case this.uuid + '-frozen':
				this.efrozen = n;
				break;
			}

		if (this.ebody) {
			
			var bds = this.ebodytbl.tBodies,
				ie7special = zk.ie7_ && bds && bds.length == 1 && !this.ehead && !bds[0].id;
			if (!bds || !bds.length || (this.ehead && bds.length < 2 || ie7special)) {
				if (ie7special) 
					jq(bds[0]).remove();
				var out = [];
				if (this.domPad_ && !this.inPagingMold() && this._mold != 'select') this.domPad_(out, '-tpad');
				out.push('<tbody id="',this.uuid,'-rows"/>');
				if (this.domPad_ && !this.inPagingMold() && this._mold != 'select') this.domPad_(out, '-bpad');
				jq(this.ebodytbl ).append(out.join(''));
			}
			_syncbodyrows(this);
		}
		if (this.ehead) {
			this.ehdfaker = this.eheadtbl.tBodies[0].rows[0];
			this.ebdfaker = this.ebodytbl.tBodies[0].rows[0];
			if (this.efoottbl)
				this.eftfaker = this.efoottbl.tBodies[0].rows[0];
		}
	},
	replaceHTML: function() { 
		var old = this._syncingbodyrows;
		this._syncingbodyrows = true;
		try {
			
			
			
			
			
			
			
			
			this.$supers(zul.mesh.MeshWidget, 'replaceHTML', arguments);
		} finally {
			this._syncingbodyrows = old;
		}
	},
	replaceChildHTML_: function() { 
		var old = this._syncingbodyrows;
		this._syncingbodyrows = true;
		try {
			this.$supers('replaceChildHTML_', arguments);
			_syncbodyrows(this);
		} finally {
			this._syncingbodyrows = old;
		}
	},
	fireOnRender: function (timeout) {
		if (!this._pendOnRender) {
			this._pendOnRender = true;
			setTimeout(this.proxy(this._onRender), timeout ? timeout : 100);
		}
	},
	_doScroll: function () { 
		
		
		
		if (zk.safari && this._ignoreDoScroll) 
			return;
		
		if (!(this.fire('onScroll', this.ebody.scrollLeft).stopped)) {
			if (this._currentLeft != this.ebody.scrollLeft) { 
				if (this.ehead) {
					this.ehead.scrollLeft = this.ebody.scrollLeft;
					
					var diff = this.ebody.scrollLeft - this.ehead.scrollLeft;
					var hdflex = jq(this.ehead).find('table>tbody>tr>th:last-child')[0];
					if (diff) { 
						hdflex.style.width = (hdflex.offsetWidth + diff) + 'px';
						this.ehead.scrollLeft = this.ebody.scrollLeft;
					} else if (parseInt(hdflex.style.width) != 0 && this.ebody.scrollLeft == 0) {
						hdflex.style.width = '';
					}
				}
				if (this.efoot) 
					this.efoot.scrollLeft = this.ebody.scrollLeft;
			}
		}
		
		var t = this.ebody.scrollTop,
			l = this.ebody.scrollLeft,
			scrolled = (t != this._currentTop || l != this._currentLeft);
		if (scrolled && 
				
				!this._listbox$rod && !this._grid$rod) {
			this._currentTop = t; 
		}
		
		if (scrolled) {
			
			this._currentLeft = l;
		}
		
		if (!this.paging && !this._paginal)
			this.fireOnRender(zk.gecko ? 200 : 60);

		if (scrolled)
			this._fireOnScrollPos();
	},
	_timeoutId: null,
	_fireOnScrollPos: function (time) { 
		clearTimeout(this._timeoutId);
		this._timeoutId = setTimeout(this.proxy(this._onScrollPos), time >= 0 ? time : zk.gecko ? 200 : 60);
	},
	_onScrollPos: function () {
		
		if (this.ebody) {
			this._currentTop = this.ebody.scrollTop;
			this._currentLeft = this.ebody.scrollLeft;
			this.fire('onScrollPos', {
				top: this._currentTop,
				left: this._currentLeft
			});
		}
	},
	_onRender: function () { 
		this._pendOnRender = false;
		if (this._syncingbodyrows || zAu.processing()) { 
			this.fireOnRender(zk.gecko ? 200 : 60); 
			return true;
		}

		var rows = this.ebodyrows;
		if (this.inPagingMold() && this._autopaging && rows && rows.length)
			if (_fixPageSize(this, rows))
				return; 
		
		if (zk.ie8_ && (this._wsbak !== undefined)) { 
			this.$n().style.whiteSpace = this._wsbak;
			delete this._wsbak;
		}
		if (zk.ie < 8)
			this._syncBodyHeight(); 
		if (zk.ie7_)
			zk(this.ebody).redoCSS(); 
		
		if (!this.desktop || !this._model || !rows || !rows.length) return;

		
		
		var items = [],
			min = this.ebody.scrollTop, max = min + this.ebody.offsetHeight;
		for (var j = 0, it = this.getBodyWidgetIterator({skipHidden:true}), 
				len = rows.length, w; (w = it.next()) && j < len; j++) {
			if (!w._loaded) {
				var row = rows[j], $row = zk(row),
					top = $row.offsetTop();
				
				if (top + $row.offsetHeight() < min) continue;
				if (top > max) break; 
				items.push(w);
			}
		}
		if (items.length)
			this.fire('onRender', {items: items}, {implicit:true});
	},
	_syncBodyHeight: function () { 
		var ebody = this.ebody,
			ebodytbl = this.ebodytbl;

		
		if (!this.desktop || this._height || (this._vflex && this._vflex != 'min'))
			return; 
		
		
		
		if (ebody.style.height == "0px")
			ebody.style.height = '';
		
		if (ebody.offsetHeight - ebodytbl.offsetHeight > 11 &&
				ebody.offsetWidth >= ebodytbl.offsetWidth) 
			ebody.style.height = (ebodytbl.offsetHeight) + 'px';
		zjq.fixOnResize(0); 
	},
	
	
	

	
	beforeSize: function () {
		
		var wd = zk.ie6_ ? this.getWidth() : this.$n().style.width;
		if (!wd || wd == "auto" || wd.indexOf('%') >= 0) {
			var n = this.$n();
			
			if (!zk.ie6_ && n._lastsz && n._lastsz.height == n.offsetHeight && n._lastsz.width == n.offsetWidth)
				return; 
				
			if (this.ebody) 
				this.ebody.style.width = "";
			if (this.ehead) 
				this.ehead.style.width = "";
			if (this.efoot) 
				this.efoot.style.width = "";
		
			
			if (zk.ie6_ && this._hflex && this._hflex != 'min') {
				n.style.width = '';
			}
			n._lastsz = null;
		}
		
		
		if (zk.ie6_ && this._vflex && this._vflex != 'min') {
			var hgh = this.getHeight();
			if (!hgh || hgh == "auto" || hgh.indexOf('%') >= 0) {
				var n = this.$n();
				n.style.height = '';
				if (this.ebody) 
					this.ebody.style.height = "";
				n._lastsz = null;
			}
		}
		
	},
	onSize: function () {
		if (this.isRealVisible()) { 
			var n = this.$n();
			if (n._lastsz && n._lastsz.height == n.offsetHeight && n._lastsz.width == n.offsetWidth) {
				this.fireOnRender(155); 
				return; 
			}
				
			this._calcSize();
			
			this.fireOnRender(155);
			
			
			if (this.ebody.scrollHeight >= this._currentTop)
				this.ebody.scrollTop = this._currentTop;
				
			if (this.ebody.scrollWidth >= this._currentLeft) {
				this.ebody.scrollLeft = this._currentLeft;
				if (this.ehead) 
					this.ehead.scrollLeft = this._currentLeft;
				if (this.efoot) 
					this.efoot.scrollLeft = this._currentLeft;
			}
			this._shallSize = false;
		}
	},

	_vflexSize: function (hgh) {
		var n = this.$n();
		if (zk.ie6_) { 
			
			
			n.style.height = "";
			n.style.height = hgh;
		}
		
		var pgHgh = 0
		if (this.paging) {
			var pgit = this.$n('pgit'),
				pgib = this.$n('pgib');
			if (pgit) pgHgh += pgit.offsetHeight;
			if (pgib) pgHgh += pgib.offsetHeight;
		}
		return zk(n).revisedHeight(n.offsetHeight) - (this.ehead ? this.ehead.offsetHeight : 0)
			- (this.efoot ? this.efoot.offsetHeight : 0)
			- (this.efrozen ? this.efrozen.offsetHeight : 0)
			- pgHgh; 
	},
	setFlexSize_: function(sz) {
		var n = this.$n(),
			head = this.$n('head');
		if (sz.height !== undefined) {
			if (sz.height == 'auto') {
				n.style.height = '';
				if (head) head.style.height = '';
			} else {
				if (zk.ie < 8 && this._vflex == 'min' && this._vflexsz === undefined)
					sz.height += 1;
				return this.$supers('setFlexSize_', arguments);
			}
		}
		if (sz.width !== undefined) {
			if (sz.width == 'auto') {
				if (this._hflex != 'min') n.style.width = '';
				if (head) head.style.width = '';
			} else {
				if (zk.ie < 8 && head && this._hflex == 'min' && this._hflexsz === undefined)
					sz.width += 1;
				return this.$supers('setFlexSize_', arguments);
			}
		}
		return {height: n.offsetHeight, width: n.offsetWidth};
	},
	
	_setHgh: function (hgh) {
		if (this.isVflex() || (hgh && hgh != "auto" && hgh.indexOf('%') < 0)) {
			if (zk.safari 
			&& this.ebody.style.height == jq.px(this._vflexSize(hgh)))
				return;

			this.ebody.style.height = ''; 
			var h = this._vflexSize(hgh); 
			if (h < 0) h = 0;

			if (!zk.ie || zk.ie8 || this._vflex != "min")
				this.ebody.style.height = h + "px";
			
			if (zk.ie && this.ebody.offsetHeight) {} 
			
			
		} else {
			
			
			
			this.ebody.style.height = "";
			this.$n().style.height = hgh;
		}
	},
	_ignoreHghExt: function () {
		return false;
	},
	
	_calcSize: function () {
		this._beforeCalcSize();
		
		
		
		
		
		var n = this.$n(),
			wd = n.style.width;
		if (!wd || wd == "auto" || wd.indexOf('%') >= 0) {
			wd = zk(n).revisedWidth(n.offsetWidth);
			if (wd) 
				wd += "px";
		}
		if (wd) {
			this.ebody.style.width = wd;
			if (this.ehead) 
				this.ehead.style.width = wd;
			if (this.efoot) 
				this.efoot.style.width = wd;
		}
		
		if (zk.ie7_ && this.ebodytbl) { 
			var s = this.ebodytbl.style,
				sw = s.width;
			if (!sw) {
				s.width = '100%';
				s.width = sw;
			}
		}
		
		var tblwd = this._getEbodyWd(),
			hgh = this.getHeight() || n.style.height; 
		if (zk.ie) {
			if (this.eheadtbl && this.eheadtbl.offsetWidth != this.ebodytbl.offsetWidth) 
				this.ebodytbl.style.width = ""; 
				 
			if (tblwd && 
					
					(!this.eheadtbl || !this.ebodytbl || !this.eheadtbl.style.width ||
					this.eheadtbl.style.width != this.ebodytbl.style.width
					|| this.ebody.offsetWidth == this.ebodytbl.offsetWidth) &&
					
					this.ebody.offsetWidth - tblwd > 11) { 
				this.ebodytbl.style.width = jq.px0(--tblwd);
			}
			
			if (!zk.ie8 && !this.isVflex() && (!hgh || hgh == "auto") && !this._ignoreHghExt()) {
				if (zk(this.ebody).hasVScroll()) 
					this.ebody.style.height = jq.px0(this.ebodytbl.offsetHeight); 
				
				tblwd = this.ebody.clientWidth;
			}
		}
		if (this.ehead) {
			if (tblwd) 
				this.ehead.style.width = tblwd + 'px';
			if (this.isSizedByContent() && this.ebodyrows && this.ebodyrows.length)
				this._adjHeadWd();
			else if (tblwd && this.efoot) 
				this.efoot.style.width = tblwd + 'px';
		} else if (this.efoot) {
			if (tblwd) this.efoot.style.width = tblwd + 'px';
			if (this.efoottbl.rows.length && this.ebodyrows && this.ebodyrows.length)
				_cpCellWd(this);
		}
		
		
		this._adjSpanWd();
		
		_fixBodyMinWd(this, true);
		
		
		if (this._hflexsz === undefined && this._hflex == 'min' && this._width === undefined && n.offsetWidth > this.ebodytbl.offsetWidth) {
			n.style.width = this.ebodytbl.offsetWidth + 'px';
			this._hflexsz = n.offsetWidth;
		}
		
		n._lastsz = {height: n.offsetHeight, width: n.offsetWidth}; 
		
		this._afterCalcSize();
	},
	_getEbodyWd: function () {
		return this.ebody.clientWidth;
	},
	_beforeCalcSize: function () {
		this._setHgh(this.$n().style.height);
	},
	_afterCalcSize: function () {
		
		if (zk.ie8 && this.isModel() && this.inPagingMold())
			zk(this).redoCSS();
		
		this._removeHorScrollbar();
		
		this._removeScrollbar();
	},
	_removeHorScrollbar: (zk.ie == 8) ? function () {
		var h = this._height;
		if (!this._vflex && (!h || h == 'auto') && !this._rows 
			&& this.ebody.offsetWidth >= this.ebodytbl.offsetWidth) {
			
			var ebodyhghbak = this.ebody.style.height,
				wgt = this;
			this.ebody.style.height = this.ebodytbl.offsetHeight + 'px';
			setTimeout(function () { wgt.ebody.style.height = ebodyhghbak }, 0);
		}
	} : zk.$void,
	_removeScrollbar: zk.ie ? function() { 
		if (this._vflex) return;
		
		var hgh = this.getHeight() || this.$n().style.height || (this.getRows && this.getRows()); 
		if (!hgh || hgh == "auto") {
			var ebody = this.ebody,
				ebodytbl = this.ebodytbl;
			if(zk.ie < 8) { 
				var $ebody;
				if (($ebody=zk(ebody)).hasVScroll()) { 
					ebody.style.height = jq.px0(ebodytbl.offsetHeight);
					if ($ebody.hasVScroll()) 
						ebody.style.height = jq.px0(ebodytbl.offsetHeight+jq.scrollbarWidth());
				}
			} else if (!this.efrozen) {
				
				
				ebody.style.overflowX = 
					ebodytbl.offsetWidth > ebody.offsetWidth ?
					'scroll': '';
			}
		}
	}: zk.$void,
	
	_isAllWidths: function() {
		if (this.isSizedByContent())
			return true;
		if (!this.head)
			return false;
		var allwidths = true;
		for (var w = this.head.firstChild; w; w = w.nextSibling) {
			if (allwidths && (w._width === undefined || w._width.indexOf('px') <= 0) && (w._hflex != 'min' || w._hflexsz === undefined) && w.isVisible()) {
				allwidths = false;
				break;
			}
		}
		return allwidths;
	},	
	domFaker_: function (out, fakeId, zcls) { 
		var head = this.head;
		out.push('<tbody style="visibility:hidden;height:0px"><tr id="',
				head.uuid, fakeId, '" class="', zcls, '-faker">');
		var allwidths = true,
			
			totalWidth = 0, shallCheckSize = zk.ie < 8;
		
		for (var w = head.firstChild; w; w = w.nextSibling) {
			out.push('<th id="', w.uuid, fakeId, '"', w.domAttrs_(),
				 	'><div style="overflow:hidden"></div></th>');
			if (allwidths && w._width === undefined && w._hflex === undefined && w.isVisible()) {
				allwidths = false;
				shallCheckSize = false;
			} else if (shallCheckSize) {
				var width = w._width;
				if (width && width.indexOf('px') != -1)
					totalWidth += zk.parseInt(width);
				else shallCheckSize = false;
			}
		}
		
		if (shallCheckSize) {
			var w = this._width;
			if (w && w.indexOf('px') != -1)
				allwidths = zk.parseInt(w) != totalWidth;
		}
		
		
		out.push('<th id="', head.uuid, fakeId, 'flex"', 
				(allwidths || this.isSizedByContent() ? '' : ' style="width:0px"'), '></th></tr></tbody>');
	},

	
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);

		if (child.$instanceof(this.getHeadWidgetClass())) {
			this.head = child;
			this._minWd = null;
		} else if (!child.$instanceof(zul.mesh.Auxhead)) 
			return;

		var nsib = child.nextSibling;
		if (nsib)
			for (var hds = this.heads, j = 0, len = hds.length; j < len; ++j)
				if (hds[j] == nsib) {
					hds.splice(j, 0, child);
					return; 
				}
		this.heads.push(child);
	},
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);

		if (child == this.head) {
			this._minWd = this.head = null;
			this.heads.$remove(child);
		} else if (child.$instanceof(zul.mesh.Auxhead))
			this.heads.$remove(child);
		else if (child.$instanceof(zul.mesh.Frozen))
			this.efrozen = null;
	},
	
	beforeMinFlex_: function (orient) {
		if (this._hflexsz === undefined && orient == 'w' && this._width === undefined) {
			if (this.isSizedByContent())
				this._calcSize();
			if (this.head) {
				this._fixHeaders(true);
				for(var w = this.head.firstChild; w; w = w.nextSibling) 
					if (w._hflex == 'min' && w.hflexsz === undefined) 
						return null;
			}
			_fixBodyMinWd(this); 
			return _getMinWd(this); 
		}
		return null;
	},
	
	beforeParentMinFlex_: function (orient) {
		if (orient == 'w') {
			if (this.isSizedByContent()) 
				this._calcSize();
			if (this.head)
				this._fixHeaders();
		} else
			this._calcSize();
	},
	clearCachedSize_: function() {
		this.$supers('clearCachedSize_', arguments);
		this._clearCachedSize();
		
		var tr;
		if (!this.ebdfaker && (tr = _getSigRow(this))) { 
			for (var cells = tr.cells, i = cells.length; i--;)
				cells[i].style.width = '';
		}
		var head = this.getHeadWidget();
		if (head) {
			for (var w = head.firstChild, wn; w; w = w.nextSibling)
				delete w._hflexsz;
		}
	},
	_clearCachedSize: function() {
		var n;
		if (n = this.$n())
			n._lastsz = this._minWd = null;
	},
	_calcMinWds: function () { 
		if (!this._minWd)
			this._minWd = _calcMinWd(this); 
		return this._minWd;
	},
	_adjSpanWd: function () { 
		if (!this._isAllWidths() || !this.isSpan())
			return;
		var hdfaker = this.ehdfaker,
			bdfaker = this.ebdfaker,
			ftfaker = this.eftfaker;
		if (!hdfaker || !bdfaker || !hdfaker.cells.length
		|| !bdfaker.cells.length)
			return;
		
		var head = this.head.$n();
		if (!head) return; 
		this._calcMinWds();
		var hdtable = this.eheadtbl,
			bdtable = this.ebodytbl,
			wd,
			wds = [],
			width = 0,
			fakerflex = this.head.$n('hdfakerflex'),
			hdfakervisible = zk(hdfaker).isRealVisible(true),
			_minwds = this._minWd.wds;
		for (var w = this.head.firstChild, i = 0; w; w = w.nextSibling) {
			if (zk(hdfaker.cells[i]).isVisible()) {
				wd = wds[i] = w._hflex == 'min' ? _minwds[i] : (w._width && w._width.indexOf('px') > 0) ? 
						zk.parseInt(w._width) : hdfakervisible ? hdfaker.cells[i].offsetWidth : bdfaker.cells[i].offsetWidth;
				width += wd;
			}
			++i;
		}
		
		var hgh = zk.ie < 8 ? (this.getHeight() || this.$n().style.height) : true; 
		
		var	total = (hgh ? bdtable.parentNode.clientWidth : bdtable.parentNode.offsetWidth) - (zk.ie < 8 ? 1 : 0), 
			extSum = total - width; 
		
		var count = total,
			visj = -1;
		if (this._nspan < 0) { 
			for (var i = hdfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
				if (!zk(hdfaker.cells[i]).isVisible()) continue;
				wds[i] = wd = extSum <= 0 ? wds[i] : (((wds[i] * total / width) + 0.5) | 0);
				var rwd = zk(bdfaker.cells[i]).revisedWidth(wd),
					stylew = jq.px0(rwd);
				count -= wd;
				visj = i;
				if (bdfaker.cells[i].style.width == stylew)
					continue;
				bdfaker.cells[i].style.width = stylew; 
				hdfaker.cells[i].style.width = stylew;
				if (ftfaker) ftfaker.cells[i].style.width = stylew;
				var cpwd = zk(head.cells[i]).revisedWidth(rwd);
				head.cells[i].style.width = jq.px0(cpwd);
				var cell = head.cells[i].firstChild;
				cell.style.width = zk(cell).revisedWidth(cpwd) + "px";
			}
			
			if (extSum > 0 && count != 0 && visj >= 0) {
				wd = wds[visj] + count;
				var rwd = zk(bdfaker.cells[visj]).revisedWidth(wd),
					stylew = jq.px0(rwd);
				bdfaker.cells[visj].style.width = stylew; 
				hdfaker.cells[visj].style.width = stylew;
				if (ftfaker) ftfaker.cells[visj].style.width = stylew;
				var cpwd = zk(head.cells[visj]).revisedWidth(rwd);
				head.cells[visj].style.width = jq.px0(cpwd);
				var cell = head.cells[visj].firstChild;
				cell.style.width = zk(cell).revisedWidth(cpwd) + "px";
			}
		} else { 
			visj = this._nspan - 1;
			for (var i = hdfaker.cells.length - (fakerflex ? 1 : 0); i--;) {
				if (!zk(hdfaker.cells[i]).isVisible()) continue;
				wd = visj == i && extSum > 0 ? (wds[visj] + extSum) : wds[i];
				var rwd = zk(bdfaker.cells[i]).revisedWidth(wd),
					stylew = jq.px0(rwd);
				if (bdfaker.cells[i].style.width == stylew)
					continue;
				bdfaker.cells[i].style.width = stylew; 
				hdfaker.cells[i].style.width = stylew;
				if (ftfaker) ftfaker.cells[i].style.width = stylew;
				var cpwd = zk(head.cells[i]).revisedWidth(rwd);
				head.cells[i].style.width = jq.px0(cpwd);
				var cell = head.cells[i].firstChild;
				cell.style.width = zk(cell).revisedWidth(cpwd) + "px";
			}
		}
		
		if (zk.opera) 
			zk(this.$n()).redoCSS();
		
	},
	_adjHeadWd: function () {
		var hdfaker = this.ehdfaker,
			bdfaker = this.ebdfaker,
			ftfaker = this.eftfaker,
			fakerflex = this.head ? this.head.$n('hdfakerflex') : null;
		if (!hdfaker || !bdfaker || !hdfaker.cells.length
		|| !bdfaker.cells.length || !zk(hdfaker).isRealVisible()
		|| !this.getBodyWidgetIterator().hasNext()) return;
		
		var hdtable = this.ehead.firstChild, head = this.head.$n();
		if (!head) return;
		
		
		var bdtable = this.ebody.firstChild;
		
		var	total = Math.max(hdtable.offsetWidth, bdtable.offsetWidth), 
			tblwd = Math.min(bdtable.parentNode.clientWidth, bdtable.offsetWidth);
			
		if (total == this.ebody.offsetWidth && 
			this.ebody.offsetWidth > tblwd && this.ebody.offsetWidth - tblwd < 20)
			total = tblwd;
		this._calcMinWds(); 
		var xwds = this._minWd,
			wds = xwds.wds,
			width = xwds.width;
		for (var i = bdfaker.cells.length - (fakerflex ? 1 : 0), 
				hwgt = this.head.lastChild; i--; hwgt = hwgt.previousSibling) {
			
			if (!zk(hdfaker.cells[i]).isVisible() || hwgt._width) continue; 
			var wd = wds[i], 
				rwd = zk(bdfaker.cells[i]).revisedWidth(wd),
				wdpx = rwd + "px";
			hdfaker.cells[i].style.width = bdfaker.cells[i].style.width = wdpx;
			if (ftfaker) 
				ftfaker.cells[i].style.width = wdpx;
			var cpwd = zk(head.cells[i]).revisedWidth(rwd);
			head.cells[i].style.width = cpwd + "px";
			var cell = head.cells[i].firstChild;
			cell.style.width = zk(cell).revisedWidth(cpwd) + "px";
		}
		
		
		if (total != hdtable.offsetWidth) {
			total = hdtable.offsetWidth;
			tblwd = Math.min(this.ebody.clientWidth, bdtable.offsetWidth);
			if (total == this.ebody.offsetWidth && 
				this.ebody.offsetWidth > tblwd && this.ebody.offsetWidth - tblwd < 20)
				total = tblwd;
		}
		
		_adjMinWd(this);
	}
});
})();