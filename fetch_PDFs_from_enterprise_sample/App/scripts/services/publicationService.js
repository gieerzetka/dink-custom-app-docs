app.service('publicationService', ['apiService', function (apiService) {

    var urls = {
        getAllKiosks: '2013q3/listKiosks',
        getKioskPublications: '2013q3/getKioskPublications?k=',
        getSignedUrlForEdition: '2015q4/getSignedS3UrlForEdition?k=',
        createAccountHub: '2015q4/createMicrosite'
    }

    this.getAllKiosks = function () {

        // To get list of kiosks, use GET API call:
        // https://admin.dink.eu/2013q3/listKiosks
        // The call has to have BASIC authentication header present, and credentials must be of the dink user
        // From publications, use DKPlugin.getCredentials(credentialsSuccess, credentialsFailure); call to get user credentials from the app (see example in index.html)
        // Response - list of kiosk in JSON format with "interesting" properties:
        // r: kiosk key
        // n: name of kiosk
        // gid: id of the google drive folder, to access it use 'https://drive.google.com/#folders/' + kiosk.gid

        return apiService.get(urls.getAllKiosks);
    };

    this.getKioskPublications = function (id) {

        // To get list of publications in kiosk, use GET API call:
        // https://admin.dink.eu/2013q3/getKioskPublications?k=KIOSK_KEY
        // The call has to have BASIC authentication header present, and credentials must be of the dink user
        // Response - list of publications in JSON format with "interesting" properties:
        // r: publication key
        // n: name of publication
        // t: type of publication, e.g. pdf
        // ce: edition key (active publication version)
        // durl: url of the publication
        // curl: url of the publications cover image
        // isEncrypted: flag indicating that publication is encrypted. If yes, use '2015q4/getSignedS3UrlForEdition?k=' method to get signed url

        return apiService.get(urls.getKioskPublications + id);
    };

    this.getSignedUrlForEdition = function (id) {

        // To get signed url of encrypted publications, use GET API call:
        // https://admin.dink.eu/2013q3/2015q4/getSignedS3UrlForEdition?k=PUBLICATION_KEY
        // The call has to have BASIC authentication header present, and credentials must be of the dink user
        // Response - signed url in JSON format with "interesting" properties:
        // url: signed download url of the publication

        return apiService.get(urls.getSignedUrlForEdition + id);
    };

    this.createAccountHub = function (data) {

        // To share publication(s) to the Account Hub, use POST API call:
        // https://admin.dink.eu/2015q4/createMicrosite
        // The call has to have BASIC authentication header present, and credentials must be of the dink user
        // Data to send:
        // var data = {
        //    name: name of customer,
        //    email: email of customer,
        //    message: message to customer,
        //    editions: list of publication edition key(s) ('ce' property in getKioskPublications)
        // };
        // Response - signed url in JSON format with "interesting" properties:
        // microsites: list of created Account Hubs objects with 'url' properties

        return apiService.post(urls.createAccountHub, data);
    };
}]);