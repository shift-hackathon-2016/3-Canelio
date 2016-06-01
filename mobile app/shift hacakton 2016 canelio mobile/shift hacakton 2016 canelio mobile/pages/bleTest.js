App.controller("bleTest", function ($scope, db_Trainig, $q) {

    // (c) 2015 Don Coleman
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    // You may obtain a copy of the License at
    //
    //     http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    // See the License for the specific language governing permissions and
    // limitations under the License.

    /* global ble, statusDiv, beatsPerMinute */
    /* jshint browser: true , devel: true*/

    // See BLE heart rate service http://goo.gl/wKH3X7
    var heartRate = {
        service: 'C033',
        measurement: 'C034'
    };

    var app = {
        linesGot:0,
        initialize: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        onDeviceReady: function () {
            app.scan();
        },
        scan: function () {
            app.status("Scanning for Heart Rate Monitor");

            var foundHeartRateMonitor = false;

            function onScan(peripheral) {
                // this is demo code, assume there is only one heart rate monitor
                console.log("Found " + JSON.stringify(peripheral));
                foundHeartRateMonitor = true;

                ble.connect(peripheral.id, app.onConnect, app.onDisconnect);
            }

            function scanFailure(reason) {
                alert("BLE Scan Failed");
            }

            ble.scan([], 5, onScan, scanFailure);

            setTimeout(function () {
                //if (!foundHeartRateMonitor) {
                //    app.status("Did not find a heart rate monitor.");
                //}
            }, 5000);
        },
        onConnect: function (peripheral) {
            app.status("Connected to " + peripheral.id);
            alertify.success("connected");
            app.peripheralId = peripheral.id;
            ble.startNotification(peripheral.id, heartRate.service, heartRate.measurement, app.onData, app.onError);
            $scope.sendData1();
            app.firstData = true;
            app.firstDate = new Date();
        },
        onDisconnect: function (reason) {
            alertify.success("disconnected");
            beatsPerMinute.innerHTML = "...";
            app.status("Disconnected");
        },
        tricks:[],
        onData: function (buffer) {
            // assuming heart rate measurement is Uint8 format, real code should check the flags
            // See the characteristic specs http://goo.gl/N7S5ZS
            //console.log(buffer);
            app.linesGot++;
            var data = new Uint8Array(buffer);
            beatsPerMinute.innerHTML = data[1];

            var position = 0;
            var tricks = [];
            for (var i = 0; i < 20 ; i = i + 5) {
                if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0 && data[i + 3] == 0 && data[i + 4] == 0) {
                    break;
                }
                var trick = {
                    trained: (data[i + 1] % 16) * 256 + data[i + 2],
                    success: data[i] * 256 + data[i + 1] / 16,
                    trickId: data[i + 3] / 8,
                    totalHours : (data[i+3]%8)*256 + data[i+4] 
                }
                app.tricks.push(trick);

            }

            //alertify.success(data[1]);
            ////if(app.linesGot == 5){
            //    ble.disconnect(app.peripheralId, app.onDisconnect, app.onError);
            ////}
            
            console.log(data);
            if (!app.firstData) {

            } else {
                clearTimeout(app.timeout);
                app.timeout = setTimeout(function () {
                    var endDate = new Date();
                    var time = endDate.getTime() - app.firstDate.getTime() - 1000;
                    console.log("total time is:", time);
                    
                }, 1000);
            }
        },
        onError: function (reason) {
            alert("There was an error " + reason);
        },
        status: function (message) {
            console.log(message);
            statusDiv.innerHTML = message;
        }
    };

    $scope.printLinesGot = function () {
        alertify.success(app.linesGot);
    }

    app.initialize();

    function onWrite() {
        alertify.success("written");
    }

    function onWriteFail() {
        alertify.error("failed to write");
    }

    $scope.sendData = function () {
        console.log(app.tricks);
    }

    $scope.sendData1 = function () {
        var data = new Uint8Array([24,52,56,6,22,24,182,178,186,67,97,78,101,76,105,79, 59,0,0,0]);
        ble.write(app.peripheralId, heartRate.service, heartRate.measurement, data.buffer, onWrite, onWriteFail);
    }

    $scope.sendData2 = function () {
        var data = new Uint32Array([3333]);
        ble.write(app.peripheralId, heartRate.service, heartRate.measurement, data.buffer, onWrite, onWriteFail);
    }

    //"0000C034-0000-1000-8000-00805f9b34fb"

    setTimeout(function () {
        app.onDeviceReady();
    }, 1000)


});
