App.factory("model_Result", function ($q, $http, requestHelper, $rootScope, $location, model_UploadDogImage) {

    var data = {
        timesSuccess: 20,
        timesTrained:30
    };


    function navigateResultOrAchievment(d, trickId, simple) {
        console.log("data is:", d);
        data = d;

        if (data.data.achivementWon) {
            model_UploadDogImage.resetImages();
            $rootScope.navigateNoNavBarTransition("/achievementWon/" + trickId + '/' + data.data.achivementId);
        } else if(!simple) {
            $rootScope.navigateNoNavBarTransition("/result/1/" + trickId);
        }
    }



    function getTrainingResult() {
        var returned = calculatePointsAndSuccessRate(data);
        returned.achivementWon = data.achivementWon;
        var messages;
        messages = ['cool!', 'Nicely done!', 'Huurah!', 'On your way!', 'You can do this!', "Nice!", "Very well!", "Good!", "Nice training!", "Bravo!", 'Sky is limit!'];
        returned.message = messages[Math.floor(Math.random() * messages.length)];
        return returned;
    }


    function calculatePointsAndSuccessRate(data) {
        var returned = {};
        returned.successRate = Math.round((data.timesSuccess / data.timesTrained) * 100);
        
        var success = parseInt(data.timesSuccess);
        var fail = parseInt(data.timesTrained) - parseInt(data.timesSuccess);
        returned.points = kmodel_Points.calculatePoints(success, fail)
        return returned;
    }

    function getAchievmentMessage() {
        var messages = ["Woow!", "Amazing!", "Epic!", "Superb!", "Magical!", "Majestic!", "Superior!", "Congrats!", 'Awesome!', "Success!"];
        return messages[Math.floor(Math.random() * messages.length)];
    }



    return {
        getTrainingResult: getTrainingResult,
        calculatePointsAndSuccessRate: calculatePointsAndSuccessRate,
        navigateResultOrAchievment: navigateResultOrAchievment,
        getAchievmentMessage: getAchievmentMessage
    };
});