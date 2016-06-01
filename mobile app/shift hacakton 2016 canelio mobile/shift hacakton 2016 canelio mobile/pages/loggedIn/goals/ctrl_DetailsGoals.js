App.controller("ctrl_DetailsGoals", function ($scope, $q, $location, $routeParams, model_Goal, model_GoalDetails, stringHelper) {
    
    $scope.day = model_GoalDetails.getDetailsData();
    console.log("----------------details");
    console.log($scope.day);
    $scope.title = $scope.day.title;
    $scope.goal = model_Goal.getGoal($scope.day.type);
    console.log($scope.goal);


    if ($scope.day.trained) {
        console.log("trained true");
        console.log($scope.day);
        $scope.goalTrained = true;
        $scope.trainedReps = parseInt($scope.day.trained);
        $scope.trainedGoal = Math.ceil(($scope.trainedReps/ $scope.goal) *100) ;
    } else {
        $scope.trainedReps = 0;
        $scope.trainedGoal = 0;
    }
    if ($scope.day.goalAchieved) {
        console.log("goalAchieved true");
        $scope.goalSuccess = true;
    }


    data = {
        from: kendo_DateHelper.getTimestampFromDate($scope.day.from.toDate()),
        to: kendo_DateHelper.getTimestampFromDate($scope.day.to.toDate()),
    };
    var def = $q.defer();

    var timeout;
    var shouldBlockNavigate = false;

    def.promise.then(function (data) {
        console.log("trick details data");
        console.log(data);
        for (var i = 0; data.length > i; i++) {
            data[i].trickName = stringHelper.formatWith3Dots(data[i].trickName, 21, 224, $('body').width() * 0.7);
            data[i].percentGoal = Math.ceil((data[i].timesTrained / $scope.trainedReps) * 100);
            data[i].successPercent = Math.ceil((data[i].timesSuccess / data[i].timesTrained) * 100);
        }
        $scope.tricks = data;

        console.log("is inside");
        var wrapper = document.getElementById('detailsGoalsScroller');
        $('#detailsGoalsScroller').css('height', $('body').height() - 48);
        myScroll = new IScroll(wrapper, { useTransition: true, preventDefault: false });
        
        

        myScroll.on('scrollStart', function () {
            console.log("blocking");
            clearTimeout(timeout);
            
            shouldBlockNavigate = true;
        });
        myScroll.on('scrollEnd', function () {
            console.log("remove block");
            timeout = setTimeout(function () {
                shouldBlockNavigate = false;
            }, 100);
            
            
        });
        var statusHeigh = 190;
        var tricksHeight = 20 + $scope.tricks.length * 60;
        console.log("something");
        var totalHeight = statusHeigh + tricksHeight
        console.log(totalHeight);
        myScroll.refresh(totalHeight, 0);
        console.log(totalHeight);
        if (data.length == 0) {
            $scope.noTricksDone = true;
        }

    }, function () {

    });

    $scope.calculateTrickWidth = function (trick) {
        return {
            width: trick.successPercent + '%'
        }
    }

    $scope.goToTrickStatistics = function (trick) {
        console.log($scope.blockNavigate);
        if (shouldBlockNavigate) {
            return null;
        }
        console.log(trick);
        $location.path('/statistics/trick/' + trick.trickId);
    }

    model_GoalDetails.getTricksForPeriod(def, data);
});
