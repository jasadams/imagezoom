
function isFirefox() {
	return ((navigator.userAgent.search(/Firefox/gi) != -1) || (navigator.userAgent.search(/Netscape/gi) != -1) || (navigator.userAgent.search(/Flock/gi) != -1));
}

function isThunderbird() {
	return (navigator.userAgent.search(/Thunderbird/gi) != -1);
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

function initInstall() {
	var bundle = document.getElementById("bundle_ImageZoom");
	var oldversion = window.arguments[0];
	var label = document.getElementById("install-notice");
	if (oldversion == "0.0.0")
		var strNotice = "iz.install.new.notice";
	else
		var strNotice = "iz.install.upgrade.notice"

	label.setAttribute("value", bundle.getString(strNotice).replace(/%version%/, bundle.getString("version")));

	var continueURL = "http://imagezoom.yellowgorilla.net/install/install.html?old=" + oldversion + "&new=" + bundle.getString("version");
	document.getElementById("continue").setAttribute("oncommand", "openURL(\"" + continueURL + "\"); window.close();");
}