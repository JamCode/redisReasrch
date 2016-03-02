var operation = require('./database/operation.js');
var redis = require("redis");
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
                    console.log(e.ema_enty_srno);
                    client.hset(entyBaseHash, e.ema_enty_srno, e.ema_enty_enty_code, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(reply);
                        }
                    });
                });
            }
        });

    }else{
        console.log(result);
    }
})
