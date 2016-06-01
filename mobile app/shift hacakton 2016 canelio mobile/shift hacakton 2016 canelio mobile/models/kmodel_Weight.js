(function ($, console, win) {

    var $scope = {

        save: function (def, weight) {
            data = {
                weight: weight,
                dateTime: kendo_DateHelper.getCurrentTimestamp()
                };
            var obj = {
                "class": "weight",
                "method": "saveWeight",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },
        getData: function (def, data) {
            var obj = {
                "class": "weight",
                "method": "getWeightByDate",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },
        getWeighCount: function (def, data) {
            var obj = {
                "class": "weight",
                "method": "getWeighCount",
                "data": null
            }
            kendo_RequestHelper.post(def, obj);
        },
        getWeighPaged: function (def, data) {
            var obj = {
                "class": "weight",
                "method": "getWeightPaged",
                "data": data
            }
            console.log("sending obj");
            kendo_RequestHelper.post(def, obj);
        },
        deleteWeight: function (def, data) {
            var obj = {
                "class": "weight",
                "method": "deleteWeight",
                "data": data
            }
            console.log("sending obj");
            kendo_RequestHelper.post(def, obj);
        }
    };


    $.extend(window, {
        kmodel_Weight: $scope,
    });
})
(jQuery, console, window);