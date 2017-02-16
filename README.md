#Apps on d!nk platform

Users can upload javascript applications, as zip files, on the d!nk admin platform.
On IOS, Windows and Android the d!nk applications will then download this javascript and
display it in a webview.

Our application does not impose any framework or architecture.

##Apps without d!nk integration

Any collection of html, javascript and css files can be uploaded as a zip.
The only requirement is an index.html file.
If your javascript application works smoothly without a server it should also
work within our d!nk apps.

Gotchas :
* When uploading a zip in the d!nk admin please make sure the index.html file is in the root directory of the zip archive

##Apps with d!nk integration

If your app needs to generate stats or access native functionality you'll have to
do a little more work. We provide a DKPlugin API that offers methods to communicate with
the underlying platform.

This can be set up in a few steps:

1. include an app_dink.js script in your index.html, this app_dink.js file should be empty and will be overwritten by our system when used in the d!nk application
2. make sure the include an empty script called phonegap.js, this file will also be overwritten by our system when used in the d!nk application
3. on IOS you'll need to wait for the deviceready event in order to use the DKPlugin API

An example of such an app is provided in : [app_with_dink_integration](/app_with_dink_integration/index.html)

Gotchas :
* When uploading a zip in the d!nk admin please make sure the index.html file is in the root directory of the zip archive
* Do not include the Phonegap/Cordova library yourself because this will conflict with the platform code, and result in errors

##DKPlugin API

All info about the DKPlugin API can be found at : TODO
