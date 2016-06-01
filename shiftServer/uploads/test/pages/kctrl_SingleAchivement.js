(function ($, console, win) {

    var $scope = kendo.observable({
        achivementID: 0,
        title: "Achievement",
        id: "0",
        trickId: "0",
        picTaken: true,
        imageSrc: '',
        daysBetween: "1",
        dogName: localStorage.getItem("dogName"),
        loading: true,
        chartSuccessDataSource: new kendo.data.DataSource({}),
        uploadPic:function(){
            //config = {
            //    type: "achivement",
            //    trickId: $scope.trickId
            //};
            //model_UploadDogImage.setConfig(config);
            //$location.path('/imageUpload');
            config = {
                type: 'achivement',
                trickId : $scope.trickId
            };
            kmodel_UploadDogImage.setConfig(config);
            kConnector.navigateAngular('/imageUpload');
        },
        navigateBack: function () {
            //window.history.back();
            kConnector.navigateBack();
        },
        beforeShow: function(e){
            $scope.set("loading", true);
        },
        show: function (e) {
            $scope.id = e.view.params.id;
            $scope.trickId = e.view.params.trickId;
            console.log("-----------------------");
            console.log($scope.id);
            var def = $.Deferred()
            var promise = def.promise();
            promise.then(function (data) {
                console.log(data);
                $scope.set("imageSrc" ,data.imageSrc);
                $scope.set("picTaken", data.hasImage);
                $scope.set('daysBetween', kendo_DateCalculationsHelper.daysBetween(data.date, data.startDate))
                var statistics = kmodel_TrickStatistics.formatTrickSatistics(data.statistic.data);
                console.log("---------");
                console.log(statistics);
                $scope.set("points" ,kmodel_Points.calculatePoints(statistics.totalSuccess, statistics.totalFailed));
                $scope.set("repetitions", statistics.totalSuccess+statistics.totalFailed)
                $scope.chart.data(statistics.sucessRates);
                $scope.set("loading", false);
                //reset scrollview
                var scrollview = $("#achivementSingle #scrollview").data("kendoMobileScrollView");
                scrollview.scrollTo(0, true);
                scrollview.refresh();

                

            }, function (error) {
            });
            var data = {
                'achivmentId': $scope.id
            };
            kmodel_Achivement.singleData(def, data);
        },
        init: function (e) {
            console.log("init called");
            //set achivment big photo
            var marginTop = 10;
            var height = $('body').height() - $('#navBar').height() - 40 - marginTop; //31 is bottom 20 is margin top
            $('#achivementSingle .achivemntBigPhotoContainer').css('height', height + 'px');
            $('#achivementSingle .achivemntBigPhotoContainer').css('margin-top', marginTop + 'px');
            //set chart width
            $('#achivementSingle #successChart').css('width', $('body').width() - 10 + 'px');
            //calculate space on page 3
            var height = $('body').height() - 85;
            var chartHeight = height - 105;
            if (chartHeight > 300) {
                chartHeight = 300;
            }
            var headerHeight = $('#achivementSingle #navBarSpaceFiller').height();
            var space = Math.floor((height-chartHeight-55)/2)
            $('#achivementSingle .sucessRateLegend').css('margin-top', space + 'px');
            //$('#achivementSingle .facebookShareContainer').css('margin-top', space + 'px');
            //init chart
            var config = kendo_ChartHelper.d3SuccessConfig();
            config.element = '#achivementSingle #successChart';
            config.height = chartHeight;
            $scope.chart = new d3AreaChart(config);

            //calculate dog name
            var $body = angular.element(document.body);
            var model_Dog = $body.injector().get('model_Dog');
            var stringHelper = $body.injector().get('stringHelper');
            var dogName = stringHelper.formatWith3Dots(model_Dog.getDogName(), 20, 256, $('body').width() * 0.8);

            //set scrollview height
            //var height = $('body').height() - $('#navBar').height();
            //$('#achivementSingle #scrollview').css('height', height + 'px');
            //$('#achivementSingle #scrollview').css('width', $('body').width() + 'px');
        }
    });


    $.extend(window, {
        kctrl_achivementSingle: $scope,
    });
})
(jQuery, console, window);
