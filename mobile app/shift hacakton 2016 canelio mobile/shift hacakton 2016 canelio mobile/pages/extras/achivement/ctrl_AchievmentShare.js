App.controller("ctrl_AchievmentShare", function ($scope, $rootScope, $q, $routeParams,model_Share) {

    $scope.title = "Share";

    $scope.loading = true;
    var def = $q.defer();
    def.promise.then(function (data) {
        $scope.url = data.url;
        $scope.loading = false;
    });

    model_Share.shareAchivment(def, $routeParams.id);

    function successCallback(){
        $rootScope.goBack();
    }

    function failCallback() {
        $scope.loading = false;
        alertify.error("Failed to share achievement");
    }


    $scope.fbShare = function () {
        $scope.loading = true;
        window.plugins.socialsharing.shareViaFacebook('', null /* img */, $scope.url /* url */, successCallback, failCallback);
    }

    $scope.twtShare = function () {
        $scope.loading = true;
        window.plugins.socialsharing.shareViaTwitter('', null /* img */, $scope.url /* url */, successCallback, failCallback);
    };
    


    $scope.whatsappShare = function () {
        $scope.loading = true;
        window.plugins.socialsharing.shareViaWhatsApp('', null /* img */, $scope.url /* url */, successCallback, failCallback);
    }
    $scope.shareOther = function () {
        $scope.loading = true;
        window.plugins.socialsharing.share('We have learned a new trick', null, null /* img */, $scope.url /* url */, successCallback, failCallback);
    }
        //var list = document.getElementById('slipList');


    //list.addEventListener('slip:beforeswipe', function (e) {
    //    if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {
    //        e.preventDefault();
    //    }
    //}, false);


    //list.addEventListener('slip:afterswipe', function (e) {
    //    e.target.parentNode.appendChild(e.target);
    //}, false);




});
