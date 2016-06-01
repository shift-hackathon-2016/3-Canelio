App.factory("svc_FileChecker", function ($q, svc_File,$location, $rootScope) {

    function checkFilesVersion() {
        //var def = $q.defer();
        //def.promise.then(function (version) {
        //    //check for file version online
        //}, function (error) {
        //    //file reading error redirect to download
        //    $location.path('filesDownload/1');
        //});
        //svc_File.getFilesVersion(def);
        var version = localStorage.getItem('filesVersion');
        console.log("version");
        console.log(version);
        console.log(typeof version);
        if (typeof version == "undefined" || version == null) {

            //$rootScope.$apply(function () {
                    console.log("location should be files download");
                    $location.path('/filesDownload/1');
                    
                //});
        } else {
            version = JSON.parse(version);
            //check time if 5 days passed check online
            $location.path("/clicker/Connect");
        }
    }


    return {
        checkFilesVersion: checkFilesVersion
    };
});