app.service('apiService', ['$q', '$http', '$location', 'Session', 'BASE_API_URL', function ($q, $http, $location, Session, baseApiUrl) {

    this.get = function (url) {

        var def = $q.defer();

        var authdata = Session.getAuthData();
        if (!authdata) {
            $location.path('/login');
        } else {

            var req = {
                method: 'GET',
                url: baseApiUrl + url,
                headers: {
                    'Authorization': 'Basic ' + authdata
                },
                timeout: 30000
            };

            var success = function (successResponse) {
                if (successResponse) {
                    def.resolve(successResponse.data);
                }
                else {
                    def.reject('No data');
                }
            };

            var failure = function (data, status, headers) {

                if (data.status === 401 || data.status === 0) {
                    $location.path('/login');
                } else {
                    def.reject(data.statusText);
                }
            };

            $http(req)
                .then(success, failure);

        }
        return def.promise;
    };

    this.post = function (url, data) {

        var def = $q.defer();

        var authdata = Session.getAuthData();
        if (!authdata) {
            $location.path('/login');
        } else {

            var req = {
                method: 'POST',
                url: baseApiUrl + url,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'Basic ' + authdata
                },
                data: angular.toJson(data),
                timeout: 30000
            };

            var success = function (successResponse) {
                if (successResponse) {
                    def.resolve(successResponse.data);
                }
                else {
                    def.reject('No data');
                }
            };

            var failure = function (data, status, headers) {

                if (data.status === 401 || data.status === 0) {
                    $location.path('/login');
                } else {
                    def.reject(data.statusText);
                }
            };

            $http(req)
                .then(success, failure);

        }
        return def.promise;
    };
        
}]);