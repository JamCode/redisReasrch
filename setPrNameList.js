var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var client1 = redis.createClient({auth_pass:'here_dev'});

client1.select(1, function(err){
    if(err){
        console.log(err);
    }
});

setEntyPrName();
setAssetPrName();


function setAssetPrName(){

}

function setEntyPrName(){
    client.hkeys('entyBaseHash', function(err, reply){
        reply.forEach(function(key){
            console.log(key);
            client.hget('entyBaseHash', key, function(err, reply){
                reply = JSON.parse(reply);
                console.log(reply.EMA_ENTY_SHRT_DESC);
                for(var i=0; i<reply.EMA_ENTY_SHRT_DESC.length;++i){
                    for(var j=i;j<reply.EMA_ENTY_SHRT_DESC.length;++j){
                        var listStr = reply.EMA_ENTY_SHRT_DESC.substr(i, j-i+1);
                        client1.lpush('enty.'+listStr, reply.EMA_ENTY_SHRT_DESC, function(err){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('set enty desc list');
                            }
                        });
                    }
                }

                if(reply.EMA_PNYN_CODE_SHRT_DESC !== null){
                    for(var i=0;i<reply.EMA_PNYN_CODE_SHRT_DESC.length;++i){
                        var listStr = reply.EMA_PNYN_CODE_SHRT_DESC.substr(0, i+1);
                        client1.lpush('enty.'+listStr, reply.EMA_ENTY_SHRT_DESC, function(err){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('set enty desc list');
                            }
                        });
                    }
                }
            });
        });
    });
}
