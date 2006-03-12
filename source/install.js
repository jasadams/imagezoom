//$Id: install.js,v 1.10 2004/06/16 22:47:23 jaap Exp $

const APP_DISPLAY_NAME = "Image Zoom";
const APP_NAME = "imagezoom";
const APP_PACKAGE = "imagezoom";
const APP_VERSION = "0.1.4";

const APP_JAR_FILE = APP_NAME+".jar";
initInstall(APP_NAME, APP_PACKAGE, APP_VERSION);

var chromef = getFolder("Profile", "chrome");

var err = addFile(APP_PACKAGE, APP_VERSION, 'chrome/'+APP_JAR_FILE, chromef, null)
if(err == SUCCESS) {
	var jar = getFolder(chromef, APP_JAR_FILE);
	registerChrome(CONTENT | PROFILE_CHROME, jar, 'content/');
	registerChrome(LOCALE | PROFILE_CHROME, jar, 'locale/en-US/');

	err = performInstall();
	if(err == SUCCESS || err == 999) {
		alert(APP_NAME + " " + APP_VERSION + " has been succesfully installed.\n"
			+"Please restart your browser before continuing.");
	} else {
		alert("Install failed. Error code:" + err);
		cancelInstall(err);
	}
} else {
	alert("Failed to create " +APP_JAR_FILE +"\n"
		+"You probably don't have appropriate permissions \n"
		+"(write access to mozilla/chrome directory). \n"
		+"_____________________________\nError code:" + err);
	cancelInstall(err);
}
