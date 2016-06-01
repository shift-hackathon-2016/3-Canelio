App.factory("model_Tricks", function ($q, $http, requestHelper, db_Tricks) {

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
        db_Tricks.getTricks();
    }

    function saveTricks(tricks) {
        localStorage.setItem("tricks", JSON.stringify(tricks));
    }


    function pushReorder(data) {
        //preslozi ih
        var tricks = getTricks();
        var newTricks = [];
        for (var i = 0 ; data.length > i; i++) {
            console.log("---------------------");
            console.log(data[i]);
            for (var j = 0 ; tricks.length > j ; j++) {
                console.log(data[j]);
                if (tricks[j].id == data[i].trick_id) {
                    newTricks.push(tricks[j]);
                }
            }
        }
        console.log("new trick list-----------");
        console.log(newTricks);
        localStorage.setItem("tricks", JSON.stringify(newTricks));
        console.log("tricks");
        console.log("push reoder data");
        console.log(data);
        var def2 = $.Deferred()
        var promise = def2.promise();
        promise.then(function (data) {
            //cleraj reordering needed
            localStorage.removeItem("trickReoderSync");
        }, function (error) {
            //saveaj u localstorage reodering needed
            localStorage.setItem("trickReoderSync", true);
        });
        kmodel_MyTricks.reorderTricks(def2, data);
    }


    return {
        getTricks: getTricks,
        pushReorder: pushReorder,
        saveTricks: saveTricks
    };
});