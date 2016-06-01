App.factory("model_DownloadFiles", function ($q, $http, requestHelper, $cordovaFile) {

    function getFullFilesList(def, data) {
        var obj = {
            "class": "files",
            "method": "getFullList",
            "data" : data
        }
        requestHelper.post(def, obj);
    }

    function createCanelioFolder(def) {
        $cordovaFile.checkDir(VAR_MOBILE_FOLDER_SINGLE).then(function (success) {
            def.resolve(true);
        }, function (fail) {
            $cordovaFile.createDir(VAR_MOBILE_FOLDER_SINGLE).then(function (sucess) {
                def.resolve(true);
            }, function (error) {
                def.reject(false);
            });
        });

    }


    function createFolder(def, name) {
        console.log("create folder", name);
        $cordovaFile.createDir(VAR_MOBILE_FOLDER + name).then(function (sucess) {
            def.resolve(true);
        }, function (error) {
            def.reject(false);
        });
    }

    function createImage(def, fileName, data) {
        var path = VAR_MOBILE_FOLDER  + fileName;
        var grantedBytes = 0;
        var text = data;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, grantedBytes,
                         function (fileSystem) {
                             _createFile(fileSystem, fileName, text, onSuccess, onError, path, def,false);
                         },
                         function (error) {
                             alertify.error("Failed creating file.");
                         });
    }


    function createFile(def, dir,fileName, data) {
        //path = 'groups/2.json'
        var path = VAR_MOBILE_FOLDER + dir + '/' + fileName + '.json';
        //if (IS_SIMULATOR) {
        //    $cordovaFile.writeFile(path, JSON.stringify(data), { 'append': false }).then(function (result) {
        //        console.log("file created !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //        def.resolve(true);
        //    }, function (err) {
        //        console.log(err);
        //        def.reject(false);
        //    });
        //} else {
        //    $cordovaFile.checkFile(path).then(function (result) {
        //        console.log("check sucseed");
        //    }, function (err) {
        //        console.log("error checking the file")
        //        console.log(JSON.stringify(err));
        //    });;
        //    $cordovaFile.createFile(path, data).then(function (result) {
        //        console.log("file created !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //        def.resolve(true);
        //    }, function (err) {
        //        console.log(JSON.stringify(err));
        //        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //        def.reject(false);
        //    });;
        //}
        var grantedBytes = 0;
        var text = JSON.stringify(data);
        console.log("local file system persistnent");
        console.log(LocalFileSystem.PERSISTENT);
        window.requestFileSystem(LocalFileSystem.PERSISTENT , grantedBytes,
                         function (fileSystem) {
                             console.log("file system result");
                             console.log(fileSystem);
                             _createFile(fileSystem, fileName, text, onSuccess, onError, path,def , true);
                         },
                         function (error) {
                             alertify.error("Failed creating file.");
                         });


    }
    function onSuccess() {
        alertify.success("resolved");
    }
    function onError() {
        alertify.error("error");
    }

    function _createFile(fileSystem, fileName, text, onSuccess, onError, path, def, addNewLine) {
        var options = {
            create: true,
            exclusive: false
        };

        fileSystem.root.getFile(path, options,
								function (fileEntry) {
								    console.log("file entry is");
								    console.log(fileEntry);
								    _createFileWriter(fileEntry, text, onSuccess, onError, def, addNewLine);
								},
								function (error) {
								    alertify.error("Failed creating file.");
								});
    };

    function _createFileWriter(fileEntry, text, onSuccess, onError ,def, addNewLine) {
        var that = this;
        fileEntry.createWriter(function(fileWriter) {
            var len = fileWriter.length;
            fileWriter.seek(0);
            if (addNewLine){
                fileWriter.write(text + '\n');
            } else {
                fileWriter.write(text);
            }
            var message = "Wrote: " + text;
            //alertify.success("sucess creating file writer");
            console.log("resolving true");
            def.resolve(true);
        },
        function(error) {
            alertify.error("Failed creating writer.");
        });
        
    };



    return {
        getFullFilesList: getFullFilesList,
        createFile: createFile,
        createFolder: createFolder,
        createCanelioFolder: createCanelioFolder,
        createImage: createImage
    };
});