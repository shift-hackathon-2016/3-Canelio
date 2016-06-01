App.factory("model_Tricks", function ($q, $http, requestHelper, db_Tricks, db_Sync) {

    //function getTricks(def, data) {
    //    var def2 = $.Deferred()
    //    var promise = def2.promise();
    //    promise.then(function (data) {
    //        localStorage.setItem('tricks', JSON.stringify(data));
    //        def.resolve(data);
    //    }, function (error) {
    //        def.resolve(JSON.parse(localStorage.getItem('tricks')));
    //    });
    //    kmodel_MyTricks.getAllTricks(def2, data);
    //}

    function getTricks(def,data) {
        db_Tricks.getTricks(def, data);
    }

    function getTricksFromServer(def,data) {
        var obj = {
            "class": "trick",
            "method": "getAllTricks",
            "data": {some:"thing"}
        }
        requestHelper.post(def, obj);
    }

    function saveTricks(def,data) {
        db_Sync.saveTricks(def, data)
    }

    function createNewTrick(def, data) {
        db_Tricks.createNewTrick(def, data);
    }


    function pushReorder(data) {
        //preslozi ih
        var serverAr = [];
        for (var i = 0; i < data.length; i++) {
            serverAr.push({
                'trick_id': data[i].id,
                'ordinal':data[i].ordinal
            })
        }
        var def2 = $.Deferred()
        var promise = def2.promise();
        promise.then(function (data) {
            //cleraj reordering needed
            localStorage.removeItem("trickReoderSync");
        }, function (error) {
            //saveaj u localstorage reodering needed
            localStorage.setItem("trickReoderSync", true);
        });
        kmodel_MyTricks.reorderTricks(def2, serverAr);
        db_Tricks.reorederTricks(data);
    }

    function deleteTrick(def,data) {
        db_Tricks.deleteTrick(def,data);
    }

    function getTrickImage(def, data) {
        var obj = {
            "class": "trick",
            "method": "getImageSmall",
            "data": data
        }
        requestHelper.post(def, obj);
    }


    return {
        getTricks: getTricks,
        pushReorder: pushReorder,
        saveTricks: saveTricks,
        getTricksFromServer: getTricksFromServer,
        createNewTrick: createNewTrick,
        deleteTrick: deleteTrick,
        getTrickImage: getTrickImage
    };
});