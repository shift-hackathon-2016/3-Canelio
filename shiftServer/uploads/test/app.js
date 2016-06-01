var App = angular.module('App', ['ngRoute']);
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





App.run(function ($rootScope) {

    var viewportScale = window.devicePixelRatio;

    $("#viewport").attr("content", "user-scalable=no, initial-scale=" + 1 + ", minimum-scale=1.0, maximum-scale=1.0, width=device-width,height=device-height");
    $('#viewport').height($('body').height());

});

App.controller("AppCtrl", function ($location, $scope, $rootScope) {
    

});
