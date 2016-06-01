App.factory("requestHelper", function ($q, $http) {

    function post(def, data, firstTry) {
        //firstTry = typeof firstTry !== 'undefined' ? firstTry : true;
        //data.token = window.localStorage.getItem('token');
        //$http.post(VAR_SERVER, data)
        //           .success(function (data, status, headers, config) {
        //               console.log("request sucessfoul");
        //               console.log(data);
        //               if (data.success == 1) {
        //                   def.resolve(data.data);
        //               } else {
        //                   if(!firstTry){
        //                       //relocatat na main menu ili javit korisniku da je server dole
        //                       def.reject(data.message);
        //                   }else{
        //                       //napraviti def2 i prosljedit ga loginu koji ce kad se rjesi opet pozvati samog sebe sa
        //                       post(def,data,false);
        //                   }
        //               }
        //           }).error(function (data, status) {
        //               //relocatat na main menu ili javit korisniku da je server dole
        //               def.reject(false);
        //           });
        window.kendo_RequestHelper.post(def, data, firstTry);
    }



    return {
        post: post
    };
});