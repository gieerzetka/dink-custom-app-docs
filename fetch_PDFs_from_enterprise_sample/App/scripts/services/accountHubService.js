app.service('accountHubService', ['$uibModal', function ($uibModal) {

    var modalDefaults = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: 'html/layout/shareToAccountHub.html'
    };

    var modalOptions = {
        actionButtonText: 'Share',
        cancelButtonText: 'Cancel',
        headerText: 'Share to Account Hub',
        bodyText: 'Share document: '
    };

    this.showModal = function (customModalDefaults, customModalOptions, publication) {
        if (!customModalDefaults) customModalDefaults = {};
        customModalDefaults.backdrop = 'static';
        return this.show(customModalDefaults, customModalOptions, publication);
    };

    this.show = function (customModalDefaults, customModalOptions, publication) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $uibModalInstance, publication) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function () {
                    if ($scope.item.email) {
                        $uibModalInstance.close($scope.item);
                    }
                };
                $scope.modalOptions.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.item = { name: '', email: '', message: '' };
                $scope.publication = publication;
            };
        }

        tempModalDefaults.resolve = {
            publication: function () {
                return publication;
            }
        };

        return $uibModal.open(tempModalDefaults).result;
    };

}]);