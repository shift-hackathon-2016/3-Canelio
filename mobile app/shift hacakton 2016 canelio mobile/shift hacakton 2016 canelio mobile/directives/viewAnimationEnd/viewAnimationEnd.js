App.directive('viewAnimationEnd', function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: 'directives/viewAnimationEnd/viewAnimationEnd.html',
        link: function ($scope, $element, $attrs) {
            if (typeof $scope.navigateBack !== "function"){
                $scope.navigateBack = function () {
                    $rootScope.animateLeft();
                    window.history.back();
                }
            }
            if (typeof $scope.mainNav_datePicker_click !== "function") {
                $scope.mainNav_datePicker_click = function () {
                }
            }
            if ($attrs.datepicker == "true") {
                $scope.mainNav_datePicker_show = true;
            }

        }
    }
});