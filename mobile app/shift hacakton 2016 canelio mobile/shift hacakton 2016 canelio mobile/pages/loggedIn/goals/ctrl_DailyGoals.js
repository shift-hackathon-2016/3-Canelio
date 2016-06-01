App.controller("ctrl_DailyGoals", function ($scope, $q, $location, $routeParams, model_Goal, model_GoalDaily, model_GoalDetails) {
    
    $scope.navigateBackBefore = function () {
        model_GoalDaily.clearFromTo();
    }

    if (!window.localStorage.getItem('tutorialGoals')) {
        $scope.goalsTutorialShow = true;
    }

    $scope.closeTutorial = function () {
        $scope.goalsTutorialShow = false;
        if ($scope.goalsTutorial) {
            window.localStorage.setItem('tutorialGoals', 'true');
        }
    }
    
    $scope.clickedLabel = function () {
        $scope.goalsTutorial = !$scope.goalsTutorial;
    };

    $scope.mainNav_settings_click = function () {
        console.log("click registered");
        model_GoalDaily.setFromTo($scope.from, $scope.to);
        $location.path('/goals/setup/daily');
    }
    $scope.goal = model_Goal.getGoal('daily');
    $scope.title = "Daily Goal: "+$scope.goal+' reps';

    var singleItemWidth = Math.floor(($('body').width() - 7) / 7);
    var onEdgeWidth = Math.floor(($('body').width() - singleItemWidth * 7 -7) / 2)+singleItemWidth;
    console.log(onEdgeWidth);


 
    $scope.getDaysStyle = function () {
        return {
            width: singleItemWidth+'px'
        }
    }

    $scope.getDotsStyle = function (day) {
        var width;
        var bgColor;
        if (!day.borderDay) {
            width = singleItemWidth;
        } else {
            width = onEdgeWidth;
        }
        //if(day.isBlank){
        //    bgColor = '#ddd';
        //}else if (day.dayPassed) {
        //    bgColor = '#bbbbbc';
        //}else if (day.goalAchieved) {
        //    bgColor = '#2b8d28'
        //} else if (day.trained) {
        //    bgColor = '#D4782C';
        //}else {
        //    bgColor = '#ca3a3a';
        //}
        //if (day.isBlank) {
        //    bgColor = '#ddd';
        //} else if (day.dayPassed) {
        //    bgColor = '#bbbbbc';
        //} else if (day.goalAchieved) {
        //    bgColor = '#26865a'
        //} else if (day.trained) {
        //    bgColor = '#99b3ce';
        //} else {
        //    bgColor = '#cea599';
        //}
        if(day.isBlank){
            bgColor = '#ddd';
        }else if (day.dayPassed) {
            bgColor = '#bbbbbc';
        }else if (day.goalAchieved) {
            bgColor = '#2b8d28'
        } else if (day.trained) {
            bgColor = '#D4782C';
        }else {
            bgColor = '#c84640';
        }
        return {
            width: width + 'px',
            backgroundColor: bgColor
        }

    }

    $scope.getTotalWidth = function(){
        return{
            width: Math.floor(($('body').width())/7)*7
        }
    }

    $scope.getData = function () {
        console.log("-----------------------------");
        console.log($scope.def);
        console.log("-----------------------------");
        if ($scope.defNeedsReject) {
            $scope.def.reject({ canceled: true });
        }
        console.log($scope.from);
        console.log($scope.to);
        var data = {
            from: kendo_DateHelper.getTimestampFromDate($scope.from.toDate()),
            to: kendo_DateHelper.getTimestampFromDate($scope.to.toDate()),
            goal :$scope.goal
        }
        console.log(data);
        $scope.def = $q.defer();
        $scope.def.promise.then(function (data) {
            console.log("daily goals got data");
            console.log(data);
            $scope.defNeedsReject = false;
            var today = moment().endOf('day');
            for (var i = 0; data.length > i; i++) {
                var day = moment(data[i]['date']);
                if (day > today) {
                    data[i].dayPassed = true;
                }
                var dayOfWeek = day.format('e');
                if (dayOfWeek == 0 || dayOfWeek == 6) {
                    data[i].borderDay = true;
                }
                if (data[i].total > 0) {
                    data[i].trained = true;
                }
            }
            var firstDay = moment(data[0]['date']).format('e');
            for (var i = firstDay; i > 0; i--) {
                var borderDay = false;
                console.log(borderDay);
                if (i == 1) {
                    borderDay = true;
                    console.log("border is true");
                }
                var space = {
                    day: '',
                    isBlank: true,
                    borderDay: borderDay
                };
                data.unshift(space);
            }
            $scope.days = data;
        }, function () {

        });
        $scope.defNeedsReject = true;
        model_GoalDaily.getGoalsDoneForMonth($scope.def,data)
    }

    $scope.calculateArrows = function () {
        if (moment().endOf('month') <= $scope.to) {
            $scope.arrowRight = false;
        } else {
            $scope.arrowRight = true;
        }
    };

    $scope.arrowLeftClick = function () {
        $scope.to = $scope.from.subtract(1, 'seconds');
        $scope.from = moment($scope.to).startOf('month');
        $scope.currentMonth = $scope.from.format("MMMM");;
        $scope.currentYear = $scope.from.year();
        $scope.calculateArrows();
        $scope.getData();
    }
    $scope.arrowRightClick = function () {
        $scope.from = $scope.to.add(1, 'seconds');
        $scope.to = moment($scope.to).endOf('month');
        $scope.currentMonth = $scope.from.format("MMMM");;
        $scope.currentYear = $scope.from.year();
        $scope.calculateArrows();
        $scope.getData();
    }

    $scope.dayClicked = function (day) {
        if (day.isBlank) {
            return null;
        }
        if (day.dayPassed) {
            alertify.error("Future is yet to be trained");
            return null;
        }
        model_GoalDaily.setFromTo($scope.from, $scope.to);
        var month = $scope.currentMonth;
        var dayCurrent = day.day;
        var year = $scope.currentYear;
        day.title = dayCurrent + ' ' + month + ', ' + year;
        day.from = moment(day.date).startOf('day');
        day.to = moment(day.date).endOf('day');
        day.type = 'daily';
        day.trained = day.total;
        model_GoalDetails.setDetailsData(day);
        $location.path('/goals/details/');
    }

    
    var fromTo = model_GoalDaily.getFromTo();
    console.log("--------");
    console.log(fromTo);
    console.log("----------");
    if (fromTo.from !== null && fromTo.to !== null) {
        $scope.from = fromTo.from;
        $scope.to = fromTo.to;
    } else {
        $scope.from = moment().startOf('month');
        $scope.to = moment().endOf('month');
    }
    $scope.arrowLeft = true;
    $scope.arrowRight = false;
    $scope.currentMonth = $scope.from.format("MMMM");;
    $scope.currentYear = $scope.from.year();
    $scope.calculateArrows();
    $scope.getData();
});
