/* ***** BEGIN LICENSE BLOCK *****

    Copyright (c) 2004  Jason Adams <imagezoom@yellowgorilla.net>

    This file is part of Image Zoom.

    Image Zoom is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    Image Zoom is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Image Zoom; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

 * ***** END LICENSE BLOCK ***** */

// Image Zoom Manager Contructor
function izImage(oImage) {
 	var pImage = oImage;
	var enabled = false;

	if ((pImage.naturalWidth != 0) || (pImage.naturalHeight != 0) ||
		(pImage.style.width != "") || (pImage.style.height != "") ||
		((pImage.getAttribute("width"))&&(pImage.getAttribute("height")))) {

		// If this value is set in the image object, we have zoomed this image before
		if (!(pImage.originalPxWidth) || (!pImage.style.width && !pImage.style.height))
		{
			// Original Width of the image in pixels; Used for calculating zoom factor
			pImage.originalPxWidth = pImage.width;

			if (!pImage.style.width && !pImage.style.height){
				// No style set for image, need to remember original dimensions
				pImage.originalWidth = pImage.width;
				pImage.originalWidthUnit = "px";
				pImage.originalHeight = pImage.height;
				pImage.originalHeightUnit = "px";
				pImage.style.width = pImage.originalWidth + pImage.originalWidthUnit;
				pImage.style.height = pImage.originalHeight + pImage.originalHeightUnit;
			} else {
				if (pImage.style.width) {
					// Remember the original width settings
					pImage.originalWidth = getDimInt(pImage.style.width);
					pImage.originalWidthUnit =  getDimUnit(pImage.style.width);
					pImage.style.width = pImage.originalWidth + pImage.originalWidthUnit;
				}

				if (pImage.style.height) {
					// Remember the original height settings
					pImage.originalHeight = getDimInt(pImage.style.height);
					pImage.originalHeightUnit =  getDimUnit(pImage.style.height);
					pImage.style.height = pImage.originalHeight + pImage.originalHeightUnit;
				}
			}

			pImage.zoomFactor = 100;
			pImage.pageFactor = 100;
			pImage.autoFitBefore = 0;
		}

		enabled = true;
	}

	izImage.prototype.getWidth = getWidth;
	izImage.prototype.getHeight = getHeight;
	izImage.prototype.setZoom = setZoom;
	izImage.prototype.setZoomPage = setZoomPage;
	izImage.prototype.setDimension = setDimension;
	izImage.prototype.zoom = zoom;
	izImage.prototype.fit = fit;
	izImage.prototype.activateAutoFit = activateAutoFit;
	izImage.prototype.disactivateAutoFit = disactivateAutoFit;
	izImage.prototype.zoomFactor = zoomFactor;
	izImage.prototype.pageFactor = pageFactor;
	izImage.prototype.getStyleWidth = getStyleWidth;
	izImage.prototype.getStyleHeight = getStyleHeight;

	// Returns the pixel width of the image
	function getWidth(){
		return pImage.width;
	}
	
	
	function getStyleWidth()
	{
		return pImage.style.width;
	}

	function getStyleHeight()
	{
		return pImage.style.height;
	}

	// Returns the pixel height of the image
	function getHeight(){
		return pImage.height;
	}

	// Zoom to a factor of the original image size
	function setZoom(factor) {
		// factors less than zero are invalid
		if ((factor > 0) && (enabled)) {
			pImage.zoomFactor = factor;
			pImage.autoFitBefore = 0;
			pZoomAbs();
		}
	}

	// Zoom to a factor of the original image size
	function setZoomPage(factor) {
		// factors less than zero are invalid
		if ((factor > 0) && (enabled)) {
			pImage.pageFactor = factor;
			pZoomAbs();
		}
	}

	// Set the dimension of the image
	function setDimension(width, height) {
		if (enabled) {
			pImage.style.width = width + "px";
			pImage.style.height = height + "px";
			pImage.zoomFactor = ((pImage.width/(pImage.pageFactor/100)) / pImage.originalPxWidth)*100;
		}
	}

	function zoom(factor) {
		if (enabled) {

			pImage.zoomFactor = pImage.zoomFactor * factor
			pImage.autoFitBefore = 0;
			// Zoom the width style if it exists
			if (pImage.style.width) {
				var origWidth = getDimInt(pImage.style.width);
				pImage.style.width = (origWidth * factor) + getDimUnit(pImage.style.width);
			}

			// Zoom the height style if it exists
			if (pImage.style.height) {
				var origHeight = getDimInt(pImage.style.height);
				pImage.style.height = (origHeight * factor) + getDimUnit(pImage.style.height);

			}
		}
	}

	function activateAutoFit() 
	{
		pImage.autoFitBefore = this.zoomFactor();
		this.fit();
	}
	
	function disactivateAutoFit() 
	{
		if (pImage.autoFitBefore != 0)
		{
			this.setZoom(pImage.autoFitBefore);
		}
	}
	
	function fit(autoScroll){
		if (enabled) {

			var bScreen = new browserScreen(pImage);

			// First calculate the size of the client area of the browser depending on mode
			var screenHeight = bScreen.getHeight();
			var screenWidth = bScreen.getWidth();

			// work out the screen ratio and the image ratio
			var screenDim = screenWidth/screenHeight;
			var imageDim = pImage.width/pImage.height;

			// How we zoom depends on the ratio of the image to the screen
			if (screenDim < imageDim) {
				setDimension(screenWidth, parseInt(screenWidth/imageDim+0.5));
			} else {
				setDimension(parseInt(screenHeight*imageDim+0.5), screenHeight);
			}

			// In case scrollbars have been introduced, do the image fit again
			var screenHeight = bScreen.getHeight();
			var screenWidth = bScreen.getWidth();

			if (screenDim < imageDim) {
				setDimension(screenWidth, parseInt(screenWidth/imageDim+0.5));
			} else {
				setDimension(parseInt(screenHeight*imageDim+0.5), screenHeight);
			}

			pImage.zoomFactor = ((pImage.width/(pImage.pageFactor/100)) / pImage.originalPxWidth)*100;

			// Scroll the browser screen to put the image in the center if requested
			if (autoScroll){
				var iTop = 0;
				var iLeft = 0;
				var cNode = pImage;

				// Get the distances of the image object from the browser edges
				while(cNode.tagName!='BODY'){
				   iLeft += cNode.offsetLeft;
				   iTop += cNode.offsetTop;
				   cNode = cNode.offsetParent;
				}

				// Now scroll the browser
				if (screenDim < imageDim) {
					pImage.ownerDocument.defaultView.scroll(iLeft-(bScreen.getPad()),iTop-((screenHeight-getDimInt(pImage.style.height))/2)-(bScreen.getPad()));
				} else {
					pImage.ownerDocument.defaultView.scroll(iLeft-((screenWidth-getDimInt(pImage.style.width))/2)-(bScreen.getPad()),iTop-(bScreen.getPad()));
				}
			}
		}
	}

	function zoomFactor() {
		return parseInt(parseInt(pImage.zoomFactor) + 0.5);
	}

	function pageFactor() {
		return pImage.pageFactor;
	}

	function pZoomAbs() {
		// only set the width style if it was originally set
		if (pImage.originalWidth){
			pImage.style.width = (pImage.originalWidth * ((pImage.pageFactor/100)*(pImage.zoomFactor/100))) + pImage.originalWidthUnit;
		} else {
			pImage.style.width = "";
		}

		// only set the height style if it was originally set
		if (pImage.originalHeight){
			pImage.style.height = (pImage.originalHeight * ((pImage.pageFactor/100)*(pImage.zoomFactor/100))) + pImage.originalHeightUnit;
		} else {
			pImage.style.height = "";
		}
	}

	// PRIVATE UTILITY FUNCTIONS

	// Gets the dimension unit from the style property passed as the sText variable
	function getDimUnit(sText){
		var ValidChars = "0123456789.";
		var returnChar = "";
		var Char;

 		for (i = 0; i < sText.length; i++){
			Char = sText.charAt(i);
			if (ValidChars.indexOf(Char) == -1){
				returnChar += Char;
			}
		}
		return returnChar;
	}

	// Gets the dimension Value from the style property passed as the sText variable
	function getDimInt(sText){
		var ValidChars = "0123456789.";
		var returnChar = "";
		var Char;

	 	for (i = 0; i < sText.length; i++){
			Char = sText.charAt(i);
			if (ValidChars.indexOf(Char) >= 0){
				returnChar += Char;
			}
		}
		return returnChar;
	}
}

function browserScreen(pImage) 
{
	var padValue = 17;
	
	browserScreen.prototype.getWidth = getWidth;
	browserScreen.prototype.getHeight = getHeight;
	browserScreen.prototype.getPad = getPad;
	
	function getWidth()
	{
		if (pImage.ownerDocument.compatMode == "BackCompat"){
			var screenWidth = pImage.ownerDocument.body.clientWidth - padValue;
		} else {
			var screenWidth = pImage.ownerDocument.documentElement.clientWidth - padValue;
		}		
		
		return screenWidth;
	}
	
	function getHeight()
	{
		if (pImage.ownerDocument.compatMode == "BackCompat"){
			var screenHeight = pImage.ownerDocument.body.clientHeight - padValue;
		} else {
			var screenHeight = pImage.ownerDocument.documentElement.clientHeight - padValue;
		}		
		
		return screenHeight;
	}	
	
	function getPad()
	{
		return padValue/2;
	}
		
}


