App.directive('mainNav', function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: 'directives/mainNav/mainNav.html',
        link: function ($scope, $element, $attrs) {
            if (typeof $scope.navigateBack !== "function"){
                $scope.navigateBack = function () {
                    if (typeof $scope.navigateBackBefore === "function") {
                        $scope.navigateBackBefore();
                    }
                    $rootScope.goBack();
                }
            }
            if (typeof $scope.mainNav_datePicker_click !== "function") {
                $scope.mainNav_datePicker_click = function () {
                }
            }
            if ($attrs.datepicker == "true") {
                $scope.mainNav_datePicker_show = true;
            }
            if (typeof $scope.mainNav_settings_click !== "function") {
                console.log("overwriting mainav settings click");
                $scope.mainNav_settings_click = function () {
                }
            }
            if ($attrs.settings == "true") {
                $scope.mainNav_settings_show = true;
            }
            if (typeof $scope.mainNav_history_click !== "function") {
                $scope.mainNav_history_click = function () {
                }
            }
            if ($attrs.history == "true") {
                $scope.mainNav_history_show = true;
            }
            if (typeof $scope.mainNav_delete_click !== "function") {
                $scope.mainNav_delete_click = function () {
                }
            }
            if ($attrs.delete == "true") {
                $scope.mainNav_delete_show = true;
            }
            if (typeof $scope.mainNav_statistic_click !== "function") {
                $scope.mainNav_statistic_click = function () {
                }
            }
            if ($attrs.statistic == "true") {
                $scope.mainNav_statistic_show = true;
            }

        }
    }
});