App.factory("model_Achivement", function ($q) {

    function getAchievmentData(def,data) {
        var obj = {
            "class": "pub",
            "method": "achivement",
            "data": data
        }
        kendo_RequestHelper.get(def, obj);
    }

    return {
        getAchievmentData: getAchievmentData,
    };
});