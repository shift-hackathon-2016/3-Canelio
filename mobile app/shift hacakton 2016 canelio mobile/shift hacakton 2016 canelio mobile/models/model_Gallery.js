App.factory("model_Gallery", function ($q, requestHelper) {

    function getDogImages(def,data) {
        var obj = {
            "class": "dog_images",
            "method": "getImages",
            "data": data
        }
        requestHelper.post(def, obj);
    }

    function getSizeDogImages(def, data) {
        var obj = {
            "class": "dog_images",
            "method": "numberOfImages",
            "data": data
        }
        requestHelper.post(def, obj);
    }

    return {
        getDogImages: getDogImages,
        getSizeDogImages: getSizeDogImages
    };
});