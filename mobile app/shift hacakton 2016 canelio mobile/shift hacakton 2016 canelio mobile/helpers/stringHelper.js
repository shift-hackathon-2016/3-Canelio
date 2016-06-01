App.factory("stringHelper", function () {

    function formatWith3Dots(string,nmChars,widthForChars,realWidth) {
        var maxNmChars = Math.round(realWidth * (nmChars / widthForChars));
        var returned = string.length > maxNmChars ? string.substring(0, maxNmChars - 3) + '...' : string;
        return returned;
    }
    
    function replaceSpaces(string) {
        return string.replace(new RegExp('%20', 'g'), ' ');
    }

    return {
        formatWith3Dots: formatWith3Dots,
        replaceSpaces: replaceSpaces
    };
});