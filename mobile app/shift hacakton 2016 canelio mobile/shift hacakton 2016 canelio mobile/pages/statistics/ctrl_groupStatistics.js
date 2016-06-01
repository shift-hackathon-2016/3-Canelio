App.controller("ctrl_GroupStatistics", function ($scope, $q, $routeParams, dateHelper, model_GroupStatistics, chartHelper, svc_File) {

    
    $scope.playVideoTxt = "Play Video";
    $scope.title = "Statistics";
    $scope.groupId = $routeParams.id;
    $scope.level = $routeParams.level;
   
    var def = $q.defer();
    $scope.filePromise = def.promise;
    if ($scope.level == "subgroup") {
        svc_File.getTrickSubGroup(def, $routeParams.id);
    } else {
        svc_File.getTrickGroup(def, $routeParams.id);
    }

    //for view sliding in
    $scope.viewAnimationDef = $q.defer();
    $scope.viewAnimationPromise = $scope.viewAnimationDef.promise;
    $scope.loading = true;
    setTimeout(function () {
        $scope.viewAnimationDef.resolve(true);
    }, 1000);

    $scope.getLegendIconColor = function (index) {

        return {
            "background-color": SERIES_COLORS[index]
        }
    }

        $scope.getTabIconSrc = function (tab) {
        if (tab == 'success') {
            if (tab == $scope.selcted) {
                return 'res/statistics2b605f.png';
            }else{
                return 'res/statisticsWhite.png'
            }
        } else if (tab == 'repetition') {
            if (tab == $scope.selcted) {
                return 'res/repetitionsChart2b605f.png';
            } else {
                return 'res/repetitionsChartWhite.png';
            }
        } else if (tab == 'share') {
            if (tab == $scope.selcted) {
                return 'res/share2b605f.png';
            } else {
                return 'res/shareWhite.png';
            }
        }
        return false;
    }    //10 is for padding of chart container

    $scope.chartsRelativeContainer = {
        "min-height": window.innerHeight - 130
    }

    $scope.tabSpacerWidth = function () {
        return{
            width: Math.floor(($('body')[0].getBoundingClientRect().width - $('#tabShare')[0].getBoundingClientRect().width - $('#tabRepetitions').outerWidth() - $('#tabSuccessRate')[0].getBoundingClientRect().width) / 2) + 'px'
        }
    }

    $scope.select = function (tab) {
        //if (tab == 'repetition') {
        //    $scope.tabSpacerWidth = {
        //        width: (window.innerWidth - 250) / 2 + 'px'
        //    }
        //} else {
        //    $scope.tabSpacerWidth = {
        //        width: (window.innerWidth - 248) / 2 + 'px'
        //    }
        //}
        $scope.selcted = tab;
    }
    $scope.isSelected = function (tab) {
        if (tab == $scope.selcted) {
            return true;
        }
        return false;
    }

    $scope.datesChanged = function (from, to) {
        $scope.loading = true;
        $scope.noTrainingsDone = false;

        $scope.from = from;
        $scope.to = to;
        var data = {
            from: from,
            to: to,
            group_id: $scope.groupId
        };
        var def = $q.defer();
        def.promise.then(function (data) {

            var def = $q.defer();
            def.promise.then(function (formattedData) {
                $scope.viewAnimationPromise.then(function (success) {
                    
                    $scope.chartSharesDatasource = formattedData.shares;
                    $("#shareChart").data('kendoChart').setDataSource($scope.chartSharesDatasource);
                    var obj = [];
                    $.extend(true,obj, formattedData.trainings);
                    console.log("set chartSharesDatasource");
                    console.log(obj);
                    console.log(formattedData.trainings);
                    $scope.shares = formattedData.shares;
                    $scope.repetitionsChart.data(formattedData.trainings);
                    $scope.successChart.data(obj);
                    $scope.totalFailed = formattedData.totalFail;
                    $scope.totalSuccess = formattedData.totalSuccess;
                    $scope.highestSucessRate = formattedData.highestSucessRate;
                    $scope.loading = false;
                    $scope.noTrainingsDone = false;
                });
            }, function (error) {
                if (error == "noData") {
                    $scope.loading = false;
                    $scope.noTrainingsDone = true ;
                }
            });
            model_GroupStatistics.formatGroupSatistics(def, $scope.filePromise, $scope.level, data)
        }, function (error) {
            console.log(error);
        });
        model_GroupStatistics.getData(def, $scope.level, data);
    }

    var chartConteinerHeight = $('body').height() - 130;
    var chartHeight = chartConteinerHeight - 95;
    if (chartHeight > 320) {
        chartHeight = 320;
    }

    $scope.chart = {
        width: window.innerWidth,
        height: chartHeight - 50
    }

    $scope.singleChartHeight = function () {
        return {
            height: (chartHeight + 95) + 'px'
        }
    }


    
    $scope.initTabs = function () {
        $scope.initRepetition();
        $scope.initSucess();
        $scope.initShares();
    }

    $scope.initRepetition = function () {
        var config = kendo_ChartHelper.d3RepetitionsConfig(chartHeight);
        $scope.repetitionsChart = new d3AreaChart(config);
    }

    $scope.initSucess = function () {
        var config = kendo_ChartHelper.d3SuccessConfig(chartHeight);
        $scope.successChart = new d3AreaChart(config);
    }

    $scope.initShares = function () {
        var config = chartHelper.getChartConfig();
        config.legend.visible = false;
        config.legend.labels.template = '#= text # #= value#%\n',
        config.series = [{
            type: "donut",
            field: "value",
            categoryField: "name",
            startAngle: 150,
        }];
        $("#shareChart").kendoChart(config);
    }

    $scope.mainNav_datePicker_click = function () {
        $scope.showDatesPicker = !$scope.showDatesPicker;
    }

    $scope.initTabs();

    //$scope.showDatesPicker = true;
    //var to = dateHelper.getCurrentDate();
    //var from = dateHelper.getDateMinusDays(1);
    //$scope.datesChanged(from, to);
    $scope.select('share');

});
