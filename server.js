#!/bin/env node
var ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '3000'

var express = require('express');
var jade = require('jade');
var client = require('./redisdb').client

/* Initialize express */
var site = express();

site.use(express.bodyParser())
site.use(express.static('static'));

/* Use Jade as templating engine */
site.engine('jade', jade.__express);

site.get('/',function(req, res){
	return res.render('home.jade')
})
/* Run on port 3000 */
site.listen(port, ip_addr);
