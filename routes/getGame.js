var bcrypt = require('bcrypt')
var genMap = require('./generateMap.js')
var client = require('../redisdb').client

exports.getList = function(req, res){
	var games = req.user.games
	return res.render('getGame.jade',{chess:games.chess.length,ships:games.ships.length })
}
exports.selectGame = function(req, res){
	var parameters = req.params.game.split('@')
	var gameType = parameters[0]
	var method = parameters[1]
	var user = req.user
	var player2 = null

	if(method == 'newGame'){
		bcrypt.genSalt(function(err,salt){
			if(gameType == 'chess'){
				user.games.chess.push(salt)
				var newGame = genMap.chess()
			}
			else if(gameType == 'ships'){
				user.games.ships.push(salt)
				var newGame = genMap.ships()
			}
			
			user.currentGame = salt

			var gameData = {
				first:user.username,
				second:user.username,
				practice: 1,
				turn:0,
				turnNumber:0,
				victor: -1,
				data:newGame
			}
			client.multi()
				.set('user:'+user.username,JSON.stringify(user))
				.set('game:'+salt,JSON.stringify(gameData))
				.exec(function(err,rep){
					if (err) return console.error(err)
					return res.redirect('/' + gameType)
				})
		})
	}
	else if(method.substring(0,4) == 'game'){ // Continue a game
		if(gameType == 'chess')
			user.currentGame = user.games.chess[method.substr(4,1)]
		else
			user.currentGame = user.games.ships[method.substr(4,1)]

		client.set('user:'+user.username,JSON.stringify(user),function(err,rep){
			if(err) console.log('error saving user')
			return res.redirect('/' + gameType)
		})
	}
	else if(method.substring(0,6) == 'versus'){ // Challenge someone
		player2 = method.substring(6)

		client.exists('user:'+player2,function(err,exists){
			if(err) console.log(err)
			if(exists)
				return setData()
			else
				return console.log('error')
		})
	}
	else if(method.substring(0,6) == 'delete'){ // Delete Game
		console.log('deleting ' + user.games.chess[method.substr(6,1)])
		if(gameType == 'chess')
			getGame(user.games.chess[method.substr(6,1)], deleteGame)
		else
			getGame(user.games.ships[method.substr(6,1)], deleteGame)
	}
	function setData(){
		bcrypt.genSalt(function(err,salt){
			if(gameType == 'chess')
				var newGame = genMap.chess()
			else
				var newGame = genMap.ships()

			user.currentGame = salt
			
			var gameData = {
				first: ("" + user.username),
				second: ("" +player2),
				practice: 0,
				turn:0,
				turnNumber:0,
				data:newGame,
				victor:-1
			}

			client.get('user:' + player2, function(err, playerString){
				var player = JSON.parse(playerString)

				if(gameType == 'chess'){
					user.games.chess.push(salt)
					player.games.chess.push(salt)
				}
				else{
					user.games.ships.push(salt)
					player.games.ships.push(salt)
				}	
				
				client.multi()
					.set('user:'+user.username,JSON.stringify(user))
					.set('user:'+player.username,JSON.stringify(player))
					.set('game:'+salt,JSON.stringify(gameData))
					.exec(function(err,rep){
						if (err) return console.error(err)
						return res.redirect('/' + gameType)
					})
			})
		})
	}
	function deleteGame(game){
		var id = ""

		if(game.victor == -1){
			if(game.first == user.username)
				game.victor = 2
			else
				game.victor = 1
		}

		console.log(user.games.chess)
		if(gameType == 'chess')
			id = user.games.chess.splice(method.substr(6,1),1)
		else
			id = user.games.ships.splice(method.substr(6,1),1)

		console.log(user.games.chess)
		client.multi()
			.set('user:'+user.username,JSON.stringify(user))
			.set('game:'+id,JSON.stringify(game))
			.exec(function(err,rep){
				if (err) return console.error('error deleting')
				return res.redirect('/getGame')
			})
	}
}
exports.saveGame = function(gameId, game, gameType, gameOver, newVictor, callback){
	client.get('game:'+gameId,function(err, oldDataString){
		var oldData = JSON.parse(oldDataString)
		var victor = oldData.victor

		if(oldData.turn == 0)
			var newTurn = 1
		else
			var newTurn = 0

		if(victor >= 0)
			return // if the game is already over, don't save
		else if(gameOver){ // Set the appropriate victor
			victor = newVictor
		}

		var gameData = {
			first: oldData.first,
			second: oldData.second,
			practice: oldData.practice,
			turn: newTurn,
			turnNumber: (oldData.turnNumber + 1),
			victor: victor,
			data:game
		}

		client.set('game:'+gameId,JSON.stringify(gameData),function(err,rep){
			if(err) console.log('error saving game')
			return callback(gameData)
		})
	})
}
exports.getGame = getGame
function getGame (gameId, callback){
	client.get('game:'+gameId,function(err, gameData){
		if(err) console.log("error getting game: getGame.js 154")
		return callback(JSON.parse(gameData))
	})
}