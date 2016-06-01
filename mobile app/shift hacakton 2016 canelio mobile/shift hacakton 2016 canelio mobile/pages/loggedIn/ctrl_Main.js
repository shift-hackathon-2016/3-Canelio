App.controller("ctrl_Main", function ($scope, $q, $location, stringHelper,model_Clicker, model_Level,model_ResultUpload, model_UploadDogImage, model_Dog, model_GoalDaily, model_GoalWeekly, model_ServerSync,model_Clicker) {
 

    console.log(moment().unix())

    //clear history rutes
    svc_AngularHistory.clearRoutes();

    //parse dog name so it doesn't break screen
    $scope.dogName = stringHelper.formatWith3Dots(model_Dog.getDogName(), 14, 210, $('body').width() - 110);




    var blockSettings = false;
    $scope.serverSync = model_ServerSync.isSyncNeeded();
    $scope.clickerSync = model_Clicker.getSyncRequired();

    $scope.goToClickerUpload = function () {
        $location.path('/downloadClicker');
    }

    var lvlData = model_Level.getLevelPoints();
    $scope.pointsNeeded = lvlData.pointsNeeded;
    $scope.levelText = lvlData.nextLvl;
    $scope.maxLevelReached = lvlData.maxLevel;
    $scope.pointsText = lvlData.pointsText;

    $scope.maxLevelReached = false;

    $scope.LevelBarStyle = function () {
        var width = lvlData.lvlPercentage *100;
        if (width < 3) {
            width = 5;
        } else if (width > 98) {
            width = 98;
        }
        console.log(width);
        return {
            width: width +'%'
        }
    }



    $scope.weeklyDone = 0;
    $scope.weeklyPercentage = 0;
    

    var defWeekly = $q.defer();
    defWeekly.promise.then(function (data) {
        $scope.weeklyProgress = data;
        if ($scope.weeklyProgress) {
            $scope.weeklyDone = $scope.weeklyProgress.goalDone;
            if (!$scope.weeklyDone) {
                $scope.weeklyDone == 0;
            }
            $scope.weeklyPercentage = Math.floor(($scope.weeklyDone / $scope.weeklyProgress.goal) * 100);
        }
    });
    model_GoalWeekly.getGoalProgress(defWeekly);

    $scope.weeklyBarStyle = function () {
        if ($scope.weeklyPercentage > 100) {
            return {
                width: '100%',
                borederRadius: '0px!important'
            }
        } else {
            return {
                width: $scope.weeklyPercentage + '%'
            }
        }
    }


    $scope.dailyDone = 0;
    $scope.dailyPercentage = 0;
    var defDaily = $q.defer();
    defDaily.promise.then(function (data) {
        $scope.dailyProgress = data;
        if ($scope.dailyProgress) {
            $scope.dailyDone = $scope.dailyProgress.goalDone;
            if (!$scope.dailyDone) {
                $scope.dailyDone = 0;
            }
            $scope.dailyPercentage = Math.floor(($scope.dailyDone / $scope.dailyProgress.goal) * 100);
        }
    });
    model_GoalDaily.getGoalProgress(defDaily);




    $scope.dailyBarStyle = function () {
        if ($scope.dailyPercentage > 100) {
            return {
                width: '100%',
                borederRadius: '0px!important'
            }
        } else {
            return {
                width: $scope.dailyPercentage + '%'
            }
        }
    }

    

    //$scope.dogImage = window.localStorage.getItem('dogImage');
    model_Dog.getDogImage().then(function (src) {
        console.log("main image src-----------------------");
        console.log(src);

        $scope.dogImage = src;
    }, function (error) { });

    $scope.changeProfilePic = function () {
        config = {
            type: "profile"
        };
        model_UploadDogImage.setConfig(config);
        $location.path('/imageUpload');
    }

    $scope.goToTrainMenu = function () {

        $location.path('/trainMenuSimple');
    }

    $scope.goToSettings = function () {
        $location.path('/settings');
    }


    $scope.goToUpload = function () {
        if (navigator.connection.type == Connection.NONE) {
            alertify.error("Please connect to internet");
        } else {
            $location.path('/uploadToServer');
        }
    }

    $scope.goToLevelDetails = function () {
        $location.path('/levelDetails');
    }
    
   
    $scope.getLiWidth = function () {
        return {
            width: $('body').width() + 'px'
        }
    }

    $scope.goToResultsUpload = function () {
        var data = [];
        for (var i = 0; i < 5; i++) {
            var trickID = 41;

            if (i == 0) {
                trickID = 41;
            } else if (i == 1) {
                trickID = 42;
            } else if (i == 2) {
                trickID = 43;
            } else if (i == 3) {
                trickID = 44;
            } else if (i == 4) {
                trickID = 46;
            }
            var training = {
                time: moment().unix(),
                timesTrained: 150,
                timesSuccess: 20,
                trick_id: trickID
            };
            data.push(training)
        }
        var def = $q.defer();
        def.promise.then(function (data) {
            console.log("data is");
            console.log(data);
            data.level = [data.level];
            data.showSucessRates = true
            data.tricks = [{
                name: 'Sit',
                success: '156',
                total: '212'
            },
            {
                name: 'Stay',
                success: '50',
                total: '367'
            },
            {
                name: 'Lay',
                success: '80',
                total: '157'
            },
            {
                name: 'Fetch',
                success: '90',
                total: '243'
            },
            {
                name: 'Clicker training',
                success: '18',
                total: '18'
            }];
            console.log("data 2 is");
            console.log(data.tricks);
            model_ResultUpload.setResult(data);
            $location.path('/resultUpload');
        });
        model_ServerSync.uploadTraining(def, data)
        
    }


    $scope.setClicker = function () {
        var clickerData = {
            time: moment().unix(),
            s1: '0000000000001',
            s2: [100,98,52,101,48,52,49,100,50,50,98,99,100,50,99,52]
        };
        alertify.success("claim clicker");
        model_Clicker.saveClicker(clickerData);
    }



});
