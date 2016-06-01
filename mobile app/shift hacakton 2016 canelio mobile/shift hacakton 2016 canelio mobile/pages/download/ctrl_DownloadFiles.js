App.controller("ctrl_DownloadFiles", function ($scope, model_DownloadFiles, $q, $routeParams, $http, $cordovaFile,$location) {

    $scope.downloadingFilesTxt = "Downloading Tricks...";
    $scope.pleaseWaitWeAreTxt = "Please wait we are";
    $scope.code = $routeParams.code;
    $scope.downloaded = 0;


    $scope.progressBarStyle = function () {
        return {
            "width": $scope.progress()
        }
    }
    $scope.progress = function () {
        return Math.round(($scope.downloaded/$scope.total) *100) +' %'
    }

    var def = $q.defer();
    def.promise.then(function (data) {
        console.log("got full files list-------------");
        $scope.filesList = data.files;
        $scope.total = data.total;
        $scope.version = data.version;

        var def = $q.defer();
        def.promise.then(function (data) {

            console.log("canelio dir created-------------");
            angular.forEach($scope.filesList, function (value, key) {
                console.log("key is:", key);
                $cordovaFile.checkDir(VAR_MOBILE_FOLDER+key).then(function (success) {
                    console.log("checkDirResolved")
                    downloadFiles(key, value);
                }, function (fail) {
                    var def = $q.defer();
                    def.promise.then(function (success) {
                        downloadFiles(key, value);
                    },
                    function (fail) {
                        ///failo je kreirat direktorij =?
                        //otvori popup sa try againom
                    });
                    model_DownloadFiles.createFolder(def, key);
                });
            }, function (fail) {
                ///failo je kreirat direktorij =?
                //otvori popup sa try againom
                console.log("failed to create canelio folder-------------");
            })
            
        });
        model_DownloadFiles.createCanelioFolder(def);
    }, function (fail) {
        console.log("failed to get full files list-------------");
    });
    model_DownloadFiles.getFullFilesList(def, localStorage.getItem('filesVersion'));


    function downloadFiles(dir, filesList) {
        angular.forEach(filesList, function (file, key) {
            $http.get(file.url)
                .success(function (data, status, headers, config) {
                    var def = $q.defer();
                    def.promise.then(function (success) {
                        $scope.downloaded++;
                        $('downloadProgressPercentage').html($scope.progress);
                        
                        if ($scope.downloaded == parseInt($scope.total)) {
                            localStorage.setItem('filesVersion', $scope.version);
                            //localStorage.removeItem('filesVersion');
                            $location.path("/trainingDownload");
                            
                        }
                    },
                    function (fail) {
                        ///failo je kreirat direktorij =?
                        //otvori popup sa try againom
                    });
                    model_DownloadFiles.createFile(def,dir, file.id, data)
                }).error(function (data, status) {
                    //try again
                });
        });

    }
    

});
