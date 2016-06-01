App.controller("ctrl_ResetPassword", function ($scope, $q, model_Login, $location, $rootScope, svc_FileChecker) {

    $scope.forgotPassword = Globalize.localize("forgotPassword");
    $scope.loginTxt = Globalize.localize("login");
    $scope.usernameTxt = Globalize.localize("username");
    $scope.passwordTxt = Globalize.localize("password");
    $scope.backTxt = Globalize.localize("back");

    $scope.login = function () {
        var def = $q.defer();
        def.promise.then(function (sucess) {
            svc_FileChecker.checkFilesVersion();
        }, function (error) {
            alertify.error(error.message);
        });
        var data = {
            email: $scope.email,
            password: $scope.password,
        }
        model_Login.login(def,data)
    }

    $scope.goBack = function () {
        $rootScope.goBack();
    }

    $scope.passwordRetrival = PASSWORD_RETRIVAL;
});