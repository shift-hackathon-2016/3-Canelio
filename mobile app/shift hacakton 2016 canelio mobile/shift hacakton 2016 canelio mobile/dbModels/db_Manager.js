App.factory("db_Manager", function ($q, $http, requestHelper, $cordovaFile) {

    function createTables(def) {
        canelio_db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS training');
            tx.executeSql('CREATE TABLE IF NOT EXISTS training (time integer, trick_id integer, timesSuccess integer, timesTrained integer)');
            tx.executeSql('DROP TABLE IF EXISTS tricks');
            tx.executeSql('CREATE TABLE IF NOT EXISTS tricks (id integer, name text , ordinal integer)');
            tx.executeSql('DROP TABLE IF EXISTS trainingForUpload');
            tx.executeSql('CREATE TABLE IF NOT EXISTS trainingForUpload (time integer, trick_id integer, timesSuccess integer, timesTrained integer)');

            def.resolve(true);
        });
    }

    function dropTable(def, data) {
        canelio_db.transaction(function (tx) {
            alertify.success("success");
            tx.executeSql('DROP TABLE IF EXISTS training');
        });
    }

          
    return {
        createTables: createTables
    };
});