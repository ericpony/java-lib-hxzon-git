

zul.wgt.Radio = zk.$extends(zul.wgt.Checkbox, {
	
	getRadiogroup: function (parent) {
		if (!parent && this._group)
			return this._group;
		var wgt = parent || this.parent;
		for (; wgt; wgt = wgt.parent)
			if (wgt.$instanceof(zul.wgt.Radiogroup)) return wgt;
		return null;
	},
	
	setRadiogroup: function (group) {
		var old;
		if ((old = this._group) != group) {
			if (old) old._rmExtern(this);
			this._group = group;
			if (group) group._addExtern(this);
			this._fixName();
		}
	},

	
	setChecked: _zkf = function (checked) {
		if (checked != this._checked) {
			this._checked = checked;
			var n = this.$n('real');
			if (n) {
				n.checked = checked || false;

				var group = this.getRadiogroup();
				if (group) {
					
					if (checked) {
						for (var items = group.getItems(), i = items.length; i--;) {
							if (items[i] != this) {
								items[i].$n('real').checked = false;
								items[i]._checked = false;
							}
						}
					}
					group._fixSelectedIndex();
				}
			}
		}
		return this;
	},
	
	setSelected: _zkf,
	
	isSelected: zul.wgt.Checkbox.prototype.isChecked,
	
	getName: function () {
		var group = this.getRadiogroup();
		return group != null ? group.getName(): this.uuid;
	},
	_fixName: function () {
		var n = this.$n("real");
		if (n)
			n.name = this.getName();
	},
	getZclass: function () {
		var zcls = this._zclass;
		return zcls != null ? zcls: "z-radio";
	},
	beforeParentChanged_: function (newParent) {
		var oldParent = this.getRadiogroup(),
			newParent = newParent ? this.getRadiogroup(newParent) : null;
		if (oldParent != newParent) {
			if (oldParent && oldParent.$instanceof(zul.wgt.Radiogroup))
				oldParent._fixOnRemove(this); 
			if (newParent && newParent.$instanceof(zul.wgt.Radiogroup))
				newParent._fixOnAdd(this); 
		}
		this.$supers("beforeParentChanged_", arguments);
	},
	fireOnCheck_: function (checked) {
		
		var group = this.getRadiogroup();
		this.fire('onCheck', checked, {toServer: group && group.isListen('onCheck')} );
	}
});
