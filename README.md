# Apps on d!nk platform

Users can upload javascript applications, as zip files, on the d!nk admin platform.
On IOS, Windows and Android the d!nk applications will then download this javascript and
display it in a webview.

Our application does not impose any framework or architecture.

## Apps without d!nk integration

Any collection of html, javascript and css files can be uploaded as a zip.
The only requirement is an index.html file.
If your javascript application works smoothly without a server it should also
work within our d!nk apps.

Gotchas :
* when uploading a zip in the d!nk admin please make sure the index.html file is in the root directory of the zip archive

## Apps with d!nk integration

If your app needs to generate stats or access native functionality you'll have to
do a little more work. We provide a DKPlugin API that offers methods to communicate with
the underlying platform.

This can be set up in a few steps:

1. include an app_dink.js script in your index.html, this app_dink.js file should be empty and will be overwritten by our system when used in the d!nk application
2. make sure the include an empty script called phonegap.js, this file will also be overwritten by our system when used in the d!nk application
3. on IOS you'll need to wait for the deviceready event in order to use the DKPlugin API

An example of such an app is provided in : [app_with_dink_integration](/app_with_dink_integration/index.html)

Gotchas :
* when uploading a zip in the d!nk admin please make sure the index.html file is in the root directory of the zip archive
* do not include the Phonegap/Cordova library yourself because this will conflict with the platform code, and result in errors

## DKPlugin API

All info about the DKPlugin javascript API can be found at : https://dhemedia.github.io/dink-dkplugin-api/interfaces/dk.dkplugin.html

For tests outside the d!nk application environment you can write a mock object that implements
the DKPlugin interface methods that are relevant to your application.

## Sample app with d!nk integration

An example of the app provided in [fetch_PDFs_from_enterprise_sample](/fetch_PDFs_from_enterprise_sample/README.md) shows how to:
* connect to the d!nk API's to fetch kiosks and (pdf) publications
* open pdf publication in kiosk
* add pdf publication to the Account Hub basket
* open pdf publication in the d!nk app
* download pdf publication (view in browser)
* share pdf publication directly to the Account Hub
* open Google Drive of the kiosk

### Some extra info about stats
Although the API docs should provide a clear picture it's not always easy for 3rd parties to
get the stats registered properly. That's why an example of an Angular service for registering
stats is provided in [statservice.js] (/snippets/statservice.js)
It illustrates the basic logic and should get you on your way.


## Angular application - connect to Document Generator

In order to use Document generator template with angular applications you need to upload zip file in d!nk admin.
Once you have your publication you can select your publication and click on **Document generator** icon.
Next you will need to add form fields.
You have 2 options:
* manually enter data
* upload JSON

If you have JSON ready you can click on "UPLOAD JSON" button. You can than input valid JSON (you can check your JSON with "check and show JSON" button).
Example of valid JSON:

    {
        "OpenQuestion": {
            "label": "OpenQuestion",
            "values": [],
            "name": "OpenQuestion",
            "type": "text"
        },
        "slider": {
            "values": [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10"
            ],
            "type": "slider",
            "name": "slider",
            "label": "slider"
        },
        "multipleChoice": {
            "label": "multiple choice",
            "values": [
                "mcoption1",
                "mcoption2",
                "mcoption3",
                "mcoption4"
            ],
            "name": "multipleChoice",
            "type": "checkbox"
        },
        "hotzone": {
            "values": [
                "hotzoneoption1",
                "hotzoneoption2",
                "hotzoneoption3",
                "hotzoneoption4",
                "hotzoneoption5"
            ],
            "name": "hotzone",
            "type": "graphicSelect",
            "label": "hotzone"
        },
        "survey_CalculateResult": {
            "text_values": [],
            "label": "CalculateResult",
            "values": [],
            "name": "CalculateResult",
            "type": "calculatedResult"
        }
    }

where "type" is one of:

    VALID_FORM_TYPES = [
        'select',
        'list',
        'table',
        'radio',
        'input',
        'number',
        'calculatedResult',
        'text',
        'checkbox',
        'slider',
        'graphicSelect',
        'textarea',
        'date',
        'image'
    ]

If type is one of:
    
    'input', 'number', 'calculatedResult', 'text', 'date', 'textarea', 'image'
    
"values" can not be empty.   

**It is important to notice that Key for each dict in JSON is same as Key that will be sent in event payload after submit is cliked in the app.**
*name* must be same as key of dict item.


Events for **latest active edition only** are considered in creating PDF.

For registering an event you can use this code:
    
    var payload = { test : "some_value"};
    var payloadJson = JSON.stringify(payload);
    var eventString = 'NAME_OF_EVENT';
    var storyId = 1;
    DKPlugin.recordAnalyticEvent(storyId,eventString,payloadJson,successCallbackFn,failureCallbackFn);

The storyId has to be an integer. But since Angular apps are not using stories I suggest you use 1 for the first view, 2 for the second view in your app etc.

You can retrieve information about the current customer by calling *DKPlugin.getCurrentSession*.

Here's an example:

    var obj = {
     successCallback : function(result){ 
       var s = angular.fromJson(result);  
       if(s.hasOwnProperty('customer')){
         console.log(s.customer.name);
       }
     },
     failureCallback : function(result){ console.log("not ok"); },
     callbackIdentifier : 'your_callback_identifier'
    };
    DKPlugin.getCurrentSession(obj);
