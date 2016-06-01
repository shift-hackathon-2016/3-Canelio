App.controller("ctrl_Login", function ($scope, $q, model_Login, $location, $rootScope, svc_FileChecker) {

    $scope.forgotPassword = "Forgot password?";
    $scope.loginTxt = "Login";
    $scope.usernameTxt = "username";
    $scope.passwordTxt = "password";
    $scope.backTxt = "back";

    $scope.login = function () {
        if ($scope.email == '' || $scope.email == null) {
            alertify.error("please enter email");
            return null;
        }
        if ($scope.password == '' || $scope.password == null) {
            alertify.error("please enter password");
            return null;
        }


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