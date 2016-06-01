App.controller("ctrl_LevelDetails", function ($scope, $q, $location, model_Dog,model_Level) {
    
    $scope.title = 'Ranking Title';
    model_Dog.getDogImage().then(function (src) {
        console.log(src);
        if (src != null) {
            $scope.dogImage = src;
        }
        
    }, function (error) { });

    var lvlPoints = model_Level.getLevelPoints();
    console.log(lvlPoints);
    $scope.level = lvlPoints.lvl;
    $scope.rankingTitle = lvlPoints.title;

});
