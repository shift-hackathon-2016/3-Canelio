(function ($, console, win) {

    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    var $scope = {
        getCurrentDate: function (inDateFormat) {
            var date = new Date();
            if (inDateFormat) {
                return date;
            }
            return $scope.formatDateForDb(date);
        },
        getDateMinusDays: function (days, inDateFormat) {
            var d = new Date() - 1000 * 60 * 60 * 24 * days;
            d = new Date(d);
            if (inDateFormat) {
                return d;
            }
            return $scope.formatDateForDb(d);
        },
        calculateDateMinusDays: function(date,days,inDateFormat){
            var d = date - 1000 * 60 * 60 * 24 * days;
            d = new Date(d);
            if (inDateFormat) {
                return d;
            }
            return $scope.formatDateForDb(d);
        },
        formatDateForDb: function (date) {
            var str = date.getFullYear() +
                '-' + pad(date.getMonth() + 1) +
                '-' + pad(date.getDate());
            return str;
        },
        getCurrentTimestamp: function () {
            var date = new Date();
            var str = date.getFullYear() +
                '-' + pad(date.getMonth() + 1) +
                '-' + pad(date.getDate()) +
                ' ' + pad(date.getHours()) +
                ':' + pad(date.getMinutes()) +
                ':' + pad(date.getSeconds());
            return str;
        },
        getDateFromIsoFormat: function (dbDate) {
            var dateParts = dbDate.split("-");
            var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
            return jsDate;
        }
    };


    $.extend(window, {
        kendo_DateHelper: $scope,
    });
})
(jQuery, console, window);