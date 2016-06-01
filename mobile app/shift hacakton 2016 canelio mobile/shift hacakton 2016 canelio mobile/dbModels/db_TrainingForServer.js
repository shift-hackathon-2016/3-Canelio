App.factory("db_TrainingForServer", function ($q, $http, requestHelper, $cordovaFile) {

    function insertTraining(def, data) {
        if (data.length == 0) {
            def.resolve(true);
        }
        var executed = 0;
        canelio_db.transaction(function (tx) {
            for (var i = 0; i < data.length; i++) {
                tx.executeSql("INSERT INTO trainingForUpload (time, trick_id,timesSuccess,timesTrained) VALUES (?,?,?,?)",
                    [data[i].time, data[i].trick_id, data[i].timesSuccess, data[i].timesTrained], function (tx, res) {
                        executed++;
                        if (executed == data.length) {
                            def.resolve(true);
                        }
                }, function () {
                    console.log("insert fail");
                });
            }

        });
    }

    function insertTrainingSingleRep(def, data) {

            if (data.length == 0) {

                def.resolve(true);
            } else {
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
                        tx.executeSql("SELECT COUNT(*) as cnt, timesSuccess,timesTrained FROM trainingForUpload WHERE time=? AND trick_id =?", [data.time, data.trick_id], function (tx, res) {
                            var row = res.rows.item(0);
                            if (row.cnt != 0) {
                                //ako postoji zapis
                                tx.executeSql("UPDATE trainingForUpload SET timesSuccess=? , timesTrained =? WHERE time=? AND trick_id =?",
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
                                tx.executeSql("INSERT INTO trainingForUpload (time, trick_id,timesSuccess,timesTrained) VALUES (?,?,?,?)", [data.time, data.trick_id, data.timesTrained, data.timesSuccess], function (tx, res) {
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



    function getTotalTrainings(def, bufferRowsOfData) {
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT COUNT(*) as cnt FROM trainingForUpload", [], function (tx, res) {
                def.resolve({ totalRows: res.rows.item(0).cnt, bufferSize: bufferRowsOfData });
            }, function (e) {
                    console.log("get total training failed");
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function getTraining(def, offset, bufferRowsOfData) {
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM trainingForUpload ORDER BY ROWID ASC LIMIT ? OFFSET ? ",
                [ bufferRowsOfData, offset], function (tx, res) {
                    var returned = [];
                    for (var i = 0; res.rows.length > i; i++) {
                        returned.push(res.rows.item(i));
                    }
                    def.resolve(returned);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function deleteRows(def, bufferSize) {
        canelio_db.transaction(function (tx) {
            tx.executeSql("DELETE FROM trainingForUpload WHERE ROWID IN (SELECT ROWID FROM trainingForUpload ORDER BY ROWID ASC LIMIT ?) ",
                [bufferSize], function (tx, res) {
                    def.resolve(true);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }


    return {
        insertTraining: insertTraining,
        insertTrainingSingleRep:insertTrainingSingleRep,
        getTotalTrainings: getTotalTrainings,
        getTraining: getTraining,
        deleteRows: deleteRows
    };
});