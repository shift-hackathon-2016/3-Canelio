App.factory("model_GoalDaily", function ($q, $http, requestHelper, $cordovaFile, model_GoalWeekly, db_Trainig) {

    var from = null;
    var to = null;

    function getGoalsDoneForMonth(def, data) {
        db_Trainig.goalDailyForPeriod(def, data);
        //var obj = {
        //    "class": "goal_daily",
        //    "method": "getGoalsInMonth",
        //    "data": data
        //}
        //requestHelper.post(def, obj);
    }

    function setFromTo(f,t) {
        from = f;
        to = t;
    }

    function getFromTo() {
        return {
            from: from,
            to:to,
        }
    }

    function clearFromTo() {
        from = null;
        to = null;
    }

    function getGoalProgress(def) {
        var goal = window.localStorage.getItem('dailyGoal');
        if (goal) {
            var def2 = $q.defer();
            def2.promise.then(function (data) {
                console.log("should resolve def1");
                def.resolve({
                    goal: goal,
                    goalDone: data
                });
            });
            var startOfDay = moment().startOf('day').unix();
            var endOfDay = moment().endOf('day').unix();
            var data = { from: startOfDay, to: endOfDay };
            db_Trainig.getTotalDoneForPeriod(def2, data);
        } else {
            def.resolve(null);
        }


        //var goal = window.localStorage.getItem('dailyGoal');
        //var goalDone = window.localStorage.getItem('dailyGoalDone');
        //var goalDay = window.localStorage.getItem('dailyGoalDay');
        //var d = new Date();
        //var today = kendo_DateHelper.formatDateForDb(d);
        //if (goalDay != today) {
        //    //reset goalDone
        //    window.localStorage.setItem('dailyGoalDone','0');
        //    window.localStorage.setItem('dailyGoalDay', today);
        //    goalDone = 0;
        //}
        //if (goal) {
        //    var returned = {
        //        goal: goal,
        //        goalDone: goalDone
        //    };
        //    return returned
        //}
        //return null;
    }






    return {
        getGoalProgress: getGoalProgress,
        getGoalsDoneForMonth: getGoalsDoneForMonth,
        setFromTo: setFromTo,
        getFromTo: getFromTo,
        clearFromTo: clearFromTo
    };
});