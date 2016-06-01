App.controller("ctrl_myTricks", function ($scope, svc_File, $q, svc_FileChecker, $location) {
    $scope.title = "My tricks"
    //check file version
    $scope.createTrick = function () {
        $location.path("/createTrick");
    }

    $scope.mainNav_delete_click = function () {
        $scope.deleteMode = !$scope.deleteMode
    }

    var def = $q.defer();
    $scope.datasourcePromise = def.promise;
    $scope.datasourcePromise.then(function (data) {
        if (data == 0) {
            $scope.noTricks = true;
        }
        $scope.createDatasource(data);
    }, function (error) {
    });
    kmodel_MyTricks.nmTricks(def, null);

    var nmLines = Math.ceil(($('body').height() - 50 - 60 )/ 50);

    $scope.createDatasource = function (total) {
        $scope.source = new kendo.data.DataSource({
            serverPaging: true,
            pageSize: nmLines * 6,
            page: 1,
            schema: {
                total: function (abc) {
                    return total;
                },
            },
            transport: {
                read: function (options) {
                    console.log("-------------");
                    console.log(options);
                    var def = $q.defer();
                    def.promise.then(function (data) {
                        console.log("!!!!!!!!!!!!!!! resolving success");
                        console.log(data);
                        options.success(data);
                    }, function (error) {
                        console.log("erorr");
                        options.error(error);
                    });
                    kmodel_MyTricks.getTricks(def, options.data);
                }
            },

        });
    };

    $scope.deleteConfirm = function () {
        if ($scope.block) {
            return null;
        }
        $scope.deleteModalLoading = true;
        var data = {
            id: $scope.trickId
        };
        var dataItem = $scope.dataItem;
        var def = $.Deferred()
        var promise = def.promise();
        promise.then(function (data) {
            $scope.deleteModalLoading = false;
            var listview = $("#myTricks #trickList").data("kendoMobileListView");
            $scope.source.remove(dataItem);
            listview.remove([dataItem]);
            listview.refresh();
            $('#myTricksDeleteModal').data('kendoMobileModalView').close();
        }, function (error) {
            $scope.deleteModalLoading = false;
        });
        kmodel_MyTricks.deleteTrick(def, data);
        $('#myTricksDeleteModal').data('kendoMobileModalView').close();
    }

    $scope.deleteCancel = function () {
        if ($scope.block) {
            return null;
        }
        $('#myTricksDeleteModal').data('kendoMobileModalView').close();
    }

    $scope.$on('$viewContentLoaded', function () {
        console.log(1);
        var app = new kendo.mobile.Application($('#kapp'), {
            transition: "slide",
            initial: "#myTricks",
            browserHistory: false,
            webAppCapable: false,
            init: function (e) {
                console.log("1111111111111111111111111111");
            },
            skin: "flat"
        });
        $scope.datasourcePromise.then(function (data) {

            console.log(2);

            //$('#scroller').kendoMobileScroller({
            //    useNative :true,
            //});
            //$('#scroller').kendoMobileScroller().reset();
            $scope.listView = $("#trickList").kendoMobileListView({
                dataSource: $scope.source,
                template: kendo.template($("#trickTemplate").html()),
                endlessScroll: true,

                click: function (e) {
                    console.log(e.dataItem);
                    if ($scope.deleteMode) {
                        console.log("--------------");
                        console.log(e.dataItem.name);
                        $scope.$apply(function () {
                            $scope.deleteModalLoading = false;
                            $scope.trickName = e.dataItem.name;
                            $scope.trickId = e.dataItem.id;
                            $scope.dataItem = e.dataItem;
                        });
                        $scope.block = true;
                        setTimeout(function () {
                            $scope.block = false;
                        }, 300)
                        console.log($scope.trickName);
                        $('#myTricksDeleteModal').data('kendoMobileModalView').open();
                    } else {
                        $scope.$apply(function () {
                            var id = e.dataItem.id;
                            $location.path("/train/1/"+id);
                        });
                    }
                }
            });
        }, function (error) {
            console.log("error");
        });

    })

});
