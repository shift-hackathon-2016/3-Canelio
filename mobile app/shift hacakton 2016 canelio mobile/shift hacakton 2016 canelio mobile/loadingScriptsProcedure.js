var scripts = [
"helpers/ctrl_FilesDownload",
"pages/ctrl_Test",
"pages/ctrl_Test2",
"pages/ctrl_Test3",
"pages/sqlLiteTest",
"pages/bleTest",
"pages/bleRead",
"helpers/dateHelper",
"helpers/kendo_DateHelper",
"helpers/kendo_DateCalculationsHelper",
"helpers/requestHelper",
"helpers/kendo_RequestHelper",
"helpers/kendo_ChartHelper",
"helpers/arrayHelper",
"helpers/chartHelper",
"helpers/stringHelper",
"services/svc_File",
"services/svc_FileChecker",
"services/kendoConnector",
"services/svc_AngularHistory",
"models/model_Register",
"models/model_Login",
"models/model_Train",
"models/model_TrickStatistics",
"models/model_GroupStatistics",
"models/model_DownloadFiles",
"models/model_Result",
"models/model_UploadDogImage",
"models/model_Gallery",
"models/model_Achivement",
"models/kmodel_Achivement",
"models/kmodel_TrickStatistics",
"models/kmodel_Points",
"models/kmodel_UploadDogImage",
"models/kmodel_Weight",
"models/kmodel_MyTricks",
"models/model_Tricks",
"models/model_Dog",
"models/model_Share",
"models/model_Goal",
"models/model_GoalDaily",
"models/model_GoalWeekly",
"models/model_GoalDetails",
"models/model_Level",
"models/model_ServerSync",
"models/model_Clicker",
"models/model_ResultUpload",
"dbModels/db_Training",
"dbModels/db_Manager",
"dbModels/db_Sync",
"dbModels/db_Tricks",
"dbModels/db_TrainingForServer",
"directives/mainNav/mainNav",
"directives/datesPicker/datesPicker",
"directives/weightDatesPicker/weightDatesPicker",
"directives/valuePicker/valuePicker",
"directives/trainSettings/trainSettings",
"directives/decimalInput/decimalInput",
"directives/d3AreaChart",
"directives/SortableList",
"pages/ctrl_Kedno",
"pages/ctrl_FirstView",
"pages/menu/ctrl_Menu",
"pages/loggedIn/ctrl_Settings",
"pages/loggedIn/ctrl_Main",
"pages/loggedIn/ctrl_TrainMenuSimple",
"pages/extras/ctrl_Extras",
"pages/extras/achivement/kctrl_AchievmentList",
"pages/extras/achivement/kctrl_SingleAchivement",
"pages/extras/weight/ctrl_Weight",
"pages/extras/weight/ctrl_WeightLog",
"pages/extras/weight/kctrl_WeightHistory",
"pages/trainMenu/ctrl_trainMenu",
"pages/trainMenu/myTricks/ctrl_myTricks",
"pages/trainMenu/myTricks/ctrl_createTrick",
"pages/trainMenu/myTricks/ctrl_deleteTrick",
"pages/group/ctrl_Group",
"pages/group/ctrl_SubGroup",
"pages/trick/ctrl_Trick",
"pages/trick/help/ctrl_Help",
"pages/trick/help/ctrl_HandSignal",
"pages/trick/help/ctrl_Instructions",
"pages/trick/ctrl_Solutions",
"pages/train/trainBasic/ctrl_TrainBasic",
"pages/train/achievment/ctrl_AchievmentWon",
"pages/train/trainBasic/ctrl_ResultTrainBasic",
"pages/imageUpload/ctrl_ImageUpload",
"pages/imageUpload/gallery/ctrl_DogGallery",
"pages/statistics/ctrl_TrickStatistics",
"pages/statistics/ctrl_groupStatistics",
"pages/notLoggedIn/ctrl_NotLoggedInMain",
"pages/notLoggedIn/ctrl_Login",
"pages/notLoggedIn/ctrl_Register",
"pages/download/ctrl_DownloadFiles",
"pages/extras/achivement/ctrl_AchievmentShare",
"pages/loggedIn/goals/ctrl_SetupGoals",
"pages/loggedIn/goals/ctrl_DailyGoals",
"pages/loggedIn/goals/ctrl_DetailsGoals",
"pages/loggedIn/goals/ctrl_WeeklyGoals",
"pages/loggedIn/sync/ctrl_ServerUpload",
"pages/loggedIn/sync/ctrl_DownloadClicker",
"pages/download/ctrl_DownloadTraining",
"pages/loggedIn/clicker/ctrl_ClickerConnect",
"pages/notLoggedIn/ctrl_RequestPassword",
"pages/loggedIn/level/ctrl_LevelDetails",
"pages/loggedIn/sync/ctrl_ResultUpload"];

