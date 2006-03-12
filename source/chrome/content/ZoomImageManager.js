
function ZoomImageManager(objBrowser) {
	this.parentNode = objBrowser;
	this.bundle = document.getElementById("bundle_ImageZoom");
	if (nsIPrefBranchObj.getCharPref("defaultGlobalZoom") == "text"){
		this.scale2Text = true;
		this.currentZoom = ZoomManager.prototype.getInstance().textZoom;
	} else {
		this.scale2Text = false;
		this.currentZoom = parseInt(nsIPrefBranchObj.getCharPref("defaultGlobalZoom"));
	}

}

ZoomImageManager.prototype = {

	getInstance : function() {
		try {
			var selectedBrowser = window.getMessageBrowser();
		} catch(e) {
			var selectedBrowser = gBrowser.selectedBrowser;
		}

		if (!selectedBrowser.ZoomImageManager)
			selectedBrowser.ZoomImageManager = new ZoomImageManager(selectedBrowser);

		if (selectedBrowser.ZoomImageManager.scale2Text){
			selectedBrowser.ZoomImageManager.currentZoom = ZoomManager.prototype.getInstance().textZoom;
		}

		return selectedBrowser.ZoomImageManager;
	},

	MIN : 1,
	MAX : 2000,

	bundle : null,

	zoomFactorsString : "", // cache
	zoomFactors : null,

	factorOther : 300,
	factorAnchor : 300,
	steps : 0,

	get textScale() {
		return this.scale2Text;
	},

	set textScale(blnValue) {
		this.scale2Text = blnValue;
		if (this.scale2Text){
			this.currentZoom = ZoomManager.prototype.getInstance().textZoom;
			this.scaleFrames(this.currentZoom, this.parentNode.contentDocument);
		}
	},

	get imageZoom() {
	    var currentZoom;
	    try {
	      currentZoom = this.currentZoom;
	      if (this.indexOf(currentZoom) == -1) {
	        if (currentZoom != this.factorOther) {
	          this.factorOther = currentZoom;
	          this.factorAnchor = this.factorOther;
	        }
	      }
	    } catch (e) {
	      currentZoom = 100;
	    }

		return currentZoom;
	},

	set imageZoom(aZoom) {
		this.scale2Text = false;
		this.currentZoom = aZoom;
		this.scaleFrames(this.currentZoom, this.parentNode.contentDocument);
	},

	pageLoad : function() {
		if (!this.scaling){
			this.scaling = true;
			try {
				this.scaleFrames(this.currentZoom, this.parentNode.contentDocument);
			} catch(e) {

			}
			this.scaling = false;
		}
	},

	increase : function() {
		this.jump(1);
	},

	decrease : function() {
		this.jump(-1);
	},

	reset : function() {
		this.imageZoom = 100;
	},

	getZoomFactors : function() {
		this.ensureZoomFactors();

		return this.zoomFactors;
	},

	indexOf : function(aZoom) {
		this.ensureZoomFactors();

		var index = -1;
		if (this.isZoomInRange(aZoom)) {
			index = this.zoomFactors.length - 1;
			while (index >= 0 && this.zoomFactors[index] != aZoom)
				--index;
		}

		return index;
	},

	/***** internal helper functions below here *****/

	ensureZoomFactors : function() {
		var zoomFactorsString = this.bundle.getString("values");
		if (this.zoomFactorsString != zoomFactorsString) {
			this.zoomFactorsString = zoomFactorsString;
			this.zoomFactors = zoomFactorsString.split(",");
			for (var i = 0; i<this.zoomFactors.length; ++i)
				this.zoomFactors[i] = parseInt(this.zoomFactors[i]);
		}
	},

	isLevelInRange : function(aLevel) {
		return (aLevel >= 0 && aLevel < this.zoomFactors.length);
	},

	isZoomInRange : function(aZoom) {
		return (aZoom >= this.zoomFactors[0] && aZoom <= this.zoomFactors[this.zoomFactors.length - 1]);
	},

	jump : function(aDirection) {
		if (aDirection != -1 && aDirection != 1)
			throw Components.results.NS_ERROR_INVALID_ARG;

		this.ensureZoomFactors();
		var currentZoom = this.imageZoom;
		var insertIndex = -1;
		var stepFactor = parseFloat(this.bundle.getString("stepFactor"));

		// temporarily add factorOther to list
		if (this.isZoomInRange(this.factorOther)) {
			insertIndex = 0;
			while (this.zoomFactors[insertIndex] < this.factorOther)
				++insertIndex;

			if (this.zoomFactors[insertIndex] != this.factorOther)
				this.zoomFactors.splice(insertIndex, 0, this.factorOther);
		}

		var factor;
		var done = false;

		if (this.isZoomInRange(currentZoom)) {
			var index = this.indexOf(currentZoom);
			if (aDirection == -1 && index == 0 ||
				aDirection ==  1 && index == this.zoomFactors.length - 1) {
				this.steps = 0;
				this.factorAnchor = this.zoomFactors[index];
			} else {
				factor = this.zoomFactors[index + aDirection];
				done = true;
			}
		}

		if (!done) {
			this.steps += aDirection;
			factor = this.factorAnchor * Math.pow(stepFactor, this.steps);
			if (factor < this.MIN || factor > this.MAX) {
				this.steps -= aDirection;
				factor = this.factorAnchor * Math.pow(stepFactor, this.steps);
			}
			factor = Math.round(factor);
			if (this.isZoomInRange(factor))
				factor = this.snap(factor);
			else
				this.factorOther = factor;
		}

		if (insertIndex != -1)
			this.zoomFactors.splice(insertIndex, 1);

		this.imageZoom = factor;
	},

	snap : function(aZoom) {
		if (this.isZoomInRange(aZoom)) {
			var level = 0;
			while (this.zoomFactors[level + 1] < aZoom)
				++level;

			// if aZoom closer to [level + 1] than [level], snap to [level + 1]
			if ((this.zoomFactors[level + 1] - aZoom) < (aZoom - this.zoomFactors[level]))
				++level;

			aZoom = this.zoomFactors[level];
		}

		return aZoom;
	},

	scaleFrames : function(currentZoom, doc){

		var itemFrames = doc.getElementsByTagName("frame");
		var itemiFrames = doc.getElementsByTagName("iframe");
		var frame, iframe;

		if (itemFrames.length > 0)
			for (var f = 0 ; f < itemFrames.length ; f++) {
				frame = itemFrames[f].contentDocument;
				this.scaleFrames(currentZoom, frame); // recursion for frames
			}

		if (itemiFrames.length > 0)
			for (var g = 0 ; g < itemiFrames.length ; g++) {
				iframe = itemiFrames[g].contentDocument;
				this.scaleFrames(currentZoom, iframe); // recursion for iframes
			}

		for (var i=0; i<doc.images.length; i++) {
			var oizImage = new izImage(doc.images[i]);
			if (oizImage.pageFactor() != currentZoom)
				oizImage.setZoomPage(currentZoom);
		}
	}
}

