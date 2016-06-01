(function ($, console, win) {

    var $scope = {

        calculatePoints: function (success, fail) {
            return parseInt(success) * 2 + parseInt(fail);
        }

    };


    $.extend(window, {
        kmodel_Points: $scope,
    });
})
(jQuery, console, window);