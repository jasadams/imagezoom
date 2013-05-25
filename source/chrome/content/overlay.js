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
if (!net) { var net = {}; }
if (!net.yellowgorilla) { net.yellowgorilla = {}; }
if (!net.yellowgorilla.imagezoom) { net.yellowgorilla.imagezoom = {}; }

net.yellowgorilla.imagezoom.overlay = new ImageZoomOverlay();

window.addEventListener("load", net.yellowgorilla.imagezoom.overlay.initImageZoom, false);

// Image Zoom overlay Object Definition
function ImageZoomOverlay() {
  'use strict';
  // Private Global Variables
  // Preference Service objects

  var nsIPrefServiceObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  var nsIPrefBranchObj = nsIPrefServiceObj.getBranch("extensions.imagezoom.");

  var izContext;
  var contextDisabled = false;
  var imagezoomBundle;
  var contextSubMenuLabel;
  var contextRotateMenuLabel;
  var rotateTime = 0;

  //Public Functions
  this.initImageZoom = function () {

    // For Mozilla and Firefox
    if (document.getElementById("contentAreaContextMenu")) {
      document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", imageZoomMenu, false);
    }
    // For Thunderbird
    if (document.getElementById("mailContext")) {
      document.getElementById("mailContext").addEventListener("popupshowing", imageZoomMenu, false);
    }
    // Add events for the mouse functions
    gPanelContainer().addEventListener("mousedown", izOnMouseDown, true);

    imagezoomBundle = document.getElementById("net.yellowgorilla.imagezoom.stringbundle");

  };

  this.izShowCustomZoom = function () {
    // Create the image object and pass it to the custom zoom dialog
    var oizImage = new IzImage(document.popupNode);
    openDialog("chrome://net.yellowgorilla.imagezoom/content/customzoom.xul", "", "chrome,modal,centerscreen", "Image", oizImage);
    reportStatus(oizImage);
  };

  this.izShowCustomDim = function () {
    // Create the image object and pass it to the custom dimension dialog
    var oizImage = new IzImage(document.popupNode);
    openDialog("chrome://net.yellowgorilla.imagezoom/content/customdim.xul", "", "chrome,modal,centerscreen", oizImage);
    reportStatus(oizImage);
  };

  this.izImageFit = function () {
    // Create the object and invoke its Fit to window method passing the autocenter option
    var oizImage = new IzImage(document.popupNode);
    oizImage.fit(nsIPrefBranchObj.getBoolPref("autocenter"));
    reportStatus(oizImage);
  };

  this.izFitWidth = function () {
    // Create the object and invoke its Fit to window method passing the autocenter option
    var oizImage = new IzImage(document.popupNode);
    oizImage.fit(nsIPrefBranchObj.getBoolPref("autocenter"), true);
    reportStatus(oizImage);
  }

  this.izZoomIn = function () {
    //Create the object and invoke its zoom method passing the factor to zoom
    var oizImage = new IzImage(document.popupNode);
    oizImage.zoom(nsIPrefBranchObj.getIntPref("zoomvalue") / 100);
    reportStatus(oizImage);
  };

  this.izZoomOut = function () {
    //Create the object and invoke its zoom method passing the factor to zoom
    var oizImage = new IzImage(document.popupNode);
    oizImage.zoom(100 / nsIPrefBranchObj.getIntPref("zoomvalue"));
    reportStatus(oizImage);
  };

  this.izSetZoom = function (zFactor) {
    //Create the object and invoke its setZoom method passing the factor to zoom
    var oizImage = new IzImage(document.popupNode);
    oizImage.setZoom(zFactor);
    reportStatus(oizImage);
  };

  this.izRotateRight = function () {
    var oizImage = new IzImage(document.popupNode);
    oizImage.rotate(90);
    izContentVariables().tmpIzImage = oizImage;
  };

  this.izRotateLeft = function () {
    var oizImage = new IzImage(document.popupNode);
    oizImage.rotate(-90);
    izContentVariables().tmpIzImage = oizImage;
  };

  this.izRotate180 = function () {
    var oizImage = new IzImage(document.popupNode);
    oizImage.rotate(180);
    izContentVariables().tmpIzImage = oizImage;
  };

  this.izRotateReset = function () {
    var oizImage = new IzImage(document.popupNode);
    oizImage.rotate(0 - oizImage.getAngle());
    izContentVariables().tmpIzImage = oizImage;
  };

  //Private Functions
  function getContextSubMenuLabel() {
    if (!contextSubMenuLabel) {
      contextSubMenuLabel = document.getElementById("context-zoomsub").getAttribute("label") + " (%zoom% %)";
    }

    return contextSubMenuLabel;
  }

  function getContextRotateMenuLabel() {
    if (!contextRotateMenuLabel) {
      contextRotateMenuLabel = document.getElementById("context-rotatesub").getAttribute("label") + " (%rotate%\u00B0)";
    }

    return contextRotateMenuLabel;
  }

  function gPanelContainer() {
    //return document.getElementById("content");
    return window;
  }
  
  function izContentVariables() {
    if (!content.document.guid1A2D0EC475F54c9189C43656F6E44B68) content.document.guid1A2D0EC475F54c9189C43656F6E44B68 = {};
    return content.document.guid1A2D0EC475F54c9189C43656F6E44B68;
  }

  function cancelScrollZoom() {
    izContentVariables().linuxImage = null;
    izContentVariables().currentImage = null;
    izContentVariables().scrollZooming = false;

    gPanelContainer().removeEventListener("wheel", scrollImage, true);
    gPanelContainer().removeEventListener("mouseup", izOnMouseUp, true);
  }

  function reportStatus(oizImage) {
    var statusTextFld;
    var tmpStatus;
    //write the zoom factor to the status bar
    if (nsIPrefBranchObj.getBoolPref("showStatus")) {
      if (document.documentElement.getAttribute("windowtype") == "mail:3pane") {
        statusTextFld = document.getElementById("statusText");
      } else {
        statusTextFld = document.getElementById("statusbar-display");
      }

      tmpStatus = "Image Zoom: " + oizImage.zoomFactor() + "% | " + imagezoomBundle.getString("widthLabel") + ": " + oizImage.getWidth() + "px | " + imagezoomBundle.getString("heightLabel") + ": " + oizImage.getHeight() + "px";
      tmpStatus = tmpStatus + " | " + imagezoomBundle.getString("rotateLabel") + ": " + oizImage.getAngle() + "\u00B0";
      statusTextFld.label = tmpStatus;
    }
  }

  function callBackStatus() {
    if (izContentVariables().tmpIzImage) {
      reportStatus(izContentVariables().tmpIzImage);
      izContentVariables().tmpIzImage = null;
    }
  }

  function disableContextMenu(event) {
    if (document.popupNode.tagName.toLowerCase() == "img" || document.popupNode.tagName.toLowerCase() == "canvas") {
      izContentVariables().linuxImage = document.popupNode;
      izContext = event.originalTarget;
      event.preventDefault();
      contextDisabled = true;
    }
    removeEventListener("popupshowing", disableContextMenu, true);
  }

  function izOnMouseDown(event) {

    var targetName = event.originalTarget.tagName.toLowerCase();
    if ((targetName == "img" || targetName == "canvas") && (izContentVariables().scrollZooming) && ((event.which == nsIPrefBranchObj.getIntPref("imageresetbutton")) || (event.which == nsIPrefBranchObj.getIntPref("imagefitbutton")) || (event.which == nsIPrefBranchObj.getIntPref("triggerbutton")))) {
      event.preventDefault();
      event.stopPropagation();
    }

    // prepare for the mouse functions on a right click when user option is true
    if ((event.which == nsIPrefBranchObj.getIntPref("triggerbutton")) && (nsIPrefBranchObj.getBoolPref("usescroll")) &&
       ((targetName == "img" || targetName == "canvas")) &&
       // Prevent zooming from being initiated when an embedded object is clicked apon
       !(targetName == "embed" || targetName == "object")) {

      if (navigator.platform !== "Win32" && navigator.platform !== "Win64" && navigator.platform !== "OS/2") {
        addEventListener("popupshowing", disableContextMenu, true);
      }
      izContentVariables().haveZoomed = false;
      gPanelContainer().addEventListener("wheel", handleWheelEvent, true);
      gPanelContainer().addEventListener("mouseup", izOnMouseUp, true);
      gPanelContainer().addEventListener("click", izOnMouseClick, true);

      izContentVariables().scrollZooming = true;
      izContentVariables().currentImage = event.originalTarget;
    }
  }

  function izOnMouseUp(event) {
    // Right mouse button release, remove listeners
    if (event.which == nsIPrefBranchObj.getIntPref("triggerbutton")) {
      if (izContentVariables().haveZoomed) {
        event.preventDefault();
      }
      cancelScrollZoom();
    }
  }

  function izOnMouseClick(event) {
    var oizImage;
    var targetName = event.originalTarget.tagName.toLowerCase();

    if (event.which == nsIPrefBranchObj.getIntPref("triggerbutton")) {
      if (izContentVariables().haveZoomed) {
        event.preventDefault();
        event.stopPropagation();
      }
      else {
        // contextmenu on mousedown
        if (contextDisabled) {
          document.popupNode = event.originalTarget;
          try {
            izContext.showPopup(null, event.screenX, event.screenY, "context", "bottomleft", "topleft");
          }
          catch (e) {
          }
        }
      }
      cancelScrollZoom();
      izContentVariables().haveZoomed = false;
      gPanelContainer().removeEventListener("click", izOnMouseClick, true);
    }

    contextDisabled = false;

    if (izContentVariables().scrollZooming) {
      // Invoke varios mouse function when mouse is over an image only
      if (targetName == "img" || targetName == "canvas") {
        switch (event.which) {
          // Middle mouse button pressed while right button down, reset image
          case nsIPrefBranchObj.getIntPref("imageresetbutton"):
            event.preventDefault();
            event.stopPropagation();
            izContentVariables().haveZoomed = true;
            oizImage = new IzImage(event.originalTarget);
            var rotateKeys = nsIPrefBranchObj.getIntPref("rotateKeys");
            if(rotateKeys && modifierKeys(event) == rotateKeys){ //alt+click: reset rotation
              oizImage.rotate(0 - oizImage.getAngle());
            } else {
              if (nsIPrefBranchObj.getBoolPref("toggleFitReset") && oizImage.zoomFactor() == 100) {
                oizImage.fit(nsIPrefBranchObj.getBoolPref("autocenter"));
              } else if(oizImage.zoomFactor() != 100) {
                oizImage.setZoom(100);
              } else if(targetName == "img") {
                var img = event.originalTarget;
                oizImage.setDimension(img.naturalWidth, img.naturalHeight);
              }
            }
            reportStatus(oizImage);
            break;
          // Left mouse button pressed while right button down, fit image to screen
          case nsIPrefBranchObj.getIntPref("imagefitbutton"):
            event.preventDefault();
            event.stopPropagation();
            izContentVariables().haveZoomed = true;
            oizImage = new IzImage(event.originalTarget);
            if (nsIPrefBranchObj.getBoolPref("toggleFitReset") && oizImage.isFitted()) {
              oizImage.setZoom(100);
            } else {
              oizImage.fit(nsIPrefBranchObj.getBoolPref("autocenter"));
            }
            reportStatus(oizImage);
            break;
        }
      } else {
        gPanelContainer().removeEventListener("click", izOnMouseClick, true);
      }
    }

  }

  function handleWheelEvent(event) {
    if ((izContentVariables().scrollZooming) && (izContentVariables().currentImage) && (nsIPrefBranchObj.getBoolPref("usescroll"))) {
      event.preventDefault();
      var scrollAmount;
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        scrollAmount = event.deltaY;
      }
      else {
        scrollAmount = event.deltaX
      }
      scrollImage(scrollAmount, event);
    }
  }

  function modifierKeys(event){
    return event.ctrlKey + event.altKey*2 + event.shiftKey*4;
  }

  function scrollImage(wheelIncrement, event) {
    var imageToScroll;

    imageToScroll = izContentVariables().currentImage;

    if (imageToScroll !== null) {
        izContentVariables().haveZoomed = true;
        var oizImage = new IzImage(imageToScroll);
        var rotateKeys = nsIPrefBranchObj.getIntPref("rotateKeys");
        if(rotateKeys && modifierKeys(event) == rotateKeys){ //alt+scroll: rotate image
          oizImage.rotate(nsIPrefBranchObj.getIntPref("rotateValue") * (wheelIncrement > 0 ? 1 : -1));
        } else{
          var zoomFactor;
          if (nsIPrefBranchObj.getIntPref("scrollmode") == 0) {
            if (((wheelIncrement < 0) && !nsIPrefBranchObj.getBoolPref("reversescrollzoom")) || ((wheelIncrement > 0) && nsIPrefBranchObj.getBoolPref("reversescrollzoom"))) {
              zoomFactor = 1 / (1 + (nsIPrefBranchObj.getIntPref("scrollvalue") / 100));
            }
            else {
              zoomFactor = 1 + (nsIPrefBranchObj.getIntPref("scrollvalue") / 100);
            }
            oizImage.zoom(zoomFactor);
          }
          else {
            if (((wheelIncrement < 0) && !nsIPrefBranchObj.getBoolPref("reversescrollzoom")) || ((wheelIncrement > 0) && nsIPrefBranchObj.getBoolPref("reversescrollzoom"))) {
              zoomFactor = oizImage.zoomFactor() - nsIPrefBranchObj.getIntPref("scrollvalue");
            }
            else {
              zoomFactor = oizImage.zoomFactor() + nsIPrefBranchObj.getIntPref("scrollvalue");
            }
            oizImage.setZoom(zoomFactor);
          }

          reportStatus(oizImage);
        }
    } else {
      cancelScrollZoom();
    }
  }

  function insertSeparator(list, position) {
    var beforeShow = false;
    var afterShow = false;
    var i;
    // Check for visable items before the separator
    for (i = position - 1; i >= 0; i--) {
      if ((list[i].tagName == "menuseparator") && (!list[i].hidden)) break;
      if ((list[i].tagName != "menuseparator") && (!list[i].hidden)) {
        beforeShow = true;
        break;
      }
    }

    // Check for visable items after the separator
    if (beforeShow) {
      for (i = position + 1; i < list.length; i++) {
        if ((list[i].tagName != "menuseparator") && (!list[i].hidden)) {
          afterShow = true;
          break;
        }
      }
    }

    // If there are visable items before and after the separator then return true
    return (beforeShow && afterShow);
  }

  function imageZoomMenu() {
    var menuItems, optionItems, i, oizImage;

    menuItems = new Array("context-zoom-zin", "context-zoom-zout", "context-zoom-zreset", "context-zoom-zcustom", "context-zoom-dcustom", "context-zoom-fit", "context-zoom-fitwidth", "context-zoom-rotate-right", "context-zoom-rotate-left", "context-zoom-rotate-180", "context-zoom-rotate-reset", "zoomsub-zin", "zoomsub-zout", "zoomsub-zreset", "rotatesub-rotate-right", "rotatesub-rotate-left", "rotatesub-rotate-180", "rotatesub-rotate-reset", "zoomsub-zcustom", "zoomsub-dcustom", "zoomsub-fit", "zoomsub-fitwidth", "zoomsub-z400", "zoomsub-z200", "zoomsub-z150", "zoomsub-z125", "zoomsub-z100", "zoomsub-z75", "zoomsub-z50", "zoomsub-z25", "zoomsub-z10");
    optionItems = new Array("mmZoomIO", "mmZoomIO", "mmReset", "mmCustomZoom", "mmCustomDim", "mmFitWindow", "mmFitWidth", "mmRotateRight", "mmRotateLeft", "mmRotate180", "mmRotateReset", "smZoomIO", "smZoomIO", "smReset", "smRotateRight", "smRotateLeft", "smRotate180", "smRotateReset", "smCustomZoom", "smCustomDim", "smFitWindow", "smFitWidth", "smZoomPcts", "smZoomPcts", "smZoomPcts", "smZoomPcts", "smZoomPcts", "smZoomPcts", "smZoomPcts", "smZoomPcts", "smZoomPcts");

    if (gContextMenu.onImage || gContextMenu.onCanvas) {
      oizImage = new IzImage(document.popupNode);
    }

    // Display the correct menu items depending on options and whether an image was clicked
    for (i = 0; i < menuItems.length; i++)
      document.getElementById(menuItems[i]).setAttribute("hidden", ((!gContextMenu.onImage && !gContextMenu.onCanvas) || !nsIPrefBranchObj.getBoolPref(optionItems[i])).toString());

    var subPopUp = document.getElementById("zoompopup");

    // Insert the necessary separators if needed in the sub menu
    var subItems = document.getElementById("zoompopup").getElementsByTagName("*");
    for (i = 0; i < subItems.length; i++) {
      if (subItems[i].tagName == "menuseparator") subItems[i].setAttribute("hidden", (!insertSeparator(subItems, i)).toString());
    }

    var izMenuItem;

    // Show the Zoom Image container if there are subitems visible, else hide
    if (subPopUp.getElementsByAttribute("hidden", false).length > 0) {
      izMenuItem = document.getElementById("context-zoomsub");
      izMenuItem.setAttribute("label", getContextSubMenuLabel().replace(/%zoom%/, oizImage.zoomFactor()));
      izMenuItem.setAttribute("hidden", "false");
    } else document.getElementById("context-zoomsub").hidden = true;

    var rotatePopUp = document.getElementById("rotatepopup");

    // Show the Zoom Image container if there are subitems visible, else hide
    if (rotatePopUp.getElementsByAttribute("hidden", false).length > 0) {
      izMenuItem = document.getElementById("context-rotatesub");
      izMenuItem.setAttribute("label", getContextRotateMenuLabel().replace(/%rotate%/, +oizImage.getAngle()));
      izMenuItem.setAttribute("hidden", "false");
    } else document.getElementById("context-rotatesub").hidden = true;
  }

  function IzImage(oImage) {
    var pImage = oImage;
    var enabled = false;

    if ((pImage.naturalWidth !== 0) || (pImage.naturalHeight !== 0) || (pImage.style.width !== "") || (pImage.style.height !== "") || ((pImage.getAttribute("width")) && (pImage.getAttribute("height")))) {

      // If this value is set in the image object, we have zoomed this image before
      if (!(pImage.originalPxWidth) || (!pImage.style.width && !pImage.style.height)) {
        // Original Width of the image in pixels; Used for calculating zoom factor
        pImage.originalPxWidth = pImage.width;
        pImage.originalPxHeight = pImage.height;

        if (!pImage.style.width && !pImage.style.height) {
          // No style set for image, need to remember original dimensions
          pImage.originalWidth = pImage.width;
          pImage.originalWidthUnit = "px";
          pImage.originalHeight = pImage.height;
          pImage.originalHeightUnit = "px";
          pImage.style.width = pImage.originalWidth + pImage.originalWidthUnit;
          pImage.style.height = pImage.originalHeight + pImage.originalHeightUnit;
        } else {
          if (pImage.style.width) {
            // Remember the original width settings
            pImage.originalWidth = getDimInt(pImage.style.width);
            pImage.originalWidthUnit = getDimUnit(pImage.style.width);
            pImage.style.width = pImage.originalWidth + pImage.originalWidthUnit;
          }

          if (pImage.style.height) {
            // Remember the original height settings
            pImage.originalHeight = getDimInt(pImage.style.height);
            pImage.originalHeightUnit = getDimUnit(pImage.style.height);
            pImage.style.height = pImage.originalHeight + pImage.originalHeightUnit;
          }
        }
        pImage.zoomFactor = 100;
        pImage.autoFitBefore = 0;
        pImage.angle = 0;
      }

      enabled = true;
    }

    this.getWidth = getWidth;
    this.getAngle = getAngle;
    this.getHeight = getHeight;
    this.setZoom = setZoom;
    this.setDimension = setDimension;
    this.zoom = zoom;
    this.fit = fit;
    this.rotate = rotate;
    this.zoomFactor = zoomFactor;
    this.isFitted = isFitted;

    // Returns the pixel width of the image
    function getWidth() {
      return pImage.width;
    }

    // Returns the pixel height of the image
    function getHeight() {
      return pImage.height;
    }

    // Returns the current rotatation angle of the image
    function getAngle() {
      return pImage.angle;
    }

    // Zoom to a factor of the original image size
    function setZoom(factor) {
      // factors less than zero are invalid
      if ((factor > 0) && (enabled)) {
        pImage.zoomFactor = factor;
        pImage.autoFitBefore = 0;
        pZoomAbs();
      }
    }

    // Set the dimension of the image
    function setDimension(width, height) {
      if (enabled) {
        pImage.style.width = width + "px";
        pImage.style.height = height + "px";
        pImage.zoomFactor = (pImage.width / pImage.originalPxWidth) * 100;
      }
    }

    // Zoom to a factor of the current image size
    function zoom(factor) {
      if (enabled) {

        pImage.zoomFactor = pImage.zoomFactor * factor;
        pImage.autoFitBefore = 0;
        // Zoom the width style if it exists
        if (pImage.style.width) {
          var origWidth = getDimInt(pImage.style.width);
          pImage.style.width = (origWidth * factor) + getDimUnit(pImage.style.width);
        }

        // Zoom the height style if it exists
        if (pImage.style.height) {
          var origHeight = getDimInt(pImage.style.height);
          pImage.style.height = (origHeight * factor) + getDimUnit(pImage.style.height);

        }
      }
    }

    // Rotate the image by a number of degrees
    function rotate(degrees) {
      if(new Date().getTime() - rotateTime < 200) return;
      rotateTime = new Date().getTime();

      if (!pImage.originalData) {
        pImage.originalData = {
          src: pImage.tagName.toLowerCase() === "canvas" ? pImage.getDataUrl() : pImage.src,
          naturalWidth: pImage.naturalWidth,
          naturalHeight: pImage.naturalHeight,
          originalPxWidth: pImage.originalPxWidth,
          originalPxHeight: pImage.originalPxHeight,
          originalWidth: pImage.originalWidth,
          originalHeight: pImage.originalHeight
        };
      }
      var origData = pImage.originalData;

      if (degrees < 0) {
        degrees = (pImage.angle + 360 + (degrees % 360)) % 360;
      }
      else {
        degrees = (pImage.angle + degrees) % 360;
      }

      var theta;
      if (degrees >= 0) {
        theta = (Math.PI * degrees) / 180;
      }
      else {
        theta = (Math.PI * (360 + degrees)) / 180;
      }
      var costheta = Math.abs(Math.cos(theta));
      var sintheta = Math.abs(Math.sin(theta));

      var canvas = pImage.ownerDocument.createElement("canvas");

      // Set the new width of the image
      canvas.width = costheta * origData.naturalWidth + sintheta * origData.naturalHeight;

      // Set the new height of the image
      canvas.height = costheta * origData.naturalHeight + sintheta * origData.naturalWidth;

      canvas.oImage = new Image();
      canvas.oImage.src = origData.src;

      canvas.oImage.onload = function () {

        var ctx = canvas.getContext("2d");
        ctx.save();

        if (theta <= Math.PI / 2) {
          ctx.translate(Math.sin(theta) * canvas.oImage.naturalHeight, 0);
        }
        else if (theta <= Math.PI) {
          ctx.translate(canvas.width, -Math.cos(theta) * canvas.oImage.naturalHeight);
        }
        else if (theta <= 1.5 * Math.PI) {
          ctx.translate(-Math.cos(theta) * canvas.oImage.naturalWidth, canvas.height);
        }
        else {
          ctx.translate(0, -Math.sin(theta) * canvas.oImage.naturalWidth);
        }

        pImage.originalPxWidth = costheta * origData.originalPxWidth + sintheta * origData.originalPxHeight;
        pImage.originalPxHeight = costheta * origData.originalPxHeight + sintheta * origData.originalPxWidth;
        pImage.originalWidth = costheta * origData.originalWidth + sintheta * origData.originalHeight;
        pImage.originalHeight = costheta * origData.originalHeight + sintheta * origData.originalWidth;

        var t0 = Math.PI * pImage.angle / 180;
        var natWidthT0 = Math.abs(Math.cos(t0)) * origData.naturalWidth + Math.abs(Math.sin(t0)) * origData.naturalHeight;
        var natHeightT0 = Math.abs(Math.cos(t0)) * origData.naturalHeight + Math.abs(Math.sin(t0)) * origData.naturalWidth;

        pImage.style.width = (getDimInt(pImage.style.width) * canvas.width / natWidthT0) + getDimUnit(pImage.style.width);
        pImage.style.height = (getDimInt(pImage.style.height) * canvas.height / natHeightT0) + getDimUnit(pImage.style.height);

        pImage.angle = degrees;

        ctx.rotate(theta);
        ctx.clearRect(0, 0, canvas.oImage.naturalWidth, canvas.oImage.naturalHeight);
        ctx.drawImage(canvas.oImage, 0, 0, canvas.oImage.naturalWidth, canvas.oImage.naturalHeight);
        ctx.restore();

        pImage.src = canvas.toDataURL();

        callBackStatus();
      };
    }

    function isFitted() {
      var imageDiff;
      var bScreen = new BrowserScreen(pImage);

      // First calculate the size of the client area of the browser depending on mode
      var screenHeight = bScreen.getHeight();
      var screenWidth = bScreen.getWidth();

      // work out the screen ratio and the image ratio
      var screenDim = screenWidth / screenHeight;
      var imageDim = pImage.width / pImage.height;

      if (screenDim < imageDim) {
        imageDiff = Math.abs(screenWidth - pImage.width);
      } else {
        imageDiff = Math.abs(screenHeight - pImage.height);
      }
      // First calculate the size of the client area of the browser depending on mode
      return imageDiff < 50;
    }

    function fit(autoScroll, widthOnly) {
      if (enabled) {

        var bScreen = new BrowserScreen(pImage);

        // First calculate the size of the client area of the browser depending on mode
        var screenHeight = bScreen.getHeight();
        var screenWidth = bScreen.getWidth();

        // work out the screen ratio and the image ratio
        var screenDim = screenWidth / screenHeight;
        var imageDim = pImage.width / pImage.height;

        // How we zoom depends on the ratio of the image to the screen
        if (screenDim < imageDim || widthOnly) {
          setDimension(screenWidth, parseInt(screenWidth / imageDim + 0.5, 10));
        }
        else {
          setDimension(parseInt(screenHeight * imageDim + 0.5, 10), screenHeight);
        }

        // In case scrollbars have been introduced, do the image fit again
        screenHeight = bScreen.getHeight();
        screenWidth = bScreen.getWidth();

        if (screenDim < imageDim || widthOnly) {
          setDimension(screenWidth, parseInt(screenWidth / imageDim + 0.5,10));
        }
        else {
          setDimension(parseInt(screenHeight * imageDim + 0.5,10), screenHeight);
        }

        // Scroll the browser screen to put the image in the center if requested
        if (autoScroll) {
          var iTop = 0;
          var iLeft = 0;
          var cNode = pImage;

          // Get the distances of the image object from the browser edges
          while (cNode.tagName.toUpperCase() !== 'BODY') {
            iLeft += cNode.offsetLeft;
            iTop += cNode.offsetTop;
            cNode = cNode.offsetParent;
          }

          // Now scroll the browser
          if (screenDim < imageDim || widthOnly) {
            pImage.ownerDocument.defaultView.scroll(iLeft - (bScreen.getPad()), iTop - ((screenHeight - getDimInt(pImage.style.height)) / 2) - (bScreen.getPad()));
          } else {
            pImage.ownerDocument.defaultView.scroll(iLeft - ((screenWidth - getDimInt(pImage.style.width)) / 2) - (bScreen.getPad()), iTop - (bScreen.getPad()));
          }
        }
      }
    }

    function zoomFactor() {
      return parseInt(parseInt(pImage.zoomFactor,10) + 0.5,10);
    }

    function pZoomAbs() {
      // only set the width style if it was originally set
      if (pImage.originalWidth) {
        pImage.style.width = (pImage.originalWidth * (pImage.zoomFactor / 100)) + pImage.originalWidthUnit;
      } else {
        pImage.style.width = "";
      }
      // only set the height style if it was originally set
      if (pImage.originalHeight) {
        pImage.style.height = (pImage.originalHeight * (pImage.zoomFactor / 100)) + pImage.originalHeightUnit;
      } else {
        pImage.style.height = "";
      }
    }

    // PRIVATE UTILITY FUNCTIONS
    // Gets the dimension unit from the style property passed as the sText variable


    function getDimUnit(sText) {
      var ValidChars = "0123456789.";
      var returnChar = "";
      var Char;

      for (var i = 0; i < sText.length; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) === -1) {
          returnChar += Char;
        }
      }
      return returnChar;
    }

    // Gets the dimension Value from the style property passed as the sText variable


    function getDimInt(sText) {
      var ValidChars = "0123456789.";
      var returnChar = "";
      var Char;

      for (var i = 0; i < sText.length; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) >= 0) {
          returnChar += Char;
        }
      }
      return returnChar;
    }
  }

  // BrowserScreen object definition
  function BrowserScreen(pImage) {
    var padValue = 17;
    var screenWidth;

    this.getWidth = function() {
      if (pImage.ownerDocument.compatMode == "BackCompat") {
        screenWidth = pImage.ownerDocument.body.clientWidth - padValue;
      } else {
        screenWidth = pImage.ownerDocument.documentElement.clientWidth - padValue;
      }

      return screenWidth;
    };

    this.getHeight = function() {
      var screenHeight;
      if (pImage.ownerDocument.compatMode == "BackCompat") {
        screenHeight = pImage.ownerDocument.body.clientHeight - padValue;
      } else {
        screenHeight = pImage.ownerDocument.documentElement.clientHeight - padValue;
      }

      return screenHeight;
    };

    this.getPad = function() {
      return padValue / 2;
    };

  }

}