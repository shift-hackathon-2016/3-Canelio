App.controller("ctrl_Settings", function ($scope, $q, $location, model_Login, model_Clicker) {
    
    $scope.title = "Settings";
    
    $scope.logout = function () {
        model_Login.clearData();
        $location.path("/notSignedIn");
    };

    $scope.refreshData = function () {
        var defer = $q.defer();
        defer.promise.then(function (sucess) {
            alertify.success("Data refreshed");
        }, function (fail) {
            console.log("data failed to referesh")
        });
        model_Login.refreshData(defer);
    }

    $scope.manualSync = function () {
        $location.path('/downloadClicker');
    }

    $scope.clickerConnected = model_Clicker.getS1();


    $scope.clickerSyncOnStart = function () {
        var dontSyncAtStart = window.localStorage.getItem("clickerDontSyncOnStart");
        if (dontSyncAtStart) {
            window.localStorage.removeItem("clickerDontSyncOnStart");
        } else {
            window.localStorage.setItem("clickerDontSyncOnStart", '1');
        }
        console.log("called");
    }

    $scope.disconnectClicker = function () {
        var def = $q.defer();
        def.promise.then(function (success) {
            $scope.clickerConnected = false;
        });
        model_Clicker.disconnectClicker(def, { "smth": "smth" });

    }

    $scope.clickerSyncOnStartClick = function () {
        $('#switchSyncStart').data('kendoMobileSwitch').toggle(true);
        $scope.clickerSyncOnStart();
    }


    var checked = window.localStorage.getItem("clickerDontSyncOnStart");
    console.log(checked);
    if (!checked) {
        checked = true;
    } else {
        checked = false;
    }

    $('#switchSyncStart').kendoMobileSwitch(
        {
            onLabel: 'Yes',
            offLabel: 'No',
            checked: checked,
        }
    );


});
