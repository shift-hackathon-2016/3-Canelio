App.controller("ctrl_RequestPassword", function ($scope, $q, model_Login, $location, $rootScope, svc_FileChecker, model_Register) {
    $scope.step = 0;

    $scope.sendEmail = function () {
        if ($scope.email == '' || $scope.email == null) {
            alertify.error('Please input your email');
        }
        var def = $q.defer();
        def.promise.then(function (data) {
            $scope.step = 2;
        }, function () {
            alertify.error("Inputed wrong email");
            $scope.email = '';
        });
        model_Register.resetPassword(def, { email: $scope.email });
    }

    $scope.back = function () {
        $rootScope.goBack();
    }

});