var time1 = new Date();
//angular.bootstrap(document.body, ['App']);
var styles = ["lib/kendo2/kendo.common.min.css",
"lib/kendo2/kendo.flat.min.css",
"lib/kendo2/kendo.dataviz.min.css",
"lib/kendo2/kendo.dataviz.mobile.min.css",
"lib/kendo2/kendo.mobile.all.min.css",
"lib/kendo2/kendo.mobile.flat.min.css",
"css/canelioKendoFixes.css",
"lib/alertify/alertify.core.css",
"lib/alertify/alertify.default.css",
"lib/cropper/cropper.css",
"css/navbar.css",
"css/decimalInput.css",
"css/tabs.css",
"css/trick.css",
"css/solutions.css",
"css/valuePicker.css",
"css/train.css",
"css/result.css",
"css/notLoggedIn.css",
"css/chartStatistics.css",
"css/datesPicker.css",
"css/infoBoxes.css",
"css/achievment.css",
"css/cropper.css",
"css/images.css",
"css/kendoFixes.css",
"css/weight.css",
"css/myTricks.css",
"css/scrollableList.css",
"css/loggedInMain.css",
"css/goals.css",
"css/sync.css",
"css/clicker.css",
"css/resultSync.css",
"css/animations/views.css",
"css/animations/charts.css",
"css/animations/imitateViewTransition.css",
"css/animations/slideFadeInFromBottomOut.css",
"css/animations/growFromTopOut.css",
"css/animations/slideFromBottomOutQuick.css"];

function loadCSS() {
    require(["css!lib/kendo2/kendo.common.min"], function () {
        console.log(VAR_SERVER);
        console.log('loaded my css');
        var time2 = new Date();
        console.log(time2 - time1);
        
        
    });
}



function loadMyAngFiles() {
    require(['pages/myscripts.js'], function () {
        updateAppLoading(6);
        console.log(VAR_SERVER);
        console.log('loaded my ang files');
        var time2 = new Date();
        console.log(time2 - time1);
        
        angular.bootstrap(document.body, ['App']);
    });
}

function loadMyAngConfig() {
    var lib = ["variables"]
    require(lib, function () {
        var lib = ["app" ]
        require(lib, function () {
            var lib = ["routing" ]
            require(lib, function () {
                var lib = ["lib/ng-cordova"]
                require(lib, function () {
                    updateAppLoading(5);
                    console.log('loaded my config');
                    var time2 = new Date();
                    console.log(time2 - time1);
                    loadMyAngFiles();
                });
            });
        });
    });
}

function loadKendo() {
    var lib = ["lib/kendo2/kendo.mobile.min"];
    require(lib, function (k) {
        updateAppLoading(4);
        console.log('loaded kendo');
        var time2 = new Date();
        console.log(time2 - time1);
        loadMyAngConfig();
    });
}

function loadLibrares() {
    var lib = ["lib/cropper/cropper",
                "lib/alertify/alertify",
                "lib/moment",
                "lib/d3/d3.min",
                "lib/iscroll-probe",
                "lib/slip",
                "lib/fastclick"
                ];
    require(lib, function (c,  a, m, d3, is, sl, f) {
        updateAppLoading(3);
        window.alertify = a;
        console.log('loaded libraries');
        var time2 = new Date();
        console.log(time2 - time1);
        window.moment = m;
        console.log("fasclick");
        console.log(m);

        console.log("after fastclick")
        loadKendo();
    });
}



function loadAngularScripts() {
    require(["lib/angular.min"], function () {
        console.log('loaded');
        updateAppLoading(2);
        var time2 = new Date();
        console.log(time2 - time1);
        require(["lib/angular-sanitize",
"lib/angular-route.min",
"lib/angular-touch.min",
"lib/angular-animate.min", ], function () {
            console.log('loaded full angular');
            loadLibrares();
            var time2 = new Date();
            console.log(time2 - time1);

        });
    });
}


requirejs.config({
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: 'lib/jquery2.1.1.',
    },
    map: {
        '*': {
            'css': 'lib/css.min' // or whatever the path to require-css is
        }
    }
});



function loadJquery() {
    
    require(["jquery"], function () {
        console.log('loaded jquery');
        updateAppLoading(1);
        setTimeout(function () {
            //var myHeight = $('body').height();
            //var mywidth = $('body').width();
            //if (myHeight != 0) {
            //    $('#viewport').height(myHeight);
            //    console.log("height is");
            //    console.log($('body').height());

            //    $('html').css('height', myHeight + 'px');

            //    $('body').css('height', myHeight + 'px');
            //}
            //if (mywidth != 0) {
            //    $('html').css('width', mywidth + 'px');
            //    $('body').css('width', mywidth + 'px');
            //}
        }, 2000);
        loadAngularScripts();
        var time2 = new Date();
        console.log(time2 - time1);
    });
}

function onDeviceReady() {
    StatusBar.hide();
  
    var progress = 0;
    var apploadertext = document.getElementById('appLoaderProgrees');
    var apploaderBar = document.getElementById('appLoaderProgreesBar');
    apploadertext.innerHTML = progress + '%';
    apploaderBar.style.width = progress + '%';

    navigator.splashscreen.hide();
    

 

    loadJquery();

};

function updateAppLoading(step) {
    var total = 6;
    var progress = Math.round(step/total * 100);
    var apploadertext = document.getElementById('appLoaderProgrees');
    var apploaderBar = document.getElementById('appLoaderProgreesBar');
    apploadertext.innerHTML = progress + '%';
    apploaderBar.style.width = progress + '%';
}

var viewportScale = 1 / window.devicePixelRatio;

var v = document.getElementById('viewport');
v.content = "user-scalable=no, initial-scale=" + viewportScale + ", minimum-scale=1.0, maximum-scale=1.0, width=device-width,height=device-height";


function beginLoadingRequireJs() {

    document.addEventListener("deviceready", onDeviceReady, false);
}
