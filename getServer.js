var operation = require('./database/operation.js');
var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var childClient = redis.createClient({port:6378});

var config = require('./config');
var async = require('async');

var redisArr = [];
redisArr.push(client);
redisArr.push(childClient);



client.on("error", function (err) {
    console.log("Error master redis" + err);
    redisArr.splice(0, 1);
    client.end();
});

childClient.on("error", function(err){
    console.log("Error child redis " + err);
    redisArr.splice(1, 1);
    childClient.end();
});


var entyBaseHash = config.hash.entyBaseHash;
var entyAccntHash = config.hash.entyAccntHash;

var entySrnoArr;

function getBytesLength(str) {
    return str.replace(/[^\x00-\xff]/gi, "--").length;
}

client.hkeys(entyBaseHash, function(err, reply){
    if(err){
        console.log(err);
    }else{
        console.log(reply.length);
        entySrnoArr = reply;
        var milSec = 1000;
        setInterval(function(){
            var packCount = 10000;

            var entyArr = [];

            for(var i = 0; i<packCount; ++i){
                var index = parseInt(Math.random()*entySrnoArr.length, 10);
                entyArr.push(entySrnoArr[index]);
            }
            var nowtime = Date.now();
            var redisIndex = parseInt(Math.random()*redisArr.length, 10);

            console.log('send '+ packCount*1000/milSec + 'req/s  to redis:'+redisIndex+' for enty base info');
            async.each(entyArr, function(item, callback){

                redisArr[redisIndex].hget(entyBaseHash, item, function(err, reply){
                    if(err){
                        console.log(err);
                    }
                    //console.log(getBytesLength(reply));
                    //reply = JSON.parse(reply);
                    callback(null);
                });
            }, function(){
                var finishtime = Date.now();
                console.log('done with cost: '+ (finishtime - nowtime));
            });
        }, milSec);
    }
});
