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

var entyBaseHash = config.hash.entyBaseHash;
var entyAccntHash = config.hash.entyAccntHash;
loadEntityBase();


function loadEntityBase(){
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
                .on('fields', function(fields) {
                    // the field packets for the rows to follow
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
