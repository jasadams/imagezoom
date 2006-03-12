/* ***** BEGIN LICENSE BLOCK *****

    Copyright (c) 2004  Jason Adams <jason_nospam@yellowgorilla.net>

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

var gDefaultZoomFactor = 200;
var gAllMenuItems = "context-zoom-zin,context-zoom-zout,context-zoom-zreset,context-zoom-zcustom,context-zoom-dcustom,context-zoom-fit,zoomsub-zin,zoomsub-zout,zoomsub-s1,zoomsub-zreset,zoomsub-zcustom,zoomsub-dcustom,zoomsub-s2,zoomsub-fit,zoomsub-s3,zoomsub-z400,zoomsub-z200,zoomsub-z150,zoomsub-z125,zoomsub-s4,zoomsub-z100,zoomsub-s5,zoomsub-z75,zoomsub-z50,zoomsub-z25,zoomsub-z10,context-zoomsub";
var gDefaultDisplayString = "zoomsub-zin,zoomsub-zout,zoomsub-s1,zoomsub-zreset,zoomsub-zcustom,zoomsub-dcustom,zoomsub-s2,zoomsub-fit,zoomsub-s3,zoomsub-z400,zoomsub-z200,zoomsub-z150,zoomsub-z125,zoomsub-s4,zoomsub-z100,zoomsub-s5,zoomsub-z75,zoomsub-z50,zoomsub-z25,zoomsub-z10,context-zoomsub";

window.addEventListener("load", initImageZoom, false);

function initImageZoom() {
    if (document.getElementById("contentAreaContextMenu")){
        document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", imageZoomMenu, false);
    }
    else if (document.getElementById("messagePaneContext")){
        document.getElementById("messagePaneContext").addEventListener("popupshowing", imageZoomMenu, false);
    }
}

function imageZoomMenu() {
	if(gContextMenu) {
		var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
  		try {
			var hideString = preferencesService.getCharPref("imagezoom.hide");
			var displayString = preferencesService.getCharPref("imagezoom.display");
		} catch(e) {
			var hideString = "";
			var displayString = gDefaultDisplayString;
		}

		var menuItems = pGetArrayCSV(hideString);
		for (var i=0; i<menuItems.length; i++)
		{
			var zoomMenu = document.getElementById(menuItems[i]);
			if(zoomMenu){
				zoomMenu.hidden = true;
			}
		}
		menuItems = pGetArrayCSV(displayString);
		for (var j=0; j<menuItems.length; j++)
		{
			zoomMenu = document.getElementById(menuItems[j]);
			if(zoomMenu){
				zoomMenu.hidden = !gContextMenu.onImage;
			}
		}
	}
}


function pGetArrayCSV(csvString)
{
	var newArray = new Array();
	newArray = pParseCSVString(csvString, newArray);
	return newArray;
}

function zoomStatus(oImage)
{
	window.top.status = "Image Zoom " + oImage.zoomFactor + "%";
}

function pParseCSVString(csvString, arrayObject)
{
	var indexStr = csvString.indexOf(",")
	if (indexStr >= 0) {
		arrayObject.push(csvString.substring(0,indexStr).replace(" ", ""));
		if (csvString.substring(indexStr+1).length > 0)
			arrayObject = pParseCSVString(csvString.substring(indexStr+1), arrayObject);
	} else {
		arrayObject.push(csvString.replace(" ", ""));
	}
	return arrayObject;
}

function pGetZoomFactor()
{
	try
	{
		var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
		var zoomValue = preferencesService.getIntPref("imagezoom.zoomvalue");
	}
	catch(e)
	{
		var zoomValue = gDefaultZoomFactor;
	}
	return zoomValue;
}

function pZoomImageAbs(oImage, zFactor)
{
  	oImage.style.width = parseInt((oImage.originalWidth * zFactor) + 0.5) + "px";
  	oImage.style.height = parseInt((oImage.originalHeight * zFactor) + 0.5) + "px";
	oImage.zoomFactor = parseInt((oImage.offsetWidth / oImage.originalWidth)*100+0.5);
}

function pSetDim(oImage, iWidth, iHeight)
{
  	oImage.style.width = iWidth + "px";
  	oImage.style.height = iHeight + "px";
	oImage.zoomFactor = parseInt((oImage.offsetWidth / oImage.originalWidth)*100+0.5);
}

function pZoomImageRel(oImage,zoomValue)
{
	var oldWidth = oImage.offsetWidth;
	var oldHeight = oImage.offsetHeight;
	oImage.style.width = parseInt((oldWidth * zoomValue) + 0.5) + "px";
	oImage.style.height = parseInt((oldHeight * zoomValue) + 0.5) + "px";
	oImage.zoomFactor = parseInt((oImage.offsetWidth / oImage.originalWidth)*100+0.5);
}

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

