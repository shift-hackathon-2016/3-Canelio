var App = angular.module('App', ['ngRoute', 'ngTouch' ,'ngAnimate']);
var canelio_db;
//var App = angular.module('App', ['ngRoute', 'ngAnimate']);
App.config([
    '$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/\w+/);
        $compileProvider.imgSrcSanitizationWhitelist(/\w+/);

        //$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    }
]);

App.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(/\w+/);
});

App.config(function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
    
});


var androidBackHasEventListener = false;

App.run(function ($rootScope, svc_FileChecker,$location ,$q) {
    //
    var viewportScale = 1 / window.devicePixelRatio;

    //$("#viewport").attr("content", "user-scalable=no, initial-scale=" + viewportScale + ", minimum-scale=1.0, maximum-scale=1.0, width=device-width,height=device-height");

    $("#viewport").attr("content", "user-scalable=no, initial-scale=" + viewportScale + ", minimum-scale=1.0, maximum-scale=1.0, width=device-width,height=device-height");

    var def = $q.defer();
    $rootScope.promiseDeviceRdy = def.promise;

    
    

    function onDeviceReady() {
        
        //StatusBar.hide();
        //navigator.splashscreen.hide();
        //$(document).bind('touchmove', function (e) {
        //    e.preventDefault();
        //});
        //document.body.scroll = 'no';
        //configure status bar 
        //configure globalize-localize

        //Globalize.culture("en");

        //configure alertify
        alertify.set({
            delay: 4000,
            buttonReverse: false,
            buttonFocus: "ok"
        });
        //set dpi and screen height width

        
        function androidBackButtonPressed() {
            console.log("androidBackButtonPressed");
            $rootScope.goBack();
        }
        if (!androidBackHasEventListener) {
            document.addEventListener("backbutton", androidBackButtonPressed, true);
            androidBackHasEventListener = true;
        }

        //set up database
        console.log("before open sqlite");
        var dbName = "canelio.db";
        if (window.navigator.simulator === true) {
            // For debugin in simulator fallback to native SQL Lite
            canelio_db = window.openDatabase(dbName, "1.0", "Cordova Demo", 200000);
            IS_SIMULATOR = true;
        }
        else {
            console.log("setting is simulator to false");
            canelio_db = window.sqlitePlugin.openDatabase(dbName);
            IS_SIMULATOR = false;
        }
        console.log("after open sqlite");
        def.resolve(true);


        //hide splash screen
        //setTimeout(function () {
        //    navigator.splashscreen.hide();
        //}, 200);
    }

    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {

    });

    document.addEventListener("deviceready", onDeviceReady, false);

   

    var routeListener = $rootScope.$on("$routeChangeStart", firstRunRoute);

    function firstRunRoute(event, next, current) {
        $location.path("/firstView");
        routeListener();
    }
    


    // INSTANTIATE SO IT WILL BE PREPARED FOR THE REST OF THE APP  
    //$rootScope.$on("$routeChangeStart", function (event, next, current) {
    //    console.log("-----------------");
    //    console.log(next.$$route);
    //    //console.log(current.$$route)
    //});

});

