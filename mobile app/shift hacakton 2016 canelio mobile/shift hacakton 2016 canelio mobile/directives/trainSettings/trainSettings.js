App.directive('trainSettings', function (dateHelper ,$parse) {
    return {
        restrict: "C",
        templateUrl: 'directives/trainSettings/trainSettings.html',
        link: function ($scope, $element, $attrs) {
            if (typeof $scope.trainTypeChanged !== "function") {
                $scope.trainTypeChanged = function () {
                }
            }
            

            $scope.trainSettings_isSelected = function (type) {
                if (type == $scope.trainingType)
                    return true;
                else
                    return false;
            }





        }
    }
});