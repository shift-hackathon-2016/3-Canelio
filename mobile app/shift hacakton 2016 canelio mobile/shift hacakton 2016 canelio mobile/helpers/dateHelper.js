App.factory("dateHelper", function () {

    function getCurrentDate(inDateFormat) {
        return kendo_DateHelper.getCurrentDate(inDateFormat);
    }

    function getDateMinusDays(days, inDateFormat) {
       return kendo_DateHelper.getDateMinusDays(days,inDateFormat)
    }

    function formatDateForDb(date) {
        return kendo_DateHelper.formatDateForDb(date);
        //return date.toISOString().slice(0, 10).replace('T', ' ');
    }


    function getCurrentTimestamp() {
        return kendo_DateHelper.getCurrentTimestamp();
    }

    return {
        getCurrentDate: getCurrentDate,
        getDateMinusDays: getDateMinusDays,
        formatDateForDb: formatDateForDb,
        getCurrentTimestamp:getCurrentTimestamp,
    };
});