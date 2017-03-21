app.controller('publicationListCtrl', ['$scope', 'publicationService', 'accountHubService', 'accountHubResultService', 'errorService', function ($scope, publicationService, accountHubService, accountHubResultService, errorService) {

    $scope.viewKioskPublications = function (kiosk) {

        var successPublications = function (publications) {

            console.log(publications);
            var pubs = publications.pubs
                .filter(function (item) {
                    return item.t == 'pdf';
                })
                .map(function (publication) {
                    return {
                        key: publication.r,
                        name: publication.n,
                        type: publication.t,
                        editionKey: publication.ce,
                        downloadUrl: publication.durl,
                        coverUrl: publication.curl + '&r=' + Math.round(Math.random() * 999999),
                        isEncrypted: publication.isEncrypted
                    };
                });

            $scope.selectedKiosk.publications = pubs;
        };

        var failure = function (e) {
            toastr.error('Error!');
            if (e) {
                errorService.showModal({}, {}, e);
            }
        };

        kiosk.publications = null;
        $scope.selectedKiosk = kiosk;

        publicationService.getKioskPublications(kiosk.key)
            .then(successPublications, failure);
    };

    $scope.openPublication = function (publication) {

        // To open publication in kiosk, use DKPlugin.openPublication(obj);
        // obj properties:
        // publicationKey - key of publication
        // publicationName - name of publication (use publicationKey or publicationName or both)
        // successCallback - a callback function that gets called if everything went well
        // failureCallback - a callback function that gets called if there's an error
        // callbackIdentifier (optional) : a string that gets passed to the callback to allow for differentiating between callbacks

        // If failure the response will be:
        //    {"message":"<a_error_message>","result":false, "error":"<the_error>", "cbId":"<the_callback_identifier>"}
        // The cbId property will only be present if a callbackIdentifier was provided.

        var obj = {
            publicationKey: publication.key, // use publicationKey or publicationName or both
            publicationName: publication.name,
            successCallback: function (result) {
                console.log("ok");
            },
            failureCallback: function (e) {
                toastr.error('Error!');
                if (e) {
                    e = angular.fromJson(e);
                    var errors = {
                        'message': e.message,
                        'code': e.code
                    }
                    errorService.showModal({}, {}, errors);
                }
            }
        };

        DKPlugin.openPublication(obj);
    };

    $scope.addToAccountHubBasket = function (publication) {

        // To add publication in Account Hub basket in the dInk app, use DKPlugin.addPdfToMicroSite(obj);
        // obj properties:
        // publicationKey - key of publication
        // successCallback - a callback function that gets called if everything went well
        // failureCallback - a callback function that gets called if there's an error
        // callbackIdentifier (optional) : a string that gets passed to the callback to allow for differentiating between callbacks

        // If failure the response will be:
        //    {"message":"<a_error_message>","result":false, "error":"<the_error>", "cbId":"<the_callback_identifier>"}
        // The cbId property will only be present if a callbackIdentifier was provided.

        var obj = {
            publicationKey: publication.key,
            successCallback: function (result) {
                toastr.success('Added to basket')
                console.log("ok");
            },
            failureCallback: function (e) {
                toastr.error('Error!');
                if (e) {
                    e = angular.fromJson(e);
                    var errors = {
                        'message': e.message,
                        'code': e.code
                    }
                    errorService.showModal({}, {}, errors);
                }
            }
        };

        DKPlugin.addPdfToMicroSite(obj);
    };

    $scope.viewInApp = function (publication) {
        
        // To open pdf publication in browser in the dInk app, use DKPlugin.openBrowser(obj);
        // obj properties:
        // url - url of the pdf document
        // successCallback - a callback function that gets called if everything went well
        // failureCallback - a callback function that gets called if there's an error
        // callbackIdentifier (optional) : a string that gets passed to the callback to allow for differentiating between callbacks

        // If failure the response will be:
        //    {"message":"<a_error_message>","result":false, "error":"<the_error>", "cbId":"<the_callback_identifier>"}
        // The cbId property will only be present if a callbackIdentifier was provided.

        var viewPublication = function (downloadUrl) {
            var obj = {
                url: publication.downloadUrl,
                successCallback: function (result) {
                    console.log("ok");
                },
                failureCallback: function (e) {
                    toastr.error('Error!');
                    if (e) {
                        e = angular.fromJson(e);
                        var errors = {
                            'message': e.message,
                            'code': e.code
                        }
                        errorService.showModal({}, {}, errors);
                    }
                }
            };

            DKPlugin.openBrowser(obj);
        };

        var success = function (result) {
            if (result.url) {
                viewPublication(result.url);
            }
        };

        var failure = function (e) {
            toastr.error('Error!');
            if (e) {
                errorService.showModal({}, {}, e);
            }
        };

        if (publication.isEncrypted == true) {
            publicationService.getSignedUrlForEdition(publication.editionKey)
                .then(success, failure);
        } else {
            viewPublication(publication.downloadUrl);
        }
    };

    $scope.downloadPublication = function (publication) {

        var download = function (downloadUrl) {
            window.open(downloadUrl, '_blank');
        };

        var success = function (result) {
            if (result.url) {
                download(result.url);
            }
        };

        var failure = function (e) {
            toastr.error('Error!');
            if (e) {
                errorService.showModal({}, {}, e);
            }
        };

        if (publication.isEncrypted == true) {
            publicationService.getSignedUrlForEdition(publication.editionKey)
                .then(success, failure);
        } else {
            download(publication.downloadUrl);
        }
    };

    $scope.sharePublication = function (publication) {

        var success = function (result) {
            
            var successCreateAccountHub = function (result) {
                accountHubResultService.showModal({}, {}, result);
            };

            var failure = function (e) {
                toastr.error('Error!');
                if (e) {
                    errorService.showModal({}, {}, e);
                }
            };

            var data = {
                name: result.name,
                email: result.email,
                message: result.message,
                editions: [publication.editionKey]
            };

            publicationService.createAccountHub(data)
                .then(successCreateAccountHub, failure)
        };

        var cancel = function () { };

        accountHubService.showModal({}, {}, publication)
            .then(success, cancel);
    };

    var _init = function () {

        $scope.selectedKiosk = null;

        var successKiosks = function (kiosks) {
            $scope.kiosks = kiosks.kiosks.map(function (kiosk) {
                return {
                    key: kiosk.r,
                    name: kiosk.n,
                    googleDrive: (kiosk.gid && kiosk.gid.length > 0) ? 'https://drive.google.com/#folders/' + kiosk.gid : null
                };
            });
        };

        var failure = function (e) {
            toastr.error('Error!');
            if (e) {
                errorService.showModal({}, {}, e);
            }
        };

        publicationService.getAllKiosks()
            .then(successKiosks, failure);
    };

    _init();
}]);