/***** init and helper functions for viewZoomOverlay.xul *****/
window.addEventListener("load", registerImageZoomManager, false);

function registerImageZoomManager()
{
	var imageZoomMenu = document.getElementById("menu_ImageZoomMain");
	var zoom = ZoomImageManager.prototype.getInstance();

	var parentMenu = imageZoomMenu.parentNode;
	parentMenu.addEventListener("popupshowing", updateImageZoomViewMenu, false);

	//document.getElementById("menu_imageZoomPopup").addEventListener("popupshowing", updateImageZoomMenu, false) ;

	var insertBefore = document.getElementById("menu_imageZoomInsertBefore");
	var popup = insertBefore.parentNode;
	var accessKeys = zoom.bundle.getString("accessKeys").split(",");
	var zoomFactors = zoom.getZoomFactors();

	for (var i = 0; i < zoomFactors.length; ++i) {
		if (!document.getElementById("imageZoom_" + zoomFactors[i])) {
			var menuItem = document.createElement("menuitem");
			menuItem.setAttribute("type", "radio");
			menuItem.setAttribute("name", "imageZoom");
			menuItem.setAttribute("id", "imageZoom_" + zoomFactors[i]);

			var label;
			if (zoomFactors[i] == 100) {
				label = zoom.bundle.getString("labelOriginal");
				menuItem.setAttribute("key", "key_imageZoomReset");
			}
			else
				label = zoom.bundle.getString("label");

			menuItem.setAttribute("label", label.replace(/%zoom%/, zoomFactors[i]));
			menuItem.setAttribute("accesskey", accessKeys[i]);
			menuItem.setAttribute("oncommand", "ZoomImageManager.prototype.getInstance().imageZoom = this.value;");
			menuItem.setAttribute("value", zoomFactors[i]);
			popup.insertBefore(menuItem, insertBefore);
		}
	}
}

function updateImageZoomViewMenu()
{
	var zoom = ZoomImageManager.prototype.getInstance();

	var imageZoomMenu = document.getElementById("menu_ImageZoomMain");
	imageZoomMenu.hidden = !nsIPrefBranchObj.getBoolPref("showViewMenu");
	var menuLabel = zoom.bundle.getString("menuLabel").replace(/%zoom%/, zoom.imageZoom);
	imageZoomMenu.setAttribute("label", menuLabel);
}

function updateImageZoomMenu()
{
	var zoom = ZoomImageManager.prototype.getInstance();

	var currentZoom = zoom.imageZoom;

	var imageZoomOther = document.getElementById("zoommain-custom");
	var label = zoom.bundle.getString("labelOther");
	imageZoomOther.setAttribute("label", label.replace(/%zoom%/, zoom.factorOther));
	imageZoomOther.setAttribute("value", zoom.factorOther);

	var popup = document.getElementById("menu_imageZoomPopup");
	var item = popup.firstChild;
	while (item) {
		if (item.getAttribute("name") == "imageZoom") {
			if (zoom.textScale) {
				if (item.getAttribute("value") == "text")
					item.setAttribute("checked","true");
				else
					item.removeAttribute("checked");
			} else {
				if (item.getAttribute("value") == currentZoom)
					item.setAttribute("checked","true");
				else
					item.removeAttribute("checked");
			}
		}
		item = item.nextSibling;
	}
}



