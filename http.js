var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var client0 = redis.createClient({auth_pass:'here_dev'});
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({
    extended: false // parse application/x-www-form-urlencoded
}));

var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at '+host+':'+port);
});

client.select(1, function(err){
    if(err){
        console.log(err);
    }
});


app.use(express.static('./'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('fonts'));



app.get('/entyUser', function(req, res){
    if(req.query.entySrno !== undefined){
        client.lrange(req.query.entySrno+'.entyUserlist', 0, -1, function(err, reply){
            if(err){
                console.log(err);
                res.send(err);
            }else{
                var userArray = [];
                async.each(reply, function(userSrno, callback){
                    client0.hget('userDtlsHash', userSrno, function(err, userReply){
                        if(err){
                            callback(err);
                        }else{
                            userReply = JSON.parse(userReply);
                            userArray.push({
                                userSrno: userReply.UDT_USER_SRNO,
                                userDesc: userReply.UDT_USER_DESC
                            });
                            callback();
                        }
                    });

                }, function(err){
                    if(err){
                        res.send(err);
                    }else{
                        res.send(userArray);
                    }
                });
            }
        });
    }
});


app.get('/search', function(req, res) {
    console.log(req.query);

    if(req.query.entyDesc !== undefined){
        client.lrange('enty.'+req.query.entyDesc, 0, 50, function(err, reply){
            res.send(reply);
        });
    }

    if(req.query.assetDesc !== undefined){
        client.lrange('asset.'+req.query.assetDesc, 0, 50, function(err, reply){
            res.send(reply);
        });
    }
});
