App.controller("ctrl_WeeklyGoals", function ($scope, $q, $location, $routeParams, model_Goal, model_GoalWeekly, model_GoalDetails) {
    
    $scope.navigateBackBefore = function () {
        model_GoalWeekly.clearFromTo();
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
        model_GoalWeekly.setFromTo($scope.from, $scope.to);
        $location.path('/goals/setup/weekly');
    }
    $scope.goal = model_Goal.getGoal('weekly');

    $scope.title = "Weekly Goal: " + $scope.goal + ' reps';

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
        if(day.isBlank){
            bgColor = '#ddd';
        } else if (day.dayPassed) {
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
        var month = $scope.from.format('MM');
        var weeks = [];
        var firstWeek = {};
        var start = moment($scope.from).startOf('week');
        firstWeek.from = kendo_DateHelper.getTimestampFromDate(start.toDate())
        var end = moment($scope.from).endOf('week');
        firstWeek.to = kendo_DateHelper.getTimestampFromDate(end.toDate())
        weeks.push(firstWeek);
        console.log(weeks);
        var newMonth = false;
        while (!newMonth) {
            var week = {};
            start = end.add(1, 'seconds');
            week.from = kendo_DateHelper.getTimestampFromDate(start.toDate());

            end = start.endOf('week');
            week.to = kendo_DateHelper.getTimestampFromDate(end.toDate());
            if (month != start.format('MM')) {
                newMonth = true;
            }
            weeks.push(week);
        }
        console.log(weeks);
       
        var data = {
            weeks: weeks,
            goal :$scope.goal
        }
        console.log(data.goal)
        console.log(data);
        $scope.def = $q.defer();
        $scope.def.promise.then(function (data) {
            console.log(data);
            $scope.defNeedsReject = false;
            for (var i = 0; data.length > i; i++) {
                var from = moment(data[i].from);
                var to = moment(data[i].to);
                var fromMonth = from.format('MMM');
                var fromDay = from.format('D');
                var toMonth = to.format('MMM');
                var toDay = to.format('D');
                data[i].forShow = fromMonth + ' ' + fromDay + ' - ' + toMonth + ' ' + toDay;
                if (moment() < moment(data[i].from)) {
                    console.log("day has passed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    console.log(data[i].to);
                    data[i].dayPassed = true;
                }
            }
            //var today = moment().endOf('day');
            //for (var i = 0; data.length > i; i++) {
            //    var day = moment(data[i]['date']);
            //    if (day > today) {
            //        data[i].dayPassed = true;
            //    }
            //    var dayOfWeek = day.format('e');
            //    if (dayOfWeek == 0 || dayOfWeek == 6) {
            //        data[i].borderDay = true;
            //    }
            //}
            //var firstDay = moment(data[0]['date']).format('e');
            //for (var i = firstDay; i > 0; i--) {
            //    var borderDay = false;
            //    console.log(borderDay);
            //    if (i == 1) {
            //        borderDay = true;
            //        console.log("border is true");
            //    }
            //    var space = {
            //        day: '',
            //        isBlank: true,
            //        borderDay: borderDay
            //    };
            //    data.unshift(space);
            //}
            $scope.weeks = data;
        }, function () {

        });
        $scope.defNeedsReject = true;
        model_GoalWeekly.getGoalsDoneForMonth($scope.def,data)
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
        console.log("-months are");
        console.log($scope.from);
        console.log($scope.to);
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

    $scope.weekClicked = function (week) {
        if (week.isBlank) {
            return null;
        }
        if (week.dayPassed) {
            alertify.error("Future is yet to be trained");
            return null;
        }
        console.log("---------------week");
        console.log(week);
        model_GoalWeekly.setFromTo($scope.from, $scope.to);
        var month = $scope.currentMonth;
        //var dayCurrent = day.day;
        var year = $scope.currentYear;
        week.title = week.forShow;
        week.from = moment(week.from);
        week.to = moment(week.to);
        week.type = 'weekly';
        model_GoalDetails.setDetailsData(week);
        $location.path('/goals/details/');
    }

    
    var fromTo = model_GoalWeekly.getFromTo();
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
