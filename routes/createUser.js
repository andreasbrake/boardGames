var bcrypt = require('bcrypt')
var client = require('../redisdb').client

// And here we behold the miracle of life!
exports.create = function(req, res){
	var name = req.body.username
	var password = req.body.password
	var salt = password

	userExists()

	// Determine if the username already exists
	function userExists(){
		client.exists('user:' + name, function(err, reply){
			if(err) return console.log('get error')
			if(reply) return console.log('name already in use')
			return createUser()
		})
	}
	// If the username is available, create a user with the specified username
	function createUser(){
		bcrypt.genSalt(function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				if (err) return console.log(err)
				var user = {
					username: name,
					hash: hash,
					salt: salt,
					games: {chess:[]}
				}

				client.set('user:' + name, JSON.stringify(user), function(err, reply) {
					if (err) return console.error(err)
					req.login(user, function(err){
						if (err) return console.error(err)
						res.redirect('/')
					})
				})
			})
		})
	}
}