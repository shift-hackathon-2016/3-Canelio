App.controller("ctrl_PassRetrival", function ($scope, $q,$location,model_Achivement,$routeParams,model_PassRetrival) {

   $scope.changePassword = function(){
       $scope.token = $routeParams.token;
       if($scope.p1 != $scope.p2){
           alertify.error("password doesnt match");
           return null
       }
       if($scope.p1 == null && $scope.p2 == ''){
            alertify.error("Please input password");
           return null
       }
         var def = $q.defer();
        def.promise.then(function (data) {
            console.log(data);
            $scope.step = 2;
        },function(){
            alertify.error("Something went wrong");
            $location.path('/passRetrival/email/');
        });
       model_PassRetrival.resetPassword(def,{p:$scope.p1, token:$scope.token});
       
   }
   


});
