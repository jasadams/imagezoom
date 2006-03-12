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

function Startup(){
	alert("Here");
}

function init(){
	Startup();
}

function imagezoom_saveOptions()
{
  	var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	var displayString = "";
	if (document.getElementById("mmZoomIO").checked)
		displayString += "context-zoom-zin,context-zoom-zout,";
	if (document.getElementById("mmReset").checked)
		displayString += "context-zoom-zreset,";
	if (document.getElementById("mmCustomZoom").checked)
		displayString += "context-zoom-zcustom,";
	if (document.getElementById("mmCustomDim").checked)
		displayString += "context-zoom-dcustom,";
	if (document.getElementById("mmFitWindow").checked)
		displayString += "context-zoom-fit,";

	if (document.getElementById("smZoomIO").checked){
		displayString += "zoomsub-zin,zoomsub-zout,";
		if ((document.getElementById("smCustomZoom").checked) ||
			(document.getElementById("smCustomDim").checked) ||
			(document.getElementById("smFitWindow").checked) ||
			(document.getElementById("smZoomPcts").checked))
			displayString += "zoomsub-s1,";
	}
	if (document.getElementById("smReset").checked){
		displayString += "zoomsub-zreset,";
		if (((document.getElementById("smCustomZoom").checked) ||
			(document.getElementById("smCustomDim").checked) ||
			(document.getElementById("smFitWindow").checked) ||
			(document.getElementById("smZoomPcts").checked)) &&
			!(document.getElementById("smZoomIO").checked))
			displayString += "zoomsub-s1,";
	}
	if (document.getElementById("smCustomZoom").checked){
		displayString += "zoomsub-zcustom,";
		if (((document.getElementById("smFitWindow").checked) ||
			(document.getElementById("smZoomPcts").checked)) &&
			!(document.getElementById("smCustomDim").checked))
			displayString += "zoomsub-s2,";
	}
	if (document.getElementById("smCustomDim").checked){
		displayString += "zoomsub-dcustom,";
		if ((document.getElementById("smCustomDim").checked) ||
			(document.getElementById("smFitWindow").checked) ||
			(document.getElementById("smZoomPcts").checked))
			displayString += "zoomsub-s2,";
	}
	if (document.getElementById("smFitWindow").checked){
		displayString += "zoomsub-fit,";
		if (document.getElementById("smZoomPcts").checked)
			displayString += "zoomsub-s3,";
	}
	if (document.getElementById("smZoomPcts").checked)
		displayString += "zoomsub-z400,zoomsub-z200,zoomsub-z150,zoomsub-z125,zoomsub-s4,zoomsub-z100,zoomsub-s5,zoomsub-z75,zoomsub-z50,zoomsub-z25,zoomsub-z10,";
	if ((document.getElementById("smZoomIO").checked) ||
		(document.getElementById("smReset").checked) ||
		(document.getElementById("smCustomZoom").checked) ||
		(document.getElementById("smCustomDim").checked) ||
		(document.getElementById("smFitWindow").checked) ||
		(document.getElementById("smZoomPcts").checked))
		displayString += "context-zoomsub,";

	displayString = displayString.substring(0, displayString.length-1);

	var allitems = pGetArrayCSV(gAllMenuItems);
	var hideString = "";
	for (var i=0; i<allitems.length; i++) {
		if (displayString.indexOf(allitems[i]) < 0)
			hideString += allitems[i] + ",";
	}

	hideString = hideString.substring(0, hideString.length-1);

	preferencesService.setCharPref("imagezoom.display",displayString);
	preferencesService.setCharPref("imagezoom.hide",hideString);

	var zoom = document.getElementById("zoomvalue")
	try
	{
	  preferencesService.setIntPref("imagezoom.zoomvalue",zoom.value);
	}
	catch(e)
	{
	  preferencesService.setIntPref("imagezoom.zoomvalue",defaultZoomFactor);
	}

}

//Initialize options
function imagezoom_initializeOptions()
{
	var preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	try {
  		var displayString = preferencesService.getCharPref("imagezoom.display");
	} catch(e) {
		var displayString = gDefaultDisplayString;
	}
	if ((displayString.indexOf("context-zoom-zin") >= 0) && (displayString.indexOf("context-zoom-zout") >= 0))
	  document.getElementById("mmZoomIO").checked = true;
	if ((displayString.indexOf("context-zoom-zreset") >= 0))
	  document.getElementById("mmReset").checked = true;
	if ((displayString.indexOf("context-zoom-zcustom") >= 0))
	  document.getElementById("mmCustomZoom").checked = true;
	if ((displayString.indexOf("context-zoom-dcustom") >= 0))
	  document.getElementById("mmCustomDim").checked = true;
	if ((displayString.indexOf("context-zoom-fit") >= 0))
	  document.getElementById("mmFitWindow").checked = true;
	if ((displayString.indexOf("zoomsub-zin") >= 0) && (displayString.indexOf("zoomsub-zout") >= 0))
	  document.getElementById("smZoomIO").checked = true;
	if ((displayString.indexOf("zoomsub-zreset") >= 0))
	  document.getElementById("smReset").checked = true;
	if ((displayString.indexOf("zoomsub-z400") >= 0)
		&& (displayString.indexOf("zoomsub-z200") >= 0)
		&& (displayString.indexOf("zoomsub-z150") >= 0)
		&& (displayString.indexOf("zoomsub-z125") >= 0)
		&& (displayString.indexOf("zoomsub-z100") >= 0)
		&& (displayString.indexOf("zoomsub-z75") >= 0)
		&& (displayString.indexOf("zoomsub-z50") >= 0)
		&& (displayString.indexOf("zoomsub-z25") >= 0)
		&& (displayString.indexOf("zoomsub-z10") >= 0))
	  document.getElementById("smZoomPcts").checked = true;
	if ((displayString.indexOf("zoomsub-zcustom") >= 0))
	  document.getElementById("smCustomZoom").checked = true;
	if ((displayString.indexOf("zoomsub-dcustom") >= 0))
	  document.getElementById("smCustomDim").checked = true;
	if ((displayString.indexOf("zoomsub-fit") >= 0))
	  document.getElementById("smFitWindow").checked = true;

  try
  {
	  var zoom = preferencesService.getIntPref("imagezoom.zoomvalue");
  }
  catch(e)
  {
	  var zoom = gDefaultZoomFactor;
  }
  var zoomValueBox = document.getElementById("zoomvalue")
  zoomValueBox.selectedItem = zoomValueBox.getElementsByAttribute( "value", zoom )[0];
}

