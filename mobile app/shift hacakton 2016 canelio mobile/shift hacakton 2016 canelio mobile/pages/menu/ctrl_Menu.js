App.controller("ctrl_Menu", function ($scope, svc_File, $q, svc_FileChecker) {
    $scope.title = "Canelio Tricks"
    var def = $q.defer();
    def.promise.then(function (groups) {
        $scope.groups = groups;
    });
    svc_File.getAllTrickGroups(def);
    //check file version
    
});
