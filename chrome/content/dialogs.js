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

var gDimRatio = 0.0;
var gDimWidth;
var gDimHeight;
var gDimAspect;

function validateKeyPress(e){
	switch(e.which) {
	   case 0:  //misc
       case 8: //backspace
           return true;
           break
       default:
       		var key = String.fromCharCode(e.which);
			if(pIsNumeric(key)){
				return true;
			} else {
				return false;
			}
	}
}

function widthPress(e)
{
	switch(e.which) {
	   case 0:  //misc
       case 8: //backspace
       case 46: //delete
           return true;
           break
       default:
       		var key = String.fromCharCode(e.which);
			if(pIsNumeric(key) && key != "."){
				return true;
			} else {
				return false;
			}
	}
}

function widthInput(e){
	if (gDimAspect.checked) {
		if (pIsNumeric(gDimWidth.value) && (gDimWidth.value != "")){
			gDimHeight.value = parseInt((parseInt(gDimWidth.value)/gDimRatio)+0.5);
		} else {
			gDimHeight.value = "";
		}
	}
}

function heightInput(e){
	if (gDimAspect.checked) {
		if (pIsNumeric(gDimHeight.value) && gDimHeight.value != ""){
			gDimWidth.value = parseInt((parseInt(gDimHeight.value)*gDimRatio)+0.5);
		} else {
			gDimWidth.value = "";
		}
	}
}

function checkInput(e){
	if (!gDimAspect.checked) {
		if (pIsNumeric(gDimWidth.value) && gDimWidth.value != ""){
			gDimHeight.value = parseInt((parseInt(gDimWidth.value)/gDimRatio)+0.5);
		} else {
			gDimHeight.value = "";
		}
	}
}

function imagezoom_customZoom()
{
	var zoomValue = document.getElementById("customZoom").value;
	if (pIsNumeric(zoomValue)){
		var oImage = window.arguments[0];
		pZoomImageAbs(oImage, zoomValue/100);
	}
}

function imagezoom_loadCustomZoom()
{
	var zoomValueBox = document.getElementById("customZoom");
	var oImage = window.arguments[0];
	zoomValueBox.value = oImage.zoomFactor;
}

function imagezoom_customDim()
{
	var dimWidth = document.getElementById("dimWidth").value;
	var dimHeight = document.getElementById("dimHeight").value;
	if (pIsNumeric(dimWidth) && pIsNumeric(dimHeight)){
		var oImage = window.arguments[0];
		pSetDim(oImage, dimWidth, dimHeight);
	}
}

function imagezoom_loadCustomDim()
{
	gDimWidth = document.getElementById("dimWidth");
	gDimHeight = document.getElementById("dimHeight");
	gDimAspect = document.getElementById("dimAspect");
	var oImage = window.arguments[0];
	gDimWidth.value = oImage.width;
	gDimHeight.value = oImage.height;
	gDimRatio = oImage.width/oImage.height;
	gDimAspect.checked = true;
}