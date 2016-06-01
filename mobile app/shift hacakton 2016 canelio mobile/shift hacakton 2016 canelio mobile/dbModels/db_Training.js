App.factory("db_Trainig", function ($q, $http, requestHelper, $cordovaFile) {

    function trickStatisticsData(def, data) {
        var from = moment(data.from).startOf('day').unix();
        var to = moment(data.to).endOf('day').unix();
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT SUM(timesSuccess) as success,SUM(timesTrained) as total,strftime('%Y-%m-%d'," + 'time' + ",'unixepoch') AS 'date' FROM training"
                + " WHERE trick_id = ? AND time >= ? AND time <= ? GROUP BY strftime('%Y-%m-%d'," + 'time' + ",'unixepoch')  order by time desc",
                [data.trick_id, from, to], function (tx, res) {
                    var returned;
                    if (res.rows.length == 0) {
                        returned = [];
                    } else {
                        var ar = [];
                        for (var i = 0; res.rows.length > i; i++) {
                            ar.push(res.rows.item(i));
                        }
                        returned = ar;
                    }
                    def.resolve(returned);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function insertTraining(data) {

        
        var time = moment(data.dateTimeTrained);
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT COUNT(*) as cnt, SUM(timesSuccess) as success,SUM(timesTrained) as total from training where time = ? AND  trick_id= ? ",
                [time.unix(), data.trick_id, ], function (tx, res) {
                    if (res.rows.item(0).cnt == 0) {
                        tx.executeSql("INSERT INTO training (time, trick_id,timesSuccess,timesTrained) VALUES (?,?,?,?)",
                        [time.unix(), data.trick_id, data.timesSuccess, data.timesTrained], function (tx, res) {
                            //tx.executeSql("SELECT COUNT(*) as cnt, SUM(timesSuccess) as success,SUM(timesTrained) as total,strftime('%Y-%m-%d'," + 'time' + ",'unixepoch') AS 'date' FROM training"
                            //+ " WHERE time =? AND trick_id =? ", [time.unix(), data.trick_id], function (tx, res) {
                            //    console.log("training aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                            //    console.log(res.rows.item(0));
                            //    console.log(res.rows.item(0).date);
                            //});
                        }, function () {
                            console.log("insert fail");
                        });
                    } else {
                        //update
                        var total = res.rows.item(0).total + data.timesTrained;
                        var success = data.timesSuccess + res.rows.item(0).success;
                        tx.executeSql("UPDATE training  SET  timesSuccess = ?,timesTrained = ? WHERE time = ? AND trick_id = ?",
                        [success,total,time.unix(), data.trick_id], function (tx, res) {
                            console.log("insert success");
                        });
                    }


            });
            

        });
    }

    function todayTrickStatistics(def, data) {
        var from = moment(data.dateTime).startOf('day').unix();
        var to = moment(data.dateTime).endOf('day').unix();
        canelio_db.readTransaction(function (tx) {
            tx.executeSql("SELECT  COUNT(*) as cnt,SUM(timesTrained) as timesTrained,SUM(timesSuccess) as timesSuccess FROM training"
                + " WHERE trick_id = ? AND time >= ? AND time <= ?",
                [data.trick_id, from, to], function (tx, res) {
                    var returned;
                    if (res.rows.item(0).cnt == 0) {
                        returned = [];
                    } else {
                        returned = res.rows.item(0);
                    }
                    console.log("returning");
                    console.log(returned);
                    def.resolve(returned);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function goalDailyForPeriod(def, data) {
        var from = moment(data.from);
        var to = moment(data.to);
        var fromUnix = moment(data.from).startOf('day').unix();
        var toUnix = moment(data.to).endOf('day').unix();
        var goal = data.goal;
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT SUM(timesTrained) as total,strftime('%Y-%m-%d'," + 'time' + ",'unixepoch') AS 'date' FROM training"
                + " WHERE time >= ? AND time <= ? GROUP BY strftime('%Y-%m-%d'," + 'time' + ",'unixepoch')  order by time desc",
                [fromUnix, toUnix], function (tx, res) {
                    var returned;

                    var ar = [];
                    for (var i = 0; res.rows.length > i; i++) {
                        ar.push(res.rows.item(i));
                    }
                    returned = ar;
                    var endReached = false;
                    var resultsPointer = returned.length -1;
                    var fromDate = to.format('YYYY-MM-DD');
                    var currentDate = moment(data.from);
                    var dates = [];
                    while (!endReached) {
                        var currentDateFormatted = currentDate.format('YYYY-MM-DD');
                        currentDate = currentDate.endOf('day');
                        if (resultsPointer != -1 && returned[resultsPointer].date == currentDateFormatted) {
                            returned[resultsPointer].day = currentDate.format('D');
                            if (goal <= returned[resultsPointer].total) {
                                returned[resultsPointer].goalAchieved = true;
                            } else {
                                returned[resultsPointer].goalAchieved = false;
                            }
                            dates.push(returned[resultsPointer]);
                            resultsPointer--;
                        }else{
                            var date = {
                                date: currentDateFormatted,
                                day: currentDate.format('D'),
                                goalAchieved: false,
                                nan : true,
                            }
                            dates.push(date);
                        }
                        if (fromDate == currentDateFormatted) {
                            endReached = true;
                        }
                        currentDate = currentDate.add('1', 's');
                    }

                    def.resolve(dates);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function goalWeeklyForPeriod(def, data) {
        var goal = data.goal;
        var weeks = data.weeks;
        var sqlsTotal = weeks.length;
        

        function getOneWeek(week, i) {
            var fromUnix = moment(data.weeks[i].from).startOf('day').unix();
            var toUnix = moment(data.weeks[i].to).endOf('day').unix();
            canelio_db.transaction(function (tx) {
                tx.executeSql("SELECT SUM(timesTrained) as total, count(*) as cnt FROM training"
                + " WHERE time >= ? AND time <= ?  ",
                    [fromUnix, toUnix], function (tx, res) {
                        var result = res.rows.item(0);
                        weeks[i].trained = result.total;
                        if (result.total >= goal) {
                            weeks[i].goalAchieved = true;
                        } else {
                            weeks[i].goalAchieved = false;
                        }
                        i++;
                        if (sqlsTotal == i) {
                            def.resolve(weeks);
                        } else {
                            getOneWeek(weeks[i], i);
                        }
                    }, function (e) {
                        console.log(e);
                        console.log("ERROR: " + e.message);
                    });
            });
        }
        getOneWeek(weeks[0], 0);

    }

    function getTricksDoneForPeriod(def, data) {
        var fromUnix = moment(data.from).startOf('day').unix();
        var toUnix = moment(data.to).endOf('day').unix();
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT trick_id as trickId,SUM(training.timesTrained) as timesTrained,SUM(timesSuccess) as timesSuccess , tricks.name as trickName FROM training JOIN tricks ON tricks.id = training.trick_id "
            + " WHERE training.time >= ? AND training.time <= ?  GROUP BY training.trick_id ",
                [fromUnix, toUnix], function (tx, res) {
                    var returned;
                    if (res.rows.length == 0) {
                        returned = [];
                    } else {
                        var ar = [];
                        for (var i = 0; res.rows.length > i; i++) {
                            ar.push(res.rows.item(i));
                        }
                        returned = ar;
                    }
                    def.resolve(returned);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function getTotalDoneForPeriod(def, data) {
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT SUM(timesTrained) as timesTrained  FROM training WHERE time >= ? AND time <= ? ",
                [data.from, data.to], function (tx, res) {
                    var returned;
                    if (res.rows.length == 0) {
                        returned = 0;
                    } else {
                        returned = res.rows.item(0).timesTrained
                    }
                    def.resolve(returned);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }

    function getTrickTotal(def, data) {
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT SUM(timesTrained) as timesTrained,SUM(timesSuccess) as timesSuccess   FROM training WHERE trick_id = ? ",
                [data.trickId], function (tx, res) {
                    var returned;
                    if (res.rows.length == 0) {
                        returned = {
                            timesTrained: 0,
                            timesSuccess: 0,
                        };
                    } else {
                        returned = res.rows.item(0);
                    }
                    def.resolve(returned);
                }, function (e) {
                    console.log(e);
                    console.log("ERROR: " + e.message);
                });
        });
    }


    return {
        trickStatisticsData: trickStatisticsData,
        getTrickTotal:getTrickTotal,
        insertTraining: insertTraining,
        todayTrickStatistics: todayTrickStatistics,
        goalDailyForPeriod: goalDailyForPeriod,
        goalWeeklyForPeriod: goalWeeklyForPeriod,
        getTricksDoneForPeriod: getTricksDoneForPeriod,
        getTotalDoneForPeriod: getTotalDoneForPeriod
    };
});