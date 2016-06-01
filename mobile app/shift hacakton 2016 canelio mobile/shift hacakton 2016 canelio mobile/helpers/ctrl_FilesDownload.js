App.controller("ctrl_FilesDownload", function ($q, $cordovaFile, $window) {
    console.log("in ctrl files download");
    var data = {
        id: "jedinica"
    };
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    console.log($window.cordova.file.dataDirectory);

    $cordovaFile.createDir('groups').then(function (sucess) {
        console.log("dir sucessfully created");
        console.log(sucess);
        $cordovaFile.writeFile('groups/2.json', blob, { 'append': false }).then(function (result) {
           console.log("writing sucess");
           $cordovaFile.readAsText('groups/2.json').then(function (sucess) {
               console.log("sucess reading file");
               console.log(JSON.parse(sucess).id);
           }, function (error) {
               console.log(error.code);
               if (error.code = 1) {
                   console.log("file doesnt exist");
               }
           });
        }, function (err) {
            console.log(err);
            console.log("writing error");
        });
    },function(error){
        console.log(error);
    });




    //window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
    //    console.log("should get directory");
    //    console.log(dir);
    //    //dir.getFile("log.txt", {create: true}, function (file) {
    //    //    var logOb = file;
    //    //    var log = data;
    //    //    logOb.createWriter(function (fileWriter) {

    //    //        var blob = new Blob([JSON.stringify(log)], {type: 'text/plain'});
    //    //        fileWriter.write(blob);
    //    //        console.log("file written");
    //    //        $location.path("/group/1");

    //    //    });
    //    //});
    //});


});