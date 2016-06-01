(function ($, console, win) {

    var $scope = {

        achivmentLevel: function (def,data) {
            var obj = {
                "class": "achievment",
                "method": "achivmentLevel",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },

        achivementsNumber: function(def, data) {
            var obj = {
                "class": "achievment",
                "method": "numberOfAchivements",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },

        getAchivements: function(def, data) {
            var obj = {
                "class": "achievment",
                "method": "getAchivements",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },

        getAchivementForTrick: function(def,data){
            var obj = {
                "class": "achievment",
                "method": "getAchivementForTrick",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        },

        getTitleForLevel: function (lvl, trickName) {
            //25 max znakova za 320
            if (lvl == 0) {
                return 'Beginner of ' + trickName;
            } else if (lvl == 1) {
                return 'Sargent of ' + trickName;
            } else if (lvl == 2) {
                return 'Defender of ' + trickName;
            } else if (lvl == 3) {
                return 'Master of ' + trickName;
            } else if (lvl == 4) {
                return 'Jedi of ' + trickName;
            }
        },

        getAchivmentId: function (def, data) {
            var obj = {
                "class": "achievment",
                "method": "getAchivmentId",
                "data": data
            }
            kendo_RequestHelper.post(def, obj);
        }

    };


    $.extend(window, {
        kmodel_Achivement: $scope,
    });
})
(jQuery, console, window);