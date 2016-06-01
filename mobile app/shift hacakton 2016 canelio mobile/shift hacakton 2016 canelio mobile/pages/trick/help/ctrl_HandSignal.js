App.controller("ctrl_HandSignal", function ($scope, svc_File, $q, $routeParams) {

    $scope.trickId = $routeParams.id;
    $scope.title = "Hand Signal";

    var def = $q.defer();
    def.promise.then(function (file) {
        $scope.handSignal = file.handSignal;
    });
    svc_File.getTrick(def, $routeParams.id);

    $scope.containerStyle = function () {
        return {
            top: $('#navBarSpaceFiller').height() +'px',
            height: $('body').height() - $('#navBarSpaceFiller').height() + 'px'
        }
    }
});
