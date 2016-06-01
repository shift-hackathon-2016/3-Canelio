App.factory("model_PassRetrival", function ($q) {

    function sendEmailRetrival(def,data) {
        var obj = {
            "class": "user",
            "method": "passRetrivalByEmail",
            "data": data
        }
        console.log("model sending");
        kendo_RequestHelper.post(def, obj);
    }
    
    function resetPassword(def,data) {
        var obj = {
            "class": "user",
            "method": "passRetrivalResetPassword",
            "data": data
        }
        kendo_RequestHelper.post(def, obj);
    }

    return {
        sendEmailRetrival: sendEmailRetrival,
        resetPassword:resetPassword
    };
});

