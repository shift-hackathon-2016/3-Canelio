App.controller("ctrl_Weight", function ($scope, svc_File, $q, svc_FileChecker,$location) {

    //check file version
    $scope.title = "Weight"

    $scope.promjenaDate = function(){
        var num = 4;
        var data = [];
        var start = new Date(2011, 0, 8);
        var end = new Date();

        for (var i = 0; i < num; i++) {
            var obj = {
                a: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
                b:Math.round( Math.random() * 30) + 5,
                c: Math.round(Math.random() * 25) + 5,
                key: Math.round(Math.random())
            }
            data.push(obj);
        }
        //data.push({ a: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())) ,b:0,c:2})
        //data = [{ "date": new Date(), "close": 95.83746573189273 }, { "date": new Date(), "close": 95.38632814073935 }, { "date": new Date(), "close": 52.38331424770877 }, { "date": new Date(), "close": 68.86315222363919 }, { "date": new Date(), "close": 60.88529542321339 }]
        $scope.chart.data(data);

    }
    config = {
        xIsMysqlDate: false,
        xField: "a",
        yField: "b",
        yField2: "c",
        element: '#wieghtChart',
        curved: false,
        height: 300,
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
                return v.toFixed(howManyDecimals) ;
            }
        }
    };
    $scope.chart = new d3AreaChart(config);





});
