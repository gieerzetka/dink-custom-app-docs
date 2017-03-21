app.factory('Session', function () {
    this.autoLoginAttempt = true;
    var that = this;

    this.setAuthData = function (authdata) {
        this.authdata = authdata;
    };

    this.getAuthData = function () {
        return that.authdata;
    };

    this.setAutoLoginAttempt = function () {
        this.autoLoginAttempt = false;
    };

    this.getAutoLoginAttempt = function () {
        return that.autoLoginAttempt;
    };

    this.destroy = function () {
        this.authdata = null;
    }

    return this;
});