App.controller("ctrl_SetupGoals", function ($scope, $q, $location, $routeParams, model_Goal) {
    
    $scope.type = $routeParams.type;
    $scope.title = "Setup " + $routeParams.type + ' goal';
    $scope.goal = model_Goal.getGoal($scope.type);
    console.log($scope.goal);
    if ($scope.goal == null) {
        console.log("inside");
        if ($scope.type == "daily") {
            $scope.recommendedRepetitions = 10;
        } else {
            $scope.recommendedRepetitions = 100;
        }
        $scope.decimalInput_DefaultValue = $scope.recommendedRepetitions;
    }

    if ($scope.type == "daily") {
        $scope.message = "How many repetitions you plan to do per day?";
    } else {
        $scope.message = "how many repetitions you plan to do per week?";
    }

    $scope.decimalInput_visible = true;
    $scope.decimalInput_hideCancel = true;
    
    $scope.decimalInput_save = function () {
        var newGoal = $('.decimalInputContainer .input').text();
        if (newGoal == '' || parseInt(newGoal) == 0) {
            alertify.error("number not valid");
        } else {
            $scope.uploadGoal(newGoal);
        }
    }

    $scope.uploadGoal = function (goal) {
        var newGoal = parseInt(goal);
        console.log($scope.goal);
        $scope.decimalInput_reset();
        var def = $q.defer();
        def.promise.then(function (success) {
            $scope.loading = false;
            $scope.goal = newGoal;
            console.log(success.data);
            model_Goal.updateGoalsDataFromServer(success);
        }, function (error) {
            $scope.loading = false;
            alertify.error("failed to load");
        });
        var data = {
            goal: newGoal,
            type: $scope.type
        };
        model_Goal.updateGoal(def, data);
        $scope.loading = true;
    }

    $scope.showInput = function () {
        $scope.decimalInput_visible = true;
    }

});
