var operation = require('./database/operation.js');
var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev', host:'10.116.0.165'});
var config = require('./config');
var async = require('async');

client.on("error", function (err) {
    console.log("Error " + err);
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
            var packCount = 1000;

            console.log('send '+ packCount*1000/milSec + 'req/s for enty base info');
            var entyArr = [];

            for(var i = 0; i<packCount; ++i){
                var index = parseInt(Math.random()*entySrnoArr.length, 10);
                entyArr.push(entySrnoArr[index]);
            }
            var nowtime = Date.now();
            async.eachSeries(entyArr, function(item, callback){
                client.hget(entyBaseHash, item, function(err, reply){
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
