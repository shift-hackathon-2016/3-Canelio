App.controller("ctrl_createTrick", function ($scope, svc_File, $q, svc_FileChecker, $location, $rootScope) {
    $scope.title = "Create Trick"
    //check file version

    $scope.createTrick = function () {
        if ($scope.trickName == '' || $scope.trickName == ' ' || $scope.trickName == null) {
            alertify.error("please enter trick name");
            return null;
        }
        data = {
            name: $scope.trickName,
            created: kendo_DateHelper.getCurrentTimestamp()
        };
        console.log(data);
        var def = $.Deferred()
        var promise = def.promise();
        promise.then(function (data) {
            $rootScope.goBack();
        }, function (error) {
            alertify.error("trick failed to create");
        });
        kmodel_MyTricks.createTrick(def,data)
    }

    //$('#createTrickSwitch').kendoMobileSwitch(
    //    {
    //        onLabel: 'Yes',
    //        offLabel: 'No',
    //        checked: true,
    //        change: function (e) {
    //            alertify.success("hello")
    //        }
    //    }
    //);


});
