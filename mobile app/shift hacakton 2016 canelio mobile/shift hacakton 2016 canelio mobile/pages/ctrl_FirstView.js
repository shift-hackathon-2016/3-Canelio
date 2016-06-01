App.controller("ctrl_FirstView", function ($scope, $location, $q, $rootScope,model_Clicker) {
    console.log("in first view");
    
    $rootScope.promiseDeviceRdy.then(function () {
        $rootScope.removeAppLoader();

        console.log("redirecting");
        console.log("after first view promise");
        var token = localStorage.getItem('token');
        if (token == null || token == '') {
            //alertify.success("redirecting to login");
            $location.path("/notSignedIn");
        } else {
            var requestSync = false;
            if (!VAR_DEVELOPMENT && model_Clicker.getS1()) {
                if(!window.localStorage.getItem("clickerDontSyncOnStart")){
                    requestSync = true;
                }
            }
            if (requestSync) {
                $location.path('/downloadClicker');
            } else {
                $location.path("/main");
            }
        }

        
    })



});
