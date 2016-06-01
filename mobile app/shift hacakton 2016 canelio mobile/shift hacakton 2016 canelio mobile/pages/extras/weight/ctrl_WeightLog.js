App.controller("ctrl_WeightLog", function ($scope, svc_File, $q, svc_FileChecker, $location) {

    $scope.title = "Log weight"

    //$('#moj').on('click', function () {
    //    $("#weightLogInput").focus().select();
    //});
    $scope.mainNav_datePicker_click = function () {
        console.log("clicked");
        $scope.showDatesPicker = !$scope.showDatesPicker;
    }

    $scope.mainNav_history_click = function () {
        kConnector.setFirstView("pages/extras/weight/weightHistory.html");
        $location.path("/kendo");
    }
    

    $scope.decimalInput_save = function (weight) {
        var number = $('.decimalInputContainer .input').text();
        $scope.decimalInput_reset();
        $scope.loadingMessage = "Saving data...";
        $scope.loading = true;
        var def = $q.defer();
        def.promise.then(function (data) {
            console.log("sucess");
            $scope.datesChanged($scope.from,$scope.to);
        }, function (error) {
            console.log("error")
        });
        console.log("sending");
        console.log($('.decimalInputContainer .input').text());
        kmodel_Weight.save(def, number);
        
    };
    
    $scope.datesChanged = function (from, to) {
        $scope.from = from;
        $scope.to = to;
        $scope.loading = true;
        $scope.loadingMessage = "Getting data...";
        data = {
            from:from,
            to:to,
        };
        var def = $q.defer();
        def.promise.then(function (data) {
            $scope.loading = false;
            $scope.data = data;
            if (data.length > 0) {
                $scope.currentWeight = parseFloat(data[data.length - 1].weight);
                $scope.currentWeight = Math.abs($scope.currentWeight.toFixed(5));
            } else {
                $scope.currentWeight = 0;
            }
            if (data.length > 1) {
                $scope.changeAvaliable = true;
                $scope.oneDataEntry = false;
                var last = data[data.length - 1];
                var before = data[data.length - 2];
                $scope.change = parseFloat(last.weight) - parseFloat(before.weight);
                $scope.change = Math.abs($scope.change.toFixed(5));
                if ($scope.change > 0) {
                    $scope.changeUp = true;
                    $scope.changeDown = false;
                } else if ($scope.change < 0) {
                    $scope.changeUp = false;
                    $scope.changeDown = true;
                } else {
                    $scope.changeUp = false;
                    $scope.changeDown = false;
                }
            } else {
                $scope.oneDataEntry = true;
                $scope.changeAvaliable = false;
            }
            
            $scope.chart.data(data);
        }, function (error) {
            console.log("error")
        });

        kmodel_Weight.getData(def,data);

    }

    var currentWeightContinerHeight = 90;
    var latestChangeContainerHeight = 80;
    var navBarHeight = 50;
    var avaliableSpace = $('body').height() - navBarHeight;
    console.log("body height", $('body').height());
    console.log("navbar height", navBarHeight)
    var maxChartHeight = 340;

    var chartHeight = avaliableSpace - currentWeightContinerHeight-latestChangeContainerHeight;
    if (chartHeight > maxChartHeight) {
        chartHeight = maxChartHeight;
    }
    console.log("chart height is", chartHeight);
    $scope.changeAvaliable = true;

    $scope.chartStyle = function () {
        var bottom = avaliableSpace - currentWeightContinerHeight - chartHeight;
        if ($scope.changeAvaliable || ($scope.oneDataEntry && $scope.currentWeight)) {
            bottom = bottom - latestChangeContainerHeight;
        }
        bottom = Math.floor(bottom / 2);
        return {bottom:bottom}
    }

    config = {
        xIsMysqlDate: true,
        xField: "date",
        yField: "weight",
        element: '#wieghtChart',
        curved: true,
        height: chartHeight,
        seeMaxTick: true,
        areaFillColor: '#134787',
        areaFillOpacity: '0.8',
        lineColor: '#062244',
        lineWidth: '2',
        yLabelFormat: function (howManyDecimals) {
            return function (v, i) {
                return v.toFixed(howManyDecimals);
            }
        }
    };
    $scope.chart = new d3AreaChart(config);



});
