/* ***** BEGIN LICENSE BLOCK *****

 Copyright (c) 2006-2013  Jason Adams <imagezoom@yellowgorilla.net>

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

// Initialize the global namespace for image zoom
if (!net) var net = {};
if (!net.yellowgorilla) net.yellowgorilla = {};
if (!net.yellowgorilla.imagezoom) net.yellowgorilla.imagezoom = {};

net.yellowgorilla.imagezoom.AppID = "{1A2D0EC4-75F5-4c91-89C4-3656F6E44B68}"
net.yellowgorilla.imagezoom.AppName = "";
net.yellowgorilla.imagezoom.AppVersion = "";

net.yellowgorilla.imagezoom.globals = new function () {

  this.minGeckoForRotate = "1.9";

  this.init = function () {
    console.log(this.getGeckoVersion());

    if (this.getGeckoVersion() < "2") {
      var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
      var imageZoomExtension = gExtensionManager.getItemForID(net.yellowgorilla.imagezoom.AppID);
      net.yellowgorilla.imagezoom.AppName = imageZoomExtension.name.toString();
      net.yellowgorilla.imagezoom.AppVersion = imageZoomExtension.version.toString();
    }
    else {
      Components.utils.import("resource://gre/modules/AddonManager.jsm");
      AddonManager.getAddonByID(net.yellowgorilla.imagezoom.AppID, function (izExtensionObject) {
        net.yellowgorilla.imagezoom.AppName = izExtensionObject.name.toString();
        net.yellowgorilla.imagezoom.AppVersion = izExtensionObject.version.toString();
      });
    }
  }

  this.openURL = function (aURL) {
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
  }

  this.getAppName = function () {
    return net.yellowgorilla.imagezoom.AppName;
  }

  this.getAppVersion = function () {
    return net.yellowgorilla.imagezoom.AppVersion;
  }

  this.initAbout = function () {
    var extName = this.getAppName();
    var extVersion = this.getAppVersion();
    document.title = extName + " " + extVersion;
    var versionlabel = document.getElementById("versionlabel");
    versionlabel.setAttribute("value", versionlabel.getAttribute("value") + " " + extVersion);
  }


  this.getGeckoVersion = function () {
    var gVersion = navigator.userAgent.match(/rv\:.*\)/i).toString();
    return gVersion.substring(3, gVersion.length - 1);
  }

  this.newerVersion = function (oldVersion, newVersion) {
    var maxToCheck = 2;
    for (var i = 0; i < maxToCheck; i++) {
      if (getVersionLevel(oldVersion, i + 1) < getVersionLevel(newVersion, i + 1)) return true;
      if (getVersionLevel(oldVersion, i + 1) > getVersionLevel(newVersion, i + 1)) return false;
    }

    return false;
  }

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

    return (versionNumber.substring(beginDot, endDot)) * 1;
  }

  function isFirefox() {
    return ((navigator.userAgent.search(/Firefox/gi) != -1) || (navigator.userAgent.search(/Netscape/gi) != -1) || (navigator.userAgent.search(/Flock/gi) != -1));
  }

  function isThunderbird() {
    return (navigator.userAgent.search(/Thunderbird/gi) != -1);
  }

  function isMozilla() {
    return (!isFirefox() && !isThunderbird());
  }

}

net.yellowgorilla.imagezoom.globals.init();