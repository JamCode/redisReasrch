var conn = require('../utility.js');


exports.loadEntityBase = function(callback){
    var sql = 'select *from trdx_entity_master';
    conn.executeSql(sql, [], callback);
}


exports.loadEntityAccount = function(callback){
    var sql = 'select *from trdx_entity_accnt_dtls where ead_accnt_status_indc = 1';
    conn.executeSql(sql, [], callback);
}
