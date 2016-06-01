App.controller("ctrl_ImageUpload", function ($scope, $q, model_UploadDogImage, $cordovaFile , $rootScope, $location) {

    $scope.title = 'Upload picture';

    $scope.imageUploadConfig = kmodel_UploadDogImage.getConfig().type;

    $scope.navigateBack = function () {
        if ($scope.imageUploadConfig != 'achivement') {
            model_UploadDogImage.resetImages();
        }
       
        $rootScope.goBack();
    }

    //check if edit button is needed
    var def = $q.defer();
    def.promise.then(function (data) {
        console.log("resolved true");
        $scope.edit = data.exists;
        $scope.editLargeId = data.largeId;
    }, function (error) {
        console.log("resolved false");
        $scope.edit = false;
    });
    model_UploadDogImage.checkForEdit(def);



    $scope.editClick = function () {
        $scope.duplicateImage($scope.editLargeId);
    }

    //check file version
    $scope.cropCancel = function () {
        $rootScope.goBack();
    }

    //initate duplicate image
    $scope.duplicateImage = function (largeId) {
        $scope.loadingMessage = "Getting photo...";
        $scope.loading = true;
        var def = $q.defer();
        def.promise.then(function (data) {
            $scope.src = data.src;
            $scope.uid = data.uid;
            $scope.imageDogId = data.imageDogId;
            $scope.initateCropper();
        }, function (error) {
            $scope.loading = false;
        });
        var data = {
            largeId: largeId
        };
        model_UploadDogImage.duplicateImage(def, data);
    }

    $scope.navigateGallery= function(){
        //$rootScope.navigateNoTransition('/dogGallery');
        $location.path('/dogGallery')
    };

    $scope.cropSave = function () {
        console.log($scope.coords);
        $scope.loadingMessage = "Cropping photo...";
        var data = {
            x: $scope.coords.x,
            y: $scope.coords.y,
            width: $scope.coords.width,
            height: $scope.coords.height,
            uid: $scope.uid,
            imageDogId: $scope.imageDogId,
        };
        console.log(data);
        var def = $q.defer();
        def.promise.then(function (data) {
            console.log("success");
            //var img = document.getElementById('cropped');
            //img.src = data.src;
            $scope.loading = false;
            $scope.cropping = false;
            model_UploadDogImage.setImages(data.src, $scope.src);
            $rootScope.goBack();
        }, function (error) {
            console.log("fail");
            $scope.loading = false;
        });
        model_UploadDogImage.cropImage(def, data);
    }

    $scope.croppingModal = function () {
        if ($scope.cropping) {
            return {
                opacity: 1
            }
        }
        return {
            opacity:0
        }
    }

    $scope.croppingArea = function () {
        return {
            width: '100%',
            height: $('body').height() - 73 + 'px'
        }
    }

    $scope.initateCropper = function () {
        $('#croppingContainer div').remove();
        $('#croppingContainer').append('<div><img id="naturalImage" /></div>');
        var img = document.getElementById('naturalImage');
        img.src = $scope.src;
        $("#naturalImage").one('load', function () {
            console.log("width is----------");
            console.log(img);
            console.log($("#naturalImage").width());
            console.log(img.naturalWidth);
            $("#naturalImage").cropper({
                done: function (data) {
                    $scope.coords = data;
                },
                aspectRatio: 1,
            minWidth: 115,
            minHeight: 115,
                //data:{
                //    width: img.naturalWidth,
                //    height: img.naturalWidth,
                //},
                zoomable: false,
                resizable: true,
                resize: true,
            }).one("built" + ".cropper", function () {
                console.log("built");
                $scope.$apply(function () {
                    $scope.cropping = true;
                    $scope.loading = false;
                })
            })
        })

    }


    $scope.uploadPhoto = function (imageData) {
        console.log("upload photo in progress...");

        $scope.loading = true;
        $scope.loadingMessage = "Uploading photo...";


        var footerHeight = 73;
        var avaliableHeight = $('body').height() - footerHeight;
        var avaliableWidth = $('body').width();
        var img = document.getElementById('naturalImage');
        //imageData = "data:image/jpeg;base64," + imageData;
        //$cordovaFile.writeFile('image.jpg', imageData, { 'append': false }).then(function (result) {
        //    console.log("written")
        //}, function (err) {
        //    console.log(err);
        //    def.reject(false);
        //});
        var imgHeight = img.naturalHeight;
        var imgWidth = img.naturalWidth;
        var def = $q.defer();
        def.promise.then(function (data) {
            console.log("success");
            console.log(data);
            $scope.src = data.src;
            $scope.uid = data.uid;
            $scope.imageDogId = data.imageDogId;
            $scope.initateCropper();
        }, function (error) {
            $scope.loading = false;
        });
        var data = {
            img: imageData,
            targetWidth: $('body').width(),
            targetHeight: $('body').height() - 73,
        };
        model_UploadDogImage.uploadImage(def, data);
    }



    $scope.takeUserPhotoFailed = function () {
        alertify.error("Oops, something went wrong please try again");
    }

    $scope.uploadFailed = function () {
        console.log("uploadFailedCalled")
        
        $scope.$apply(function () {
            // some code...
            $scope.loading = false;
            $scope.cropping = false;
            console.log($scope.loading);
            console.log($scope.cropping);
            console.log("inside");
        });
    }

    $scope.takeUserPhoto = function (t) {
        var type;
        var edit;
        $scope.loading = true;
        $scope.loadingMessage = "Loading...";
        if (t == "gallery") {
            type = Camera.PictureSourceType.PHOTOLIBRARY;
            edit = true;
        } else {
            type = Camera.PictureSourceType.CAMERA;
            edit = false;
        }
        navigator.camera.getPicture($scope.uploadPhoto, $scope.uploadFailed, {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: type,
            allowEdit: edit,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true,

            targetWidth: $('body').width()*2,
            targetHeight: ($('body').height() -73)*2,
            //saveToPhotoAlbum: true
        });
    }



    //check if image from gallery is selected
    var largeId = model_UploadDogImage.getImageLargeId();
    if (largeId) {
        $scope.duplicateImage(largeId);
    }
});
