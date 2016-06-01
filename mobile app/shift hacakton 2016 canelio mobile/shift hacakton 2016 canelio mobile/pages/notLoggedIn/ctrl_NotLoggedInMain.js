App.controller("ctrl_NotLoggedInMain", function ($scope, svc_File, $q,$location) {

    svc_AngularHistory.clearRoutes();

    $scope.trackYourDogTrainingTxt = "Track your dog training";
    $scope.loginTxt = "Login";
    $scope.registerTxt = "Register";
    
    console.log("inside");

    var token = localStorage.getItem('token');
    if (token != null && token != '') {
        $location.path('/main');
    }

});
