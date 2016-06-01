App.controller("ctrl_Trick", function ($scope, svc_File,db_Trainig, $location, $q, $routeParams, stringHelper, model_Tricks, model_UploadDogImage) {

    /**/
    //nista ne showat ni hidat na component trick jel kad se pas promijeni moze se i ovo promijenit
    $scope.trickId = $routeParams.id;
    $scope.title = stringHelper.replaceSpaces($routeParams.name);
    $scope.costumeTrick = true;
    var def = $q.defer();
    def.promise.then(function (trick) {
        $scope.costumeTrick = false;
    });
    svc_File.getTrick(def, $routeParams.id);



    var def2 = $q.defer();
    def2.promise.then(function (data) {
        console.log($scope.trickId);
        console.log("level is", data);
        $scope.achivmentLevel = data.level;
        $scope.fulltitle = kmodel_Achivement.getTitleForLevel($scope.achivmentLevel, $scope.title);
        console.log($scope.fulltitle);
        $scope.achivmentTitle = stringHelper.formatWith3Dots($scope.fulltitle, 25, 320, $('body').width());
        if ($scope.achivmentLevel == 1) {
            $scope.trophy1 = 'res/trophies/trophy1.png';
        } else if ($scope.achivmentLevel == 2) {
            $scope.trophy1 = 'res/trophies/trophy1.png';
            $scope.trophy2 = 'res/trophies/trophy2.png';
        } else if ($scope.achivmentLevel == 3) {
            $scope.trophy1 = 'res/trophies/trophy1.png';
            $scope.trophy2 = 'res/trophies/trophy2.png';
            $scope.trophy3 = 'res/trophies/trophy3.png';
        } else if ($scope.achivmentLevel == 4) {
            $scope.trophy1 = 'res/trophies/trophy1.png';
            $scope.trophy2 = 'res/trophies/trophy2.png';
            $scope.trophy3 = 'res/trophies/trophy3.png';
            $scope.trophy4 = 'res/trophies/trophy4.png';
        }
    }, function (data) {
        $scope.goOffline = true;
    });
    var data = {
        trickId: $scope.trickId
    };
    kmodel_Achivement.achivmentLevel(def2, data);




    var def3 = $q.defer();
    def3.promise.then(function (data) {
        console.log(data);
        if (data.hasImage) {
            $scope.imageSrc = data.imageSrc;
        } else {
            console.log("set it");
            $scope.imageSrc = "res/logo062244White.png";
        }
    });
    var dataTrick = {
        trickId: $scope.trickId
    };
    model_Tricks.getTrickImage(def3, dataTrick);

    var def = $q.defer();
    def.promise.then(function (trick) {
        $scope.costumeTrick = false;
    });
    svc_File.getTrick(def, $routeParams.id);


    var defStats = $q.defer();
    defStats.promise.then(function (trick) {
        console.log("trick is");
        console.log(trick);
        if (trick.timesTrained == null) {
            trick.timesTrained = 100;
        }
        if (trick.timesSuccess == null) {
            trick.timesSuccess = 50;
        }
         $scope.success = Math.round((trick.timesSuccess / trick.timesTrained) *100);
         $scope.fail = 100 - $scope.success;
         $('#successBar').css('width', $scope.success + '%');
         $('#failBar').css('width', $scope.fail + '%');
    });
    db_Trainig.getTrickTotal(defStats, { trickId: $routeParams.id });











    $scope.goToInstructions = function () {
        if ($scope.costumeTrick) {
            alertify.error("There are no instructions for custome tricks");
        } else {
            $location.path('/instructions/' + $scope.trickId);
        }
    }

    $scope.goToStatistics = function () {
        $location.path('/statistics/trick/' +$scope.trickId);
    }

    $scope.uploadDogImage = function () {
        config = {
            type: "achivement",
            trickId: $scope.trickId
        };
        model_UploadDogImage.setConfig(config);
        $location.path('/imageUpload');
    }

    $scope.goToAchivment = function () {
        console.log($scope.trickId);
        console.log($routeParams.name);
        $location.path('/as/' + $scope.trickId +'/'+ $routeParams.name)
    }

});
