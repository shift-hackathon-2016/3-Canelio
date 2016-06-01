App.controller("ctrl_TrainMenuSimple", function ($scope, $q, $location, model_Tricks, model_Clicker) {

    $scope.title = "behaviours";

    $scope.reorderingNotAllowed = model_Clicker.getSyncRequired();

    if (!window.localStorage.getItem('tutorialTricks')) {
        $scope.tricksTutorialShow = true;
    }
    $scope.closeTutorial = function () {
        $scope.tricksTutorialShow = false;
        if ($scope.tricksTutorial) {
            window.localStorage.setItem('tutorialTricks', 'true');
        }
    }

    $scope.clickedLabel = function () {
        $scope.tricksTutorial = !$scope.tricksTutorial;
    };

    //var def2 = $.Deferred()
    //var promise = def2.promise();
    //promise.then(function (data) {
    //    $scope.tricks = data;
    //    initScrollView();
    //}, function (error) {
    //});
    
    //$scope.tricks = model_SimpleTrainMenu.getTricks();
    $scope.$on('$viewContentLoaded', function () {
        var def = $q.defer();
        def.promise.then(function (data) {
            $scope.tricks = data;

            initScrollView();
        });
        model_Tricks.getTricks(def, {});
    });

    $scope.checkIfReoderingAllowed = function (type, dontAlert) {
        if ($scope.reorderingNotAllowed) {
            if(!dontAlert){
                alertify.error("Go to phone settings and Sync Clicker before " + type + " tricks");
            }
            return false;
        } else {
            return true;
        }
    }
    

    $scope.goToachievments = function () {
        if (navigator.connection.type == Connection.NONE) {
            alertify.error("Please connect to internet");
        } else {
            kConnector.setFirstView("pages/extras/achivement/achievmentsListView.html");
            $location.path("/kendo");
        }

    }

    $scope.createTrick = function () {
        if (navigator.connection.type == Connection.NONE) {
            alertify.error("Please connect to internet");
        } else {
            $location.path('/createTrick')
        }
        
    }

    function addLedContainers() {
        $('#mainMenuList #slipList li').each(function (index, li) {
            if (index < 5) {
                var num = index + 1;
                var ledice = '<div class="ledContainer ' + 'led' + num + '"></led>';
                $(li).append(ledice);
            }
        });
    }

    function pushReoder() {
        var trickOrder = [];
        $('#mainMenuList #slipList li').each(function (index, li) {
            var trick = {
                'id': $(li).attr('trickid'),
                'trick_id': $(li).attr('trickid'),
                'ordinal': index + 1,
                'name': $(li).attr('trickName')
            }
            trickOrder.push(trick);
        });
        model_Tricks.pushReorder(trickOrder);
    }

    function initScrollView(){



        $($scope.tricks).each(function (index , el) {
            var text = '<li class="menuLink" trickid="' + el.id + '" trickName="'+el.name+'">' + el.name + '</li>';
            $('#mainMenuList #slipList').append(text);
        });
        addLedContainers();

        var listHeight = $('body').height() - 96;
    

        var config = {
            itemHeight: 60,
            numItems: $scope.tricks.length,
            container: '#mainMenuList ',
            containerHeight: listHeight,
            IscrollFixAddHeight: 0,
        }

        $('#mainMenuList').css('height', listHeight + 'px');

    
        var scrollProgress = false;
        $('#mainMenuList li').on('click', function (e) {
            if(!scrollProgress){
                var id = $(this).attr('trickid');
                var name = $(this).attr('trickName');
                var route = '/trick/' + id+ '/'+name;
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
        $('#mainMenuList #slipList')[0].addEventListener('slip:swipe', function (e) {
            if (!$scope.checkIfReoderingAllowed('deleting')) {
                return null;
            }
            var target = e.target;
            var id = $(target).attr('trickid');
            var name = $(target).attr('trickName');
            $scope.$apply(function () {
                $location.path('/deleteTrick/' + id + '/' + name);
            });;
        }, false);
        $('#mainMenuList #slipList')[0].addEventListener('slip:beforereorder', function (e) {
            if (!$scope.checkIfReoderingAllowed('reordering')) {
                e.preventDefault();
                return null;
            }
            $('#mainMenuList').addClass('mainMenuListSorting');
            $('#mainMenuList #slipList li .ledContainer').remove();
        }, false);
        $('#mainMenuList #slipList')[0].addEventListener('slip:reorder', function (e) {
            console.log("reoder called");
            $('#mainMenuList').removeClass('mainMenuListSorting');
            addLedContainers();
            pushReoder();
        }, false);
        $('#mainMenuList #slipList')[0].addEventListener('slip:cancelreorder', function (e) {
            $('#mainMenuList').removeClass('mainMenuListSorting');
            addLedContainers();
        }, false);
        //check file version
    }
 

});
