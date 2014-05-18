var redis = require('redis')

var redis_port = process.env.OPENSHIFT_REDIS_PORT || '6379';
var redis_host = process.env.OPENSHIFT_REDIS_HOST || '127.0.0.1';

var client;
if (typeof process.env.OPENSHIFT_GEAR_NAME == 'undefined') {
	/** LOCAL **/
	client = redis.createClient(redis_port, redis_host);
} else {
	/** PRODUCTION **/
	/* TODO: Cache static assets if production */
	client = redis.createClient(redis_port, redis_host);
	client.auth(process.env.REDIS_PASSWORD);
}

exports.client = client;