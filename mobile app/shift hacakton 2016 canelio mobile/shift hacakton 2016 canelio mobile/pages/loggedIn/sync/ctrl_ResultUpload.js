App.controller("ctrl_ResultUpload", function ($scope, $q, $location, model_Dog, model_Level, model_ResultUpload, stringHelper) {
    
    
    $scope.totalSteps = 0;
    var results = model_ResultUpload.getResult();
    $scope.step = results.step;
    console.log("inside result upload");
    console.log($scope.step);

    $scope.successRatesExists = results.showSucessRates;

    if ($scope.successRatesExists) {
        $scope.totalSteps++;
    }

    $scope.lvlsWonExists = false;
    if (results.lvlsWon != 0) {
        $scope.totalSteps++;
        $scope.lvlsWonExists = true;
    }

    $scope.achivementsWonExists = false;
    if (results.achivmentsTotal != 0) {
        $scope.totalSteps++;
        $scope.achivementsWonExists = true;
        console.log("it exists");
        console.log($scope.achivementsWonExists);
    }

    if ($scope.step == 0) {
        if ($scope.lvlsWonExists) {
            $scope.step = 1
        } else if ($scope.achivementsWonExists) {
            $scope.step = 2;
        } else {
            $scope.step = 3;
        }
    }

    for (var i = 0; i < results.achivementsWon.length; i++) {
        results.achivementsWon[i].trick = stringHelper.formatWith3Dots(results.achivementsWon[i].trick,18,320,320);;
    }




    $scope.achivmentClicked = function (a) {
        console.log(a);
        var config = {
            trickId: a.trickId,
            achivmentId: a.achivmentId,
            type: 'resultSync'
        };
        kmodel_UploadDogImage.setConfig(config);
        $location.path('/achievementWon/' + a.trickId + '/' + a.achivmentId);
    }
    console.log("step and totalsteps");
    console.log($scope.step);
    console.log($scope.totalSteps);


    model_Dog.getDogImage().then(function (src) {
        console.log(src);
        if (src != null) {
            $scope.dogImage = src;
        }

    }, function (error) { });

    var lvlPoints = model_Level.getLevelPoints();
    console.log(lvlPoints);
    $scope.level = results.lvl;
    $scope.rankingTitle = results.title;
    $scope.lvlsWon = results.lvlsWon;
    $scope.titleWon = results.titleWon;

    $scope.achivmentsTotal = results.achivmentsTotal;
    $scope.achivementsWon = results.achivementsWon;
    var wrapper = document.getElementById('achivmentsContainer');
    var totalHeight = 170 + 30 + 120 * results.achivementsWon.length;
    $('#achivmentsContainer').css('height', $('body').height() - 48);
    myScroll = new IScroll(wrapper, { useTransition: true, preventDefault: false });
    myScroll.refresh(totalHeight, 0);

    var scrollProgress = false;

    $scope.$on('$viewContentLoaded', function () {
        console.log("inside 1231--------");
        $($scope.achivementsWon).each(function (index, el) {
            console.log("inside 123--------");
            var text = '<div class="singleAchivment" trickid="' + el.trickId + '"achivmentid="' + el.achivmentId + '">'
                +'<div class="width320 relativeContainer"><img class="profileImg" src="'
                + el.img + '"/><div class="trickTitle">'+ el.trick + '</div></div></div>';
            $('.resultUploadAchivmentList').append(text);
        });


        $('#resultUploadAchivmentList .singleAchivment').on('click', function (e) {
            console.log("click recieved");
            if (!scrollProgress) {
                var trickId = $(this).attr('trickid');
                var achivmentId = $(this).attr('achivmentid');
                var config = {
                    trickId: trickId,
                    achivmentId: achivmentId,
                    type: 'resultSync'
                };
                for (var i = 0; $scope.achivementsWon.length > i; i++) {
                    if ($scope.achivementsWon[i].trickId == config.trickId) {
                        if ($scope.achivementsWon[i].hasImg) {
                            kmodel_UploadDogImage.setImages($scope.achivementsWon[i].img, null);
                        }
                    }
                }
                model_ResultUpload.setStep($scope.step);
                $scope.$apply(function () {
                    $location.path('/achievementWon/' + trickId + '/' + achivmentId);
                });;
            }
        });


    });



    myScroll.on('scrollStart', function () {
        scrollProgress = true;
    })
    myScroll.on('scrollEnd', function () {
        scrollProgress = false;
    })


    $scope.goNextPage = function () {
        if ($scope.step == 1) {
            if ($scope.achivementsWonExists) {
                $scope.step = 2;
            } else if ($scope.successRatesExists) {
                $scope.step = 3;
            }
            return null;
        }
        if ($scope.step == 2) {
            if ($scope.successRatesExists){
                $scope.step = 3;
            }
            return null;
        }

    }

    $scope.goBackStep = function () {
        if ($scope.step == 3) {
            console.log($scope.step);
            if ($scope.achivementsWonExists) {
                console.log($scope.step);
                $scope.step = 2;
                console.log($scope.step);
            } else {
                console.log("in else");
                $scope.step = 1;
            }
            return null;
        }
        if ($scope.step == 2) {
            if ($scope.lvlsWonExists) {
                $scope.step = 1;
            }
            return null;
        }
    }

    $scope.close = function () {
        kmodel_UploadDogImage.resetImages();
        model_ResultUpload.clearFromResultUpload();
        $location.path('/main');
    }



    $scope.tricks = results.tricks;
    $scope.totalReps = 0;
    for (var i = 0; i < $scope.tricks.length; i++) {
        $scope.totalReps = $scope.totalReps+ parseInt($scope.tricks[i].total);
    }

    $scope.calculateTrickWidth = function (trick) {
        if(trick.total == 0){
            return {
                width: '0%'
            }
        }else{
            return {
                width: Math.round((trick.success / trick.total) *100) + '%'
            }
        }
    }

    $scope.calculateSuccessRate = function (trick) {
        return Math.round((trick.success / trick.total) * 100);
    }

    $scope.goToTrickStatistics = function (trick) {
        console.log(trick);
        model_ResultUpload.setStep(3);
        $location.path('/statistics/trick/'+trick.id);
    }

    console.log(results.achivmentsTotal);
    console.log(results);


});
