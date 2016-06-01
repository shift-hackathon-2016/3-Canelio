App.controller("ctrl_Register", function ($scope, $location, $q, model_Register, $rootScope, svc_FileChecker) {

    
    $scope.emailTxt = "e-mail";
    $scope.passwordTxt = "password";
    $scope.usernameTxt = "username";

    $scope.dogBreedTxt = "dog breed";
    $scope.dogNameTxt = "dog name";
    $scope.promoCodeTxt = "promo code";

    $scope.backTxt = "back";
    $scope.nextTxt = "next";
    $scope.registerTxt = "Register";

    $scope.almostDoneTxt = "Almost done...";



    $scope.step = 0;
    $scope.nextButton = $scope.nextTxt;
    $scope.nextStep = function () {

        if ($scope.step == 0) {
            if ($scope.email == '' || $scope.email == null) {
                alertify.error("Please enter your email");
                return null;
            }
            if ($scope.password == '' || $scope.password == null) {
                alertify.error("Please enter password");
                return null;
            }
            if ($scope.dogName == '' || $scope.dogName == null) {
                alertify.error("Please enter your dog's name");
                return null;
            }
            var data = {
                "password": $scope.password,
                "email": $scope.email,
                "dogName": $scope.dogName,
            };
            var def = $q.defer();
            def.promise.then(function (sucess) {
                svc_FileChecker.checkFilesVersion();
                //$location.path("/mainMenu");
            }, function (error) {
                console.log("error");
                console.log(error);
                if (error.errorCode == 2) {
                    $scope.step = 0;
                    alertify.error("Email exists");
                    alertify.error("Retrieve your password from login screen");
                }
                if (error.errorCode == 3) {
                    alertify.error("Invalid email");
                    $scope.email = '';
                    $scope.step = 0;
                }
            });
            model_Register.register(def,data);
        }
        $scope.step++;
    }
    $scope.prevStep = function () {
        if ($scope.step == 0) {
            $rootScope.goBack();
        }
        $scope.step--;
    }
});