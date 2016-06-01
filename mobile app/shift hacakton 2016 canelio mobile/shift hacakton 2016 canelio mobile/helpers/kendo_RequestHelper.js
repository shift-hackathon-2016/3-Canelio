(function ($, console, win) {

    var kendo_RequestHelper = {
        post: function (def, data , firstTry) {
            firstTry = typeof firstTry !== 'undefined' ? firstTry : true;
            data.token = window.localStorage.getItem('token');

            var originalData = data;
            $.ajax({
                type: "POST",
                url: VAR_SERVER,
                data: data,
                success: function (data, status, headers, config) {
                    data = JSON.parse(data);

                    if (data.success == 1) {
                        def.resolve(data.data);
                    } else {
                        if (!firstTry) {
                            //relocatat na main menu ili javit korisniku da je server dole
                            def.reject({ message: data.message, errorCode: data.errorCode });
                        } else {
                            var def2 = $.Deferred()
                            def2.promise().then(function (def2Data) {

                                kendo_RequestHelper.post(def, originalData, false);
                            }, function (error) {
                                //relog nije prosao
                                def.reject({ message: data.message, errorCode: data.errorCode });
                            });
                            var $body = angular.element(document.body);
                            var $model_Login = $body.injector().get('model_Login');
                            $model_Login.relog(def2);
                            //napraviti def2 i prosljedit ga loginu koji ce kad se rjesi opet pozvati samog sebe sa

                        }
                    }
                },
                error: function (data, status) {
                    //relocatat na main menu ili javit korisniku da je server dole
                           def.reject(data);
                       }
            });

        }
    };


    $.extend(window, {
        kendo_RequestHelper: kendo_RequestHelper,
    });
})
(jQuery, console, window);