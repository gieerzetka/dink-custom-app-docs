app.service('errorService', ['$uibModal', function ($uibModal) {

    var modalDefaults = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: 'html/layout/error.html'
    };

    var modalOptions = {
        actionButtonText: 'OK',
        headerText: 'Errors',
        bodyText: 'Following error(s) ocurred:'
    };

    this.showModal = function (customModalDefaults, customModalOptions, errors) {
        if (!customModalDefaults) customModalDefaults = {};
        customModalDefaults.backdrop = 'static';
        return this.show(customModalDefaults, customModalOptions, errors);
    };

    this.show = function (customModalDefaults, customModalOptions, errors) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $uibModalInstance, errors) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function (result) {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.errors = errors;
            };
        }

        tempModalDefaults.resolve = {
            errors: function () {
                return errors;
            }
        };

        return $uibModal.open(tempModalDefaults).result;
    };

}]);