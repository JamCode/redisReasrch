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

exports.getPlusMinus = function(num){
	if (num>0) {
		return 1;
	}else if (num == 0) {
		return 0
	}else{
		return -1
	}
}


exports.compareDay = function(a, b){
	var a1 = a.split('-');
	var b1 = b.split('-');
	var d1 = new Date(a1[0], a1[1], a1[2]);
	var d2 = new Date(b1[0], b1[1], b1[2]);
	//console.log(d1.toString());
	//console.log(d2.toString());
	//console.log(Date.parse(d1) - Date.parse(d2));
	return Date.parse(d1) - Date.parse(d2);
}

exports.endPool = function(callback){
	pool.end(function(err){
		callback(err);
	});
}

exports.isMarketOpenTime = function() {
	var now = new Date();
	var day = now.getDay();
	if (day == 6 || day == 7) {
		return false;
	}

	var hour = now.getHours();
	var min = now.getMinutes();
	if (hour < 9 || hour > 15 || (hour == 9 && min < 30) || (hour == 15 && min > 0)) {
		return false;
	}
	return true;
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
