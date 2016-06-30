var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var config = require('./config');

client.on("error", function (err) {
    console.log("Error " + err);
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'rdsruiaj3v2uaiv.mysql.rds.aliyuncs.com',
    user: 'wanghan',
    password: 'wanghan',
    database: 'cfets_test'
});
connection.connect();


exports.loadAssetDtls = function(endCallback){
    client.del(config.hash.assetDtlsHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            var query = connection.query('select *from trdx_asset_base_dtls');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hset(config.hash.assetDtlsHash, row.abd_asset_srno, JSON.stringify(row), function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            //console.log(row.EMA_ENTY_SRNO);
                        }
                        connection.resume();
                    });
                })
                .on('end', function() {
                    console.log('load asset dtls end');
                    endCallback(null);
                }
            );
        }
    });
}


exports.loadUserDtls = function(endCallback){
    console.log('start load user dtls');
    client.del(config.hash.userDtlsHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            var query = connection.query('select *from trdx_user_dtls');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hset(config.hash.userDtlsHash, row.UDT_USER_SRNO, JSON.stringify(row), function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            //console.log(row.EMA_ENTY_SRNO);
                        }
                        connection.resume();
                    });
                })
                .on('end', function() {
                    console.log('load user dtls end');
                    endCallback(null);
                }
            );
        }
    });
}

exports.loadEntityMktMaking = function(endCallback){
    console.log('start load entity mkt making dtls');
    client.del(config.hash.entyMktMakeHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            var query = connection.query('select *from trdx_entity_mkt_making_dtls');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hget(config.hash.entyMktMakeHash, row.EMM_ENTY_SRNO, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            var arr = JSON.parse(reply);
                            if(arr == null){
                                arr = [];
                            }
                            arr.push(row);
                            client.hset(config.hash.entyMktMakeHash, row.EMM_ENTY_SRNO, JSON.stringify(arr), function(err, reply){
                                if(err){
                                    console.log(err);
                                }else{

                                }
                                connection.resume();
                            });
                        }
                    });
                })
                .on('end', function() {
                    console.log('load entity mkt making dtls end');
                    endCallback(null);
                }
            );
        }
    });
}

exports.loadEntityMktStatus = function(endCallback){
    console.log('start load entity mkt status');
    client.del(config.hash.entyMktStatusHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            var query = connection.query('select *from trdx_entity_mkt_status_dtls where ems_enty_status_indc = 3');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hget(config.hash.entyMktStatusHash, row.EMS_ENTY_SRNO, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            var arr = JSON.parse(reply);
                            if(arr == null){
                                arr = [];
                            }
                            arr.push(row);
                            client.hset(config.hash.entyMktStatusHash, row.EMS_ENTY_SRNO, JSON.stringify(arr), function(err, reply){
                                if(err){
                                    console.log(err);
                                }else{

                                }
                                connection.resume();
                            });
                        }
                    });
                })
                .on('end', function() {
                    console.log('load entity mkt status end');
                    endCallback(null);
                }
            );
        }
    });
}


exports.loadEntityElg = function(endCallback){
    console.log('start load entity elg');
    client.del(config.hash.entyElgHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            var query = connection.query('select *from trdx_entity_elgblt_dtls where eed_enty_elgblt_status_indc = 1');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hget(config.hash.entyElgHash, row.EED_ENTY_SRNO, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            var arr = JSON.parse(reply);
                            if(arr == null){
                                arr = [];
                            }
                            arr.push(row);
                            client.hset(config.hash.entyElgHash, row.EED_ENTY_SRNO, JSON.stringify(arr), function(err, reply){
                                if(err){
                                    console.log(err);
                                }else{

                                }
                                connection.resume();
                            });
                        }
                    });
                })
                .on('end', function() {
                    console.log('load entity elg end');
                    endCallback(null);
                }
            );
        }
    });
}

exports.loadEntityAccnt = function(endCallback){
    console.log('start load entity accnt');
    client.del(config.hash.entyAccntHash, function(err, reply){
        if (err) {
            console.log(err);
        }else{
            var entyAccntQuery = connection.query('select *from trdx_entity_accnt_dtls where ead_accnt_status_indc = 1');
            entyAccntQuery
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hget(config.hash.entyAccntHash, row.EAD_ENTY_SRNO, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            var arr = JSON.parse(reply);
                            if(arr == null){
                                arr = [];
                            }
                            arr.push(row);
                            client.hset(config.hash.entyAccntHash, row.EAD_ENTY_SRNO, JSON.stringify(arr), function(err, reply){
                                if(err){
                                    console.log(err);
                                }else{

                                }
                                connection.resume();
                            });
                        }
                    });
                })
                .on('end', function() {
                    console.log('load entity accnt end');
                    endCallback(null);
                }
            );
        }
    });
}

exports.loadEntityBase = function(endCallback){
    console.log('start load entity base');
    client.del(config.hash.entyBaseHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            var entyBaseQuery = connection.query('select *from trdx_entity_master');
            entyBaseQuery
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    // Pausing the connnection is useful if your processing involves I/O
                    connection.pause();
                    client.hset(config.hash.entyBaseHash, row.EMA_ENTY_SRNO, JSON.stringify(row), function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            //console.log(row.EMA_ENTY_SRNO);
                        }
                        connection.resume();
                    });
                })
                .on('end', function() {
                    console.log('load entity base end');
                    endCallback(null);
                }
            );
        }
    });
}
