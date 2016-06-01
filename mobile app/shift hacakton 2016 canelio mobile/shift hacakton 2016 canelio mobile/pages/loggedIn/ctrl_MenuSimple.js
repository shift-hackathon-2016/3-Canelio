App.controller("ctrl_TrainMenuSimple", function ($scope, $q, $location, model_SimpleMenu) {

    $scope.title = "Train";

    var def2 = $.Deferred()
    var promise = def2.promise();
    promise.then(function (data) {
        $scope.tricks = data;
        initScrollView();
    }, function (error) {
    });
    
    model_SimpleMenu.getTricks(def2);


    $scope.goToachievments = function () {
        kConnector.setFirstView("pages/extras/achivement/achievmentsListView.html");
        $location.path("/kendo");
    }


    function initScrollView(){



        $($scope.tricks).each(function (index , el) {
            var text = '<li class="menuLink" trickid="' + el.id + '">' + el.name + '</li>';
            $('#mainMenuList #slipList').append(text);
        });

        var listHeight = $('body').height() - 108;
        console.log("$('body').height()", $('body').height());
    

        var config = {
            itemHeight: 60,
            numItems: $scope.tricks.length,
            container: '.scrollableList',
            containerHeight: listHeight,
            IscrollFixAddHeight: 0,
        }

        $('#mainMenuList').css('height', listHeight + 'px');

    
        var scrollProgress = false;
        $('#mainMenuList li').on('click', function (e) {
            if(!scrollProgress){
                var id = $(this).attr('trickid');
                var route = '/statistics/trick/' + id;
                $scope.$apply(function () {
                    $location.path(route);
                });;
            }
        });

        var sortableList = new SortableList(config);
        var iscroll = sortableList.getComponents().iscroll;
        iscroll.on('scrollStart', function () {
            scrollProgress = true;
        })
        iscroll.on('scrollEnd', function () {
            scrollProgress = false;
        })
        $('#mainMenuList #slipList')[0].addEventListener('slip:beforereorder', function (e) {
            console.log("dsakklsdaklsad");
            $('#mainMenuList').addClass('mainMenuListSorting');
        }, false);
        $('#mainMenuList #slipList')[0].addEventListener('slip:reorder', function (e) {
            $('#mainMenuList').removeClass('mainMenuListSorting');
        }, false);
        //check file version
        $scope.createTrick = function () {
            $location.path('/createTrick')
        }
    }
 

});
