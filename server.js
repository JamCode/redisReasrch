var operation = require('./database/operation.js');
var redis = require("redis"),
var client = redis.createClient({auth_pass:'here_dev'});

client.on("error", function (err) {
    console.log("Error " + err);
});

var entyBaseHash = 'entyBaseHash';

operation.loadEntity(function(flag, result){
    if(flag){
        client.del(entyBaseHash, function(err, reply){
            if(err){
                console.log(err);
            }else{
                result.forEach(function(e){
                    client.hset(entyBaseHash, e.ema_enty_srno, e, redis.print);
                });
            }
        });

    }else{
        console.log(result);
    }
})
