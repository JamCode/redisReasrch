var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var client1 = redis.createClient({auth_pass:'here_dev'});

client1.select(1, function(err){
    if(err){
        console.log(err);
    }
});


delEntyPrName();

function delEntyPrName(){
    client.hkeys('entyBaseHash', function(err, reply){
        reply.forEach(function(key){
            client.hget('entyBaseHash', key, function(err, reply){
                reply = JSON.parse(reply);


                for(var i=0; i<reply.EMA_ENTY_SHRT_DESC.length;++i){
                    (function(i, desc){
                        var listStr = desc.substr(0, i+1);
                        client1.del('enty.'+listStr, function(err, reply){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('del '+listStr);
                            }
                        });
                    })(i, reply.EMA_ENTY_SHRT_DESC);
                }
                if(reply.EMA_PNYN_CODE_SHRT_DESC !== null){
                    for(var i=0;i<reply.EMA_PNYN_CODE_SHRT_DESC.length;++i){
                        var listStr = reply.EMA_PNYN_CODE_SHRT_DESC.substr(0, i+1);
                        client1.del('enty.'+listStr, reply.EMA_ENTY_SHRT_DESC, function(err){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('del enty desc');
                            }
                        });
                    }
                }
            });
        });
    });
}
