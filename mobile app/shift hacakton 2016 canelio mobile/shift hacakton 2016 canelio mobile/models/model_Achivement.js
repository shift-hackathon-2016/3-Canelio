App.factory("model_Achivement", function ($q, $http, requestHelper) {

    function achivementsNumber(def, data) {
        var obj = {
            "class": "achievment",
            "method": "numberOfAchivements",
            "data": data
        }
        requestHelper.post(def, obj);
    }



    function getAchivements(def,data) {
        var obj = {
            "class": "achievment",
            "method": "getAchivements",
            "data": data
        }
        requestHelper.post(def, obj);
    }



    return {
        achivementsNumber: achivementsNumber,
        getAchivements: getAchivements
    };
});