var bcrypt = require('bcrypt')
var genMap = require('./generateMap.js')
var client = require('../redisdb').client
var gameIndex = -1

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
				gameIndex = user.games.chess.length
				user.games.chess.push(salt)
				var newGame = genMap.chess()
			}
			else if(gameType == 'ships'){
				gameIndex = user.games.ships.length
				user.games.ships.push(salt)
				var newGame = genMap.ships()
			}
			
			var gameData = {
				first:user.username,
				second:user.username,
				turn:0,
				turnNumber:0,
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
	else if(method.substring(0,4) == 'game'){
		gameIndex = method.substring(4)
		return res.redirect('/' + gameType)
	}
	else if(method.substring(0,6) == 'versus'){
		if(gameType == 'chess')
			gameIndex = user.games.chess.length
		else
			gameIndex = user.games.ships.length

		player2 = method.substring(6)
		player2exists()
	}
	function player2exists(){
		client.exists('user:'+player2,function(err,ex){
			if(err) console.log(err)
			if(ex)
				return setData()
			else
				return console.log('error')
		})
	}
	function setData(){
		bcrypt.genSalt(function(err,salt){
			if(gameType == 'chess')
				var newGame = genMap.chess()
			else
				var newGame = genMap.ships()

			var gameData = {
				first: ("" + user.username),
				second: ("" +player2),
				turn:0,
				turnNumber:0,
				data:newGame
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
}
exports.saveGame = function(res, user, game,gameType){
	if(gameType == 'chess')
		var gameId = user.games.chess[gameIndex]
	else if(gameType == 'ships')
		var gameId = user.games.ships[gameIndex]

	client.get('game:'+gameId,function(err, oldDataString){
		var oldData = JSON.parse(oldDataString)

		if(oldData.turn == 0)
			var newTurn = 1
		else
			var newTurn = 0

		var gameData = {
			first:oldData.first,
			second: oldData.second,
			turn: newTurn,
			turnNumber: (oldData.turnNumber + 1),
			data:game
		}

		client.set('game:'+gameId,JSON.stringify(gameData),function(err,rep){
			if(err) console.log('error saving game')
			return res.redirect('/' + gameType)
		})
	})
}
exports.loadGame = function(){
	return gameIndex
}