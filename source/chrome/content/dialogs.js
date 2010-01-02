/* ***** BEGIN LICENSE BLOCK *****

    Copyright (c) 2006-2010  Jason Adams <imagezoom@yellowgorilla.net>

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

// returns true if it was a numeric keypress and false if it was not
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

// Checks whether sText is an integer
function pIsNumeric(sText)
{
	var ValidChars = "0123456789";
	var IsNumber=true;
	var Char;

 	for (i = 0; i < sText.length && IsNumber == true; i++){
		Char = sText.charAt(i);
		if (ValidChars.indexOf(Char) == -1){
			IsNumber = false;
		}
	}
	return IsNumber;
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
		if (window.arguments[0] == "Image") {
			var izoImage = window.arguments[1];
			izoImage.setZoom(zoomValue);
		} else {
			var imgZoomManager = window.arguments[1];
			imgZoomManager.imageZoom = zoomValue;
		}
	}
}

function imagezoom_loadCustomZoom()
{
	var zoomValueBox = document.getElementById("customZoom");
	if (window.arguments[0] == "Image") {
		var izoImage = window.arguments[1];
		zoomValueBox.value = izoImage.zoomFactor();
	} else {
		var imgZoomManager = window.arguments[1];
		zoomValueBox.value = imgZoomManager.factorOther;
	}
}

function imagezoom_customDim()
{
	var dimWidth = document.getElementById("dimWidth").value;
	var dimHeight = document.getElementById("dimHeight").value;
	if (pIsNumeric(dimWidth) && pIsNumeric(dimHeight)){
		var izoImage = window.arguments[0];
		izoImage.setDimension(dimWidth, dimHeight);
	}
}

function imagezoom_loadCustomDim()
{
	gDimWidth = document.getElementById("dimWidth");
	gDimHeight = document.getElementById("dimHeight");
	gDimAspect = document.getElementById("dimAspect");
	var izoImage = window.arguments[0];
	gDimWidth.value = izoImage.getWidth();
	gDimHeight.value = izoImage.getHeight();
	gDimRatio = izoImage.getWidth()/izoImage.getHeight();
	gDimAspect.checked = true;
}