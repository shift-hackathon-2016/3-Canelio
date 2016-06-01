App.controller("ctrl_deleteTrick", function ($scope, $q, $location, $rootScope, $routeParams) {

    $scope.trickId = $routeParams.id;
    $scope.trickName = $routeParams.name;


    $scope.deleteCancel = function () {
        $rootScope.goBack();
    }

    $scope.deleteTrick = function () {
        var def = $q.defer();
        def.promise.then(function () {
            $rootScope.goBack();
        }, function () {
            alertify.error("failed to delete trick");
        })
        data = {
            trick_id : $scope.trickId
        };
        kmodel_MyTricks.deleteTrick(def,data);
    }

});
