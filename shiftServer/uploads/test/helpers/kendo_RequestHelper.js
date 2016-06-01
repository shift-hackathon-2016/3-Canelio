(function ($, console, win) {

    var kendo_RequestHelper = {
        get: function (def, data ) {
            var url = VAR_SERVER+'/'+data.class +'/'+data.method+'/';
            for(var i=0; data.data.length > i;i++){
                url = url +encodeURIComponent(data.data[i])+'/';
            }
            console.log(url);
            $.ajax({
                type: "POST",
                url: url,
                crossDomain: true,
                success: function (data, status, headers, config) {
                    data = JSON.parse(data);

                    if (data.success == 1) {
                        def.resolve(data.data);
                    } 
                },
                error: function (data, status) {
                    //relocatat na main menu ili javit korisniku da je server dole
                           def.reject(data);
                }
            });

        },
        post: function (def, data) {
            var originalData = data;
            console.log(PUB_ENDPOINT);
            $.ajax({
                type: "POST",
                url: PUB_ENDPOINT,
                data: data,
                success: function (data, status, headers, config) {
                    data = JSON.parse(data);

                    if (data.success == 1) {
                        def.resolve(data.data);
                    } else {
                        def.reject({ message: data.message, errorCode: data.errorCode });
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