App.factory("svc_NativeTransitions", function ($q, $cordovaFile, $window,$location) {

    function getDeffered() {
        var def = $q.defer();
        var promise = def.promise;
        promise.then(function () {
            console.log("resolved");
        })
    }





    return {
        getDeffered: getDeffered,
    };
});