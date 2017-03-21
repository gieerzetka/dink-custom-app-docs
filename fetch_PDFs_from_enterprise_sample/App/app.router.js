app.config(function ($routeProvider, $httpProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    $routeProvider.when('/login', {
        templateUrl: 'html/login/login.html',
        controller: 'loginCtrl',
        controllerAs: 'loginCtrl'
    }).when('/publicationList', {
        templateUrl: 'html/publications/publicationList.html',
        controller: 'publicationListCtrl',
        controllerAs: 'publicationListCtrl'
    }).otherwise({
        redirectTo: '/login'
    });
});