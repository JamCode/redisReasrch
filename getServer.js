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
});

childClient.on("error", function(err){
    console.log("Error child redis" + err);
});


var entyBaseHash = config.hash.entyBaseHash;
var entyAccntHash = config.hash.entyAccntHash;

var entySrnoArr;

client.hkeys(entyBaseHash, function(err, reply){
    if(err){
        console.log(err);
    }else{
        console.log(reply.length);
        entySrnoArr = reply;
        var milSec = 1000;
        setInterval(function(){
            var packCount = 10000;

            console.log('send '+ packCount*1000/milSec + 'req/s for enty base info');
            var entyArr = [];

            for(var i = 0; i<packCount; ++i){
                var index = parseInt(Math.random()*entySrnoArr.length, 10);
                entyArr.push(entySrnoArr[index]);
            }
            var nowtime = Date.now();
            async.each(entyArr, function(item, callback){
                //var redisIndex = parseInt(Math.random()*redisArr.length, 10);
                redisArr[0].hget(entyBaseHash, item, function(err, reply){
                    if(err){
                        console.log(err);
                    }
                    reply = JSON.parse(reply);
                    callback(null);
                });
            }, function(){
                var finishtime = Date.now();
                console.log('done with cost: '+ (finishtime - nowtime));
            });
        }, milSec);
    }
});
