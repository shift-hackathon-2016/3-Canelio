App.factory("model_Share", function ($q, $http, requestHelper, $rootScope, $location) {

    function shareAchivment(def, id) {
        data = { id: id };
        var obj = {
            "class": "achievment",
            "method": "shareAchievment",
            "data": data
        }
        kendo_RequestHelper.post(def, obj);
    }



    return {
        shareAchivment: shareAchivment,
    };
});