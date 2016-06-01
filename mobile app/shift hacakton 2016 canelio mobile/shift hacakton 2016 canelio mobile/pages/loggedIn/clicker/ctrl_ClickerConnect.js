App.controller("ctrl_ClickerConnect", function ($scope, $q,$timeout, $location, model_Clicker) {
    
    $scope.step = 1;


    $scope.cancelClickerConnect = function () {
        $location.path('/main');
    }


    $scope.securityConnect = function () {
        if ($scope.clickerCode == '' || $scope.clickerCode == null) {
            alertify.error("Please enter the code");
        } else {
            $scope.tryConnect();
        }
    }

    $scope.tryConnect = function () {
        var data = {
            userInput: $scope.clickerCode
        };
        var def = $q.defer();
        def.promise.then(function (success) {
            console.log(success);
            $scope.s1 = success.s1;
            $scope.s2 = success.s2;
            $scope.s2original = [];
            $.extend(true, $scope.s2original, success.s2);
            var time = model_Clicker.getMinutesSecondsToFullHour();
            $scope.time = time.time;
            $scope.s2.push(time.m);
            $scope.s2.push(time.s);
            $scope.s2.push(0, 0);
            console.log($scope.s2);
            $scope.checkForClicker();
        }, function (error) {
            alertify.error(error.message);
        });
        model_Clicker.connectS3(def, data);
    }

    $scope.goToStep2AndClear = function () {
        $scope.enableBluetoothTransferWarning = false;
        $scope.enableBluetoothWarning = false;
        alertify.error("there was error connecting to clicker");
        $scope.step = 2;
        $scope.clickerCode = null;
    }

    $scope.checkForClicker = function () {
        $scope.step = 3;
        var canelioIds = model_Clicker.getCanelioBLEIds();
        $scope.bleApp = {
            timesReconnected: 0,
            pointsData: {
                timesTrained: 0,
                timesSuccess: 0,
            },
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
                $scope.$apply(function () {
                    $scope.enableBluetoothWarning = true;
                });
            },
            failedEnableAndroid: function () {
                $scope.$apply(function () {
                    $scope.enableBluetoothWarning = true;
                });
            },
            checkBle: function () {
                ble.isEnabled($scope.bleApp.bleEnabled, $scope.bleApp.bleDisabled);
            },
            scan: function () {
                //chekirati da li je scan failo vise od 2 puta warning ako je
                var deviceName = "Canelio" + $scope.s1;
                var found = false;
                function onScan(peripheral) {
                    if (peripheral.name == deviceName) {
                        found = true;
                        ble.connect(peripheral.id, $scope.bleApp.onConnect, $scope.bleApp.onDisconnect);

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
                    alertify.error("scan failed");
                    $scope.bleApp.scan();
                }
                ble.scan([], 5, onScan, scanFailure);
                $timeout(function () {
                    if(!found){
                        $scope.enableBluetoothTransferWarning = true;
                    }
                    //ble.stopScan($scope.bleApp.stopScanSuccess, $scope.bleApp.stopScanFailed);
                }, 5000, true);
            },
            stopScanFailed: function(){
                ble.stopScan($scope.bleApp.stopScanSuccess, $scope.bleApp.stopScanFailed);
            },
            stopScanSuccess : function(){
                alertify.success("succes stop scan");
            },
            reconnect : function(){
                $scope.enableBluetoothTransferWarning = false;
                $scope.enableBluetoothWarning = false;
                $scope.bleApp.scan();
            },
            onConnect: function (peripheral) {
                $scope.bleApp.isConnected = true;
                $scope.bleApp.successConnecting = true;
                $scope.bleApp.peripheralId = peripheral.id;
                console.log("connnected");
                alertify.success("connected");
                console.log($scope.s2);
                ble.startNotification(peripheral.id, canelioIds.service, canelioIds.measurement, $scope.bleApp.onData, $scope.bleApp.onErrorSendRecieve);
                function onWrite() {
                }

                var data = new Uint8Array($scope.s2);
                ble.write($scope.bleApp.peripheralId, canelioIds.service, canelioIds.measurement, data.buffer, onWrite, $scope.bleApp.onErrorSendRecieve);

            },
            onDisconnect: function (reason) {
                //save existing tricks if last got 00000 else reconnect
                $scope.bleApp.isConnected = false;
                if ($scope.bleApp.dataTransferEnded) {
                    $scope.bleApp.saveTraining();
                } else {
                    $scope.bleApp.training = [];
                    $scope.bleApp.pointsData.timesTrained = 0;
                    $scope.bleApp.pointsData.timesSuccess = 0;
                    $scope.bleApp.checkIfReconnectOrWarning();
                }
            },
            checkIfReconnectOrWarning: function () {
                alertify.error("Something went wrong");
                $scope.goToStep2AndClear();
            },
            training: [],
            dataTransferEnded: false,
            dcSuccess: function () {
                $scope.bleApp.isConnected = false;
                $scope.bleApp.onDisconnect();
                $location.path('/main');
            },
            dcFail: function(){
                if ($scope.bleApp.isConnected) {
                    ble.disconnect($scope.bleApp.peripheralId, $scope.bleApp.dcSuccess, $scope.bleApp.dcFail);
                }
            },
            onData: function (buffer) {
                console.log("got data");
                var data = new Uint8Array(buffer);
                console.log(data);
                var position = 0;
                var tricks = [];
                for (var i = 0; i < 20 ; i = i + 5) {
                    if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0 && data[i + 3] == 0 && data[i + 4] == 0) {
                        $scope.bleApp.dataTransferEnded = true;
                        ble.disconnect($scope.bleApp.peripheralId, $scope.bleApp.dcSuccess, $scope.bleApp.dcFail);
                        break;
                    }
                    //var trick = {
                    //    timesTrained: (data[i + 1] % 16) * 256 + data[i + 2],
                    //    timesSuccess: data[i] * 256 + data[i + 1] / 16,
                    //    trick_id: data[i + 3] / 8,
                    //    time: ((data[i + 3] % 8) * 256 + data[i + 4]) * 3600 + $scope.bleApp.unixTimeLastSync
                    //}
                    //console.log(trick.trick_id)
                    //console.log("tricks ids are");
                    //console.log($scope.bleApp.tricks)
                    //console.log("after id fail");
                    //$scope.bleApp.pointsData.timesTrained = $scope.bleApp.pointsData.timesTrained + trick.timesTrained;
                    //$scope.bleApp.pointsData.timesSuccess = $scope.bleApp.pointsData.timesSuccess + trick.timesSuccess;
                    //$scope.bleApp.training.push(trick);
                }

            },
            saveTraining: function () {
                console.log("should save training");
                var def = $q.defer();
                def.promise.then(function (success) {
                    var data = {
                        s1: $scope.s1,
                        s2: $scope.s2original,
                        time: $scope.time,
                    };
                    model_Clicker.saveClicker(data);
                    $location.path('/main');
                }, function (error) {
                    $scope.goToStep2AndClear();
                });
                var data = {
                    s3: $scope.clickerCode,
                    s2: $scope.s2original,
                    s1: $scope.s1,
                };
                console.log("senidnig data");
                console.log(data);
                model_Clicker.claimClicker(def, data);
                //var def = $q.defer();
                //def.promise.then(function (data) {
                //    var time = model_Clicker.getSyncTime();
                //    model_ServerSync.updateSync(time, false);
                //    model_Clicker.resetSyncTime();
                //    defSaved.resolve(true);
                //});
                //db_TrainingForServer.insertTraining(def, $scope.bleApp.training);
                //var defLocalSave = $q.defer();
                //model_Clicker.saveTraining(defLocalSave, $scope.bleApp.training);
            },
            onErrorSendRecieve: function (reason) {
                //reconnect if second time show warning
                alertify.error("error getting data please retry connecting to clicker");
                $scope.bleApp.dcFail();
                $scope.goToStep2AndClear();
            },
        };
        $scope.bleApp.checkBle();
    }


});
