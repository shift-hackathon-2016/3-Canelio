App.controller("ctrl_SingleAchivment", function ($scope, $q, $routeParams, db_Trainig, stringHelper, model_Tricks, $location) {
    console.log("iside single achivment");
        $scope.title = $routeParams.trickName;
        $scope.trickId = $routeParams.trickId;
        $scope.name = $routeParams.trickName;
        console.log("trick id is");
        console.log($scope.trickId);

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
            $scope.success = Math.round((trick.timesSuccess / trick.timesTrained) * 100);
            $scope.fail = 100 - $scope.success;
        });
        db_Trainig.getTrickTotal(defStats, { trickId: $scope.trickId });


        var def2 = $q.defer();
        def2.promise.then(function (data) {
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
            }
        });
        var dataTrick = {
            trickId: $scope.trickId
        };
        model_Tricks.getTrickImage(def3, dataTrick);

        
        var defAchId= $q.defer();
        defAchId.promise.then(function (data) {
            $scope.achivmentId = data;
            console.log("achivment id is", $scope.achivmentId);
        });
        var dataTrickID = {
            trickId: $scope.trickId
        };
        kmodel_Achivement.getAchivmentId(defAchId, dataTrickID);

        $scope.shareAchivment = function () {
            var url = '/share/achievmenet/' + $scope.trickId;
            $location.path(url);
        }

});
