App.controller("ctrl_TrickStatistics", function ($scope, $q, $routeParams, dateHelper, model_TrickStatistics, chartHelper) {

    $scope.showDatesPicker = false;
    $scope.title = "Statistics";
    $scope.trickId = $routeParams.id;

    setTimeout(function () {
        $('#datesPicker').addClass('slideFadeInFromBottomOut');
    }, 400);
    

    //for view sliding in
    $scope.viewAnimationDef = $q.defer();
    $scope.viewAnimationPromise = $scope.viewAnimationDef.promise;
    $scope.loading = true;
    $scope.viewAnimationDef.resolve(true);

   
    //10 is for padding of chart container
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
        }
        return false;
    }

    $scope.chartsRelativeContainer = {
        "min-height": window.innerHeight-130
    }

    $scope.tabSpacersWidth = function(){
        //
        return {
            width: Math.floor(($('body')[0].getBoundingClientRect().width - $('#sucessRateTab')[0].getBoundingClientRect().width - $('#repetitionsTab')[0].getBoundingClientRect().width) / 3) + 'px'
        }
    }

    
   

    $scope.select = function (tab) {
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
        console.log("got dates changed");
        console.log(from);
        console.log(to);
        var data = {
            from: from,
            to: to,
            trick_id: $scope.trickId
        };
        var def = $q.defer();
        def.promise.then(function (data) {
            if (data.length == 0) {
                $scope.loading = false;
                $scope.noTrainingsDone = true;
                return null;
            }
            //w8 for view animation to slide in for smooth animation
            $scope.viewAnimationPromise.then(function (success) {
                
                console.log("data is:");
                console.log(data);
                var formatedData = model_TrickStatistics.formatTrickSatistics(data);
                console.log(formatedData.repetitions);
                $scope.repetitionsChart.data(formatedData.repetitions);
                $scope.successChart.data(formatedData.sucessRates);
                $scope.totalFailed = formatedData.totalFailed;
                $scope.totalSuccess = formatedData.totalSuccess;
                $scope.highestSucessRate = formatedData.highestSucessRate;
                $scope.loading = false;
                //$scope.initRepetition();
            });

        }, function (error) {
            console.log(error);
        });
        model_TrickStatistics.getData(def, data);
    }

    
    $scope.initTabs = function () {
        $scope.initRepetition();
        $scope.initSucess();
    }
    var chartConteinerHeight = $('body').height() - 130;
    var chartHeight = chartConteinerHeight - 95;
    if (chartHeight > 320) {
        chartHeight = 320;
    }

    $scope.singleChartHeight = function () {
        return {
            height:(chartHeight +95) +'px'
        }
    }

    $scope.initRepetition = function () {
        var config = kendo_ChartHelper.d3RepetitionsConfig(chartHeight);
        $scope.repetitionsChart = new d3AreaChart(config);
    }

    $scope.initSucess = function () {
        var config = kendo_ChartHelper.d3SuccessConfig(chartHeight);
        $scope.successChart = new d3AreaChart(config);
    }

    $scope.mainNav_datePicker_click = function () {
        $scope.showDatesPicker = !$scope.showDatesPicker;
    }

    $scope.initTabs();

    //$scope.showDatesPicker = true;
    //var to = dateHelper.getCurrentDate();
    //var from = dateHelper.getDateMinusDays(1);
    //$scope.datesChanged(from, to);
    $scope.select('success')


});
