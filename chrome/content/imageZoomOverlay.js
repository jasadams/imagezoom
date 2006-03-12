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
	if (!(oImage.originalWidth && oImage.originalHeight && oImage.zoomFactor))
	{
		oImage.originalWidth = oImage.offsetWidth;
		oImage.originalHeight = oImage.offsetHeight;
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

	var oImage = retrieveImage();
	var screenWidth = window._content.innerWidth-10;
	var screenHeight = window._content.innerHeight-10;
	var screenDim = screenWidth/screenHeight;
	var imageDim = oImage.offsetWidth/oImage.offsetHeight;


	if (screenDim < imageDim) {
		pSetDim(oImage, screenWidth, screenWidth/imageDim);
	} else {
		pSetDim(oImage, screenHeight*imageDim, screenHeight);
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

