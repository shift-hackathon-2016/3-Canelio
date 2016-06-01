App.controller("ctrl_DownloadClicker", function ($scope, $q, $location, $timeout, model_ServerSync, model_Level, db_Sync, $rootScope, model_Clicker, db_TrainingForServer, model_ResultUpload) {
    $('#serverUploadProgress').html(0 + '%');
    $('#serverUploadProgressBar').css('width', 0 + '%');

    var levels = [];
    var achievements = [];
    $scope.percentDone = 0;

    $scope.startTestingTime = 0;
    $scope.errors = [];
    $scope.tricksPassed = 0;
    $scope.currentTestTrickId = 1;

    var loggingTime = {
        start: moment().unix()
    };

    function uploadPrevious(defUploadPrevious) {
        if (navigator.connection.type != Connection.NONE){
            var def = $q.defer();
            def.promise.then(function (data) {
                var total = data.totalRows;
                var bufferSize = data.bufferSize;
                var uploaded = 0;

                if (total == 0) {
                    model_ServerSync.clearSyncNeeded();
                    defUploadPrevious.resolve(true);

                    return null;
                }
                function uploadBuffer(offset) {
                    var def = $q.defer();
                    def.promise.then(function (data) {
                        
                        var defUpload = $q.defer();
                        defUpload.promise.then(function (data) {
                            console.log("got data1........");
                            console.log(data);
                            var defDelete = $q.defer();
                            defDelete.promise.then(function (data2) {
                                uploaded = uploaded + bufferSize;
                                console.log("got data2........");
                                console.log(data);
                                if (data.level) {
                                    levels.push(data.level);

                                }

                                for (var i = 0; i < data.achivments.length; i++) {
                                    achievements.push(data.achivments[i])
                                }
                                //levels.push(data.level);
                                //achievements.push(data.achivments);
                                var percent = Math.round((uploaded / total) * 50) + $scope.percentDone;
                                if (percent > 100) {
                                    percent = 100;
                                }

                                $('#serverUploadProgress').html(percent + '%');
                                $('#serverUploadProgressBar').css('width', percent + '%');


                                if (uploaded >= total) {
                                    uploaded = total;
                                    model_ServerSync.clearSyncNeeded();
                                    var resultData = {
                                        level: levels,
                                        achivments: achievements,
                                        tricks: $scope.bleApp.trickData,
                                        showSucessRates:true
                                    };
                                    model_ResultUpload.setResult(resultData);
                                    $location.path('/resultUpload');
                                } else {
                                    uploadBuffer(uploaded);
                                }

                            });
                            model_ServerSync.deleteUploadedTraining(defDelete);

                        });
                        console.log("uploading trainings");
                        console.log(data);
                        model_ServerSync.uploadTraining(defUpload, data)
                    });
                    model_ServerSync.getTraining(def, 0);
                }
                uploadBuffer(0)

            });
            model_ServerSync.getTotalTrainings(def);
        } else {
            defUploadPrevious.reject(true);
        }
    }


    function downloadFromClicker(defSaved) {
        var canelioIds = model_Clicker.getCanelioBLEIds();
        $scope.bleApp = {
            timesReconnected: 0,
            pointsData: {
                timesTrained: 0,
                timesSuccess:0,
            },
            trickData: [],
            unixTimeLastSync: model_Clicker.getSyncTime(),
            bleEnabled: function () {
                if ($scope.enableBluetoothWarning) {
                    $scope.$apply(function () {
                        $scope.enableBluetoothWarning = false;
                    });
                    
                }
                $scope.bleApp.scan();
            },
            bleDisabled: function () {

                if ($scope.enableBluetoothWarning) {
                    alertify.error("Bluetooth still disabled");
                }
                //if (device.platform == 'Android') {
                //    ble.enable($scope.bleApp.bleEnabled, $scope.bleApp.failedEnableAndroid);
                //} else {
                $scope.$apply(function () {
                    $scope.enableBluetoothWarning = true;
                });
                
                //$('#DownloadClickerBluetoothWarning').css('display', 'block');
                //}
            },
            failedEnableAndroid: function(){
                $scope.$apply(function () {
                    $scope.enableBluetoothWarning = true;
                });
            },
            checkBle: function () {
                ble.isEnabled($scope.bleApp.bleEnabled, $scope.bleApp.bleDisabled);
            },
            scan: function () {
                //chekirati da li je scan failo vise od 2 puta warning ako je
                loggingTime.untilScann = moment().unix();
                var deviceName = "Canelio" + model_Clicker.getS1();
                var found = false;
                function onScan(peripheral) {
                    if (peripheral.name == deviceName) {
                        found = true;
                        $scope.bleApp.peripheralId = peripheral.id;
                        ble.connect(peripheral.id, $scope.bleApp.onConnect, $scope.bleApp.onDisconnect);
                        //ble.disconnect($scope.bleApp.peripheralId, $scope.bleApp.dcSuccess, $scope.bleApp.dcFail);
                        //alertify.success("something");
                        $timeout(function () {
                            if (!$scope.bleApp.isConnected && !$scope.bleApp.successConnecting) {
                                alertify.error("timeout expired disconnecting");
                                ble.disconnect($scope.bleApp.peripheralId, $scope.bleApp.dcSuccess, $scope.bleApp.dcFail);
                            }
                            //ble.stopScan();
                        }, 10000, true);
                    }
                }
                function scanFailure(reason) {
                    $scope.bleApp.reconnect();
                }
                ble.scan([], 5, onScan, scanFailure);
                $timeout(function () {
                    if (!found) {
                        $scope.enableBluetoothTransferWarning = true;
                    }
                    //ble.stopScan();
                }, 5000, true);
            },
            onConnect: function (peripheral) {
                loggingTime.untilConnect = moment().unix();
                $scope.bleApp.isConnected = true;
                $scope.bleApp.successConnecting = true;
                $scope.bleApp.firstConnect = true;
                ble.startNotification(peripheral.id, canelioIds.service, canelioIds.measurement, $scope.bleApp.onData, $scope.bleApp.onErrorSendRecieve);
                function onWrite() {
                    loggingTime.untilWrite = moment().unix();
                }

                function onWriteFail() {
                    console.log("written fail");
                }
                var s2Time = model_Clicker.getS2AndHour();
                $scope.bleApp.timeForNextSync = s2Time.time;
                var data = new Uint8Array(s2Time.s2);
                console.log("sending data to clicker");
                console.log(data);
                ble.write($scope.bleApp.peripheralId, canelioIds.service, canelioIds.measurement, data.buffer, onWrite, $scope.bleApp.onErrorSendRecieve);

            },
            onDisconnect: function (reason) {
                //save existing tricks if last got 00000 else reconnect
                loggingTime.untilDisconnect = moment().unix();
                $scope.bleApp.isConnected = false;
                if ($scope.bleApp.dataTransferEnded) {
                    $scope.bleApp.saveTraining();
                } else {
                    for (var i = 0; $scope.bleApp.trickData.length > i; i++) {
                        $scope.bleApp.trickData[i].total = 0;
                        $scope.bleApp.trickData[i].success = 0;
                    };
                    $scope.bleApp.training = [];
                    $scope.bleApp.pointsData.timesTrained = 0;
                    $scope.bleApp.pointsData.timesSuccess = 0;
                    $scope.bleApp.timesReconnected++;
                    $scope.bleApp.checkIfReconnectOrWarning();
                }
            },
            checkIfReconnectOrWarning: function () {
                alertify.error("checkIfReconnectOrWarning");
                model_Clicker.setSyncRequired();
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $location.path('/main');
                    });
                }else {
                    $location.path('/main');
                }
                
            },
            reconnect: function () {
                $scope.enableBluetoothTransferWarning = false;
                $scope.enableBluetoothWarning = false;
                $scope.bleApp.scan();
            },
            training: [],
            dataTransferEnded: false,
            dcSuccess: function () {
                $scope.bleApp.isConnected = false;
                $scope.bleApp.onDisconnect();
                if ($scope.errors.length > 0) {
                    console.log("errors are----------");
                    console.log($scope.errors);
                }
                if ($scope.bleApp.training.length != $scope.bleApp.totalTricksToRecieve) {
                    
                }
                //$location.path('/main');
            },
            dcFail: function () {
                if ($scope.bleApp.isConnected) {
                    ble.disconnect($scope.bleApp.peripheralId, $scope.bleApp.dcSuccess, $scope.bleApp.dcFail);
                }
            },
            doDc: function(){
                $scope.bleApp.dataTransferEnded = true;
                ble.disconnect($scope.bleApp.peripheralId, $scope.bleApp.dcSuccess, $scope.bleApp.dcFail);
            },
            onData: function (buffer) {
                //console.log("got data");
                
                var data = new Uint8Array(buffer);
                console.log(data);
                if ($scope.bleApp.firstConnect) {
                    $scope.bleApp.firstConnect = false;
                    $scope.bleApp.totalTricksToRecieve = data[0] * 256 + data[1];
                    return null;
                }
                
                var position = 0;
                var tricks = [];
                for (var i = 0; i < data.length ; i = i + 7) {
                    $scope.tricksPassed++;
                    if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0 && data[i + 3] == 0 && data[i + 4] == 0) {
                        console.log("data before dc");
                        console.log(data);
                        setTimeout($scope.bleApp.doDc, 500);
                        break;
                    }
                    console.log("check this out");
                    console.log(data[i]);
                    console.log(data[i + 1]);
                    var trick = {
                        timesSuccess: data[i] + data[i+1] *256,
                        timesTrained: data[i+2] + data[i + 3] * 256,
                        time: data[i + 4] + data[i + 5] * 256,
                        trick_id: data[i + 6]
                    }
                    
                    console.log(trick.trick_id)
                    console.log("tricks is");
                    console.log(trick)
                    trick.time = trick.time * 3600 + $scope.bleApp.unixTimeLastSync;
                    if ((trick.trick_id - 1) < $scope.bleApp.trickData.length) {
                        if (trick.timesSuccess > trick.timesTrained) {
                            trick.timesSuccess = Math.round(trick.timesTrained / 2);
                        }
                        console.log($scope.bleApp.trickData[trick.trick_id - 1].total);
                        console.log($scope.bleApp.trickData[trick.trick_id - 1].success);
                        $scope.bleApp.trickData[trick.trick_id - 1].total = $scope.bleApp.trickData[trick.trick_id - 1].total + trick.timesTrained;
                        $scope.bleApp.trickData[trick.trick_id - 1].success = $scope.bleApp.trickData[trick.trick_id - 1].success + trick.timesSuccess;
                        console.log($scope.bleApp.trickData[trick.trick_id - 1].total);
                        console.log($scope.bleApp.trickData[trick.trick_id - 1].success);
                        trick.trick_id = $scope.bleApp.trickData[trick.trick_id - 1].id;
                        
                        console.log("after id fail");
                        $scope.bleApp.pointsData.timesTrained = $scope.bleApp.pointsData.timesTrained + parseInt(trick.timesTrained);
                        $scope.bleApp.pointsData.timesSuccess = $scope.bleApp.pointsData.timesSuccess + parseInt(trick.timesSuccess);
                        $scope.bleApp.training.push(trick);
                    }

                }
                if ($scope.bleApp.totalTricksToRecieve == 0) {
                    $('#serverUploadProgress').html(50 + '%');
                    $('#serverUploadProgressBar').css('width', 50 + '%');
                } else {
                    $scope.percentDone = Math.round(($scope.tricksPassed / $scope.bleApp.totalTricksToRecieve) * 50);
                    $('#serverUploadProgress').html($scope.percentDone + '%');
                    $('#serverUploadProgressBar').css('width', $scope.percentDone + '%');
                }


            },
            saveTraining: function () {
                var def = $q.defer();
                model_Level.updatePoints($scope.bleApp.pointsData);
                def.promise.then(function (data) {
                    var time = model_Clicker.getSyncTime();
                    model_ServerSync.updateSync(time, false);
                    model_Clicker.resetSyncTime();
                    loggingTime.untilDbSaved = moment().unix();
                    model_Clicker.saveSyncTime($scope.bleApp.timeForNextSync);
                    model_Clicker.clearSyncRequired();
                    defSaved.resolve(true);
                });
                db_TrainingForServer.insertTraining(def, $scope.bleApp.training);
                var defLocalSave = $q.defer();
                model_Clicker.saveTraining(defLocalSave, $scope.bleApp.training);
            },
            onErrorSendRecieve: function (reason) {
                //reconnect if second time show warning
                alertify.error("Error getting data please retry connecting to clicker");
                $scope.bleApp.dcFail();
            },
            cancelSync: function () {
                alertify.success("You can always sync clicker from settings");
                model_Clicker.setSyncRequired();
                $location.path('/main');
            }
        };
        var defTricks = $q.defer();
        defTricks.promise.then(function (data) {
            $scope.bleApp.tricks = [];
            $scope.bleApp.trickData = data;
            for (var i = 0; $scope.bleApp.trickData.length > i; i++) {
                $scope.bleApp.trickData[i].total = 0;
                $scope.bleApp.trickData[i].success = 0;
            };
            $scope.bleApp.checkBle();
        });
        model_Clicker.getFirstFiveTricks(defTricks);
        
    }

    $scope.checkBleButton = function () {
        scope.bleApp.checkBle();
    }



    //provjeri vezu
    $('#clickerUploadProgress').html('5%');
    $('#clickerUploadProgressBar').css('width', '5%');
    var defDownloadClicker = $q.defer();
    defDownloadClicker.promise.then(function (data) {
        console.log("download passedddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
        var uploadNeeded = model_ServerSync.isSyncNeeded();
        if (uploadNeeded) {
            var defUpload = $q.defer();
            defUpload.promise.then(function (data) {
                $location.path('/main');
            }, function (error) {
                alertify.error("Connect to internet to get levels and achievements");
                $location.path('/main');
            });
            uploadPrevious(defUpload);
        }
    });
    downloadFromClicker(defDownloadClicker);



});
