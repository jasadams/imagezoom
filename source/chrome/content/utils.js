var izAppID = "{1A2D0EC4-75F5-4c91-89C4-3656F6E44B68}";

function isFirefox() {
	return ((navigator.userAgent.search(/Firefox/gi) != -1) || (navigator.userAgent.search(/Netscape/gi) != -1) || (navigator.userAgent.search(/Flock/gi) != -1));
}

function isThunderbird() {
	return (navigator.userAgent.search(/Thunderbird/gi) != -1);
}

function getGeckoVersion(){
	var gVersion = navigator.userAgent.match(/rv\:.*\)/i).toString();
	return gVersion.substring(3, gVersion.length - 1);
}

function isMozilla() {
	return (!isFirefox() && !isThunderbird());
}

function openURL(aURL)
{
	if (isFirefox()) {
		if (window.opener){
			window.opener.openURL(aURL);
		} else {
			openDialog("chrome://browser/content/browser.xul", "_blank", "chrome,all,dialog=no", aURL, null, null);
		}
	} else if(isMozilla()) {
		if (window.opener){
			window.opener.openURL(aURL);
		} else {
			openDialog("chrome://navigator/content/navigator.xul", "_blank", "chrome,all,dialog=no", aURL, null, null);
		}
	} else {
		var uri = Components.classes["@mozilla.org/network/standard-url;1"]
						  .createInstance(Components.interfaces.nsIURI);
		uri.spec = aURL;

		var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
								  .getService(Components.interfaces.nsIExternalProtocolService);
		protocolSvc.loadUrl(uri);
	}
}

function getAppName() {
	if (isMozilla())
		return "";
	var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
                                	.getService(Components.interfaces.nsIExtensionManager);
	var imageZoomExtension = gExtensionManager.getItemForID(izAppID);
	return imageZoomExtension.name.toString();
}

function getAppVersion() {
	if (isMozilla())
		return "";
	var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
                                	.getService(Components.interfaces.nsIExtensionManager);
	var imageZoomExtension = gExtensionManager.getItemForID(izAppID);
	return imageZoomExtension.version.toString();
}

function getVersionLevel(versionNumber, level)
{
	var beginDot = 0;
	var endDot = -1;
	for (var i=0; (i<level) && (endDot < versionNumber.length); i++)
	{
		if (versionNumber.indexOf('.', endDot+1) >= 0)
		{
			beginDot = endDot + 1;
			endDot = versionNumber.indexOf('.', endDot+1);
		}
		else
		{
			beginDot = endDot + 1;
			endDot = versionNumber.length;
		}
	}

	return (versionNumber.substring(beginDot, endDot))*1;
}

function newerVersion(oldVersion, newVersion) 
{
	var maxToCheck = 2;
	for (var i=0; i<maxToCheck; i++)
	{
		if (getVersionLevel(oldVersion, i+1) < getVersionLevel(newVersion, i+1))
			return true;
		if (getVersionLevel(oldVersion, i+1) > getVersionLevel(newVersion, i+1))
			return false;			
	}
	
	return false;
}


function initAbout() 
{
	var extName = getAppName();
	var extVersion = getAppVersion();
	document.title = extName + " " + extVersion;
	var versionlabel = document.getElementById("versionlabel");
	versionlabel.setAttribute("value", versionlabel.getAttribute("value") + " " + extVersion);
}
