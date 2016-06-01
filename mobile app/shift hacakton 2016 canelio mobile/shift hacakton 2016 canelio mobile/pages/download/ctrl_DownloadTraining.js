App.controller("ctrl_DownloadTraining", function ($scope, model_DownloadFiles, $q, $routeParams, db_Manager, $cordovaFile, $location, model_ServerSync, model_Tricks) {

    var trainingsDownloaded = false;
    var tricksDownloaded = false;

    var def = $q.defer();
    def.promise.then(function (data) {
        var def = $q.defer();
        def.promise.then(function (data) {
            var total = data.count;
            var bufferSize = data.bufferSize;
            var uploaded = 0;
            $('#downloadTrainingProgressPercentage').html('0%');
            $('#downloadTrainingProgressBar').css('width', '3%');


            function uploadBuffer(offset) {
                var def = $q.defer();
                def.promise.then(function (data) {
                    console.log("before saving");
                    var defSave = $q.defer();
                    defSave.promise.then(function (data) {
 
                        uploaded = uploaded + bufferSize;

                        if (uploaded >= total) {
                            uploaded = total;
                            trainingsDownloaded = true;
                            console.log("downloaded........")
                            if (trainingsDownloaded && tricksDownloaded) {
                                $location.path('/clicker/Connect');
                            }

                        }
                        if (total != 0) {
                            var percent = Math.round(uploaded / total) * 100;
                        } else {
                            var percent = 100;
                        }
                        

                        $('#downloadTrainingProgressPercentage').html(percent + '%');
                        $('#downloadTrainingProgressBar').css('width', percent + '%');

                        if (uploaded < total) {
                                console.log("calling itself..........")
                                uploadBuffer(uploaded);
                        }

                    });

                    model_ServerSync.saveTrainingsToDb(defSave, data)
                });
                model_ServerSync.getTrainingsServer(def, { offset: uploaded, bufferSize: bufferSize });
            }
            uploadBuffer(0)

        });
        model_ServerSync.getTotalTrainingsServer(def);
    });
    db_Manager.createTables(def);

    var def2 = $q.defer();
    def2.promise.then(function (data) {
        console.log("got tricks from server");
        var def = $q.defer();
        def.promise.then(function () {
            tricksDownloaded = true;
            console.log("def resolved");
            console.log(trainingsDownloaded);
            console.log(tricksDownloaded);
            if (trainingsDownloaded && tricksDownloaded) {
                $location.path('/main');
            }
        });
        model_Tricks.saveTricks(def, data);
    });
    model_Tricks.getTricksFromServer(def2, {});
    


});
