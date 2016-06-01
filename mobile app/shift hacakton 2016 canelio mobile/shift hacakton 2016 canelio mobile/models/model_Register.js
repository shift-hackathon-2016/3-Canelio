App.factory("model_Register", function ($q, $http, model_Login) {

    function register(def, data) {
        var obj = {
            "class": "user",
            "method": "register",
            "data": data
        }
        var defer = $q.defer();
        defer.promise.then(function (data) {
            //db_Manager.createTables();
            model_Login.saveData(data);
            def.resolve(true);
        }, function (error) {
            def.reject(error);
        });
        kendo_RequestHelper.post(defer, obj , false);
    }

    function resetPassword(def, data) {
        var obj = {
            "class": "user",
            "method": "passRetrivalByEmail",
            "data": data
        }
        kendo_RequestHelper.post(def, obj, false);
    }



    return {
        register: register,
        resetPassword: resetPassword
    };
});