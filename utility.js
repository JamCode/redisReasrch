var mysql = require('mysql');

var pool = mysql.createPool({
	host: 'rdsruiaj3v2uaiv.mysql.rds.aliyuncs.com',
	user: 'wanghan',
  	password: 'wanghan',
	database: 'cfets_test',
	port: 3306,
	acquireTimeout: 60000
});

console.log('load utility');


exports.endPool = function(callback){
	pool.end(function(err){
		callback(err);
	});
}




exports.sha1Cryp = function(str){
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex');
}

exports.executeSql = function(sql, para, callback) {

	//logger.debug(sql, logger.getFileNameAndLineNum(__filename));

	pool.getConnection(function(err, conn){
		//logger.debug('enter getConnection', logger.getFileNameAndLineNum(__filename));
		if (err) {
            console.log(err);
			if(callback!=null){
				callback(false, err);
			}
		}
		//modify by wanghan 20141007
		else{
			var query = conn.query(sql, para, function(err, result){
				if (err) {
                    console.log(err);
					if(callback!=null){
						callback(false, err);
					}
				} else{
					if (callback && typeof callback === 'function') callback(true, result);
				}
				//logger.debug('conn release', logger.getFileNameAndLineNum(__filename));
				//conn.end();
				conn.release();
			});
			console.log(query.sql);
		}
	});
}

exports.executeSqlString = function(sql, callback) {
	pool.getConnection(function(err, conn){
		if (err){
			callback(false, err);
		}else{
			conn.query(sql, function(err, result){
				if (err) {
					callback(false, err);
				}else{
					if (callback && typeof callback === 'function') callback(true, result);
				}
				//conn.end();
				conn.release();
			});
		}
	});
}

exports.executeTwoStepTransaction = function(sqlArray, paraArray, callback){
	pool.getConnection(function(err, conn){
		if (err){
			callback(false, err);
		}else {
			var queues = require('mysql-queues');
			const DEBUG = true;
			queues(conn, DEBUG);
			var trans = conn.startTransaction();
			trans.query(sqlArray[0], paraArray[0], function(err, result) {
				if(err) {
					trans.rollback();
					callback(true);
				}
				else
					trans.query(sqlArray[1], paraArray[1], function(err) {
						if(err){
							trans.rollback();
							callback(true);
						}
						else{
							trans.commit();
							callback(true, result);
						}
					});
			});
			trans.execute();
		}
	});
}
