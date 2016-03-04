var operation = require('./database/operation.js');
var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var config = require('./config');

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
            var packCount = 1;

            console.log('send '+ packCount*1000/milSec + 'req/s for enty base info');
            for(var i = 0; i<packCount; ++i){
                var index = parseInt(Math.random()*entySrnoArr.length, 10);
                var nowtime = Date.now();
                client.hget(entyBaseHash, entySrnoArr[index], function(err, reply){
                    if(err){
                        console.log(err);
                    }
                    var finishtime = Date.now();
                    console.log('cost: ' + (finishtime - nowtime));
                    if (reply!=null) {
                        console.log(reply);
                    }
                });
            }

        }, milSec);
    }
});
