App.factory("model_Level", function ($q, $http, requestHelper) {

    function updatePoints(data) {
        var points = parseInt(window.localStorage.getItem('dogPointsNeededToLvlUp')) - (data.timesTrained-data.timesSuccess)- data.timesSuccess * 2;
        window.localStorage.setItem('dogPointsNeededToLvlUp',points);

    }



    function updateLevel(data) {
        if (data.pointsNeeded) {
            window.localStorage.setItem('dogTitle', data.title);
            window.localStorage.setItem('dogPointsNeededToLvlUp', data.pointsNeeded);
            window.localStorage.setItem('dogLevel', data.userLevel);
            window.localStorage.setItem('dogLevelWorthPoints', data.levelPoints);
        }
    }

    function clearLevel(data) {
        window.localStorage.removeItem('dogPointsNeededToLvlUp');
        window.localStorage.removeItem('dogLevel');
        window.localStorage.removeItem('dogLevelWorthPoints');
    }

    function getLevelPoints(data) {
        var lvl = parseInt(window.localStorage.getItem('dogLevel'));
        var pointsNeeded = parseInt(window.localStorage.getItem('dogPointsNeededToLvlUp'));
        var dogLevelWorthPoints = parseInt(window.localStorage.getItem('dogLevelWorthPoints'));
        var lvlPercentage = (dogLevelWorthPoints - pointsNeeded) / dogLevelWorthPoints;
        if (pointsNeeded == 1) {
            var pointsText = "point"
        } else {
            var pointsText = "points";
        }
        if (lvl >= 1000) {
            var maxLevel = true;
        }
        return {
            title: window.localStorage.getItem('dogTitle'),
            lvl: lvl,
            nextLvl: lvl + 1,
            pointsNeeded: pointsNeeded,
            pointsText: pointsText,
            maxLevel: maxLevel,
            clearLevel: clearLevel,
            lvlPercentage: lvlPercentage
        }
    }



    return {
        updatePoints: updatePoints,
        updateLevel: updateLevel,
        getLevelPoints: getLevelPoints,
        clearLevel: clearLevel
    };
});