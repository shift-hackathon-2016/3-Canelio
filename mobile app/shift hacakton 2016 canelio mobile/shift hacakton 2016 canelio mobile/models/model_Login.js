App.factory("model_Login", function ($q, $cordovaFile, $window, $location, $http, model_Dog, model_Goal, model_Level, db_Manager, db_Sync) {

    function login(def, data) {
        data.fetchData = true;
        var days = model_Goal.getImportantDays();
        data.weeklyDayStart = days.weeklyDayStart;
        data.weeklyDayEnd = days.weeklyDayEnd;
        data.dailyToday = days.dailyToday;
        var obj = {
            "class": "user",
            "method": "login",
            "data": data
        }
        var defer = $q.defer();
        defer.promise.then(function (data) {
            console.log("login failed");
            saveData(data ,true);
            def.resolve(true);
        }, function (error) {
            console.log("saving data failed");
            def.reject(error);
        });
        kendo_RequestHelper.post(defer, obj);
    }

    function refreshData(def) {
        var data = {};
        data.email = window.localStorage.getItem("email");
        data.password = window.localStorage.getItem("password");
        data.relog = true;
        login(def, data);
    }

    function relog(def) {
        console.log("relog called--------------------------------");
        var obj = {
            "class": "user",
            "method": "login",
            "data": {
                relog: true,
                password: localStorage.getItem('password'),
                email: localStorage.getItem('email')
            }
        }
        var defer = $q.defer();
        defer.promise.then(function (data) {
            saveData(data ,false);
            def.resolve(true);
        }, function (error) {
            def.reject(false);
        });
        kendo_RequestHelper.post(defer, obj, false);
    }

    function saveToken(token) {
        window.localStorage.setItem('token',token);
    }

    function saveData(data) {
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('email', data.email);
        window.localStorage.setItem('password', data.password);
        window.localStorage.setItem('dogName', data.dogName);
        if (data.userLevel) {
            model_Level.updateLevel(data);
        }
        if (data.imageSmall) {
            model_Dog.saveDogImage(data.imageSmall);
        }
        if (data.tricks) {
            //window.localStorage.setItem('tricks', JSON.stringify(data.tricks));
        }
        if (data.dailyGoal || data.weeklyGoal) {
            model_Goal.updateGoalsDataFromServer(data);
        }
        if (data.title) {
            window.localStorage.setItem('dogTitle', data.title);
        }
    }

    function clearData() {
        window.localStorage.removeItem('dogName');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('password');
        model_Dog.deleteDogImage();
        window.localStorage.removeItem('tricks');
        window.localStorage.removeItem('filesVersion')
        window.localStorage.removeItem("serverSyncRequired");
        window.localStorage.removeItem('tutorialGoals');
        window.localStorage.removeItem('tutorialTricks');
        window.localStorage.removeItem('dogTitle')
        
        model_Goal.clearGoals();
        model_Level.clearLevel();
        window.localStorage.removeItem('clickerSyncTime');
        window.localStorage.removeItem('clickerSyncRequired');
        window.localStorage.removeItem('s1');
        window.localStorage.removeItem('s2');
        window.localStorage.removeItem("clickerDontSyncOnStart");
    }

    return {
        login: login,
        saveToken: saveToken,
        saveData: saveData,
        clearData: clearData,
        relog: relog,
        refreshData: refreshData
    };
});