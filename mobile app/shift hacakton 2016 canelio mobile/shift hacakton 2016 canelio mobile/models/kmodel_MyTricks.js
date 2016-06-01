(function ($, console, win) {

    var $scope = {

        createTrick: function (def, data) {
            var def2 = $.Deferred()
            def2.promise().then(function (def2Data) {
                var $body = angular.element(document.body);
                var model_Tricks = $body.injector().get('model_Tricks');
                var trickSaveData = {
                    id: def2Data.trickId,
                    name: data.name
                }
                model_Tricks.createNewTrick(def, trickSaveData);
            }, function (error) {
                def.reject(error);
            });
            var obj = {
                "class": "trick",
                "method": "createTrick",
                "data": data
            }
            kendo_RequestHelper.post(def2, obj);

        },
        nmTricks: function (def, data) {
            var obj = {
                "class": "trick",
                "method": "numberOfTricks",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },
        getTricks: function (def, data) {
            var obj = {
                "class": "trick",
                "method": "getTricks",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },
        getAllTricks: function (def, data) {
            var obj = {
                "class": "trick",
                "method": "getAllTricks",
                "data": { myTrick:1}
            }
            kendo_RequestHelper.post(def, obj);
        },
        reorderTricks:function(def,data){
            var obj = {
                "class": "trick",
                "method": "reoderTricks",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },
        deleteTrick: function (def, data) {
            var def2 = $.Deferred()
            def2.promise().then(function (def2Data) {
                var $body = angular.element(document.body);
                var model_SimpleTrainMenu = $body.injector().get('model_Tricks');
                model_SimpleTrainMenu.deleteTrick(def, data.trick_id);
            }, function (error) {
                def.reject();
            });
            var obj = {
                "class": "trick",
                "method": "deleteTrick",
                "data": data
            }
            kendo_RequestHelper.post(def2, obj);
        },

    };


    $.extend(window, {
        kmodel_MyTricks: $scope,
    });
})
(jQuery, console, window);