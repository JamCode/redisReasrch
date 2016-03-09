var operation = require('./database/operation.js');
var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
// var childClient = redis.createClient({port:6378});

var config = require('./config');
var async = require('async');

var redisArr = [];
redisArr.push(client);

var mysql = require('mysql');
var pool  = mysql.createPool({
    host: 'rdsruiaj3v2uaiv.mysql.rds.aliyuncs.com',
    user: 'wanghan',
    password: 'wanghan',
    database: 'cfets_test'
});


//redisArr.push(childClient);



client.on("error", function (err) {
    console.log("Error master redis" + err);
    redisArr.splice(0, 1);
    client.end();
});

// childClient.on("error", function(err){
//     console.log("Error child redis " + err);
//     redisArr.splice(1, 1);
//     childClient.end();
// });


var args = process.argv;

var entySrnoArr;
var totalPackages = args[2];
var unitpackages = args[3];

if(unitpackages == null||totalPackages == null){
    console.log('need totalPackages and unitpackages');
    return;
}

function getBytesLength(str) {
    return str.replace(/[^\x00-\xff]/gi, "--").length;
}

function sendPackage(count, entySrnoArr, startTime){
    var realSendCount = 0;
    if (totalPackages <= 0) {
        return;
    }
    if(totalPackages - count<0){
        realSendCount = totalPackages;
    }else{
        realSendCount = count;
    }
    totalPackages-=realSendCount;

    var entyArr = [];
    for(var i = 0; i<realSendCount; ++i){
        var index = parseInt(Math.random()*entySrnoArr.length, 10);
        entyArr.push(entySrnoArr[index]);
    }

    async.each(entyArr, function(item, callback){

        pool.getConnection(function(err, connection) {
            // Use the connection
            connection.query( 'SELECT * FROM trdx_entity_master where EMA_ENTY_SRNO = ?', [item], function(err, rows) {
                // And done with the connection.
                if(err){
                    console.log(err);
                }
                
                if(rows.length>0){
                    console.log(rows[0].EMA_ENTY_SRNO);
                }

                connection.release();
                callback(null);
            });
        });
    }, function(){
        var finishtime = Date.now();
        console.log(totalPackages+' done with cost: '+ (finishtime - startTime));
        if(totalPackages == 0){
            console.log(unitpackages + ' for one time '+', total is ' + args[2]);
        }
        sendPackage(unitpackages, entySrnoArr, startTime);
    });
}


client.hkeys(config.hash.entyBaseHash, function(err, reply){
    if(err){
        console.log(err);
    }else{
        console.log(reply.length);
        entySrnoArr = reply;
        var startTime = Date.now();
        sendPackage(unitpackages, entySrnoArr, startTime);
    }
});
