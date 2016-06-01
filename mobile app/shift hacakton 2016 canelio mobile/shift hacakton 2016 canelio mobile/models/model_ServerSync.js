App.factory("model_ServerSync", function ($q, $http, requestHelper, $rootScope, $location, db_Sync) {

    function isSyncNeeded(def) {
        if (window.localStorage.getItem('serverSyncRequired')) {
            return true
        } else {
            return false
        }
    }

    function setSync() {
        var serverSync = window.localStorage.getItem('serverSyncRequired');
        if (!serverSync) {
            window.localStorage.setItem("serverSyncRequired", "true");
        }
    }

    function updateSync(time, overwrite) {
        window.localStorage.setItem("serverSyncRequired", "true");
        if (overwrite) {
            window.localStorage.setItem("serverSyncDate", time);
        } else {
            var prevTime = window.localStorage.getItem("serverSyncDate");
            if (parseInt(prevTime) < time) {
                window.localStorage.setItem("serverSyncDate", time);
            }
        }
    }

    function getSyncTime() {
        return window.localStorage.getItem("serverSyncDate");
    }

    function clearSyncNeeded() {
        window.localStorage.removeItem("serverSyncRequired");
        window.localStorage.removeItem("serverSyncDate");
    }

    function uploadTraining(def, data) {
        var obj = {
            "class": "training",
            "method": "trainMultiple",
            "data": {
                training: data
            }
        }
        console.log(obj);
        requestHelper.post(def, obj);
    }

    function getTotalTrainings(def) {
        db_Sync.getTotalTrainings(def, getSyncTime());
    }

    function getTraining(def, offset) {
        db_Sync.getTraining(def, offset);
    }

    function deleteUploadedTraining(def) {
        db_Sync.deleteUploadedTraining(def);
    }

    function getTotalTrainingsServer(def) {
        var def2 = $q.defer();
        def2.promise.then(function (data) {
            data.bufferSize = db_Sync.getBufferSize();
            def.resolve(data);
        });
        var obj = {
            "class": "training",
            "method": "getTrainingCount",
            "data": {some:'data'}
        }
        requestHelper.post(def2, obj);
    }

    function getTrainingsServer(def, data) {
        var obj = {
            "class": "training",
            "method": "getTrainingForLocal",
            "data": data
        }
        requestHelper.post(def, obj);
    }

    function saveTrainingsToDb(def, data) {
        db_Sync.saveTraining(def, data);
    }



    return {
        isSyncNeeded: isSyncNeeded,
        setSync: setSync,
        getSyncTime: getSyncTime,
        updateSync:updateSync,
        uploadTraining: uploadTraining,
        getTotalTrainings: getTotalTrainings,
        getTraining: getTraining,
        clearSyncNeeded: clearSyncNeeded,
        getTotalTrainingsServer: getTotalTrainingsServer,
        getTrainingsServer: getTrainingsServer,
        saveTrainingsToDb: saveTrainingsToDb,
        deleteUploadedTraining: deleteUploadedTraining
    };
});