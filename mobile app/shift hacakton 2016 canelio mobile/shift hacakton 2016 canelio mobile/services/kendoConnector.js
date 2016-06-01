(function ($, console, win) {

    var routes = localStorage.getItem("kendoRoutes");
    if (routes == null || routes == "") {
        localStorage.setItem("kendoRoutes", "[]");
    }

    var $scope = {
        app: null,
        setApp: function (app) {
            $scope.app = app;
        },
        destroyApp: function (e) {
            $scope.app = null;
        },
        navigateAngular: function(path, transition){
            var $body = angular.element(document.body);
            var $rootScope = $body.scope().$root;
            $rootScope.angNavigate(path,transition);
        },
        navigateBack: function () {
            var lastRoute = $scope.popRoute();
            var transition = "slide:left reverse";
            if (lastRoute.transition) {
                transition = lastRoute.transition+' reverse' ;
            } 
            //window.history.back()
            
            if (lastRoute == "history") {
                $scope.popRoute();
                var $body = angular.element(document.body);   
                var $rootScope = $body.scope().$root;
                var injector = $body.injector();
                var $location = injector.get('$location');
                $rootScope.$apply(function () {               
                    $rootScope.goBack($rootScope,$location, true);
                });
            } else {
                var url = $scope.constructRoute(lastRoute.view, lastRoute.params);
                $scope.app.navigate(url, transition);
            }
            
        },
        navigate: function (view, params, transition) {
            if (transition == null) {
                transition == "slide:left";
            }
            var route = {
                'view': view,
                "params": params,
                "transition": transition,
            };
            $scope.pushRoute(route);
            var url = $scope.constructRoute(view, params);
            $scope.app.navigate(url, transition);
        },
        pushRoute: function (route) {
            
            var routes = JSON.parse(localStorage.getItem("kendoRoutes"));
            routes.push(route);
            localStorage.setItem("kendoRoutes", JSON.stringify(routes));
        },
        //returns last route after pop
        popRoute: function () {

            var routes = JSON.parse(localStorage.getItem("kendoRoutes"));
            routes.pop();
            localStorage.setItem("kendoRoutes", JSON.stringify(routes));
            if (routes.length > 0) {
                return routes[routes.length - 1];
            } else {
                return null;
            }
            
        },
        getRoutes : function(){
            return JSON.parse(localStorage.getItem("kendoRoutes"));
        },
        constructRoute: function (url, params) {
            first = true;
            var stringParams = "";
            for (var paramName in params) {
                if (first) {
                    stringParams = "" + paramName + '=' + params[paramName];
                    first = false;
                } else {
                    stringParams = stringParams+ "&" + paramName + '=' + params[paramName];
                }
            }
            return url + '?'+stringParams;
        },
        setFirstView: function (view, params, transition) {
            var route = {
                'view': view,
                "params": params,
                "transition": transition,
            };
            $scope.pushRoute("history");
            $scope.pushRoute(route);
        },
        getFirstView: function () {
            var routes = JSON.parse(localStorage.getItem("kendoRoutes"));
            last = routes[routes.length - 1];
            return $scope.constructRoute(last.view,last.params);
        }
    };


    $.extend(window, {
        kConnector: $scope,
    });
})
(jQuery, console, window);