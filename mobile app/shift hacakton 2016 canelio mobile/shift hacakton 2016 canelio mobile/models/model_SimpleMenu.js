App.factory("model_SimpleTrainMenu", function ($q, $http, requestHelper) {

    function getTricks(def, data) {
        var def2 = $.Deferred()
        var promise = def2.promise();
        promise.then(function (data) {
            localStorage.setItem('tricks', JSON.stringify(data));
            def.resolve(data);
        }, function (error) {
            def.resolve(JSON.parse(localStorage.getItem('tricks')));
        });
        kmodel_MyTricks.getAllTricks(def2, data);
    }

    function getDailyProgress(def, data) {

    }

    function reoderTricks(def,data) {

    }



    return {
        getTricks: getTricks,
        getDailyProgress: getDailyProgress
    };
});