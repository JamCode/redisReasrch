var redis = require("redis");
var client = redis.createClient({auth_pass:'here_dev'});
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({
    extended: false // parse application/x-www-form-urlencoded
}));

var server = app.listen(8089, function(){
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





app.get('/', function(req, res) {
    console.log(req.query);

    if(req.query.entyDesc !== undefined){
        client.lrange('enty.'+req.query.entyDesc, 0, 100, function(err, reply){
            res.send(reply);
        });
    }

    if(req.query.assetDesc !== undefined){
        client.lrange('asset.'+req.query.assetDesc, 0, 100, function(err, reply){
            res.send(reply);
        });
    }
});
