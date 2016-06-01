(function ($, console, win) {

    var $scope = kendo.observable({
        title: "Achievement list",
        loading: true,
        noAchivements: false,
        source: null,
        navigateBack: function () {
            kConnector.navigateBack();
        },
        createDataSource: function (total) {
            var navHeight = $('#navBarSpaceFiller').height();
            var bodyHeight = $('body').height();
            var lineHeight = 150;
            var nmLines = Math.ceil((bodyHeight - navHeight) / lineHeight);
            console.log("nm lines is:", nmLines);
            $scope.source = new kendo.data.DataSource({
                serverPaging: true,
                pageSize: nmLines*7,
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
                            console.log(data);
                            var $body = angular.element(document.body);
                            var $string_helper = $body.injector().get('stringHelper');
                            for (var i = 0; i < data.length ; i++) {
                                data[i].trickName = $string_helper.formatWith3Dots(data[i].trickName,18,320,320);
                            }
                            

                            options.success(data);
                        }, function (error) {
                            console.log("erorr");
                            options.error(error);
                        });
                        console.log("-------------");
                        console.log(options.data);
                        kmodel_Achivement.getAchivements(def, options.data);
                    }
                },
            });
            $scope.createListView();
        },
        createListView: function () {
            $("#achivementListView .achivmentList").kendoMobileListView({
                template: kendo.template($("#achivementListTemplate").html()),
                endlessScroll: true,
                dataSource: $scope.source,
                virtualViewSize: 20,
                click: function (e) {
                    console.log((e));
                    kConnector.navigate("pages/extras/achivement/singleAchivement.html", {
                        id: e.dataItem.id,
                        trickId : e.dataItem.trickId
                    }, "slide:left");
                },
            });
        },
        loaderPadding : function(e){
            var height = $('#achivementListView .loadingContainer').outerHeight();
            return (($('body').height()-height) /2) +'px';
        },
        noAchivmentMessagePadding: function(e){
            var height = $('#achivementListView .noAchivemntsMessage').outerHeight();
            return (($('body').height() - height) / 2) + 'px';
        },
        beforeShow: function (){
            
        },
        show: function (e) {
            $scope.set("loading", true);
            var def = $.Deferred()
            var datasourcePromise = def.promise();
            datasourcePromise.then(function (data) {
                console.log("Dataa is---------------");
                console.log(data);
                if (data == 0) {
                    $scope.set("noAchivements", true);
                }
                $scope.set("loading", false);
                $scope.createDataSource(data);
            }, function (error) {
            });
            kmodel_Achivement.achivementsNumber(def, null);
        },
        init: function (e) {
            //$scope.set("noAchivements", false);
            //$scope.set("loading", true);
       
            

        }
    });


    $.extend(window, {
        kctrl_achivementList: $scope,
    });
})
(jQuery, console, window);