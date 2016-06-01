


//#### Begin Individual Plugin Code ####

// install   :     cordova plugin add org.apache.cordova.file
// link      :     https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

// TODO: add functionality to define storage size in the getFilesystem() -> requestFileSystem() method
// TODO: add documentation for FileError types
// TODO: add abort() option to downloadFile and uploadFile methods.
// TODO: add support for downloadFile and uploadFile options. (or detailed documentation) -> for fileKey, fileName, mimeType, headers
// TODO: add support for onprogress property

App

//Filesystem (checkDir, createDir, checkFile, creatFile, removeFile, writeFile, readFile)
  .factory('$cordovaFile', ['$q', '$window', '$log', '$timeout', function ($q, $window, $log, $timeout) {

    return {
      checkDir: function (dir) {
        return getDirectory(dir, {create: false});
      },

      createDir: function (dir, replaceBOOL) {
        return getDirectory(dir, {create: true, exclusive: replaceBOOL});
      },

      listDir: function (filePath) {
        var q = $q.defer();

        getDirectory(filePath, {create: false}).then(function (parent) {
          var reader = parent.createReader();
          reader.readEntries(
            function (entries) {
              q.resolve(entries);
            },
            function () {
              q.reject('DIR_READ_ERROR : ' + filePath);
            });
        }, function () {
          q.reject('DIR_NOT_FOUND : ' + filePath);
        });

        return q.promise;
      },

      checkFile: function (filePath) {
        // Backward compatibility for previous function checkFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        return getFileEntry(filePath, {create: false});
      },

      createFile: function (filePath, replaceBOOL) {
        // Backward compatibility for previous function createFile(filepath replaceBOOL)
        if (arguments.length == 3) {
          filePath = '/' + filePath + '/' + arguments[1];
          replaceBOOL = arguments[2];
        }

        return getFileEntry(filePath, {create: true, exclusive: replaceBOOL});
      },

      removeFile: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function removeFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFileEntry(filePath, {create: false}).then(function (fileEntry) {
          fileEntry.remove(q.resolve, q.reject);
        }, q.reject);

        return q.promise;
      },

      // options is a dict with possible keys :
      // - append : true/false (if true, append data on EOF)
      writeFile: function (filePath, data, options) {
        var q = $q.defer();

        getFileWriter(filePath, {create: true}).then(function (fileWriter) {
          if (options && options['append'] === true) {
            // Start write position at EOF.
            fileWriter.seek(fileWriter.length);
          }
          fileWriter.onwriteend = function (evt) {
            if (this.error)
              q.reject(this.error);
            else
              q.resolve(evt);
          };
          fileWriter.write(data);
        }, q.reject);

        return q.promise;
      },

      readFile: function (filePath) {  /// now deprecated in new ng-cordova version
        $log.log('readFile is now deprecated as of v0.1.4-alpha, use readAsText instead');
        return this.readAsText(filePath);
      },

      readAsText: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFile(filePath, {create: false}).then(function (file) {
          getPromisedFileReader(q).readAsText(file);
        }, q.reject);

        return q.promise;
      },


      readAsDataURL: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFile(filePath, {create: false}).then(function (file) {
          getPromisedFileReader(q).readAsDataURL(file);
        }, q.reject);

        return q.promise;
      },

      readAsBinaryString: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFile(filePath, {create: false}).then(function (file) {
          getPromisedFileReader(q).readAsBinaryString(file);
        }, q.reject);

        return q.promise;
      },

      readAsArrayBuffer: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFile(filePath, {create: false}).then(function (file) {
          getPromisedFileReader(q).readAsArrayBuffer(file);
        }, q.reject);

        return q.promise;
      },

      readFileMetadata: function (filePath) {
        return getFile(filePath, {create: false});
      },

      readFileAbsolute: function (filePath) {
        var q = $q.defer();
        getAbsoluteFile(filePath).then(function (file) {
          getPromisedFileReader(q).readAsText(file);
        }, q.reject);
        return q.promise;
      },

      readFileMetadataAbsolute: function (filePath) {
        return getAbsoluteFile(filePath);
      },

      downloadFile: function (source, filePath, trustAllHosts, options) {
        var q = $q.defer();
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(source);

        fileTransfer.onprogress = q.notify;
        fileTransfer.download(uri, filePath, q.resolve, q.reject, trustAllHosts, options);
        return q.promise;
      },

      uploadFile: function (server, filePath, options) {
        var q = $q.defer();
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(server);

        if (options.timeout !== undefined && options.timeout !== null) {
          $timeout(function () {
            fileTransfer.abort();
          }, options.timeout);
          options.timeout = null;
        }

        fileTransfer.onprogress = q.notify;
        fileTransfer.upload(filePath, uri, q.resolve, q.reject, options);
        return q.promise;
      }

    };

    /*
     * Returns a new FileReader that will resolve the provided Deferred with
     * the result of the next method called on the FileReader, or reject it
     * if an error occurs while attempting to complete that operation.
     */
    function getPromisedFileReader(deferred) {
      var reader = new FileReader();
      reader.onloadend = function () {
        if (this.error)
          deferred.reject(this.error);
        else
          deferred.resolve(this.result);
      };
      return reader;
    }

    /*
     * Returns a promise that will be resolved with the requested File object
     * or rejected if an error occurs attempting to retreive it.
     */
    function getFile(path, options) {
      var q = $q.defer();
      getFileEntry(path, options).then(function (fileEntry) {
        fileEntry.file(q.resolve, q.reject);
      }, q.reject);
      return q.promise;
    }

    /*
     * Returns a promise that will either be resolved with a FileWriter bound to the file identified
     * in the provided path or rejected if an error occurs while attempting to initialize
     * the writer.
     */
    function getFileWriter(path, options) {
      var q = $q.defer();
      getFileEntry(path, options).then(function (fileEntry) {
        fileEntry.createWriter(q.resolve, q.reject);
      }, q.reject);
      return q.promise;
    }

    /*
     * Returns a promise that will either be resolved with the FileEntry instance that corresponds
     * to the provided path or rejected if an error occurs while attempting to retrieve the
     * FileEntry.
     */
    function getFileEntry(path, options) {
      var q = $q.defer();
      getFilesystem().then(function (filesystem) {
        filesystem.root.getFile(path, options, q.resolve, q.reject);
      }, q.reject);
      return q.promise;
    }

    /*
     * Returns a promise that will either be resolved with the File object associated with the requested
     * absolute path, or rejected if an error occurs while trying to initialize that File object.
     */
    function getAbsoluteFile(path) {
      var q = $q.defer();
      $window.resolveLocalFileSystemURL(path, function (fileEntry) {
        fileEntry.file(q.resolve, q.reject);
      }, q.reject);
      return q.promise;
    }

    /*
     * Returns a promise that will either be resolved with the Directory object associated with
     * the requested directory or rejected if an error occurs while atempting to access that directory.
     */
    function getDirectory(dir, options) {
      var q = $q.defer();
      getFilesystem().then(function (filesystem) {
        filesystem.root.getDirectory(dir, options, q.resolve, q.reject);
      }, q.reject);
      return q.promise;
    }

    /*
     * Returns a Promise that will be either resolved with the FileSystem object associated
     * with the device's persistent file system and with 1MB of storage reserved for it,
     * or rejected if an error occurs while trying to accessing the FileSystem
     */
    function getFilesystem() {
      var q = $q.defer();
      try {
        $window.requestFileSystem($window.PERSISTENT, 1024 * 1024, q.resolve, q.reject);
      } catch (err) {
        q.reject(err);
      }
      return q.promise;
    }
  }]);
