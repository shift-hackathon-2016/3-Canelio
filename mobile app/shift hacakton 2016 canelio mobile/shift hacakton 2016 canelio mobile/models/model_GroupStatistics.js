App.factory("model_GroupStatistics", function ($q, $http, requestHelper) {

    function getData(def, level, data) {
        var obj = {
            "class": "statistics",
            "data": data
        }
        if(level == "subgroup"){
            obj.method = "getSubGroupData";
        } else if (level == "group") {
            obj.method = "getGroupData";
        }
        requestHelper.post(def, obj);
    }

    function formatGroupSatistics(ctrlDef, filePromise, level, data) {
        filePromise.then(function (fileData) {
            if (data.length == 0) {
                ctrlDef.reject("noData");
                return null;
            }

            var totalValues = {};
            var totalDone = 0;
            var trainings = [];
            var workingDate = "",
                highestSucessRate = 0,
                totalSuccess = 0,
                totalFail = 0,
                dayTraining;
            for (var i = 0; data.length > i; i++) {
                //shares
                if (typeof totalValues[data[i].trick_id] == "undefined") {
                    totalValues[data[i].trick_id] = 0;
                }
                totalValues[data[i].trick_id] += parseInt(data[i].total);
                totalDone +=  parseInt(data[i].total);

                //repetiotions and success rate
                if (workingDate !== data[i].date) {
                    if (typeof dayTraining != "undefined") {
                        dayTraining.date = workingDate;
                        dayTraining.successRate = Math.round((dayTraining.success / dayTraining.total) * 100);
                        highestSucessRate = highestSucessRate > dayTraining.successRate ? highestSucessRate : dayTraining.successRate;
                        totalSuccess += dayTraining.success;
                        totalFail += dayTraining.fail;
                        trainings.push(dayTraining);
                        dayTraining = {
                            success: 0,
                            fail: 0,
                            total: 0
                        };

                    } else {
                       dayTraining  = {
                            success: 0,
                            fail: 0,
                            total:0
                       }

                    }
                    workingDate = data[i].date;

                }

                dayTraining.success += parseInt(data[i].success);
                dayTraining.fail += parseInt(data[i].total) - parseInt(data[i].success);
                dayTraining.total += parseInt(data[i].total);

            }
            //add last day of training
            dayTraining.date = workingDate;
            dayTraining.successRate = Math.round((dayTraining.success / dayTraining.total)*100);

            highestSucessRate = highestSucessRate > dayTraining.successRate ? highestSucessRate : dayTraining.successRate;
            totalSuccess += dayTraining.success;
            totalFail += dayTraining.fail;
            trainings.push(dayTraining);

            //shares
            var shares = [];
            var formattedFileData = formatFile(level, fileData);
            angular.forEach(totalValues, function (value, key) {
                var share = {};
                if (typeof formattedFileData[key] == "undefined") {
                    share.name = "NONE -- please update app";
                } else {
                    share.name = formattedFileData[key];
                }
                share.value = value;

                share.percentage = Math.round((share.value / totalDone) * 100);
                shares.push(share);
            });
            //repetitions and success rate
            ctrlDef.resolve({
                shares: shares,
                trainings: trainings,
                highestSucessRate: highestSucessRate,
                totalFail: totalFail,
                totalSuccess: totalSuccess,
            });
        })
    }


    function formatFile(lvl, data) {

        if (lvl === "subgroup") {
            return formatSubGroupFile(data);
        } else if (lvl === "group") {
            return formatGroupFile(data);
        }
    };

    function formatGroupFile(data) {
        var ar = [];
        var tricks = data.subGroups;

        for (var i = 0; i < tricks.length; i++) {
            if (typeof tricks[i].id != "undefined") {
                ar[tricks[i].id] = tricks[i].name;
            } else {
                ar[tricks[i].trickId] = tricks[i].name;
            }
        }
        return ar;
    }

    function formatSubGroupFile(data) {
        var ar = [];
        var tricks = data.tricks;
        for (var i = 0; i < tricks.length; i++) {
            ar[tricks[i].id] = tricks[i].name;
        }
        return ar;
    }

    return {
        getData: getData,
        formatGroupSatistics: formatGroupSatistics
    };
});