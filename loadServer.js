var operation = require('./database/operation.js');
var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var config = require('./config');

client.on("error", function (err) {
    console.log("Error " + err);
});

var entyBaseHash = config.hash.entyBaseHash;
var entyAccntHash = config.hash.entyAccntHash;


operation.loadEntityAccount(function(flag, result){
    if(flag){
        client.del(entyAccntHash, function(err, reply){
            if (err) {
                console.log(err);
            }else{
                result.forEach(function(e){
                    client.hget(entyAccntHash, e.EAD_ENTY_SRNO, function(err, reply){
                        if(err){
                            console.log(err);
                        }else{
                            if(reply == null){
                                client.hset(entyAccntHash,
                                    e.EAD_ENTY_SRNO, JSON.stringify([e]), function(err, reply){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                            }else{
                                var arr = JSON.parse(reply);
                                arr.push(e);
                                client.hset(entyAccntHash,
                                    e.EAD_ENTY_SRNO, JSON.stringify(arr), function(err, reply){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                            }
                        }
                    });
                });
            }
        });
    }else{
        console.log(result);
    }
});

operation.loadEntityBase(function(flag, result){
    if(flag){
        client.del(entyBaseHash, function(err, reply){
            if(err){
                console.log(err);
            }else{
                result.forEach(function(e){
                    client.hset(entyBaseHash, e.EMA_ENTY_SRNO, JSON.stringify(e), function(err, reply){
                        if(err){
                            console.log(err);
                        }
                    });
                });
            }
        });

    }else{
        console.log(result);
    }
})
