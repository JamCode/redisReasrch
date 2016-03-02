var conn = require('../utility.js');


exports.loadEntity = function(callback){
    var sql = 'select *from trdx_entity_master';
    conn.executeSql(sql, [], callback);
}


exports.loadEntityAccount = function(callback){
    var sql = 'select *from trdx_entity_accnt_dtls';
    conn.executeSql(sql, [], callback);
}
