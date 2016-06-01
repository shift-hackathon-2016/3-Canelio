App.factory("chartHelper", function () {

    function getChartConfig(){
        return kendo_ChartHelper.getChartConfig();

    }
    
    return {
        getChartConfig: getChartConfig
    };
});