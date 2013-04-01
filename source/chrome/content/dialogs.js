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

var gDimRatio = 0.0;
var gDimWidth;
var gDimHeight;
var gDimAspect;

// returns true if it was a numeric key press and false if it was not
function validateKeyPress(e) {
  switch (parseInt(e.which,10)) {
    case 0:
      //misc
      return true;
    case 8:
      //backspace
      return true;
    case 46:
      // Delete
      return true;
    default:
      var key = String.fromCharCode(parseInt(e.which, 10));
      return pIsNumeric(key);
  }
}

// Checks whether sText is an integer


function pIsNumeric(sText) {
  var ValidChars = "0123456789";
  var IsNumber = true;
  var Char;

  for (var i = 0; i < sText.length && IsNumber === true; i++) {
    Char = sText.charAt(i);
    if (ValidChars.indexOf(Char) == -1) {
      IsNumber = false;
    }
  }
  return IsNumber;
}

function widthInput() {
  if (gDimAspect.checked) {
    if (pIsNumeric(gDimWidth.value) && (gDimWidth.value !== "")) {
      gDimHeight.value = parseInt((parseInt(gDimWidth.value,10) / gDimRatio) + 0.5, 10);
    } else {
      gDimHeight.value = "";
    }
  }
}

function heightInput() {
  if (gDimAspect.checked) {
    if (pIsNumeric(gDimHeight.value) && gDimHeight.value !== "") {
      gDimWidth.value = parseInt((parseInt(gDimHeight.value,10) * gDimRatio) + 0.5,10);
    } else {
      gDimWidth.value = "";
    }
  }
}

function checkInput() {
  if (!gDimAspect.checked) {
    if (pIsNumeric(gDimWidth.value) && gDimWidth.value !== "") {
      gDimHeight.value = parseInt((parseInt(gDimWidth.value,10) / gDimRatio) + 0.5,10);
    } else {
      gDimHeight.value = "";
    }
  }
}

function imagezoom_customZoom() {
  var zoomValue = document.getElementById("customZoom").value;
  if (pIsNumeric(zoomValue)) {
    var izoImage = window.arguments[1];
    izoImage.setZoom(zoomValue);
  }
}

function imagezoom_loadCustomZoom() {
  var zoomValueBox = document.getElementById("customZoom");
  var izoImage = window.arguments[1];
  zoomValueBox.value = izoImage.zoomFactor();
}

function imagezoom_customDim() {
  var dimWidth = document.getElementById("dimWidth").value;
  var dimHeight = document.getElementById("dimHeight").value;
  if (pIsNumeric(dimWidth) && pIsNumeric(dimHeight)) {
    var izoImage = window.arguments[0];
    izoImage.setDimension(dimWidth, dimHeight);
  }
}

function imagezoom_loadCustomDim() {
  gDimWidth = document.getElementById("dimWidth");
  gDimHeight = document.getElementById("dimHeight");
  gDimAspect = document.getElementById("dimAspect");
  var izoImage = window.arguments[0];
  gDimWidth.value = izoImage.getWidth();
  gDimHeight.value = izoImage.getHeight();
  gDimRatio = izoImage.getWidth() / izoImage.getHeight();
  gDimAspect.checked = true;
}