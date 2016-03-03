var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var config = require('./config');
var async = require('async');

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

var entyBaseHash = config.hash.entyBaseHash;
var entyAccntHash = config.hash.entyAccntHash;



async.series([
    function(callback){
        loadEntityBase(callback);
    },
    function(callback){
        loadEntityAccnt(callback);
    },
    function(callback){
        loadEntityElg(callback);
    },
    function(callback){
        loadEntityMktStatus(callback);
    },
    function(callback){
        loadEntityMktMaking(callback);
    },
    function(callback){
        loadUserDtls(callback);
    }
],
function(err, results){
    // results is now equal to ['one', 'two']
    if(!err){
        console.log('all load finish');
    }
});

// loadEntityBase();
// loadEntityAccnt();
// loadEntityElg();

function loadUserDtls(endCallback){
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

function loadEntityMktMaking(endCallback){
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

function loadEntityMktStatus(endCallback){
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


function loadEntityElg(endCallback){
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

function loadEntityAccnt(endCallback){
    console.log('start load entity accnt');
    client.del(entyAccntHash, function(err, reply){
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
                    client.hget(entyAccntHash, row.EAD_ENTY_SRNO, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            var arr = JSON.parse(reply);
                            if(arr == null){
                                arr = [];
                            }
                            arr.push(row);
                            client.hset(entyAccntHash, row.EAD_ENTY_SRNO, JSON.stringify(arr), function(err, reply){
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

function loadEntityBase(endCallback){
    console.log('start load entity base');
    client.del(entyBaseHash, function(err, reply){
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
                    client.hset(entyBaseHash, row.EMA_ENTY_SRNO, JSON.stringify(row), function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(row.EMA_ENTY_SRNO);
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



// operation.loadEntityAccount(function(flag, result){
//     if(flag){
//         client.del(entyAccntHash, function(err, reply){
//             if (err) {
//                 console.log(err);
//             }else{
//                 // var resultHash = {};
//                 // result.forEach(function(e){
//                 //     if (resultHash[e.EAD_ENTY_SRNO] == null) {
//                 //         resultHash[e.EAD_ENTY_SRNO] = [];
//                 //     }
//                 //     resultHash[e.EAD_ENTY_SRNO].push(e);
//                 // });
//
//                 // console.log('resultHash: ' + Object.keys(resultHash).length);
//
//                 // for (var entySrno in resultHash) {
//                 //     client.hset(entyAccntHash, entySrno, JSON.stringify(resultHash[entySrno]), function(err, reply){
//                 //         if(err){
//                 //             console.log(err);
//                 //         }
//                 //     });
//                 // }
//             }
//         });
//
//     }else{
//         console.log(result);
//     }
// });
//
// operation.loadEntityBase(function(flag, result){
//     if(flag){
//         client.del(entyBaseHash, function(err, reply){
//             if(err){
//                 console.log(err);
//             }else{
//                 // result.forEach(function(e){
//                 //     client.hset(entyBaseHash, e.EMA_ENTY_SRNO, JSON.stringify(e), function(err, reply){
//                 //         if(err){
//                 //             console.log(err);
//                 //         }
//                 //     });
//                 // });
//             }
//         });
//
//     }else{
//         console.log(result);
//     }
// })