// install   :      cordova plugin add org.apache.cordova.network-information
// link      :      https://github.com/apache/cordova-plugin-network-information/blob/master/doc/index.md

App

  .factory('$cordovaNetwork', ['$rootScope', '$document', function ($rootScope, $document) {

    return {
      getNetwork: function () {
        return navigator.connection.type;
      },

      isOnline: function () {
        var networkState = navigator.connection.type;
        return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
      },

      isOffline: function () {
        var networkState = navigator.connection.type;
        return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
      },

      watchOffline: function () {
        document.addEventListener("offline", function () {
          var networkState = navigator.connection.type;
          $rootScope.$apply(function () {
            $rootScope.$broadcast('networkOffline', networkState);
          });
        }, false);
      },

      watchOnline: function () {
        document.addEventListener("online", function () {
          var networkState = navigator.connection.type;
          $rootScope.$apply(function () {
            $rootScope.$broadcast('networkOnline', networkState);
          });
        }, false);
      },

      clearOfflineWatch: function () {
        document.removeEventListener("offline", function () {
          $rootScope.$$listeners.networkOffline = []; // not clearing watch --broken clear
        }, false);
      },

      clearOnlineWatch: function () {
        document.removeEventListener("online", function () {
          $rootScope.$$listeners.networkOnline = []; // not clearing watch --broken clear
        }, false);
      }
    };
  }]);
// install   :      cordova plugin add org.apache.cordova.statusbar
// link      :      https://github.com/apache/cordova-plugin-statusbar/blob/master/doc/index.md

App

  .factory('$cordovaStatusbar', [function () {

    return {
      overlaysWebView: function (bool) {
        return StatusBar.overlaysWebView(!!bool);
      },

      style: function (style) {
        switch (style) {
          // Default
          case 0:
            return StatusBar.styleDefault();

          // LightContent
          case 1:
            return StatusBar.styleLightContent();

          // BlackTranslucent
          case 2:
            return StatusBar.styleBlackTranslucent();

          // BlackOpaque
          case 3:
            return StatusBar.styleBlackOpaque();

          default:
            return StatusBar.styleDefault();
        }
      },

      // supported names:
      // black, darkGray, lightGray, white, gray, red, green,
      // blue, cyan, yellow, magenta, orange, purple, brown
      styleColor: function (color) {
        return StatusBar.backgroundColorByName(color);
      },

      styleHex: function (colorHex) {
        return StatusBar.backgroundColorByHexString(colorHex);
      },

      hide: function () {
        return StatusBar.hide();
      },

      show: function () {
        return StatusBar.show();
      },

      isVisible: function () {
        return StatusBar.isVisible;
      }
    };
  }]);
