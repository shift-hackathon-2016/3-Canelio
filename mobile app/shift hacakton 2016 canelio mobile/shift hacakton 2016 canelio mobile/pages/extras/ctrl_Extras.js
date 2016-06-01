App.controller("ctrl_Extras", function ($scope, svc_File, $q, svc_FileChecker,$location) {

    //check file version
    $scope.title = "Extras Menu"

    $scope.achievments = function () {
        kConnector.setFirstView("pages/extras/achivement/achievmentsListView.html");
        $location.path("/kendo");
    }
});
