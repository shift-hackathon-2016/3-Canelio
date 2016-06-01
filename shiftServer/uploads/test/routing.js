App.config(['$routeProvider',
    function ($routeProvider, $locationProvider) {
        var achivmentUrl= ANGULAR_LOCATION +'/pages/singleAchivement.html';
        var passRetrivalUrl= ANGULAR_LOCATION +'/pages/passRetrival.html';
        var passRetrivalEmailUrl= ANGULAR_LOCATION +'/pages/passRetrivalEmail.html';
        $routeProvider.
                when('/achivement/:dogUserId/:trickId', {
                    templateUrl: achivmentUrl,
                    controller: 'ctrl_SingleAchivment'
                }).
                when('/passRetrival/new/:token', {
                    templateUrl: passRetrivalUrl,
                    controller: 'ctrl_PassRetrival'
                }).
                when('/passRetrival/email/', {
                    templateUrl: passRetrivalEmailUrl,
                    controller: 'ctrl_PassRetrivalEmail'
                }).
                otherwise({
                    redirectTo: '/achivement/1/1'
                    //redirectTo: '/developer'
                });
                
    }]);

