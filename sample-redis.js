var redis = require("redis");

var BridgeRedis = module.exports = function(){
	this.client = redis.createClient();	
	this.client.on("error", function (err) {
		console.log('error event -' + this.client.host + ':'+ this.client.port + '-' + err);
	});
}

BridgeRedis.prototype.disconnet = function(){
	this.client.quit(function(err, res){
		console.log("existing from quit command")
	});
};

BridgeRedis.prototype.cb = function(err, result){
	if err
		throw err
	return result
}

BridgeRedis.prototype.exists = function(hash, callback){
	// HEXISTS key field
	// Determine if a hash field exists
	this.client.exists(hash, function(err, result){
		if (err){
			throw err
		} else {
			// HGET key field
			// Get the value of a hash field
			this.client.hget(hash, callback)
		}
	});
}

// HVALS key
// Get all the values in a hash
client.hvals('hash key', function(err, replies){

	if (err ) {
		return console.error("error response -" + err);
	}

	console.log(replies.length + " replies:");
	replies.forEach(function(reply, i){
		console.log('   ' + i + ': '+ reply);
	});

});

client.hkeys('hash key', function(err, replies){

	if (err ) {
		return console.error("error response -" + err);
	}

	console.log(replies.length + " replies:");
	replies.forEach(function(reply, i){
		console.log('   ' + i + ': '+ reply);
	});

});

client.hlen('hash key', function(err, replies){
	if(err) 
		return console.error("error response -" + err)
	console.log("cantidad");
	console.log(replies)

});

client.hgetall('hash key', function(err, replies){
	console.log(replies);
});

// HSET key field value
// Set the string value of a hash field
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

// HKEYS key
// Get all the fields in a hash
client.hkeys("hash key", function (err, replies) {
	console.log(replies.length + " replies:");
	replies.forEach(function (reply, i) {
		console.log("    " + i + ": " + reply);
	});
	client.quit();
});

/*
	HDEL key field [field ...]
	Delete one or more hash fields

	HGETALL key
	Get all the fields and values in a hash

	HINCRBY key field increment
	Increment the integer value of a hash field by the given number

	HINCRBYFLOAT key field increment
	Increment the float value of a hash field by the given amount

	HLEN key
	Get the number of fields in a hash

	HMGET key field [field ...]
	Get the values of all the given hash fields

	HMSET key field value [field value ...]
	Set multiple hash fields to multiple values

	HSET key field value
	Set the string value of a hash field

	HSETNX key field value
	Set the value of a hash field, only if the field does not exist

	HSCAN key cursor [MATCH pattern] [COUNT count]
	Incrementally iterate hash fields and associated values
*/