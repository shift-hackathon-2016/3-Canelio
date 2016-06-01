App.factory("db_Tricks", function ($q, $http, requestHelper, $cordovaFile) {

    function getTricks(def, data) {
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT id,name,ordinal FROM tricks ORDER BY ordinal asc",
                [], function (tx, res) {
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

    function getFirst5Ids(def,data){
        canelio_db.transaction(function (tx) {
            tx.executeSql("SELECT id,name FROM tricks ORDER BY ordinal asc LIMIT 5 OFFSET 0",
                [], function (tx, res) {
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

    function reorederTricks(data) {
        canelio_db.transaction(function (tx) {
            for (var i = 0; i < data.length; i++) {
                tx.executeSql("UPDATE tricks SET ordinal =? WHERE id =?",
                    [data[i].ordinal, data[i].id], function (tx, res) {
                   
                    }, function (e) {
                    });
            }
        });
    }

    function createNewTrick(def, data) {
        canelio_db.transaction(function (tx) {
            console.log("tricks are...................");
            console.log(data);
            tx.executeSql("UPDATE tricks SET ordinal =ordinal+1 WHERE ordinal > 5", [],
            function (tx, res) {
                tx.executeSql("INSERT INTO tricks (id, name,ordinal) VALUES (?,?,?)", [data.id, data.name, 6],
                    function (tx, res) {
                        def.resolve(true);
                    }, function (e) {
                });
            }, function (e) {
            });

        });
    }

    function deleteTrick(def, data) {
        canelio_db.transaction(function (tx) {
            console.log("tricks are...................");
            console.log(data);
            tx.executeSql("DELETE FROM tricks WHERE id = ?", [data],
            function (tx, res) {
                def.resolve(true);
            }, function (e) {
            });

        });
    }

   


    return {
        getTricks: getTricks,
        reorederTricks: reorederTricks,
        createNewTrick: createNewTrick,
        deleteTrick: deleteTrick,
        getFirst5Ids: getFirst5Ids
    };
});