App.factory("model_Clicker", function ($q, $http, requestHelper, $cordovaFile, db_Sync, db_Tricks) {

    function getCanelioBLEIds() {
        return {
            service: 'C033',
            measurement: 'C034'
        }
    }

    function getS1() {
       return window.localStorage.getItem('s1');
    }

    function getS2AndHour() {
        var s2 = JSON.parse(window.localStorage.getItem("s2"));
        var times = getMinutesSecondsToFullHour();
        s2.push(times.m);
        s2.push(times.s);
        s2.push(0, 0);
        return {
            s2: s2,
            time:times.time,
        };
    }

    function getSyncTime() {
        return parseInt(window.localStorage.getItem('clickerSyncTime'));
    }

    function resetSyncTime() {
        window.localStorage.setItem("clickerSyncTime", moment().startOf('hour').unix());
    }

    function saveTraining(def, data) {
        db_Sync.saveTrainingFromClicker(def, data);
    }

    function getFirstFiveTricks(def, data) {
        db_Tricks.getFirst5Ids(def);
    }

    function getMinutesSecondsToFullHour() {
        return {
            m: parseInt(moment().format('m')),
            s: parseInt(moment().format('s')),
            time: moment().startOf('hour').unix(),
        }
    }

    function connectS3(def, data) {
        var obj = {
            "class": "clicker",
            "method": "getConnectVariables",
            "data": data
        }
        kendo_RequestHelper.post(def, obj);
    }

    function claimClicker(def, data) {
        var obj = {
            "class": "clicker",
            "method": "claimClicker",
            "data": data
        }
        kendo_RequestHelper.post(def, obj);
    }

    function saveClicker(data) {
        window.localStorage.setItem("s1", data.s1);
        window.localStorage.setItem("s2", JSON.stringify(data.s2));
        saveSyncTime(data.time);
    }

    function saveSyncTime(data) {
        window.localStorage.setItem("clickerSyncTime", data);
    }

    function setSyncRequired() {
        window.localStorage.setItem("clickerSyncRequired", "1");
    }

    function clearSyncRequired() {
        window.localStorage.removeItem("clickerSyncRequired")
    }

    function getSyncRequired() {
        return window.localStorage.getItem("clickerSyncRequired");
    }

    function disconnectClicker(def, data) {
        var def2 = $q.defer();
        def2.promise.then(function (success) {
            console.log("dc success");
            window.localStorage.removeItem('clickerSyncTime');
            window.localStorage.removeItem('clickerSyncRequired');
            window.localStorage.removeItem('s1');
            window.localStorage.removeItem('s2');
            window.localStorage.removeItem("clickerDontSyncOnStart");
            def.resolve(true);
        }, function (error) {
            window.localStorage.removeItem('clickerSyncTime');
            window.localStorage.removeItem('clickerSyncRequired');
            window.localStorage.removeItem('s1');
            window.localStorage.removeItem('s2');
            window.localStorage.removeItem("clickerDontSyncOnStart");
            def.resolve(true);0
        });
        var obj = {
            "class": "clicker",
            "method": "disconnectClicker",
            "data": {
                s1: getS1(),
                s2: JSON.parse(window.localStorage.getItem("s2"))
            }
        }
        console.log("dcing");
        console.log(obj.data.s2);
        kendo_RequestHelper.post(def2, obj);
    }






    return {
        getCanelioBLEIds: getCanelioBLEIds,
        getSyncTime: getSyncTime,
        resetSyncTime: resetSyncTime,
        getMinutesSecondsToFullHour: getMinutesSecondsToFullHour,
        getFirstFiveTricks:getFirstFiveTricks,
        saveTraining:saveTraining,
        getS1: getS1,
        getS2AndHour: getS2AndHour,
        connectS3: connectS3,
        claimClicker: claimClicker,
        saveSyncTime: saveSyncTime,
        saveClicker: saveClicker,
        setSyncRequired: setSyncRequired,
        clearSyncRequired: clearSyncRequired,
        getSyncRequired: getSyncRequired,
        disconnectClicker: disconnectClicker,
    };
});