App.controller("ctrl_SingleAchivment", function ($scope, $q,model_Achivement,$routeParams) {

    $scope.loading = true;
    $scope.dogLevel = 87;
    $scope.dogUserId = $routeParams.dogUserId;
    $scope.trickId = $routeParams.trickId;

    
    var def = $q.defer();
    def.promise.then(function (data) {
        console.log(data);
        
        
        $scope.level = data.level
        $scope.dogName = data.dogName;
        $scope.dogPic = data.dogSmall;             
        $scope.picTaken = data.hasImage;
        
        if(data.picTaken){
            console.log("setting it up");
            
            $('#trickPic').attr('src', data.trickPic);
//            $scope.trickPic = data.imageSrc;
        }else{
            $('#trickPic').attr('src','res/achivementWon.png');
        }
        
        
        $scope.trickName = data.trickName;
        $scope.pointsWon = parseInt(data.total)-parseInt(data.success)+parseInt(data.success) *2 ;

        $scope.loading = false;
        
        
        $scope.daysTrained = 6;
        
        
        if (data.achivmentLevel == 0) {  
            $scope.trickTitle = 'Beginner of ' + $scope.trickName;
        }else if(data.achivmentLevel == 1){
           $scope.trophy1 = 'res/badge1.png'; 
           $scope.trickTitle = 'Sargent of ' + $scope.trickName;
        } else if (data.achivmentLevel == 2) {
            $scope.trophy1 = 'res/badge1.png';
            $scope.trophy2 = 'res/badge2.png';
            $scope.trickTitle = 'Defender of ' + $scope.trickName;
        } else if (data.achivmentLevel == 3) {
            $scope.trophy1 = 'res/badge1.png';
            $scope.trophy2 = 'res/badge2.png';
            $scope.trophy3 = 'res/badge3.png';
            $scope.trickTitle = 'Defender of ' + $scope.trickName;
        } else if (data.achivmentLevel == 4) {
            $scope.trophy1 = 'res/badge1.png';
            $scope.trophy2 = 'res/badge2.png';
            $scope.trophy3 = 'res/badge3.png';
            $scope.trophy4 = 'res/badge4.png';
            $scope.trickTitle = 'Jedi of ' + $scope.trickName;
        }

    },function(error){
        alert(error);
    });
    
    model_Achivement.getAchievmentData(def, [$scope.dogUserId,$scope.trickId]);



});
