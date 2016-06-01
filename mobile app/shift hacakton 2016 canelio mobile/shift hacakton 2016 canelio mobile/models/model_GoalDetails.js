App.factory("model_GoalDetails", function ($q, $http, requestHelper, $cordovaFile, db_Trainig) {

    var detailsData;

    function getTricksForPeriod(def, data) {
        //var obj = {
        //    "class": "goal",
        //    "method": "getTricksDoneForPeriod",
        //    "data": data
        //}
        //kendo_RequestHelper.post(def, obj);
        db_Trainig.getTricksDoneForPeriod(def, data);
    }

    function setDetailsData(data) {
        detailsData = data;
    }

    function getDetailsData() {
        return detailsData;
    }

   


    return {
        getTricksForPeriod: getTricksForPeriod,
        setDetailsData: setDetailsData,
        getDetailsData: getDetailsData
    };
});