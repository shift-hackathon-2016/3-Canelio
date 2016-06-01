App.directive('datesPicker', function (dateHelper ,$parse) {
    return {
        restrict: "C",
        templateUrl: 'directives/datesPicker/datesPicker.html',
        link: function ($scope, $element, $attrs) {

            if (typeof $scope.datesChanged !== "function") {
                $scope.datesChanged = function () {
                }
            }
            $scope.datesPicker_toPickerFocused = function () {
                $('#toPicker').data('kendoDatePicker').open();
            }
            $scope.datesPicker_fromPickerFocused = function (id) {
                $('#fromPicker').data('kendoDatePicker').open();
            }

            $scope.lastDaysClicked = function (days) {
                var from = dateHelper.getDateMinusDays(days, true);
                var to = dateHelper.getCurrentDate(true);
                $scope.datesPicker_fromObject = from;
                $scope.datesPicker_toObject = to;
                from = dateHelper.formatDateForDb(from);
                to = dateHelper.formatDateForDb(to);

                $scope.datesPicker_pick = days;
                $scope.datesChanged(from, to);
                $scope.showDatesPicker = false;
               
            }

            $scope.datesPicker_costumeDatesClicked = function () {
                if ($scope.datesPicker_fromObject > $scope.datesPicker_toObject) {
                    alertify.error("From date must be before To date");
                    $scope.datesPicker_fromObject = $scope.datesPicker_toObject;
                    $('#fromPickerContainer').addClass('datesError');
                    setTimeout(function () {
                        $('#fromPickerContainer').removeClass('datesError');
                    }, 3000);
                    return null;
                }

                $scope.datesPicker_pick = 'custome';
                console.log("custome");
                console.log($scope.datesPicker_fromObject)
                $scope.datesChanged(dateHelper.formatDateForDb($scope.datesPicker_fromObject), dateHelper.formatDateForDb($scope.datesPicker_toObject));
                $scope.showDatesPicker = false;
            }

            $scope.datesPicker_isSelected = function (pick) {
                if ($scope.datesPicker_pick == pick) {
                    return true;
                }
                return false;
            }
            
            $scope.lastDaysClicked(9999);
            //$scope.datesPicker_fromObject = new Date();
            //$scope.datesPicker_toObject = new Date();



        }
    }
});