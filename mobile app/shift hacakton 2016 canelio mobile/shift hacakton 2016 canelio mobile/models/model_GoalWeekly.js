App.factory("model_GoalWeekly", function ($q, $http, requestHelper, $cordovaFile, db_Trainig) {

    var from = null;
    var to = null;

    function getGoalsDoneForMonth(def, data) {
        db_Trainig.goalWeeklyForPeriod(def,data)
        //var obj = {
        //    "class": "goal_weekly",
        //    "method": "getGoalsInMonth",
        //    "data": data
        //}
        //requestHelper.post(def, obj);
    }

    function setFromTo(f, t) {
        from = f;
        to = t;
    }

    function getFromTo() {
        return {
            from: from,
            to: to,
        }
    }

    function clearFromTo() {
        from = null;
        to = null;
    }


    function getGoalProgress(def) {
        var goal = window.localStorage.getItem('weeklyGoal');
        if (goal) {
            var def2 = $q.defer();
            def2.promise.then(function (data) {
                console.log("should resolve def1");
                def.resolve({
                    goal: goal,
                    goalDone: data
                });
            });
            var startOfDay = moment().startOf('week').unix();
            var endOfDay = moment().endOf('week').unix();
            var data = { from: startOfDay, to: endOfDay };
            db_Trainig.getTotalDoneForPeriod(def2, data);
        } else {
            def.resolve(null);
        }
    }


    


    return {
        getGoalProgress: getGoalProgress,
        getGoalsDoneForMonth: getGoalsDoneForMonth,
        setFromTo: setFromTo,
        getFromTo: getFromTo,
        clearFromTo: clearFromTo
    };
});