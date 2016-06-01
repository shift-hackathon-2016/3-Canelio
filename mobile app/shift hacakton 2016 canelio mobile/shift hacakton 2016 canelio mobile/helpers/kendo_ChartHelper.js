(function ($, console, win) {

    var $scope = {
        getChartConfig:function (){
            var config = {
                legend: {
                    visible: true,
                    position: "top",
                    labels: {
                        font: "18px",
                    
                        margin: {
                            right: 20,
                        },
                        padding: {
                            top: 5,
                            bottom:5
                        }
                    }
                },
                seriesColors: SERIES_COLORS,
                valueAxis: {
                    line: {
                        visible: false,

                    },
                    majorGridLines: {
                        color: "#bbb"
                    },
                    minorGridLines : {
                        color: "#000000",
                        visible: false
                    },
                },
                categoryAxis: {
                    field: "date",
                    majorGridLines: {
                        visible: false
                    },
                    line: {
                        visible: false,
                    },
                    labels: {
                        rotation: 90
                    },
                },
                chartArea: {
                    background: "transparent",
                },
                tooltip: {
                    visible: false,
                },
                theme: "flat"
            };
            return config;
        },
        getSucessRateConfig: function () {
            var config = $scope.getChartConfig();
            config.series = [
                {
                    name: "Success Rate %",
                    field: "successRate",
                    color: "#134787",
                    type: "area"
                },
                {
                    name: "Success Rate blue line",
                    type: "line",
                    field: "successRate",
                    color: "#062244",
                    visibleInLegend: false,
                    markers: {
                        background: "#062244"
                    }
                }
            ];
            config.valueAxis.labels = {
                template: "#:value#%"
            }
            config.valueAxis.max = 105;
            config.valueAxis.min = 0;
            config.legendItemClick = function (e) {
                e.preventDefault();
            }
            return config;
        },
        d3SuccessConfig: function (height) {
            var config = {
                xIsMysqlDate: true,
                xField: "date",
                yField: "successRate",
                element: '#successChart',
                curved: false,
                height: height,
                seeMaxTick: true,
                areaFillColor: '#134787',
                areaFillOpacity: '0.8',
                lineColor: '#062244',
                lineWidth: '2',
                yLabelFormat: function (howManyDecimals) {
                    return function (v, i) {
                        return v.toFixed(howManyDecimals) + ' %';
                    }
                }
            }
            return config
        },
        d3RepetitionsConfig: function (height) {
            var config = {
                xIsMysqlDate: true,
                xField: "date",
                yField: "fail",
                yField2: "success",
                element: '#repetitionsChart',
                curved: false,
                roundXTicks:true,
                height: height,
                seeMaxTick: true,
                areaFillColor: '#871326',
                areaFillOpacity: '0.8',
                areaFillColor2: '#134787',
                areaFillOpacity2: '0.8',
                lineColor: '#900112',
                lineWidth: '2',
                lineColor2: '#062244',
                lineWidth2: '2',
                yLabelFormat: function (howManyDecimals) {
                    return function (v, i) {
                        return v.toFixed(howManyDecimals) + ' rep';
                    }
                }
            }
            return config
        }
    };


    $.extend(window, {
        kendo_ChartHelper: $scope,
    });
})
(jQuery, console, window);