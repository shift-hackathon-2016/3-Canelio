(function ($, console, win) {

    var $scope = {
        daysBetween: function (startDate, endDate) {
            var start = moment(startDate, $scope.inputFormat());
            var end = moment(endDate, $scope.inputFormat());
            var days = start.diff(end, "days");
            if (days == 0) {
                return '1 day';
            } else {
                return days+1 + ' days';
            }
        },
        inputFormat: function(){
            return "YYYY-MM-DD"
        }
    };


    $.extend(window, {
        kendo_DateCalculationsHelper: $scope,
    });
})
(jQuery, console, window);