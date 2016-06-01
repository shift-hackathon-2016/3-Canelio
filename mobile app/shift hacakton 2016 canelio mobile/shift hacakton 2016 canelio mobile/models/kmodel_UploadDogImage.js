(function ($, console, win) {

    var $scope = {
        images: {},
        config: {},
        imageLargeId: null,
        getConfig: function () {
            return $scope.config;
        } ,
        setConfig: function (c) {
            $scope.config = c;
        },
        setImages:function(small, big) {
            $scope.images.small = small;
            $scope.images.big = big;
            if ($scope.config.type == "profile") {
                //spremi image offline
                var $body = angular.element(document.body);
                var $model_Dog = $body.injector().get('model_Dog');
                $model_Dog.saveDogImage(small);
            }
        },
        resetImages:function () {
            $scope.images = {};
        },
        getImages:function() {
            return $scope.images;
        },
        setConfig:function (c) {
            $scope.config = c;
        },
        getConfig:function () {
            return $scope.config;
        },
        setImageLargeId:function (id) {
            $scope.imageLargeId = id;
        },
        getImageLargeId:function () {
            var id = $scope.imageLargeId;
            $scope.imageLargeId = null;
            return id;
        },
        uploadImage:function (def, data) {
                if($scope.config.type == "achivement"){
                    var obj = {
                        "class": "trick",
                        "method": "uploadImage",
                        "data": data
                    }
                    kendo_RequestHelper.post(def, obj);
                } else if ($scope.config.type == "profile") {
                    var obj = {
                        "class": "dog",
                        "method": "uploadImage",
                        "data": data
                    }
                    kendo_RequestHelper.post(def, obj);
                }
        },
        cropImage: function (def, data) {
                if ($scope.config.type == "achivement") {
                    data.trickId = $scope.config.trickId;
                    var obj = {
                        "class": "trick",
                        "method": "cropImage",
                        "data": data
                    }
                    kendo_RequestHelper.post(def, obj);
                } else if ($scope.config.type == "profile") {
                    var obj = {
                        "class": "dog",
                        "method": "cropImage",
                        "data": data
                    }
                    kendo_RequestHelper.post(def, obj);
                }
        },
        checkForEdit: function (def) {
                if ($scope.config.type == "achivement") {
                    data = {
                        trickId:$scope.config.trickId
                    };
                    var obj = {
                        "class": "trick",
                        "method": "hasImage",
                        "data": data
                    }
                    kendo_RequestHelper.post(def, obj);
                } else if ($scope.config.type == "profile") {
                    var obj = {
                        "class": "dog",
                        "method": "hasImage",
                        "data": {
                            sample:true
                        }
                    }
                    kendo_RequestHelper.post(def, obj);
                }
        },
        duplicateImage:function (def, data) {
            var obj = {
                "class": "dog_images",
                "method": "createFromLarge",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        }

    };


    $.extend(window, {
        kmodel_UploadDogImage: $scope,
    });
})
(jQuery, console, window);