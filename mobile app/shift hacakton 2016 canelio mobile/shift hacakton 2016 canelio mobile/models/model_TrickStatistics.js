App.factory("model_TrickStatistics", function ($q, $http, requestHelper, db_Trainig) {

    function getData(def, data) {
        db_Trainig.trickStatisticsData(def, data);
        //var obj = {
        //    "class": "statistics",
        //    "method": "getTrickData",
        //    "data": data
        //}
        //requestHelper.post(def, obj);
    }

    function getTodayTraining(def,data) {
        //var obj = {
        //    "class": "statistics",
        //    "method": "getTodayTrainingData",
        //    "data": data
        //}
        //requestHelper.post(def, obj);
        db_Trainig.todayTrickStatistics(def, data);
    }

    function formatTrickSatistics(data) {
        return kmodel_TrickStatistics.formatTrickSatistics(data);
    }




    return {
        getData: getData,
        getTodayTraining:getTodayTraining,
        formatTrickSatistics: formatTrickSatistics
    };
});