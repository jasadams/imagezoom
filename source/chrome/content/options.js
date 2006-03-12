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
var gData;
var imagezoomPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("imagezoom");

function init(){
    var prefWindow = parent.hPrefWindow;

    gData = prefWindow.wsm.dataManager.pageData["chrome://imagezoom/content/optionsmoz.xul"];

	var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("imagezoom.");

    if ("imagezoomData" in gData)
        return;

    var imagezoomData = {};
    imagezoomData[0] = preferencesService.getBoolPref("mmZoomIO");
    imagezoomData[1] = preferencesService.getBoolPref("mmReset");
    imagezoomData[2] = preferencesService.getBoolPref("mmCustomZoom");
    imagezoomData[3] = preferencesService.getBoolPref("mmCustomDim");
    imagezoomData[4] = preferencesService.getBoolPref("mmFitWindow");
    imagezoomData[5] = preferencesService.getBoolPref("mmZoomPcts");

    imagezoomData[6] = preferencesService.getBoolPref("smZoomIO");
    imagezoomData[7] = preferencesService.getBoolPref("smReset");
    imagezoomData[8] = preferencesService.getBoolPref("smCustomZoom");
    imagezoomData[9] = preferencesService.getBoolPref("smCustomDim");
    imagezoomData[10] = preferencesService.getBoolPref("smFitWindow");
    imagezoomData[11] = preferencesService.getBoolPref("smZoomPcts");

	imagezoomData[12] = preferencesService.getIntPref("zoomvalue");

    // Initialise dictionarysearchData here
    gData.imagezoomData = imagezoomData;

}

function imagezoom_saveOptions()
{
	var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("imagezoom.");

    preferencesService.setBoolPref("mmZoomIO", document.getElementById("imagezoommmZoomIO").checked);
    preferencesService.setBoolPref("mmReset", document.getElementById("imagezoommmReset").checked);
    preferencesService.setBoolPref("mmCustomZoom", document.getElementById("imagezoommmCustomZoom").checked);
    preferencesService.setBoolPref("mmCustomDim", document.getElementById("imagezoommmCustomDim").checked);
    preferencesService.setBoolPref("mmFitWindow", document.getElementById("imagezoommmFitWindow").checked);
    preferencesService.setBoolPref("mmZoomPcts", document.getElementById("imagezoommmZoomPcts").checked);

    preferencesService.setBoolPref("smZoomIO", document.getElementById("imagezoomsmZoomIO").checked);
    preferencesService.setBoolPref("smReset", document.getElementById("imagezoomsmReset").checked);
    preferencesService.setBoolPref("smCustomZoom", document.getElementById("imagezoomsmCustomZoom").checked);
    preferencesService.setBoolPref("smCustomDim", document.getElementById("imagezoomsmCustomDim").checked);
    preferencesService.setBoolPref("smFitWindow", document.getElementById("imagezoomsmFitWindow").checked);
    preferencesService.setBoolPref("smZoomPcts", document.getElementById("imagezoomsmZoomPcts").checked);

	preferencesService.setIntPref("zoomvalue", document.getElementById("imagezoomzoomvalue").value);

}

function Startup()
{
	init();
}

//Initialize options
function imagezoom_initializeOptions()
{
	var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("imagezoom.");

    document.getElementById("imagezoommmZoomIO").checked = preferencesService.getBoolPref("mmZoomIO");
    document.getElementById("imagezoommmReset").checked = preferencesService.getBoolPref("mmReset");
    document.getElementById("imagezoommmCustomZoom").checked = preferencesService.getBoolPref("mmCustomZoom");
    document.getElementById("imagezoommmCustomDim").checked = preferencesService.getBoolPref("mmCustomDim");
    document.getElementById("imagezoommmFitWindow").checked = preferencesService.getBoolPref("mmFitWindow");
    document.getElementById("imagezoommmZoomPcts").checked = preferencesService.getBoolPref("mmZoomPcts");

    document.getElementById("imagezoomsmZoomIO").checked = preferencesService.getBoolPref("smZoomIO");
    document.getElementById("imagezoomsmReset").checked = preferencesService.getBoolPref("smReset");
    document.getElementById("imagezoomsmCustomZoom").checked = preferencesService.getBoolPref("smCustomZoom");
    document.getElementById("imagezoomsmCustomDim").checked = preferencesService.getBoolPref("smCustomDim")
    document.getElementById("imagezoomsmFitWindow").checked = preferencesService.getBoolPref("smFitWindow");
    document.getElementById("imagezoomsmZoomPcts").checked = preferencesService.getBoolPref("smZoomPcts");

	var zoom = preferencesService.getIntPref("zoomvalue");
	var zoomValueBox = document.getElementById("imagezoomzoomvalue")
	zoomValueBox.selectedItem = zoomValueBox.getElementsByAttribute( "value", zoom )[0];
}

