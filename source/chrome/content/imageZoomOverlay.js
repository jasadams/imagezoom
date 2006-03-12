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

function retrieveImage()
{
	var oImage = document.popupNode;
	if (!(oImage.originalPxWidth))
	{
		if (!oImage.style.width && !oImage.style.height){
			oImage.originalWidth = oImage.width;
			oImage.originalPxWidth = oImage.width;
			oImage.originalWidthUnit = "px";
			oImage.widthUnit = "px";
			oImage.style.width = oImage.width + oImage.widthUnit;
			oImage.originalHeight = oImage.height;
			oImage.originalHeightUnit = "px";
			oImage.heightUnit = "px";
			oImage.style.height = oImage.height + oImage.heightUnit;
		} else if(oImage.style.width && !oImage.style.height){
			oImage.originalWidth = getDimInt(oImage.style.width);
			oImage.originalPxWidth = oImage.width;
			oImage.originalWidthUnit =  getDimUnit(oImage.style.width);
			oImage.widthUnit = oImage.originalWidthUnit;
		} else if(oImage.style.height && !oImage.style.width){
			oImage.originalHeight = getDimInt(oImage.style.height);
			oImage.originalHeightUnit =  getDimUnit(oImage.style.height);
			oImage.heightUnit = oImage.originalHeightUnit;
			oImage.originalPxWidth = oImage.width;
		} else if(oImage.style.width && oImage.style.height){
			oImage.originalWidth = getDimInt(oImage.style.width);
			oImage.originalPxWidth = oImage.width;
			oImage.originalWidthUnit =  getDimUnit(oImage.style.width);
			oImage.widthUnit = oImage.originalWidthUnit;
			oImage.originalHeight = getDimInt(oImage.style.height);
			oImage.originalHeightUnit =  getDimUnit(oImage.style.height);
			oImage.heightUnit = oImage.originalHeightUnit;
		}
		oImage.zoomFactor = 100;

	}

	return oImage;
}

function izShowCustomZoom()
{
	var oImage = retrieveImage();
	openDialog("chrome://imagezoom/content/customzoom.xul", "", "chrome,modal,centerscreen", oImage);
	zoomStatus(oImage);
}

function izShowCustomDim()
{
	var oImage = retrieveImage();
	openDialog("chrome://imagezoom/content/customdim.xul", "", "chrome,modal,centerscreen", oImage);
	zoomStatus(oImage);
}

function izImageFit(){

	var padValue = 17;
	var imagezoomPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("imagezoom.");
	var oImage = retrieveImage();

	if (oImage.ownerDocument.compatMode == "BackCompat"){
		var screenHeight = oImage.ownerDocument.body.clientHeight - padValue;
		var screenWidth = oImage.ownerDocument.body.clientWidth - padValue;
	} else {
		var screenHeight = oImage.ownerDocument.documentElement.clientHeight - padValue;
		var screenWidth = oImage.ownerDocument.documentElement.clientWidth - padValue;
	}

	var screenDim = screenWidth/screenHeight;
	var imageDim = oImage.width/oImage.height;


	if (screenDim < imageDim) {
		pSetDim(oImage, screenWidth, parseInt(screenWidth/imageDim+0.5), true);
	} else {
		pSetDim(oImage, parseInt(screenHeight*imageDim+0.5), screenHeight, true);
	}

	if (oImage.ownerDocument.compatMode == "BackCompat"){
		var screenHeight = oImage.ownerDocument.body.clientHeight - padValue;
		var screenWidth = oImage.ownerDocument.body.clientWidth - padValue;
	} else {
		var screenHeight = oImage.ownerDocument.documentElement.clientHeight - padValue;
		var screenWidth = oImage.ownerDocument.documentElement.clientWidth - padValue;
	}

	if (screenDim < imageDim) {
		pSetDim(oImage, screenWidth, parseInt(screenWidth/imageDim+0.5), true);
	} else {
		pSetDim(oImage, parseInt(screenHeight*imageDim+0.5), screenHeight, true);
	}

	if (imagezoomPrefs.getBoolPref("autocenter")){
		var iTop = 0;
		var iLeft = 0;
		var cNode = oImage;
		while(cNode.tagName!='BODY'){
		   iLeft += cNode.offsetLeft;
		   iTop += cNode.offsetTop;
		   cNode = cNode.offsetParent;
		}

		if (screenDim < imageDim) {
			oImage.ownerDocument.defaultView.scroll(iLeft-(padValue/2),iTop-((screenHeight-getDimInt(oImage.style.height))/2)-(padValue/2));
		} else {
			oImage.ownerDocument.defaultView.scroll(iLeft-((screenWidth-getDimInt(oImage.style.width))/2)-(padValue/2),iTop-(padValue/2));
		}
	}
	zoomStatus(oImage);
}

function izZoomIn()
{
	var oImage = retrieveImage();
	pZoomImageRel(oImage,(pGetZoomFactor()/100));
	zoomStatus(oImage);
}

function izZoomOut()
{
	var oImage = retrieveImage();
	pZoomImageRel(oImage,1/(pGetZoomFactor()/100));
	zoomStatus(oImage);
}

function izSetZoom(zFactor)
{
	var oImage = retrieveImage();
  	pZoomImageAbs(oImage,zFactor);
	zoomStatus(oImage);
}

