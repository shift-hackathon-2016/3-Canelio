App.controller("ctrl_Solutions", function ($scope, svc_File, $q, $routeParams) {
    console.log("inside Solution");
    $scope.problemsTxt = "Problems";
    $scope.advicesTxt = "Advices";
    $scope.title = "Advices";

    $scope.getTabIconSrc = function (tab) {
        if (tab == 'advice') {
            if (!$scope.isProblemsActive) {
                return 'res/advices2b605f.png';
            } else {
                return 'res/advicesWhite.png'
            }
        } else if (tab == 'problems') {
            if ($scope.isProblemsActive) {
                return 'res/problems2b605f.png';
            } else {
                return 'res/problemsWhite.png';
            }
        }
        return false;
    }

    $scope.tabChange = function (isProblems) {
        $scope.isProblemsActive = isProblems;
        $scope.app.view().scroller.reset();
    }

    $scope.tabsSpacer = {
        width: Math.floor(window.innerWidth - 157)/3+ 'px'
    }

    $scope.problemClicked = function (problem) {
        if ($scope.block) {
            return null;
        }
        problem.showFull = !problem.showFull;
    }

    $scope.isProblemClicked = function (problem) {
        return problem.showFull;
    }

    $scope.isProblemsActive = true;
    var def = $q.defer();
    def.promise.then(function (solution) {
        $scope.problems = solution.problems;
        $scope.advices = solution.advice;
    });
    svc_File.getTrickSolution(def, $routeParams.id);

    $scope.$on('$viewContentLoaded', function () {
        $scope.app = new kendo.mobile.Application($('#kapp'), {
            transition: "none",
            initial: "#solutions",
            browserHistory: false,
            webAppCapable: false,
            skin: "ios-light",
            init: function () {
                this.view().scroller.bind("scroll", function (e) {
                    console.log("scroll");
                    clearTimeout($scope.timeout);
                    $scope.timeout = setTimeout(function () {
                        $scope.block = false;
                    },100);
                    $scope.block = true;
                });
            }
        });
    })

});
