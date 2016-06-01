App.factory("svc_File", function ($q, $cordovaFile, $window,$location) {

    function getFile(deferred, filePath) {
        $cordovaFile.readAsText(VAR_MOBILE_FOLDER + filePath).then(function (sucess) {
            deferred.resolve(sucess);
        }, function (error) {
            deferred.reject();
            //$location.path('/error/' + error.code);
        });
    }

    function getFileJson(deferred, filePath , blockRedirect) {
        $cordovaFile.readAsText(VAR_MOBILE_FOLDER + filePath).then(function (sucess) {
            console.log("__________________________________________");
            console.log(JSON.parse(sucess));
            deferred.resolve(JSON.parse(sucess));
        }, function (error) {
            console.log(error);
            deferred.reject();
            if (typeof blockRedirect == "undefined") {
                //$location.path('/error/' + error.code);
            }
        });
    }



    function getAllTrickGroups(deferred) {
        getFileJson(deferred, 'groups/all.json');
    }

    function getTrickGroup(deferred, id) {
        getFileJson(deferred, 'groups/'+id+'.json');
    }

    function getTrickSubGroup(deferred, id) {
        getFileJson(deferred, 'subgroups/' + id + '.json');
    }

    function getTrick(deferred, id) {
        getFileJson(deferred, 'tricks/' + id + '.json');
    }

    function getTrickSolution(deferred, id) {
        getFileJson(deferred, 'tricks/' + id + 'solution.json');
    }





    return {
        getFile: getFile,
        getFileJson: getFileJson,
        getAllTrickGroups: getAllTrickGroups,
        getTrickGroup: getTrickGroup,
        getTrickSubGroup: getTrickSubGroup,
        getTrick: getTrick,
        getTrickSolution: getTrickSolution,

    };
});