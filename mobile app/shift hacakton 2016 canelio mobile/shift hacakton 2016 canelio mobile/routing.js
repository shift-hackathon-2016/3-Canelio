App.config(['$routeProvider',
    function ($routeProvider, $locationProvider ,$q) {

        //var originalWhen = $routeProvider.when;



        //$routeProvider.when = function (path, route) {

        //    route.resolve = {
        //        'nativePageTransitions': function () {
        //            var def = $q.defer();
        //            var promise = def.promise;
        //            promise.then(function () {
        //                console.log("resolved");
        //            });
        //            setTimeout(function () {
        //                def.resolve();
        //            }, 1000);
        //            return promise
        //        }
        //    };

        //    return originalWhen(path, route);
        //};


        $routeProvider.accessWhen = function (path, route) {
            //ios
            route.resolve = {
                'nativePageTransitions': function ($q) {
                  
                    var def = $q.defer();
                    var promise = def.promise;
                    promise.then(function () {
                        console.log("resolved");
                    });
                    console.log("location")
                    console.log(window.location);
                    setTimeout(function () {
                        def.resolve();
                    }, 100);
                    return promise
                }
            }


            ;
            return $routeProvider.when(path, route);
        };

        $routeProvider.
                accessWhen('/test', {
                    templateUrl: 'pages/test.html',
                    controller: 'ctrl_Test'
                }).
                accessWhen('/bleTest', {
                    templateUrl: 'pages/bleTest.html',
                    controller: 'bleTest'
                }).
                accessWhen('/bleRead', {
                    templateUrl: 'pages/bleRead.html',
                    controller: 'bleRead'
                }).
          
                accessWhen('/group/:id', {
                    templateUrl: 'pages/group/group.html',
                    controller: 'ctrl_Group'
                }).
                accessWhen('/developer', {
                    templateUrl: 'welcome.html',
                }).
                accessWhen('/main', {
                    templateUrl: 'pages/loggedIn/main.html',
                    controller: 'ctrl_Main'
                }).
                accessWhen('/settings', {
                    templateUrl: 'pages/loggedIn/settings.html',
                    controller: 'ctrl_Settings'
                }).
                accessWhen('/trainMenuSimple', {
                    templateUrl: 'pages/loggedIn/trainMenuSimple.html',
                    controller: 'ctrl_TrainMenuSimple'
                }).
                accessWhen('/trainMenu', {
                    templateUrl: 'pages/trainMenu/trainMenu.html',
                    controller: 'ctrl_trainMenu'
                }).
                accessWhen('/myTricks', {
                    templateUrl: 'pages/trainMenu/myTricks/myTricks.html',
                    controller: 'ctrl_myTricks'
                }).
                accessWhen('/createTrick', {
                    templateUrl: 'pages/trainMenu/myTricks/createTrick.html',
                    controller: 'ctrl_createTrick'
                }).
                accessWhen('/extrasMenu', {
                    templateUrl: 'pages/extras/extras.html',
                    controller: 'ctrl_Extras',
                }).
                accessWhen('/Weight', {
                    templateUrl: 'pages/extras/weight/weight.html',
                    controller: 'ctrl_Weight',
                }).
                accessWhen('/weight/log', {
                    templateUrl: 'pages/extras/weight/log.html',
                    controller: 'ctrl_WeightLog',
                }).
                accessWhen('/achievmentsList', {
                    templateUrl: 'pages/extras/achivement/achivementListView.html',
                    controller: 'ctrl_AchievmentList',
                }).
                accessWhen('/kendo', {
                    templateUrl: 'pages/kedno.html',
                    controller: 'ctrl_Kendo',
                }).
                accessWhen('/canelioTricks', {
                    templateUrl: 'pages/menu/menu.html',
                    controller: 'ctrl_Menu'
                }).
                accessWhen('/group/:id', {
                    templateUrl: 'pages/group/group.html',
                    controller: 'ctrl_Group'
                }).
                accessWhen('/subGroup/:id', {
                    templateUrl: 'pages/group/subGroup.html',
                    controller: 'ctrl_SubGroup'
                }).
                accessWhen('/trick/:id/:name', {
                    templateUrl: 'pages/trick/trick.html',
                    controller: 'ctrl_Trick'
                }).
                accessWhen('/deleteTrick/:id/:name', {
                    templateUrl: 'pages/trainMenu/myTricks/deleteTrick.html',
                    controller: 'ctrl_deleteTrick'
                }).
                accessWhen('/help/:id', {
                    templateUrl: 'pages/trick/help/help.html',
                    controller: 'ctrl_Help'
                }).
                accessWhen('/handSignal/:id', {
                    templateUrl: 'pages/trick/help/handSignal.html',
                    controller: 'ctrl_HandSignal'
                }).
                accessWhen('/instructions/:id', {
                    templateUrl: 'pages/trick/help/instructions.html',
                    controller: 'ctrl_Instructions'
                }).
                accessWhen('/solutions/:id', {
                    templateUrl: 'pages/trick/solutions.html',
                    controller: 'ctrl_Solutions'
                }).
                accessWhen('/train/1/:id', {
                    templateUrl: 'pages/train/trainBasic/trainBasic.html',
                    controller: 'ctrl_TrainBasic'
                }).
                accessWhen('/result/1/:id', {
                    templateUrl: 'pages/train/trainBasic/resultTrainBasic.html',
                    controller: 'ctrl_ResultTrainBasic'
                }).
                accessWhen('/achievementWon/:trickId/:achivementId', {
                    templateUrl: 'pages/train/achievment/achievementWon.html',
                    controller: 'ctrl_AchievementWon'
                }).
                accessWhen('/share/achievmenet/:id', {
                    templateUrl: 'pages/extras/achivement/achievmentShare.html',
                    controller: 'ctrl_AchievmentShare'
                }).
                accessWhen('/imageUpload', {
                    templateUrl: 'pages/imageUpload/imageUpload.html',
                    controller: 'ctrl_ImageUpload'
                }).
                accessWhen('/dogGallery', {
                    templateUrl: 'pages/imageUpload/gallery/dogGallery.html',
                    controller: 'ctrl_DogGallery'
                }).
                accessWhen('/statistics/trick/:id', {
                    templateUrl: 'pages/statistics/trickStatistics.html',
                    controller: 'ctrl_TrickStatistics'
                }).
                accessWhen('/statistics/:level/:id', {
                    templateUrl: 'pages/statistics/groupStatistics.html',
                    controller: 'ctrl_GroupStatistics'
                }).
                accessWhen('/notSignedIn', {
                    templateUrl: 'pages/notLoggedIn/notLoggedInMain.html',
                    controller: 'ctrl_NotLoggedInMain'
                }).
                accessWhen('/login', {
                    templateUrl: 'pages/notLoggedIn/login.html',
                    controller: 'ctrl_Login'
                }).
                accessWhen('/passwordReset', {
                    templateUrl: 'pages/notLoggedIn/requestPassword.html',
                    controller: 'ctrl_RequestPassword'
                }).
                accessWhen('/register', {
                    templateUrl: 'pages/notLoggedIn/register.html',
                    controller: 'ctrl_Register'
                }).
                accessWhen('/filesDownload/:code', {
                    templateUrl: 'pages/download/downloadFiles.html',
                    controller: 'ctrl_DownloadFiles'
                }).
                accessWhen('/trainingDownload/', {
                    templateUrl: 'pages/download/downloadTraining.html',
                    controller: 'ctrl_DownloadTraining'
                }).
                accessWhen('/goals/setup/:type', {
                    templateUrl: 'pages/loggedIn/goals/setupGoals.html',
                    controller: 'ctrl_SetupGoals'
                }).
                accessWhen('/goals/daily', {
                    templateUrl: 'pages/loggedIn/goals/dailyGoals.html',
                    controller: 'ctrl_DailyGoals'
                }).
                accessWhen('/goals/details/', {
                    templateUrl: 'pages/loggedIn/goals/detailsGoals.html',
                    controller: 'ctrl_DetailsGoals'
                }).
                accessWhen('/goals/weekly/', {
                    templateUrl: 'pages/loggedIn/goals/weeklyGoals.html',
                    controller: 'ctrl_WeeklyGoals'
                }).
                accessWhen('/uploadToServer', {
                    templateUrl: 'pages/loggedIn/sync/serverUpload.html',
                    controller: 'ctrl_ServerUpload'
                }).
                accessWhen('/downloadClicker', {
                    templateUrl: 'pages/loggedIn/sync/downloadClicker.html',
                    controller: 'ctrl_DownloadClicker'
                }).
                accessWhen('/firstView', {
                    templateUrl: 'pages/firstView.html',
                    controller: 'ctrl_FirstView'
                }).
                accessWhen('/clicker/Connect', {
                    templateUrl: 'pages/loggedIn/clicker/clickerConnect.html',
                    controller: 'ctrl_ClickerConnect'
                }).
                accessWhen('/levelDetails', {
                    templateUrl: 'pages/loggedIn/level/levelDetails.html',
                    controller: 'ctrl_LevelDetails'
                }).
                accessWhen('/resultUpload', {
                    templateUrl: 'pages/loggedIn/sync/resultUpload.html',
                    controller: 'ctrl_ResultUpload'
                }).
                accessWhen('/as/:trickId/:trickName', {
                    templateUrl: 'pages/loggedIn/achivments/singleAchivment.html',
                    controller: 'ctrl_SingleAchivment'
                }).
                otherwise({
                    redirectTo: '/firstView'
                    //redirectTo: '/developer'
                });
                
    }]);

