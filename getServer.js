var operation = require('./database/operation.js');
var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
// var childClient = redis.createClient({port:6378});

var config = require('./config');
var async = require('async');

var redisArr = [];
redisArr.push(client);
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



var entySrnoArr;
var totalPackages = 10000;

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
        redisArr[0].hget(config.hash.entyBaseHash, item, function(err, reply){
            if(err){
                console.log(err);
            }
            callback(null);
        });
    }, function(){
        var finishtime = Date.now();
        console.log(totalPackages+' done with cost: '+ (finishtime - startTime));
        sendPackage(50, entySrnoArr, startTime);
    });
}


client.hkeys(entyBaseHash, function(err, reply){
    if(err){
        console.log(err);
    }else{
        console.log(reply.length);
        entySrnoArr = reply;
        var startTime = Date.now();
        sendPackage(50, entySrnoArr, startTime);
    }
});
