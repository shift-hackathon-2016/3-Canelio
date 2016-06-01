App.controller("ctrl_Instructions", function ($scope, svc_File, $q, $routeParams) {

    $scope.trickId = $routeParams.id;
    $scope.title = "Instructions";

    var def = $q.defer();
    def.promise.then(function (file) {
        console.log(file);
        $scope.steps = file.steps;
        console.log($scope.steps);
    });
    svc_File.getTrick(def, $routeParams.id);

    $scope.containerStyle = function () {
        return {
            top: $('#navBarSpaceFiller').height() +'px',
            height: $('body').height() - $('#navBarSpaceFiller').height() + 'px'
        }
    }

    $scope.$on('$viewContentLoaded', function () {
        var app = new kendo.mobile.Application($('#kapp'), {
            transition: "none",
            initial: "#instructions",
            browserHistory: false,
            webAppCapable: false,
            skin: "ios-light"
        });
    })
    
});
