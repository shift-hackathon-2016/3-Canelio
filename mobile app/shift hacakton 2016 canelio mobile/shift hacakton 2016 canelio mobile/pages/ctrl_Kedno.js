App.controller("ctrl_Kendo", function ($scope) {

    //$scope.loading = true;

    $scope.$on('$viewContentLoaded', function () {
        console.log("firstview....");
        console.log(kConnector.getFirstView());
        var app = new kendo.mobile.Application($('#kendoApp'), {
            transition: "none",
            initial: kConnector.getFirstView(),
            browserHistory: false,
            hashBang :false,
            webAppCapable: true,
            init: function (e) {
                //$scope.$apply(function () {
                //    $scope.loading = false;
                //});
            },
            skin: "flat"
        });
        kConnector.setApp(app);
    })

});

