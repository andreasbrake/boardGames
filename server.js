#!/bin/env node
var ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '3000'

var express = require('express');
var jade = require('jade');
var passport = require('passport')
var bcrypt = require('bcrypt')
var LocalStrategy = require('passport-local').Strategy

var client = require('./redisdb').client

var chess = require('./routes/chess.js')
var game = require('./routes/getGame.js')
var createUser = require('./routes/createUser.js')

/* Initialize express */
var site = express();

site.use(express.static('static'));
site.use(express.cookieParser())
site.use(express.bodyParser())
site.use(express.session({ secret: 'butz lolz' }))
site.use(passport.initialize())
site.use(passport.session())

/* Use Jade as templating engine */
site.engine('jade', jade.__express);

site.get('/',function(req, res){
	if(req.user == null)
		return res.render('home.jade',{user:'null'})
	else
		return res.render('home.jade',{user:req.user.username})
})
// ====== LOGIN ======
site.get('/login',function(req,res){
	res.render('login.jade')
})
site.post('/login', passport.authenticate('local', 
	{successRedirect: '/',
	failureRedirect: '/login'}))
// ====== LOGOUT ======
site.get('/logout', auth, function(req, res){
  req.logout();
  res.redirect('/');
})
// ====== SIGNUP ======
site.get('/signup',function(req,res){
	res.render('signup.jade')
})
// ./routes/createUser.js
site.post('/signup', createUser.create)



site.get('/profile',auth,function(req, res){
	return res.render('profile.jade')
})
site.get('/chess',auth,chess.get)
site.post('/chess',auth,chess.post)

site.get('/getGame',auth,game.getList)
site.get('/getGame/:game',auth,game.selectGame)

passport.use(new LocalStrategy(
		function(username, password, done){
			client.get('user:' + username, function(err, userStr){
				if (err) return done(err)
				if (!userStr) return done(null, false)

				var user = JSON.parse(userStr)
				bcrypt.hash(password, user.salt, function(err, comp_hash){
					if (err) return done(null, false);
					if (user.hash !== comp_hash) return done(null, false)
					
					return done(null, user);
				})
			})
		}))

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(name, done) {
	client.get('user:' + name, function(err, user) {
		if (err) return done(err)
		done(null, JSON.parse(user))
	});
});
function auth(req, res, next){
	if(req.user) next()
	else res.redirect('/login')
}

/* Run on port 3000 */
site.listen(port, ip_addr);
