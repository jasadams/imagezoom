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

function init(){
    var prefWindow = parent.hPrefWindow;

    gData = prefWindow.wsm.dataManager.pageData["chrome://imagezoom/content/optionsmoz.xul"];

    if ("imagezoomData" in gData)
        return;

    var imagezoomData = {};
    imagezoomData[0] = imagezoomPrefs.getBoolPref("mmZoomIO");
    imagezoomData[1] = imagezoomPrefs.getBoolPref("mmReset");
    imagezoomData[2] = imagezoomPrefs.getBoolPref("mmCustomZoom");
    imagezoomData[3] = imagezoomPrefs.getBoolPref("mmCustomDim");
    imagezoomData[4] = imagezoomPrefs.getBoolPref("mmFitWindow");
    imagezoomData[5] = imagezoomPrefs.getBoolPref("mmZoomPcts");

    imagezoomData[6] = imagezoomPrefs.getBoolPref("smZoomIO");
    imagezoomData[7] = imagezoomPrefs.getBoolPref("smReset");
    imagezoomData[8] = imagezoomPrefs.getBoolPref("smCustomZoom");
    imagezoomData[9] = imagezoomPrefs.getBoolPref("smCustomDim");
    imagezoomData[10] = imagezoomPrefs.getBoolPref("smFitWindow");
    imagezoomData[11] = imagezoomPrefs.getBoolPref("smZoomPcts");

    imagezoomData[12] = imagezoomPrefs.getBoolPref("usescroll");
    imagezoomData[13] = imagezoomPrefs.getIntPref("scrollvalue");

    imagezoomData[14] = imagezoomPrefs.getIntPref("zoomvalue");
    imagezoomData[15] = imagezoomPrefs.getBoolPref("autocenter");

    // Initialise dictionarysearchData here
    gData.imagezoomData = imagezoomData;

	imagezoom_toggleScrollEnabled();
}

function imagezoom_saveOptions()
{
    imagezoomPrefs.setBoolPref("mmZoomIO", document.getElementById("imagezoommmZoomIO").checked);
    imagezoomPrefs.setBoolPref("mmReset", document.getElementById("imagezoommmReset").checked);
    imagezoomPrefs.setBoolPref("mmCustomZoom", document.getElementById("imagezoommmCustomZoom").checked);
    imagezoomPrefs.setBoolPref("mmCustomDim", document.getElementById("imagezoommmCustomDim").checked);
    imagezoomPrefs.setBoolPref("mmFitWindow", document.getElementById("imagezoommmFitWindow").checked);
    imagezoomPrefs.setBoolPref("mmZoomPcts", document.getElementById("imagezoommmZoomPcts").checked);

    imagezoomPrefs.setBoolPref("smZoomIO", document.getElementById("imagezoomsmZoomIO").checked);
    imagezoomPrefs.setBoolPref("smReset", document.getElementById("imagezoomsmReset").checked);
    imagezoomPrefs.setBoolPref("smCustomZoom", document.getElementById("imagezoomsmCustomZoom").checked);
    imagezoomPrefs.setBoolPref("smCustomDim", document.getElementById("imagezoomsmCustomDim").checked);
    imagezoomPrefs.setBoolPref("smFitWindow", document.getElementById("imagezoomsmFitWindow").checked);
    imagezoomPrefs.setBoolPref("smZoomPcts", document.getElementById("imagezoomsmZoomPcts").checked);

    imagezoomPrefs.setBoolPref("usescroll", document.getElementById("imagezoomusescroll").checked);
    imagezoomPrefs.setIntPref("scrollvalue", document.getElementById("imagezoomscrollvalue").value);

    imagezoomPrefs.setIntPref("zoomvalue", document.getElementById("imagezoomzoomvalue").value);
    imagezoomPrefs.setBoolPref("autocenter", document.getElementById("imagezoomautocenter").checked);
}

function Startup()
{
    init();
}

//Initialize options
function imagezoom_initializeOptions()
{


    document.getElementById("imagezoommmZoomIO").checked = imagezoomPrefs.getBoolPref("mmZoomIO");
    document.getElementById("imagezoommmReset").checked = imagezoomPrefs.getBoolPref("mmReset");
    document.getElementById("imagezoommmCustomZoom").checked = imagezoomPrefs.getBoolPref("mmCustomZoom");
    document.getElementById("imagezoommmCustomDim").checked = imagezoomPrefs.getBoolPref("mmCustomDim");
    document.getElementById("imagezoommmFitWindow").checked = imagezoomPrefs.getBoolPref("mmFitWindow");
    document.getElementById("imagezoommmZoomPcts").checked = imagezoomPrefs.getBoolPref("mmZoomPcts");

    document.getElementById("imagezoomsmZoomIO").checked = imagezoomPrefs.getBoolPref("smZoomIO");
    document.getElementById("imagezoomsmReset").checked = imagezoomPrefs.getBoolPref("smReset");
    document.getElementById("imagezoomsmCustomZoom").checked = imagezoomPrefs.getBoolPref("smCustomZoom");
    document.getElementById("imagezoomsmCustomDim").checked = imagezoomPrefs.getBoolPref("smCustomDim")
    document.getElementById("imagezoomsmFitWindow").checked = imagezoomPrefs.getBoolPref("smFitWindow");
    document.getElementById("imagezoomsmZoomPcts").checked = imagezoomPrefs.getBoolPref("smZoomPcts");

	document.getElementById("imagezoomusescroll").checked = imagezoomPrefs.getBoolPref("usescroll");

    var scroll = imagezoomPrefs.getIntPref("scrollvalue");
    var scrollValueBox = document.getElementById("imagezoomscrollvalue");
    scrollValueBox.selectedItem = scrollValueBox.getElementsByAttribute( "value", scroll )[0];
	imagezoom_toggleScrollEnabled();

    var zoom = imagezoomPrefs.getIntPref("zoomvalue");
    var zoomValueBox = document.getElementById("imagezoomzoomvalue");
    zoomValueBox.selectedItem = zoomValueBox.getElementsByAttribute( "value", zoom )[0];

    document.getElementById("imagezoomautocenter").checked = imagezoomPrefs.getBoolPref("autocenter");
}

function imagezoom_toggleScrollEnabled()
{
	var scrollDisabled = !document.getElementById("imagezoomusescroll").checked;
	document.getElementById("imagezoomscrollvalue").disabled = scrollDisabled;
	document.getElementById("imagezoomscrollvaluelabelbefore").disabled = scrollDisabled;
	document.getElementById("imagezoomscrollvaluelabelafter").disabled = scrollDisabled;
}