App.factory("arrayHelper", function () {

    function formatTrickSatistics(data){
        var repetitions = [];
        var sucessRates = [];
        var totalSuccess = 0;
        var totalFailed = 0;
        var highestSucessRate = 0;
        for (var i = 0; data.length > i; i++) {
            var rep = {};
            rep.success = parseInt(data[i].success);
            rep.fail = data[i].total - data[i].success;
            rep.date = data[i].date;
            totalSuccess += rep.success;
            totalFailed += rep.fail;
            repetitions.push(rep);

            var success = {};
            success.successRate = Math.round((data[i].success / data[i].total) * 100);
            success.date = data[i].date;
            highestSucessRate = highestSucessRate > success.successRate ? highestSucessRate : success.successRate;
            sucessRates.push(success);
        }
        console.log(repetitions);
        return {
            repetitions: repetitions,
            sucessRates: sucessRates,
            totalSuccess: totalSuccess,
            totalFailed: totalFailed,
            highestSucessRate: highestSucessRate
        }
    }
    
    return {
        formatTrickSatistics: formatTrickSatistics
    };
});