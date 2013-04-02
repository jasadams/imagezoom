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

if (!net) var net = {};
if (!net.yellowgorilla) net.yellowgorilla = {};
if (!net.yellowgorilla.imagezoom) net.yellowgorilla.imagezoom = {};

net.yellowgorilla.imagezoom.globals = new ImageZoomGlobals();

function ImageZoomGlobals() {

  var self = this;
  var nsIPrefServiceObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  var nsIPrefBranchObj = nsIPrefServiceObj.getBranch("extensions.imagezoom.");

  self.AppName = "";
  self.AppVersion = "0.0.0";

  self.AppID = "{1A2D0EC4-75F5-4c91-89C4-3656F6E44B68}";
  Components.utils.import("resource://gre/modules/AddonManager.jsm");


  AddonManager.getAddonByID(self.AppID, function (izExtensionObject) {
    self.AppName = izExtensionObject.name.toString();
    self.AppVersion = izExtensionObject.version.toString();

    var oldVersion = nsIPrefBranchObj.getCharPref("version");
    var version = self.AppVersion;
    if (self.newerVersion(oldVersion, version)) {
      nsIPrefBranchObj.setCharPref("version", version);
      try {
        // try to save the prefs
        nsIPrefServiceObj.savePrefFile(null);
        setTimeout(function () {
          if (typeof gBrowser !== 'undefined') {
            gBrowser.selectedTab = gBrowser.addTab('http://imagezoom.yellowgorilla.net/install/?source=install&version=' + version);
          }
        }, 100);
      }
      catch(error) {
        // Do nothing
      }
    }
  });

  self.minGeckoForRotate = 2.0;

  self.openURL = function (aURL) {
    if (isFirefox()) {
      if (window.opener) {
        window.opener.open(aURL);
      } else {
        openDialog("chrome://browser/content/browser.xul", "_blank", "chrome,all,dialog=no", aURL, null, null);
      }
    } else if (isMozilla()) {
      if (window.opener) {
        window.opener.open(aURL);
      } else {
        openDialog("chrome://navigator/content/navigator.xul", "_blank", "chrome,all,dialog=no", aURL, null, null);
      }
    } else {
      var uri = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURI);
      uri.spec = aURL;

      var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
      protocolSvc.loadUrl(uri);
    }
  };

  self.getAppName = function () {
    return self.AppName;
  };

  self.getAppVersion = function () {
    return self.AppVersion;
  };

  self.initAbout = function () {
    var extName = self.getAppName();
    var extVersion = self.getAppVersion();
    document.title = extName + " " + extVersion;
    var versionLabel = document.getElementById("versionLabel");
    versionLabel.setAttribute("value", versionLabel.getAttribute("value") + " " + extVersion);
  };


  self.getGeckoVersion = function () {
    var xulAppInfo = Components.classes["@mozilla.org/xre/app-info;1"]
      .getService(Components.interfaces.nsIXULAppInfo);

    var versionParts = xulAppInfo.platformVersion.split('.');
    var gVersion;
    if (versionParts.length>1) {
      gVersion = parseFloat(versionParts[0] + "." + versionParts[0]);
    }
    else {
      gVersion = parseFloat(versionParts[0]);
    }
    return gVersion;
  };

  self.newerVersion = function (oldVersion, newVersion) {
    var maxToCheck = 2;
    for (var i = 0; i < maxToCheck; i++) {
      if (getVersionLevel(oldVersion, i + 1) < getVersionLevel(newVersion, i + 1)) return true;
      if (getVersionLevel(oldVersion, i + 1) > getVersionLevel(newVersion, i + 1)) return false;
    }

    return false;
  };

  // Private Functions

  function getVersionLevel(versionNumber, level) {
    var beginDot = 0;
    var endDot = -1;
    for (var i = 0;
         (i < level) && (endDot < versionNumber.length); i++) {
      if (versionNumber.indexOf('.', endDot + 1) >= 0) {
        beginDot = endDot + 1;
        endDot = versionNumber.indexOf('.', endDot + 1);
      } else {
        beginDot = endDot + 1;
        endDot = versionNumber.length;
      }
    }

    return parseInt(versionNumber.substring(beginDot, endDot), 10);
  }

  function isFirefox() {
    var xulAppInfo = Components.classes["@mozilla.org/xre/app-info;1"]
      .getService(Components.interfaces.nsIXULAppInfo);
    return (xulAppInfo.name.toUpperCase().search(/FIREFOX/gi) != -1);
  }

  function isThunderbird() {
    var xulAppInfo = Components.classes["@mozilla.org/xre/app-info;1"]
      .getService(Components.interfaces.nsIXULAppInfo);
    return (xulAppInfo.name.toUpperCase().search(/THUNDERBIRD/gi) != -1);
  }

  function isMozilla() {
    return (!isFirefox() && !isThunderbird());
  }

}
