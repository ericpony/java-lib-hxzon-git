



(function() {
	function _beforeChildKey(wgt, evt) {
		return zAu.processing() || wgt._shallIgnore(evt)
			|| (!wgt._focusItem && !wgt.getSelectedItem());
	}
	function _afterChildKey(evt) {
		switch (evt.data.keyCode) {
		case 33: 
		case 34: 
		case 38: 
		case 40: 
		case 37: 
		case 39: 
		case 32: 
		case 36: 
		case 35: 
			evt.stop();
			return false;
		}
		return true;
	}

	function _updHeaderCM(box) { 
		if (--box._nUpdHeaderCM <= 0 && box.desktop && box._headercm && box._multiple) {
			var zcls = zk.Widget.$(box._headercm).getZclass() + '-img-seld',
				$headercm = jq(box._headercm);
			$headercm[box._isAllSelected() ? "addClass": "removeClass"](zcls);
		}
	}
	function _isButton(evt) {
		return evt.target.$button 
			|| (zk.isLoaded('zul.wgt')
			&& evt.target.$instanceof(zul.wgt.Button, zul.wgt.Toolbarbutton));
	}
	function _isInputWidget(evt) { 
		return evt.target.$inputWidget 
			|| (zk.isLoaded('zul.inp') && evt.target.$instanceof(zul.inp.InputWidget));
	}
	function _focusable(evt) {
		return (jq.nodeName(evt.domTarget, "input", "textarea", "button", "select", "option", "a")
				&& !evt.target.$instanceof(zul.sel.SelectWidget))
			|| _isButton(evt) || _isInputWidget(evt);
	}
	function _fixReplace(w) {
		return w && (w = w.uuid) ? zk.Widget.$(w): null;
	}

var SelectWidget =

zul.sel.SelectWidget = zk.$extends(zul.mesh.MeshWidget, {
	_rows: 0,
	
	rightSelect: true,
	$init: function () {
		this.$supers('$init', arguments);
		this._selItems = [];
	},
	$define: {
		
		
		rows: function (rows) {
			var n = this.$n();
			if (n) {
				n._lastsz = null;
				this.onSize();
			}
		},
		
		
		checkmark: function (checkmark) {
			if (this.desktop)
				this.rerender();
		},
		
		
		multiple: function (multiple) {
			if (!this._multiple && this._selItems.length) {
				var item = this.getSelectedItem();
				for (var it; (it = this._selItems.pop());)
					if (it != item) {
						if (!this._checkmark)
							it._setSelectedDirectly(false);
						else it._selected = false;
					}

				this._selItems.push(item);
			}
			if (this._checkmark && this.desktop)
				this.rerender();
		},
		
		
		selectedIndex: [
			function (v) {
				return v < -1 || (!v && v !== 0) ? -1 : v;
			},
			function() {
				var selected = this._selectedIndex;
				this.clearSelection();
				this._selectedIndex = selected;
				if (selected > -1) {
					var w;
					for (var it = this.getBodyWidgetIterator(); selected-- >=0;)
						w = it.next();
					if (w) {
						this._selectOne(w, true);
						zk(w).scrollIntoView(this.ebody);
						if (zk.ff >= 4 && this.ebody) { 
							
							this._currentTop = this.ebody.scrollTop; 
							this._currentLeft = this.ebody.scrollLeft;
						}
					}
				}
			}
		],
		
		
		name: function () {
			if (this.destkop) this.updateFormData();
		}
	},
	setChgSel: function (val) { 
		var sels = {};
		for (var j = 0;;) {
			var k = val.indexOf(',', j),
				s = (k >= 0 ? val.substring(j, k): val.substring(j)).trim();
			if (s) sels[s] = true;
			if (k < 0) break;
			j = k + 1;
		}
		for (var it = this.getBodyWidgetIterator(), w; (w = it.next());)
			this._changeSelect(w, sels[w.uuid] == true);
	},
	updateFormData: function () {
		if (this._name) {
			if (!this.efield)
				this.efield = jq(this.$n()).append('<div style="display:none;"></div>').find('> div:last-child')[0];

			jq(this.efield).children().remove();

			
			var data = [],
				tmp = '<input type="hidden" name="' + this._name + '" value="';
			for (var i = 0, j = this._selItems.length; i < j; i++)
				data.push(tmp, this._selItems[i].getValue(), '"/>');

			jq(this.efield).append(data.join(''));
		} else if (this.efield) {
			jq(this.efield).remove();
			this.efield = null;
		}
	},
	
	setSelectedItem: function (item) {
		if (!item)
			this.clearSelection();
		else if (item = zk.Widget.$(item)) {
			this._selectOne(item, true);
			zk(item).scrollIntoView(this.ebody);
			if (zk.ff >= 4 && this.ebody) { 
				
				this._currentTop = this.ebody.scrollTop; 
				this._currentLeft = this.ebody.scrollLeft;
			}
		}
	},
	
	getSelectedItem: function () {
		return this._selItems[0];
	},
	
	getSelectedItems: function () {
		
		return this._selItems.$clone();
	},
	setHeight: function (height) {
		if (!this._nvflex && this._height != height) {
			this._height = height;
			var n = this.$n();
			if (n) {
				n.style.height = height || '';
				this.onSize();
			}
		}
	},
	setVflex: function(v) {
		this.$supers('setVflex', arguments);
		if (this.desktop) this.onSize();
	},
	setHflex: function(v) {
		this.$supers('setHflex', arguments);
		if (this.desktop) this.onSize();
	},
	_getEbodyWd: function () {
		var anchor = this.$n('a');
		
		if (zk.safari)
			anchor.style.display = 'none';

		
		var tblwd = zk.opera && this.ebody.offsetHeight == 0 ? 
				this.ebody.offsetWidth : this.ebody.clientWidth;

		if (zk.safari)
			anchor.style.display = '';
		return tblwd;
	},
	_beforeCalcSize: function () {
		
		if (zk.ie8) {
			var anchor = this.$n('a');
			this._oldCSS = anchor.style.display;
			anchor.style.display = "none";
		}

		
		if (zk.ie)
			this._syncFocus(this._focusItem);

		this._calcHgh();
	},
	_afterCalcSize: function () {
		
		if (zk.ie8) {
			this.$n('a').style.display = this._oldCSS;
			delete this._oldCSS;
		}
		this.$supers('_afterCalcSize', arguments);
	},
	_calcHgh: function () {
		var rows = this.ebodyrows,
			n = this.$n(),
			hgh = n.style.height,
			isHgh = hgh && hgh != "auto" && hgh.indexOf('%') < 0;
		if (isHgh) {
			hgh = zk.parseInt(hgh);
			if (hgh) {
				hgh -= this._headHgh(0);
				if (hgh < 20) hgh = 20;
				var sz = 0;
				l_out:
				for (var h, j = 0, rl = rows.length; j < rl; ++sz, ++j) {
					
					var r;
					for (;; ++j) {
						if (j >= rl) break l_out;
						r = rows[j];
						if (zk(r).isVisible()) break;
					}

					var $r = zk(r);
					h = $r.offsetTop() + $r.offsetHeight();
					if (h >= hgh) {
						if (h > hgh + 2) ++sz; 
						break;
					}
				}
				sz = Math.ceil(sz && h ? (hgh * sz)/h: hgh/this._headHgh(20));

				this._visibleRows(sz);

                hgh -= (this.efoot ? this.efoot.offsetHeight : 0);
                
                hgh -= (this.efrozen ? this.efrozen.offsetHeight : 0);
                this.ebody.style.height = (hgh < 0 ? 0 : hgh) + "px";

				
				if (zk.ie && this.ebody.offsetHeight) {} 
				
				
				return; 
			}
		}

		var nVisiRows = 0, nRows = this.getRows(), lastVisiRow, firstVisiRow, midVisiRow;
		for (var j = 0, rl = rows.length; j < rl; ++j) { 
			var r = rows[j];
			if (zk(r).isVisible()) {
				++nVisiRows;
				if (!firstVisiRow) firstVisiRow = r;

				if (nRows === nVisiRows) {
					midVisiRow = r;
					break;
					
					
				}
				lastVisiRow = r;
			}
		}

		hgh = 0;
		var diff = 2;
		if (!nRows) {
			if (this.isVflex()) {
				hgh = this._vflexSize(n.style.height);

				if (zk.ie && this._cachehgh != hgh) {
					hgh -= 1; 
					this._cachehgh = hgh;
				}
				if (hgh < 25) hgh = 25;

				var rowhgh = firstVisiRow ? zk(firstVisiRow).offsetHeight(): null;
				if (!rowhgh) rowhgh = this._headHgh(20);

				nRows = Math.round((hgh - diff)/ rowhgh);
			}
			this._visibleRows(nRows);
		}

		if (nRows) {
			if (!hgh) {
				if (!nVisiRows) hgh = this._headHgh(20) * nRows;
				else {
					
					
					var tpad = this.$n('tpad'),
						tpadoffsethgh = (tpad ? tpad.offsetHeight : 0),
						tpadhgh = tpadoffsethgh > 0 && this._padsz && this._padsz['tpad'] ? this._padsz['tpad'] : tpadoffsethgh < 0 ? 0 : tpadoffsethgh;
					if (nRows <= nVisiRows) {
						var $midVisiRow = zk(midVisiRow);
						hgh = $midVisiRow.offsetTop() + $midVisiRow.offsetHeight() - tpadhgh;
					} else {
						var $lastVisiRow = zk(lastVisiRow);
						hgh = $lastVisiRow.offsetTop() + $lastVisiRow.offsetHeight() - tpadhgh;
						hgh = Math.ceil((nRows * hgh) / nVisiRows);
					}
				}
				if (zk.ie) hgh += diff; 
			}

			
			if (zk.opera) {
				this.ebody.style.height = ''; 
				if (this.ebody.offsetHeight) {} 
			}
			
			this.ebody.style.height = hgh + "px";
			
			
			
			if (zk.safari)
				zk(this.ebody).redoCSS();	
			
			
			if (zk.ie && this.ebody.offsetHeight) {} 
			
			
			

			
			var h = n.style.height;
			if (!h || h == "auto") {

				
				
				if (zk.ie && !zk.ie8 && this.ebodytbl) {
					var ow = this.ebody.offsetWidth,
						cw = this.ebody.clientWidth,
						w = ow - cw;
					if (cw && w > 11) { 
						if (ow == this.ebodytbl.offsetWidth)
							this.ebodytbl.style.width = jq.px0(zk(this.ebodytbl).revisedWidth(this.ebodytbl.offsetWidth - w));
					}
				}


			}
		} else {
			
			
			hgh = n.style.height;
			if (zk.ie && (!hgh || hgh == "auto") && zk(this.ebody).hasVScroll()) {
				if (!nVisiRows) this.ebody.style.height = ""; 
				else this.ebody.style.height =
						(this.ebody.offsetHeight * 2 - this.ebody.clientHeight) + "px";
			} else {
				this.ebody.style.height = "";
			}

			
			
		}
	},
	
	_visibleRows: function (v) {
		if ("number" == typeof v) {
			this._visiRows = v;
		} else
			return this.getRows() || this._visiRows || 0;
	},
	
	_headHgh: function (defVal) {
		var hgh = this.ehead ? this.ehead.offsetHeight : 0;
		if (this.paging) {
			var pgit = this.$n('pgit'),
				pgib = this.$n('pgib');
			if (pgit) hgh += pgit.offsetHeight;
			if (pgib) hgh += pgib.offsetHeight;
		}
		return hgh ? hgh: defVal;
	},
	
	indexOfItem: function (item) {
		if (item.getMeshWidget() == this) {
			for (var i = 0, it = this.getBodyWidgetIterator(), w; (w = it.next()); i++)
				if (w == item) return i;
		}
		return -1;
	},
	toggleItemSelection: function (item) {
		if (item.isSelected()) this._removeItemFromSelection(item);
		else this._addItemToSelection(item);
		this.updateFormData();
	},
	
	selectItem: function (item) {
		if (!item)
			this.setSelectedIndex(-1);
		else if (this._multiple || !item.isSelected())
			this.setSelectedIndex(this.indexOfItem(item));
	},
	_addItemToSelection: function (item) {
		if (!item.isSelected()) {
			if (!this._multiple) {
				this._selectedIndex = this.indexOfItem(item);
			} else {
				var index = this.indexOfItem(item);
				if (index < this._selectedIndex || this._selectedIndex < 0) {
					this._selectedIndex = index;
				}
				item._setSelectedDirectly(true);
			}
			this._selItems.push(item);
		}
	},
	_removeItemFromSelection: function (item) {
		if (item.isSelected()) {
			if (!this._multiple) {
				this.clearSelection();
			} else {
				item._setSelectedDirectly(false);
				this._selItems.$remove(item);
			}
		}
	},
	
	clearSelection: function () {
		if (this._selItems.length) {
			for(var item;(item = this._selItems.pop());)
				item._setSelectedDirectly(false);
			this._selectedIndex = -1;
			this._updHeaderCM();
		}
	},
	
	focus_: function (timeout) {
		var btn;
		if (btn = this.$n('a')) {
			if (this._focusItem) {
				for (var it = this.getBodyWidgetIterator(), w; (w = it.next());) 
					if (this._isFocus(w)) {
						w.focus_(timeout);
						break;
					}
			} else {
				
				if (this._currentTop)
					btn.style.top = this._currentTop + "px";
				if (this._currentLeft)
					btn.style.left = this._currentLeft + "px"; 	
			}
			this.focusA_(btn, timeout);
			return true;
		}
		return false;
	},
	focusA_: function(btn, timeout) { 
		zk(btn).focus(timeout);
	},
	bind_: function () {
		this.$supers(SelectWidget, 'bind_', arguments);
		var btn = this.$n('a');
		if (btn)
			this.domListen_(btn, 'onFocus', 'doFocus_')
				.domListen_(btn, 'onKeyDown')
				.domListen_(btn, 'onBlur', 'doBlur_');
		this.updateFormData();
		this._updHeaderCM();
	},
	unbind_: function () {
		var btn = this.$n('a');
		if (btn)
			this.domUnlisten_(btn, 'onFocus', 'doFocus_')
				.domUnlisten_(btn, 'onKeyDown')
				.domUnlisten_(btn, 'onBlur', 'doBlur_');
		this.$supers(SelectWidget, 'unbind_', arguments);
	},
	clearCache: function () {
		this.$supers('clearCache', arguments);
		this.efield = null;
	},
	doFocus_: function (evt) {
		var row	= this._focusItem || this._lastSelectedItem;
		if (row) row._doFocusIn();
		this.$supers('doFocus_', arguments);
	},
	doBlur_: function (evt) {
		if (this._focusItem) {
			this._lastSelectedItem = this._focusItem;
			this._focusItem._doFocusOut();
		}
		this._focusItem = null;
		this.$supers('doBlur_', arguments);
	},
	
	shallIgnoreSelect_: function (evt) { 
		
		return evt.name == 'onRightClick' ? this.rightSelect ? -1: true: false;
	},
	
	_shallIgnore: function(evt, bSel) { 
		if (!evt.domTarget || !evt.target.canActivate())
			return true;

		if (bSel) {
			try {
				var el = evt.domTarget;
				if (el) 
					for (;;) {
						if (el.id == this.uuid) 
							break;
						if (!(el = el.parentNode))
							return true; 
					}
			} catch (e) {
			}

			if (typeof (bSel = this.nonselectableTags) == "string") {
				if (!bSel)
					return; 
				if (bSel == "*")
					return true;

				var tn = jq.nodeName(evt.domTarget),
					bInpBtn = tn == "input" && evt.domTarget.type.toLowerCase() == "button";
				if (bSel.indexOf(tn) < 0) {
					return bSel.indexOf("button") >= 0
						&& (_isButton(evt) || bInpBtn);
				}
				return !bInpBtn || bSel.indexOf("button") >= 0;
			}
		}

		return _focusable(evt);
	},
	_doItemSelect: function (row, evt) { 
		
		
		
		
		var alwaysSelect,
			cmClicked = this._checkmark && evt.domTarget == row.$n('cm');
		if (zk.dragging || (!cmClicked && (this._shallIgnore(evt, true)
		|| ((alwaysSelect = this.shallIgnoreSelect_(evt, row))
			&& !(alwaysSelect = alwaysSelect < 0)))))
			return;

		var skipFocus = _focusable(evt); 
		if (this._checkmark
		&& !evt.data.shiftKey && !(evt.data.ctrlKey || evt.data.metaKey) 
		&& (!this._cdo || cmClicked)) {
			
			this._syncFocus(row);

			if (this._multiple) {
				var seled = row.isSelected();
				if (!seled || !alwaysSelect)
					this._toggleSelect(row, !seled, evt, skipFocus);
			} else
				this._select(row, evt, skipFocus);
		} else {
		
		
		
			if ((zk.gecko || zk.safari) && row.isListen('onDoubleClick')) {
				var now = jq.now(), last = row._last;
				row._last = now;
				if (last && now - last < 900)
					return; 
			}
			this._syncFocus(row);
			if (this._multiple) {
				if (evt.data.shiftKey)
					this._selectUpto(row, evt, skipFocus);
				else if (evt.data.ctrlKey || evt.data.metaKey)
					this._toggleSelect(row, !row.isSelected(), evt, skipFocus);
				else if (!alwaysSelect || !row.isSelected())
					this._select(row, evt, skipFocus);
			} else
				this._select(row, evt, skipFocus);

			
			if (!skipFocus)
				row.focus();
			
			
			
		}
	},
	
	doKeyDown_: function (evt) {
		if (!this._shallIgnore(evt)) {

		
		
		
		
			switch (evt.data.keyCode) {
			case 33: 
			case 34: 
			case 38: 
			case 40: 
			case 37: 
			case 39: 
			case 32: 
			case 36: 
			case 35: 
				if (!jq.nodeName(evt.domTarget, "a"))
					this.focus();
				if (evt.domTarget == this.$n('a')) {
					if (evt.target == this) 
						evt.target = this._focusItem || this.getSelectedItem() || this;
					this._doKeyDown(evt);
				}
				evt.stop();
				return false;
			}
		}

		if (!zk.gecko3 || !jq.nodeName(evt.domTarget, "input", "textarea"))
			zk(this.$n()).disableSelection();

		
		if (evt.target == this) 
			evt.target = this._focusItem || this.getSelectedItem() || this;
		this.$supers('doKeyDown_', arguments);
	},
	doKeyUp_: function (evt) {
		zk(this.$n()).enableSelection();
		evt.stop({propagation: true});
		this.$supers('doKeyUp_', arguments);
	},
	_doKeyDown: function (evt) { 
		if (_beforeChildKey(this, evt))
			return true;

		var row = this._focusItem || this.getSelectedItem(),
			data = evt.data,
			shift = data.shiftKey, ctrl = (data.ctrlKey || data.metaKey);
		if (shift && !this._multiple)
			shift = false; 

		var endless = false, step, lastrow;

		
		if (zk.safari && typeof data.keyCode == "string")
			data.keyCode = zk.parseInt(data.keyCode);
		switch (data.keyCode) {
		case 33: 
		case 34: 
			step = this._visibleRows();
			if (step == 0) step = 20;
			if (data.keyCode == 33)
				step = -step;
			break;
		case 38: 
		case 40: 
			step = data.keyCode == 40 ? 1: -1;
			break;
		case 32: 
			if (this._multiple) this._toggleSelect(row, !row.isSelected(), evt);
			else this._select(row, evt);
			break;
		case 36: 
		case 35: 
			step = data.keyCode == 35 ? 1: -1;
			endless = true;
			break;
		case 37: 
			this._doLeft(row);
			break;
		case 39: 
			this._doRight(row);
			break;
		}

		if (step) {
			if (shift) this._toggleSelect(row, true, evt);
			var nrow = row.$n();
			for (;nrow && (nrow = step > 0 ? nrow.nextSibling: nrow.previousSibling);) {
				var r = zk.Widget.$(nrow);
				if (r.$instanceof(zul.sel.Treerow))
					r = r.parent;
				if (!r.isDisabled()) {
					if (shift) this._toggleSelect(r, true, evt);

					if (zk(nrow).isVisible()) {
						if (!shift) lastrow = r;
						if (!endless) {
							if (step > 0) --step;
							else ++step;
							if (step == 0) break;
						}
					}
				}
			}
		}
		if (lastrow) {
			if (ctrl) this._focus(lastrow);
			else this._select(lastrow, evt);
			this._syncFocus(lastrow);
			zk(lastrow).scrollIntoView(this.ebody); 
		}

		return _afterChildKey(evt);
	},
	_doKeyUp: function (evt) { 
		return _beforeChildKey(this, evt) || _afterChildKey(evt);
	},
	_doLeft: zk.$void,
	_doRight: zk.$void,
	
	_syncFocus: function (row) {
		var focusEl = this.$n('a'),
			offs, n;
		if (row && (n = row.$n())) {
			offs = zk(n).revisedOffset();
			offs = this._toStyleOffset(focusEl, offs[0] + this.ebody.scrollLeft, offs[1]);
		} else
			offs = [0, 0];
		focusEl.style.top = offs[1] + "px";
		focusEl.style.left = offs[0] + "px";
	},
	_toStyleOffset: function (el, x, y) {
		var ofs1 = zk(el).revisedOffset(),
			x2 = zk.parseInt(el.style.left), y2 = zk.parseInt(el.style.top);;
		return [x - ofs1[0] + x2, y  - ofs1[1] + y2];
	},
	
	_select: function (row, evt, skipFocus) {
		if (this._selectOne(row, skipFocus)) {
			
			this.fireOnSelect(row, evt);
		}
	},
	
	_selectUpto: function (row, evt, skipFocus) {
		if (row.isSelected()) {
			if (!skipFocus)
				this._focus(row);
			return; 
		}

		var focusfound = false, rowfound = false,
			lastSelected = this._lastSelectedItem || this._focusItem;
		for (var it = this.getBodyWidgetIterator(), si = this.getSelectedItem(), w; (w = it.next());) {
			if (w.isDisabled()) continue; 
			if (focusfound) {
				this._changeSelect(w, true);
				if (w == row)
					break;
			} else if (rowfound) {
				this._changeSelect(w, true);
				if (this._isFocus(w) || w == lastSelected)
					break;
			} else if (!si) { 
				if (w != row)
					continue;
				this._changeSelect(w, true);
				break;
			} else {
				rowfound = w == row;
				focusfound = this._isFocus(w) || w == lastSelected;
				if (rowfound || focusfound) {
					this._changeSelect(w, true);
					if (rowfound && focusfound)
						break;
				}
			}
		}

		if (!skipFocus)
			this._focus(row);
		this.fireOnSelect(row, evt);
	},
	
	setSelectAll: _zkf = function (notify, evt) {
		for (var it = this.getBodyWidgetIterator(), w; (w = it.next());)
			if (!w.isDisabled())
				this._changeSelect(w, true);
		if (notify && evt !== true)
			this.fireOnSelect(this.getSelectedItem(), evt);
	},
	
	selectAll: _zkf,
	
	_selectOne: function (row, skipFocus) {
		var selItem = this.getSelectedItem();
		if (this._multiple) {
			if (row && !skipFocus) this._unsetFocusExcept(row);
			var changed = this._unsetSelectAllExcept(row);
			if (!changed && row && selItem == row) {
				if (!skipFocus) this._setFocus(row, true);
				return false; 
			}
		} else {
			if (selItem) {
				if (selItem == row) {
					if (!skipFocus) this._setFocus(row, true);
					return false; 
				}
				this._changeSelect(selItem, false);
				if (row)
					if(!skipFocus) this._setFocus(selItem, false);
			}
			if (row && !skipFocus) this._unsetFocusExcept(row);
		}
		
		if (row) {
			this._changeSelect(row, true);
			if (!skipFocus) this._setFocus(row, true);
		}
		return true;
	},
	
	_toggleSelect: function (row, toSel, evt, skipFocus) {
		if (!this._multiple) {
			var old = this.getSelectedItem();
			if (row != old && toSel)
				this._changeSelect(row, false);
		}

		this._changeSelect(row, toSel);
		if (!skipFocus)
			this._focus(row);

		
		this.fireOnSelect(row, evt);
	},
	
	fireOnSelect: function (ref, evt) {
		var data = [];

		for (var it = this.getSelectedItems(), j = it.length; j--;)
			if (it[j].isSelected())
				data.push(it[j]);

		var edata, keep = true;
		if (evt) {
			edata = evt.data;
			if (this._multiple) 
				keep = (edata.ctrlKey || edata.metaKey) || edata.shiftKey || 
					(this._checkmark && (!this._cdo || (evt.domTarget.id && evt.domTarget.id.endsWith('-cm'))));
		}

		this.fire('onSelect', zk.copy({items: data, reference: ref, clearFirst: !keep}, edata));
	},
	
	_focus: function (row) {
		if (this.canActivate({checkOnly:true})) {
			this._unsetFocusExcept(row);
			this._setFocus(row, true);
		}
	},
	
	_changeSelect: function (row, toSel) {
		var changed = row.isSelected() != toSel;
		if (changed) {
			row.setSelected(toSel);
			row._toggleEffect(true);
		}
		return changed;
	},
	_isFocus: function (row) {
		return this._focusItem == row;
	},
	
	_setFocus: function (row, bFocus) {
		var changed = this._isFocus(row) != bFocus;
		if (changed) {
			if (bFocus) {
				if (!row.focus())
					this.focus();

				if (!this.paging && zk.gecko)
					this.fireOnRender(5);
					
			}
		}
		if (!bFocus)
			row._doFocusOut();
		return changed;
	},
	
	_unsetSelectAllExcept: function (row) {
		var changed = false;
		for (var it = this.getSelectedItems(), j = it.length; j--;) {
			if (it[j] != row && this._changeSelect(it[j], false))
				changed = true;
		}
		return changed;
	},
	
	_unsetFocusExcept: function (row) {
		if (this._focusItem && this._focusItem != row)
			this._setFocus(this._focusItem, false)
		else
			this._focusItem = null;
	},
	_updHeaderCM: function () { 
		if (this._headercm && this._multiple) {
			var box = this, v;
			this._nUpdHeaderCM = (v = this._nUpdHeaderCM) > 0 ? v + 1: 1;
			setTimeout(function () {_updHeaderCM(box);}, 100); 
		}
	},
	_syncBodyHeight: function () {
		if(this._rows == 0)
			this.$supers('_syncBodyHeight', arguments);
	},
	_isAllSelected: function () {
		for (var it = this.getBodyWidgetIterator({skipHidden:true}), w; (w = it.next());)
			if (!w.isDisabled() && !w.isSelected())
				return false;
		return true;
	},
	_ignoreHghExt: function () {
		return this._rows > 0;
	},
	
	onChildAdded_: function (child) {
		this.$supers('onChildAdded_', arguments);
		if (this.desktop && child.$instanceof(zul.sel.ItemWidget) && child.isSelected())
			this._syncFocus(child);
	},
	
	onChildRemoved_: function (child) {
		this.$supers('onChildRemoved_', arguments);
		var selItems = this._selItems, len;
		if (this.desktop && child.$instanceof(zul.sel.ItemWidget) && (len = selItems.length))
			this._syncFocus(selItems[len - 1]);
	},
	
	replaceWidget: function (newwgt) {
		this.$supers('replaceWidget', arguments);

		newwgt._lastSelectedItem = _fixReplace(this._lastSelectedItem);
		newwgt._focusItem = _fixReplace(this._focusItem);
	}
});

})();
