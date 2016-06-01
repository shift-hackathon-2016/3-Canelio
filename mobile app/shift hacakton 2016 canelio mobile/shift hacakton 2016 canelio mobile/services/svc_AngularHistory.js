(function ($, console, win) {

    var routes = localStorage.getItem("angRoutes");
    if (routes == null || routes == "") {
        localStorage.setItem("angRoutes", "[]");
    }

    var $scope = {
        routes: [],
        ignoreNextRoute: false,
        currentRoute: null,
        addRoute: function (route) {
            if ($scope.ignoreNextRoute) {
                $scope.ignoreNextRoute = false;
                return null;
            }
            var hashPos = route.indexOf('#');
            var location = route.substring(hashPos + 1, route.length);
            $scope.routes = JSON.parse(localStorage.getItem("angRoutes"));
            $scope.routes.push(location);
            localStorage.setItem("angRoutes", JSON.stringify($scope.routes));
            $scope.currentRoute = route;
        },
        getBackRoute: function () {
            $scope.routes = JSON.parse(localStorage.getItem("angRoutes"));
            $scope.currentRoute = $scope.routes.pop();
            $scope.ignoreNextRoute = true;
            localStorage.setItem("angRoutes", JSON.stringify($scope.routes));
            return $scope.routes[$scope.routes.length - 1];
        },
        checkRoute: function (route) {
            if ($scope.currentRoute.indexOf('/main') > -1) {
                return false;
            } else if ($scope.currentRoute.indexOf('/notSignedIn') > -1 ) {
                return false;
            } else if ($scope.currentRoute.indexOf('/resultUpload') > -1) {
                return false;
            } else if ($scope.currentRoute.indexOf('/clicker/Connect') > -1) {
                return false;
            } else if ($scope.currentRoute.indexOf('/downloadClicker') > -1) {
                return false;
            } else if ($scope.currentRoute.indexOf('/uploadToServer') > -1) {
                return false;
            }
            return true;
        },
        goBack: function ($rootScope, $location, isFromKendo) {
            $scope.routes = JSON.parse(localStorage.getItem("angRoutes"));
            $scope.currentRoute = $scope.routes[$scope.routes.length - 1];
            if (!isFromKendo && $scope.currentRoute.indexOf('/kendo') > -1) {
                kConnector.navigateBack();
                return false;
            }
            if (!svc_AngularHistory.checkRoute(prevRoute)) {
                return false;
            }
            $scope.currentRoute = $scope.routes.pop();
            $scope.ignoreNextRoute = true;
            localStorage.setItem("angRoutes", JSON.stringify($scope.routes));
            var prevRoute = $scope.routes[$scope.routes.length - 1];
            if ($rootScope.$$phase) {
                 $location.path(prevRoute);
            } else {
                $rootScope.$apply(function () {
                    $location.path(prevRoute);
                });
            }
        },
        clearRoutes: function () {

            if ($scope.routes.length > 2) {
                $scope.routes = $scope.routes.splice($scope.routes.length - 2, $scope.routes.length - 1);
                localStorage.setItem("angRoutes", JSON.stringify($scope.routes));
            }

            var kendoRoutes = JSON.parse(localStorage.getItem("kendoRoutes"));
            if (kendoRoutes.length > 2) {
                kendRoutes = kendoRoutes.splice(kendoRoutes.length - 2, kendoRoutes.length - 1);
                localStorage.setItem("kendoRoutes", JSON.stringify(kendoRoutes));
            }
            
            //$scope.routes = [$scope.currentRoute];
            //console.log($scope.routes);
            //localStorage.setItem("angRoutes", JSON.stringify($scope.routes));
        }
    };


    $.extend(window, {
        svc_AngularHistory: $scope,
    });
})
(jQuery, console, window);