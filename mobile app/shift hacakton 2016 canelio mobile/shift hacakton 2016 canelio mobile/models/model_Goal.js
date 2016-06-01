App.factory("model_Goal", function ($q, $http, requestHelper, $cordovaFile) {

    function updateGoal(def, data) {
        var days = getImportantDays();
        data = $.extend(days, data);
        var obj = {
            "class": "goal",
            "method": "setGoal",
            "data": data
        }
        kendo_RequestHelper.post(def, obj);
    }

    function setGoal(type, goal ,data) {
        if (type == 'daily') {
            window.localStorage.setItem('dailyGoal', goal);
        }else if(type == 'weekly'){
            window.localStorage.setItem('weeklyGoal', goal);
        }
    }

    function getGoal(type) {
        if (type == 'daily') {
            return window.localStorage.getItem('dailyGoal');
        } else if (type == 'weekly') {
            return window.localStorage.getItem('weeklyGoal');
        }
        return null;
    }

    function getImportantDays() {
        var d = new Date();
        var today = kendo_DateHelper.formatDateForDb(d);
        var weeklyGoalDayStart = kendo_DateHelper.formatDateForDb(moment().startOf('week').toDate());;
        var weeklyGoalDayEnd = kendo_DateHelper.formatDateForDb(moment().endOf('week').toDate());;
        console.log("get important days.-----------");
        console.log(weeklyGoalDayStart);
        console.log(weeklyGoalDayEnd)
        return {
            weeklyDayStart: weeklyGoalDayStart,
            weeklyDayEnd: weeklyGoalDayEnd,
            dailyToday: today,
        }
    }

    function clearGoals() {
        window.localStorage.removeItem('dailyGoal');
        window.localStorage.removeItem('dailyGoalDone');
        window.localStorage.removeItem('dailyGoalDay');
        window.localStorage.removeItem('weeklyGoal');
        window.localStorage.removeItem('weeklyGoalDone');
        window.localStorage.removeItem('weeklyGoalDayStart');
        window.localStorage.removeItem('weeklyGoalDayEnd');
    }

    function updateGoalsDataFromServer(data) {
        if (data.dailyGoal) {
            window.localStorage.setItem('dailyGoal', data.dailyGoal);
        }
        window.localStorage.setItem('dailyGoalDone', data.dailyGoalDone);
        var d = new Date();
        var today = kendo_DateHelper.formatDateForDb(d);
        window.localStorage.setItem('dailyGoalDay', today);

        //weekly
        var newGoalDayStart = moment().startOf('week');
        var newGoalDayEnd = moment().endOf('week');
        if (data.weeklyGoal) {
            window.localStorage.setItem('weeklyGoal', data.weeklyGoal);
        }
        window.localStorage.setItem('weeklyGoalDone', data.weeklyGoalDone)
        window.localStorage.setItem('weeklyGoalDayStart', newGoalDayStart);
        window.localStorage.setItem('weeklyGoalDayEnd', newGoalDayEnd);
    }


    return {
        updateGoal: updateGoal,
        setGoal: setGoal,
        getGoal:getGoal,
        clearGoals: clearGoals,
        getImportantDays: getImportantDays,
        updateGoalsDataFromServer: updateGoalsDataFromServer
    };
});