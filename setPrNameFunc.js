var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var client1 = redis.createClient({auth_pass:'here_dev'});
var config = require('./config');
var async = require('async');

client1.select(1, function(err){
    if(err){
        console.log(err);
    }else{

    }
});

exports.setEntyUserRelation = function(){
    console.log('setEntyUserRelation');
    client.hgetall(config.hash.userDtlsHash, function(err, reply){
        if(err){
            console.log(err);
        }else{
            for (var variable in reply) {
                var user = reply[variable];
                user = JSON.parse(user);
                console.log('load '+user.UDT_USER_SRNO);
                client1.lpush(user.UDT_ENTY_SRNO+'.entyUserlist', user.UDT_USER_SRNO, function(err, reply){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    });
}


exports.setAssetPrName = function(){
    client.hkeys('assetDtlsHash', function(err, reply){
        reply.forEach(function(key){
            client.hget('assetDtlsHash', key, function(err, reply){
                reply = JSON.parse(reply);

                for(var i=0; i<reply.abd_asset_shrt_desc.length;++i){
                    for(var j=i;j<reply.abd_asset_shrt_desc.length;++j){
                        var listStr = reply.abd_asset_shrt_desc.substr(i, j-i+1);
                        client1.lpush('asset.'+listStr, JSON.stringify({desc:reply.abd_asset_shrt_desc, assetSrno:reply.abd_asset_srno, assetCode:reply.abd_asset_encd_asset_code}), function(err){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('set asset desc list');
                            }
                        });
                    }
                }
            });
        });
    });
}

exports.setEntyPrName = function(){
    client.hkeys('entyBaseHash', function(err, reply){
        reply.forEach(function(key){
            console.log(key);
            client.hget('entyBaseHash', key, function(err, reply){
                reply = JSON.parse(reply);
                console.log(reply.EMA_ENTY_SHRT_DESC);
                for(var i=0; i<reply.EMA_ENTY_SHRT_DESC.length;++i){
                    for(var j=i;j<reply.EMA_ENTY_SHRT_DESC.length;++j){
                        var listStr = reply.EMA_ENTY_SHRT_DESC.substr(i, j-i+1);
                        client1.lpush('enty.'+listStr, JSON.stringify({desc:reply.EMA_ENTY_SHRT_DESC, entySrno:reply.EMA_ENTY_SRNO}), function(err){
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
                        client1.lpush('enty.'+listStr, JSON.stringify({desc:reply.EMA_ENTY_SHRT_DESC, entySrno:reply.EMA_ENTY_SRNO}), function(err){
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
