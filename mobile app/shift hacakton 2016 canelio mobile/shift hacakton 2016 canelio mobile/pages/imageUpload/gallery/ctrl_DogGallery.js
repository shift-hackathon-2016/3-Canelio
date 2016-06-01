App.controller("ctrl_DogGallery", function ($scope, $q, $rootScope, model_Gallery, model_UploadDogImage) {
    
    $scope.title = "Gallery"

    var lineHeight = ($('body').width() / 3) + 10;
    var nmLines = ($('body').height() - $('#navBarSpaceFiller').height()) / lineHeight;
    nmLines = Math.ceil(nmLines);
   

    var def = $q.defer();
    $scope.datasourcePromise = def.promise;
    $scope.datasourcePromise.then(function (data) {
        console.log("total is,", data);
        console.log("pageSize is:", nmLines * 4);
        if (data == 0) {
            $scope.noImages = true;
        }
        $scope.createDatasource(data);
    }, function (error) {
    });
    model_Gallery.getSizeDogImages(def, null);

    $scope.loadImage = function (largeId) {
        model_UploadDogImage.setImageLargeId(largeId);
        $rootScope.goBack();
    }

    $scope.createDatasource = function (total) {
        $scope.source = new kendo.data.DataSource({
            serverPaging: true,
            pageSize: nmLines * 6,
            page:1,
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
                    model_Gallery.getDogImages(def, options.data);
                }
            },

        });
    };

    
    //$scope.createListView = function () {
    //    console.log("created");

    //}
        $scope.$on('$viewContentLoaded', function () {
            $scope.datasourcePromise.then(function (data) {
                var app = new kendo.mobile.Application($('#kapp'), {
                    transition: "none",
                    initial: "#gallery",
                    browserHistory: false,
                    webAppCapable: false,
                    init: function (e) {
                        console.log("1111111111111111111111111111");
                    },
                    skin: "ios-light"
                });
                //$('#scroller').kendoMobileScroller({
                //    useNative :true,
                //});
                //$('#scroller').kendoMobileScroller().reset();
                $scope.listView = $(".gallery").kendoMobileListView({
                    dataSource: $scope.source,
                    template: kendo.template($("#template").html()),
                    endlessScroll: true,
                    //loadMore: true,
                    itemChange: function (e) {
                        console.log(2222222222222);
                    },
                    dataBound: function (e) {
                        console.log(3333333333);
                    },
                    dataBinding: function (e) {
                        console.log(4444444444444);
                    },
                    click: function (e) {
                        if (typeof $(e.target[0]).attr('largeid') != "undefined") {
                            console.log("1223452");
                            console.log($(e.target[0]).attr('largeid'));
                            $scope.loadImage($(e.target[0]).attr('largeid'));
                        }
                        console.log(e);
                        
                        console.log(555555555555555555);
                    }
                });
            }, function (error) {
                console.log("error");
            });
            
        })
        
});
