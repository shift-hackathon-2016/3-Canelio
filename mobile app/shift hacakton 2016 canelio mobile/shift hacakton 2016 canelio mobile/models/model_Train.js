App.factory("model_Train", function ($q, $http, requestHelper, model_GoalDaily, model_Level, db_Trainig, model_ServerSync, db_TrainingForServer) {

    function train(def, data) {
        console.log(data);
        data.dateTimeTrained = data.dateTimeTrained.substr(0, 14) + '00:00';
        model_Level.updatePoints(data);
        var obj = {
            "class": "training",
            "method": "train",
            "data": data
        }
        var def2 = $q.defer();
        def2.promise.then(function (success) {
            def.resolve(success)

        }, function () {
            console.log("resolved fail");
            console.log(data);
            var trainingForSeverData = {
                time: moment(data.dateTimeTrained).unix(),
                timesSuccess: data.timesSuccess,
                timesTrained: data.timesTrained,
                trick_id: data.trick_id
            }
            console.log("insert data");
            console.log(trainingForSeverData);
            var def3 = $q.defer();
            db_TrainingForServer.insertTrainingSingleRep(def3, [trainingForSeverData]);
            model_ServerSync.setSync();
            db_Trainig.todayTrickStatistics(def, data);
        });
        console.log("senidng obj-----------");
        console.log(obj);
        db_Trainig.insertTraining(data);
        if (model_ServerSync.isSyncNeeded()) {
            console.log("should reject");
            def2.reject();
        } else {
            requestHelper.post(def2, obj);
        }

        
    }



    function saveTrainingOffline() {

    }



    return {
        train: train,
        saveTrainingOffline: saveTrainingOffline
    };
});