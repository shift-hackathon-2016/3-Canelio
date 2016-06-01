App.factory("model_UploadDogImage", function ($q, $http, requestHelper) {
    
    var images = {};
    var config = {};
    var imageLargeId = null;

    function setImages(small, big) {
        kmodel_UploadDogImage.setImages(small, big);
    }

    function resetImages() {
        kmodel_UploadDogImage.resetImages();
    }

    function getImages() {
        return kmodel_UploadDogImage.getImages();
    }

    function setConfig(c) {
        kmodel_UploadDogImage.setConfig(c);
    }

    function getConfig() {
        return kmodel_UploadDogImage.getConfig();
    }

    function setImageLargeId(id) {
        kmodel_UploadDogImage.setImageLargeId(id);
    }

    function getImageLargeId() {
        return kmodel_UploadDogImage.getImageLargeId();
    }

    function uploadImage(def, data) {
        kmodel_UploadDogImage.uploadImage(def, data);
    }

    function cropImage(def, data) {
        kmodel_UploadDogImage.cropImage(def, data);
    }

    function checkForEdit(def) {
        kmodel_UploadDogImage.checkForEdit(def);
    }

    function duplicateImage(def, data) {
        kmodel_UploadDogImage.duplicateImage(def, data);
    }





    return {
        uploadImage: uploadImage,
        cropImage: cropImage,
        duplicateImage: duplicateImage,
        checkForEdit:checkForEdit,
        setImages: setImages,
        resetImages: resetImages,
        getImages: getImages,
        getConfig:getConfig,
        setConfig: setConfig,
        setImageLargeId: setImageLargeId,
        getImageLargeId: getImageLargeId
    };
});