App.controller("AppCtrl", function ($location, $scope, $rootScope, $window ,$location) {
    

    function hrefChangeListener (){

     
        return origPath(url);
    }
    

    var animateBack = false;
    $rootScope.removeAppLoader = function () {
        setTimeout(function () {
            $('#appLoader').animate({
                opacity: 0,
                bottom: "+=100%",
            }, 500, function () {
                $('#appLoader').remove();
                console.log("is simulator");
                console.log(IS_SIMULATOR);
                if (!IS_SIMULATOR) {

                    $rootScope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {
                        console.log("route change started");
                        var direction = 'left';
                        console.log("animateBack is");
                        console.log(animateBack)
                        if (animateBack) {
                            animateBack = false;
                            direction = 'right';
                        }
                        var slowDownFactor;
                        if (device.platform == 'Android') {
                            slowDownFactor = 1;
                        } else {
                            slowDownFactor = 4;
                        }


                        //ios settings
                            var options = {
                                "direction": direction, // 'left|right|up|down', default 'left' (which is like 'next')
                                "duration": 300, // in milliseconds (ms), default 400
                                "slowdownfactor": slowDownFactor, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
                                "slidePixels": 0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
                                "iosdelay": -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
                                "androiddelay": -1, // same as above but for Android, default 70
                                "winphonedelay": 250, // same as above but for Windows Phone, default 200,
                                "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
                                "fixedPixelsBottom": 0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
                            };
                            console.log("location");
                            console.log(newUrl);

                            console.log("should sucess");
                            window.plugins.nativepagetransitions.slide(
                              options,
                              function (msg) {
                                  setTimeout(function () {
                                      window.plugins.nativepagetransitions.executePendingTransition();
                                  }, 150);
                                  
                                  console.log("sucess");
                              }, // called when the animation has finished
                              function (msg) { alert("error: " + msg) } // called in case you pass in weird values
                            );

                    
                        });
                    }//end if
                });
                $scope.pageClass = "view-animate-left";
            },600)
        
        };


    //$rootScope.$on('$routeUpdate', function (event, newUrl, oldUrl) {
    //    console.log("$routeUpdate started");
    //    console.log(newUrl);
    //});

    //$rootScope.$on('$routeChangeError', function (event, newUrl, oldUrl) {
    //    console.log("$routeChangeStart started");
    //    console.log(newUrl);
    //});

    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        svc_AngularHistory.addRoute(newUrl);
    });
    //$rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
    //    console.log("$locationChangeSuccess sucess");
    //    console.log(newUrl);
    //});

    var firstView = true;
    var animationsSpecial = [
        { current: '/group/:id', next: '/mainMenu' },
        { current: '/Items', next: '/Info' }
    ];
    var animationsLeft = [
        { current: '/subGroup/:id', next: '/group/:id' },
        { current: '/trick/:id', next: '/group/:id' },
        { current: '/trick/:id', next: '/subGroup/:id' },
        { current: '/statistics/:level/:id', next: '/group/:id' },
        { current: '/statistics/:level/:id', next: '/subGroup/:id' },
        { current: '/solutions/:id', next: '/trick/:id' },
        { current: '/train/1/:id', next: '/trick/:id' },
        { current: '/statistics/trick/:id', next: '/trick/:id' },
        { current: '/trick/:id', next: '/group/:id' },
    ];

    

    $rootScope.goBack = function (isFromKendo) {
        animateBack = true;
        $scope.pageClass = "view-animate-right";
        svc_AngularHistory.goBack($rootScope, $location, isFromKendo);
        //if ($rootScope.$$phase) {
        //    var route = svc_AngularHistory.getBackRoute();
        //    if (svc_AngularHistory.checkRoute(route)) {
        //        $location.path(route);
        //    }
        //    console.log("should back");
        //} else {
        //    $rootScope.$apply(function () {
        //        var route = svc_AngularHistory.getBackRoute();
        //        if (svc_AngularHistory.checkRoute(route)) {
        //            $location.path(route);
        //        }
        //    });
        //}

        

        setTimeout(function () {
            $scope.pageClass = "view-animate-left";
        },200);
    }

    $rootScope.navigateNoNavBarTransition = function (path) {
        $scope.pageClass = "view-animate-left-no-navbar";
        $location.path(path);
        setTimeout(function () {
            $scope.pageClass = "view-animate-left";
        }, 200);
    }

    $rootScope.navigateNoTransition = function (path) {
        $scope.pageClass = "no-transition";
        //$scope.$apply(function () {
            
        //});
        $location.path(path);
        setTimeout(function () {
            $scope.pageClass = "view-animate-left";
        }, 200);
    },

    $rootScope.angNavigate = function (path, transition) {
        if (transition != null) {
            $scope.pageClass = transition;
            //$scope.$apply(function () {
                
            //});
            
        }
        $rootScope.$apply(function () {
            $location.path(path);
            setTimeout(function () {
                $scope.pageClass = "view-animate-left";
            }, 200);
        });
    }

    //change binded class for animate
    //$rootScope.$on("$routeChangeStart", function (event, next, current) {
    //    console.log("event is:", event);
    //    console.log("current is:", current);
    //    console.log("next is:", next);
    //    console.log(firstView);
    //    if (firstView) {
    //        $scope.pageClass = "view-no-animate";
    //        firstView = false;
    //    } else {
    //        var leftAnimate = false;
    //        angular.forEach(animationsLeft, function (routes) {
    //            if (routes.current == current.$$route.originalPath && routes.next == next.$$route.originalPath) {
    //                $scope.pageClass = "view-animate-left";
    //                leftAnimate = true;
    //            }
    //        });
    //        if (!leftAnimate) {
    //            $scope.pageClass = "view-animate-right";
    //        }
    //    }
    //});
});
