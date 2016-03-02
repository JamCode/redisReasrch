var conn = require('../utility.js');


exports.loadEntityBase = function(callback){
    var sql = 'select *from trdx_entity_master';
    conn.executeSql(sql, [], callback);
}


exports.loadEntityAccount = function(callback){
    var sql = 'select *from trdx_entity_accnt_dtls';
    conn.executeSql(sql, [], callback);
}
