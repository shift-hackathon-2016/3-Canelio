App.controller("ctrl_Main", function ($scope, $q, $location) {
    

    $scope.goToTrainMenu = function () {
        $location.path('/trainMenu');
    }

    $scope.goToSettings = function () {
        $location.path('/settings');
    }
    
    var wrapper = $('#wrapper')[0];
    myScroll = new IScroll(wrapper, { useTransition: true, scrollX: true, scrollY: false , snap:true, snapThreshold:0.8,tap:true});

    $('#wrapper').on('tap', function (e) {
        console.log(e);
    });

    var bodyWidth = $('body').width();
    var maxScroll = $('body').width() * 3;

    function updatePositionScrollEnd() {
        console.log("update");
        var currentX = Math.abs(this.x);
        console.log(currentX);
        var xMin = currentX - bodyWidth;
        
        if (xMin < 0) {
            xMin = 0;
        }
        console.log("xMin", xMin);
        var xMax = currentX + 2*bodyWidth;
        
        if (xMax > maxScroll) {
            console.log("true");
            xMax = maxScroll;
        }
        console.log("xMax", xMax);
        myScroll.refresh(0, 0, xMax,-1* xMin);
    }


    myScroll.refresh(0, 0, bodyWidth * 2, 0);
    myScroll.on('scrollEnd', updatePositionScrollEnd);
    $scope.getLiWidth = function () {
        return {
            width: $('body').width() + 'px'
        }
    }
});
