App.factory("db_Sync", function ($q, $http, requestHelper, $cordovaFile, db_TrainingForServer) {

    var bufferRowsOfData = 500;

    function getTotalTrainings(def){
        db_TrainingForServer.getTotalTrainings(def, bufferRowsOfData);
    }

    function getTraining(def, offset) {
        db_TrainingForServer.getTraining(def, offset, bufferRowsOfData);
    }

    function deleteUploadedTraining(def) {
        db_TrainingForServer.deleteRows(def, bufferRowsOfData);
    }

    function getBufferSize() {
        return bufferRowsOfData
    }

    function saveTraining(def, data ) {
        var executed = 0;
        canelio_db.transaction(function (tx) {
            for (var i = 0; i < data.length; i++) {
                tx.executeSql("INSERT INTO training (time, trick_id,timesSuccess,timesTrained) VALUES (?,?,?,?)", [data[i].time, data[i].trick_id, data[i].timesSuccess, data[i].timesTrained], function (tx, res) {
                    executed++;
                    if (executed == data.length) {
                        def.resolve(true);
                    }
                }, function (e) {
                    console.log("ERROR: " + e.message);
                });
            }
        });
        if (data.length == 0) {
            def.resolve(true);
        }
    }



  


    function saveTrainingFromClicker(def, data) {
        console.log("data length is");
        console.log(data.length);
        console.log(data);
        if (data.length == 0) {
            
            def.resolve(true);
        } else {
            console.log("in else");
            var executed = 0;
            var checkForUpdateTimeNeeded = false;
            var defExecuted = $q.defer();
            defExecuted.promise.then(function (data) {
                def.resolve(true);
            }, function (error) { }, function (update) {
                executed++;
                if (executed == data.length) {
                    defExecuted.resolve(true);
                }
            });
            canelio_db.transaction(function (tx) {
                function saveOrUpdateTraining(def, data, notify) {
                    tx.executeSql("SELECT COUNT(*) as cnt, timesSuccess,timesTrained FROM training WHERE time=? AND trick_id =?", [data.time, data.trick_id], function (tx, res) {
                        var row = res.rows.item(0);
                        if (row.cnt != 0) {
                            //ako postoji zapis
                            tx.executeSql("UPDATE training SET timesSuccess=? , timesTrained =? WHERE time=? AND trick_id =?",
                                [data.timesSuccess + row.timesSuccess, data.timesTrained + row.timesTrained, data.time, data.trick_id], function (tx, res) {
                                    if (notify) {
                                        def.notify(true);
                                    } else {
                                        def.resolve(true);
                                    }
                                }, function (e) {
                                    console.log("ERROR: " + e.message);
                                });
                        } else {
                            tx.executeSql("INSERT INTO training (time, trick_id,timesSuccess,timesTrained) VALUES (?,?,?,?)", [data.time, data.trick_id, data.timesSuccess, data.timesTrained], function (tx, res) {
                                if (notify) {
                                    def.notify(true);
                                } else {
                                    def.resolve(true);
                                }

                            }, function (e) {
                                console.log("ERROR: " + e.message);
                            });
                        }

                    }, function (e) {
                        console.log("ERROR: " + e.message);
                    });

                }

            for (var i = 0; i < data.length; i++) {
                    saveOrUpdateTraining(defExecuted, data[i], true);
                }
            });
        }
    }

    function saveTricks(def, data) {
        var inserted = 0;
        canelio_db.transaction(function (tx) {
            for (var i = 0; i < data.length; i++) {
                tx.executeSql("INSERT INTO tricks (id, name,ordinal) VALUES (?,?,?)", [data[i].id, data[i].name, data[i].ordinal],
                    function (tx, res) {
                        inserted++;
                        if (inserted == data.length) {
                            def.resolve(true);
                        }
                }, function (e) {

                });
            }
        });
    }

    return {
        getTotalTrainings: getTotalTrainings,
        getTraining: getTraining,
        getBufferSize: getBufferSize,
        saveTraining: saveTraining,
        saveTricks: saveTricks,
        saveTrainingFromClicker: saveTrainingFromClicker,
        deleteUploadedTraining: deleteUploadedTraining,
    };
});