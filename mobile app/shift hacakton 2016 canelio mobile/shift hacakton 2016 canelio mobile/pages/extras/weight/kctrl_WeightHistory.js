(function ($, console, win) {

    var $scope = kendo.observable({
        achivementID: 0,
        title: "Weight History",
        loading: true,
        createDataSource: function (total) {
            var navHeight = $('#navBarSpaceFiller').height();
            var bodyHeight = $('body').height();
            var lineHeight = 80;
            var tapToDeleteHeight = 32;
            var nmLines = Math.ceil((bodyHeight - navHeight -tapToDeleteHeight) / lineHeight);
            console.log("nm lines is:", nmLines);
            $scope.source = new kendo.data.DataSource({
                serverPaging: true,
                pageSize: nmLines * 7,
                page: 1,
                schema: {
                    total: function (abc) {
                        return total;
                    },
                },
                transport: {
                    read: function (options) {
                        var def = $.Deferred()
                        def.promise().then(function (data) {
                            data.forEach(function (d) {
                                d.weight = Math.abs(parseFloat(d.weight).toFixed(5));
                            });
                            console.log(data);
                            options.success(data);
                        }, function (error) {
                            console.log("erorr");
                            options.error(error);
                        });
                        console.log("-------------");
                        console.log(options.data);
                        kmodel_Weight.getWeighPaged(def, options.data);
                    }
                },
            });
            $scope.createListView();
        },
        createListView: function () {
            console.log("creating listview");
             $("#weightHistory .historyList").kendoMobileListView({
                template: kendo.template($("#weightHistoryTemplate").html()),
                endlessScroll: true,
                dataSource: $scope.source,
                click: function (e) {
                    e.preventDefault();
                    $('#weightHistoryModal').data('kendoMobileModalView').open();
                    $scope.set("date", e.dataItem.date);
                    $scope.set("weight", e.dataItem.weight);
                    $scope.set("itemForDelete", e.dataItem);

                },
            });
            console.log("creating listview");
        },
        modalLoading:false,
        closeModalView: function () {
            $('#weightHistoryModal').data('kendoMobileModalView').close();
        },
        deleteEntry: function () {
            $scope.set("modalLoading", true);
            var dataItem = $scope.get("itemForDelete");
            var data = {
                id: dataItem.id
            };
            var def = $.Deferred()
            var promise = def.promise();
            promise.then(function (data) {
                $scope.set("modalLoading", false);
                var listview = $("#weightHistory .historyList").data("kendoMobileListView");
                $scope.source.remove(dataItem);
                listview.remove([dataItem]);
                listview.refresh();
                $('#weightHistoryModal').data('kendoMobileModalView').close();
            }, function (error) {
                $scope.set("modalLoading", false);
            });
            kmodel_Weight.deleteWeight(def, data);
            $('#weightHistoryModal').data('kendoMobileModalView').close();
        },
        navigateBack: function () {
            //window.history.back();
            kConnector.navigateBack();
        },
        beforeShow: function(e){
            $scope.set("loading", true);
        },
        show: function (e) {

        },
        init: function (e) {
            $scope.set("loading", true);
            var def = $.Deferred()
            var datasourcePromise = def.promise();
            datasourcePromise.then(function (data) {
                if (data == 0) {
                    $scope.set("noAchivements", true);
                }
                $scope.set("loading", false);
                $scope.createDataSource(data);
            }, function (error) {
            });
            kmodel_Weight.getWeighCount(def, null);
        }
    });


    $.extend(window, {
        kctrl_WeightHistory: $scope,
    });
})
(jQuery, console, window);
