App.controller("ctrl_PassRetrivalEmail", function ($scope, $q,model_Achivement,$routeParams,model_PassRetrival) {
    
   
   
   $scope.sendEmail = function(){
       if($scope.email == '' ||$scope.email == null){
           alertify.error('Please input your email');
       }
        var def = $q.defer();
        def.promise.then(function (data) {
            $scope.step = 2;
        },function(){
            alertify.error("Inputed wrong email");
            $scope.email = '';
        });
       model_PassRetrival.sendEmailRetrival(def,{email:$scope.email});
   }


});
