App.controller("ctrl_ServerUpload", function ($scope, $q, $location, model_ServerSync, db_Sync, $rootScope) {
    
    var def = $q.defer();
    def.promise.then(function (data) {
        console.log("total rows:");
        console.log(data);
        var total = data.totalRows;
        console.log(total);
        var bufferSize = data.bufferSize;
        var uploaded = 0;
        var totalTrainingsDone = [];
        $('#serverUploadProgress').html('0%');
        $('#serverUploadProgressBar').css('width', '3%');
        
        

        var levels = [];
        var achievements = [];

        function uploadBuffer(offset) {
            var def = $q.defer();
            def.promise.then(function (data) {
                var defUpload = $q.defer();
                defUpload.promise.then(function (data) {
                    var defDelete = $q.defer();
                    defDelete.promise.then(function (data) {
                        console.log("recieved data");
                        console.log(data);
                        uploaded = uploaded + bufferSize;
                        console.log("uploaded total---------------");
                        console.log(uploaded);
                        console.log(total);
                        if (uploaded >= total) {
                            uploaded = total;
                            model_ServerSync.clearSyncNeeded();
                            $location.path('/main');
                        } else {
                            uploadBuffer(uploaded);
                        }

                        var percent = Math.round(uploaded / total) * 100;

                        $('#serverUploadProgress').html(percent + '%');
                        $('#serverUploadProgressBar').css('width', percent + '%');
                        levels.push(data.level);
                        achievements.push(data.achivments);
                    });
                    model_ServerSync.deleteUploadedTraining(defDelete);

                });
                model_ServerSync.uploadTraining(defUpload, data)
            });
            console.log("getting training");
            console.log(uploaded);
            model_ServerSync.getTraining(def, 0);
        }
        uploadBuffer(0)
        
    });
    model_ServerSync.getTotalTrainings(def);

});
