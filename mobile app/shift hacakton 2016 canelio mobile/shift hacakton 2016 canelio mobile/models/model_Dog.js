App.factory("model_Dog", function ($q, $http, requestHelper, $cordovaFile, model_DownloadFiles) {

    var dogImagePromise = $q.defer().promise;
    var dogImageSaveInProgress = false;

    function getDogName() {
        return localStorage.getItem('dogName');
    }

    function deleteDogImage() {
        var previousPic = window.localStorage.getItem('dogImage');
        if (previousPic != null && previousPic != '') {
            var imageName = previousPic.substring(previousPic.lastIndexOf('/') + 1, previousPic.length);
            $cordovaFile.removeFile(VAR_MOBILE_FOLDER + imageName);
        }
        window.localStorage.removeItem('dogImage');
    }

    function saveDogImage(url) {
        dogImageSaveInProgress = true;
        var defer = $q.defer();
        dogImagePromise = defer.promise;

        if (IS_SIMULATOR) {
            defer.resolve(true);
            return null;
        }

        var assetURL = url;
        var imageName = url.substring(url.lastIndexOf('/')+1, url.length);
        var fileName = VAR_MOBILE_FOLDER + imageName;
        var fileTransfer = new FileTransfer();
        store = cordova.file.dataDirectory;

        console.log("saving image in url----------------");
        console.log(store + '/' + fileName);
        console.log(assetURL);
        console.log(fileTransfer);



        //android
        fileTransfer.download(assetURL, store +'/'+ fileName,
            function (entry) {
                console.log(entry);
                console.log("successs saved image");
                var previousPic = window.localStorage.getItem('dogImage');
                if(previousPic != null && previousPic != ''){
                    var imageNamePrev = previousPic.substring(previousPic.lastIndexOf('/') + 1, previousPic.length);
                    if (imageNamePrev != imageName) {

                        $cordovaFile.removeFile(VAR_MOBILE_FOLDER + imageName);
                    }
                }
                //android
                window.localStorage.setItem('dogImage', entry.nativeURL);

                //android
                defer.resolve(entry.nativeURL);
                kmodel_UploadDogImage.resetImages();
            },
            function (err) {
                console.log("failed saved");
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code " + error.code);
                defer.reject(false);
                dogImageSaveInProgress = false;
            });

        //console.log("saving.....");
        //console.log(cordova.file)
        //console.log(store);
        //console.log(assetURL);
        //console.log(store + imageName);
        ////iphone
        //fileTransfer.download(assetURL, store +'/'+ fileName,
        //    function (entry) {
        //        console.log(entry);
        //        console.log("successs saved image");
        //        var previousPic = window.localStorage.getItem('dogImage');
        //        if (previousPic != null && previousPic != '') {
        //            var imageNamePrev = previousPic.substring(previousPic.lastIndexOf('/') + 1, previousPic.length);
        //            if (imageNamePrev != imageName) {

        //                $cordovaFile.removeFile(VAR_MOBILE_FOLDER + imageName);
        //            }
        //        }
        //        //android
        //        //window.localStorage.setItem('dogImage', entry.nativeURL);
        //        //iphone
        //        var iphoneUrl = entry.toNativeURL();
        //        iphoneUrl = iphoneUrl.replace('file://', '');
        //        window.localStorage.setItem('dogImage', iphoneUrl);
        //        dogImageSaveInProgress = false;
        //        console.log(entry.toInternalURL());
        //        console.log(entry.toNativeURL());
        //        console.log(entry.toURI());
        //        console.log(entry.toURL());
        //        //android
        //        //defer.resolve(entry.nativeURL);
        //        //iphone
        //        defer.resolve(iphoneUrl);

        //        kmodel_UploadDogImage.resetImages();
        //    },
        //    function (err) {
        //        console.log("failed saved");
        //        console.log("download error source " + error.source);
        //        console.log("download error target " + error.target);
        //        console.log("upload error code " + error.code);
        //        defer.reject(false);
        //        dogImageSaveInProgress = false;
        //    });
    }


    function getDogImage() {
        if (dogImageSaveInProgress) {
            return dogImagePromise;
        } else {
            var defer = $q.defer();
            defer.resolve(window.localStorage.getItem('dogImage'));
            return defer.promise;
        }
    }


    function saveTrainingOffline() {

    }



    return {
        getDogName: getDogName,
        saveDogImage: saveDogImage,
        getDogImage: getDogImage,
        deleteDogImage: deleteDogImage
    };
});