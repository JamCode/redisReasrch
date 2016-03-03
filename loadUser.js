var async = require('async');
var loadOper = require('./loadOper.js');


async.series([
    function(callback){
        loadOper.loadUserDtls(callback);
    }
],
function(err, results){
    // results is now equal to ['one', 'two']
    if(!err){
        console.log('all load finish');
    }
});
