App.factory("model_ResultUpload", function ($q, $http, requestHelper, model_Level,stringHelper) {

    var result = {
        fromResultUpload: true,
        step: 1,
        showSucessRates: true,
        titleWon: false,
        lvlsWon: 0,
        achivmentsTotal: 0,
        lvl: 65,
        title : 'authorty challanger',
        achivementsWon: [
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            },
            {
                img: 'res/logo062244White.png',
                trick: 'Sit'
            }
        ],
        tricks: [
            {
                trick: 'Sit',
                success: '256',
                total: '300'
            },
            {
                trick: 'Stay',
                success: '50',
                total: '300'
            },
            {
                trick: 'Lay',
                success: '200',
                total: '300'
            },
            {
                trick: 'Fetch',
                success: '90',
                total: '300'
            },
            {
                trick: 'Clicker training',
                success: '270',
                total: '300'
            },
        ]
    };

    function getResult() {
        return result;
    }

    function setResult(data) {
        result = {};
        result.showSucessRates = data.showSucessRates;
        result.achivementsWon = [];
        result.tricks = [];
        result.achivmentsTotal = 0;
        result.lvlsWon = 0;
        if (data.level.length > 0) {
            var prevLvlData = model_Level.getLevelPoints();
            console.log(data.level);
            model_Level.updateLevel(data.level[data.level.length -1]);
            var newLvlData = model_Level.getLevelPoints();
            result.lvlsWon = newLvlData.lvl - prevLvlData.lvl;
            result.title = newLvlData.title;
            result.lvl = newLvlData.lvl;
            if(prevLvlData.title != newLvlData.title){
                result.titleWon = true;
            }
        }
        if (data.tricks.length > 0) {
            var tricks = [];
            for (var i = 0; data.tricks.length > i; i++) {
                console.log("pushing tricks");
                tricks.push(data.tricks[i]);
                console.log(tricks);
                console.log(tricks[i]);
                tricks[i].trick = tricks[i].name;
                tricks[i].trick = stringHelper.formatWith3Dots(tricks[i].trick, 18, 320, 320);
                console.log(tricks[i].total);
                if (tricks[i].total == 0) {
                    console.log("here it is-.....");
                    tricks[i].noResults = true;

                    
                }
            }
            console.log("##################################");
            console.log(tricks);
            result.tricks = tricks;
        }
        console.log(data);
        if (data.achivments.length > 0) {
            result.achivmentsTotal = data.achivments.length;
            var achivmentsWon = [];
            for (var i = 0; i < data.achivments.length; i++) {
                var a = {
                    img: 'res/logo062244White.png',
                    trick: data.achivments[i].trickName,
                    achivmentId: data.achivments[i].achivmentId,
                    trickId: data.achivments[i].trickId
                };
                achivmentsWon.push(a);
            }
            result.achivementsWon = achivmentsWon;
        }
        result.fromResultUpload = true,
        result.step = 0;

        console.log(result);
        //var lvlData = model_Level.getLevelPoints();
        //$scope.pointsNeeded = lvlData.pointsNeeded;
        //$scope.levelText = lvlData.nextLvl;
        //$scope.maxLevelReached = lvlData.maxLevel;
        //$scope.pointsText = lvlData.pointsText;
        //level: ObjectlevelPoints: "420"
        //levelsWon: 26pointsNeeded: 134
        //title: "Dawg Recruit"
        //titleWon: 
            //Objectposition: "3"
            //title: "Dawg Recruit"__proto__: ObjectuserLevel: "32"userPoints: "286
    }

    function saveDogImage(small, config) {
        if (small != null) {
            for (var i = 0 ; result.achivementsWon.length > i; i++) {
                if (result.achivementsWon[i].trickId == config.trickId) {
                    result.achivementsWon[i].img = small;
                    result.achivementsWon[i].hasImg = true;
                }
            }
        }

    }

    function isFromResultUpload() {
        return result.fromResultUpload;
    }

    function clearFromResultUpload() {
        result.fromResultUpload = false;
        result.step = 1;
    }

    function setStep(step) {
        result.step = step;
    }



    return {
        getResult: getResult,
        setResult: setResult,
        saveDogImage: saveDogImage,
        isFromResultUpload: isFromResultUpload,
        clearFromResultUpload: clearFromResultUpload,
        setStep: setStep
    };
});