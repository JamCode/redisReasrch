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

var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'rdsruiaj3v2uaiv.mysql.rds.aliyuncs.com',
  user            : 'wanghan',
  password        : 'wanghan',
  database        : 'cfets_test'
});

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


app.get('/searchDatabase', function(req, res){
    pool.getConnection(function(err, connection) {
        // Use the connection
        if(err){
            console.log(err);
        }else{
            connection.query( 'SELECT EMA_ENTY_SHRT_DESC, EMA_ENTY_SRNO FROM trdx_entity_master where EMA_ENTY_SHRT_DESC like \'%'+req.query.entyDesc+'%\' limit 10', function(err, rows) {
                if(err){
                    console.log(err);
                }else{
                    res.send(rows);
                }
                connection.release();
            });
        }
        // Don't use the connection here, it has been returned to the pool.
    });
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
