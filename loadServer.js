var async = require('async');
var loadOper = require('./loadOper.js');


async.series([
    function(callback){
        loadOper.loadEntityBase(callback);
    },
    function(callback){
        loadOper.loadEntityAccnt(callback);
    },
    function(callback){
        loadOper.loadEntityElg(callback);
    },
    function(callback){
        loadOper.loadEntityMktStatus(callback);
    },
    function(callback){
        loadOper.loadEntityMktMaking(callback);
    }
],
function(err, results){
    // results is now equal to ['one', 'two']
    if(!err){
        console.log('all load finish');
    }
});
