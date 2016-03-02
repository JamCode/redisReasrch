var operation = require('./database/operation.js');


operation.loadEntity(function(flag, result){
    if(flag){
        result.forEach(function(e){
            console.log(e);
        });
    }else{
        console.log(result);
    }
})
