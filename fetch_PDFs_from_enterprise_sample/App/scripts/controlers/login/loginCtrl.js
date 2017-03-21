app.controller('loginCtrl', ['$scope', '$location', '$window', '$timeout', 'Base64', 'Session', 'publicationService', 'errorService', function ($scope, $location, $window, $timeout, Base64, Session, publicationService, errorService) {

    $scope.loginUser = function () {

        var authdata = Base64.encode($scope.username.toLowerCase() + ':' + $scope.password);
        Session.setAuthData(authdata);
        $location.path('/publicationList');
    };

    var tryAutoLogin = function () {

        if (!!(Session.getAutoLoginAttempt()) === true) {

            var userName = $window.G.userEmail;
            var password = $window.G.pwd;

            if (userName && userName.length > 0 && password && password.length > 0) {
                var authdata = Base64.encode(userName.toLowerCase() + ':' + password);
                Session.setAuthData(authdata);
                Session.setAutoLoginAttempt();
                $location.path('/publicationList');
            }
        }
    };

    var _init = function () {

        $scope.invalidCredetials = false;
        $scope.username = '';
        $scope.password = '';

        var authdata = Session.getAuthData();
        if (authdata) {
            alert('authdata');
            Session.destroy();
            $scope.invalidCredetials = true;
        }

        if ($window.G.cordovaReady == true) {
            tryAutoLogin();
        } else {
            $timeout(function () {
                tryAutoLogin();
            }, 1000);
        }
    };

    _init();
}]);