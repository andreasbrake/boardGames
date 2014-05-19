var bcrypt = require('bcrypt')
var client = require('../redisdb').client
var gameIndex = -1

exports.getList = function(req, res){
	return res.render('getGame.jade',{games:req.user.games.chess.length})
}
exports.selectGame = function(req, res){
	var gameType = req.params.game
	var user = req.user

	if(gameType == 'newGame'){
		bcrypt.genSalt(function(err,salt){
			gameIndex = user.games.chess.length
			user.games.chess.push(salt)
			var newGame = generateFreshMap()
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
					return res.redirect('/chess')
				})
		})
	}
	else if(gameType.substring(0,4) == 'game'){
		gameIndex = gameType.substring(4)
		return res.redirect('/chess')
	}
	else if(gameType.substring(0,6) == 'versus'){
		gameIndex = user.games.chess.length

		var playerTwo = gameType.substring(6)
		player2exists(user,playerTwo)
	}
	function player2exists(user,playerTwo){
		client.exists('user:'+playerTwo,function(err,ex){
			if(err) console.log(err)
			if(ex)
				return setData(user,playerTwo)
			else
				return console.log('error')
		})
	}
	function setData(user,playerTwo){
		bcrypt.genSalt(function(err,salt){
			var newGame = generateFreshMap()
			var gameData = {
				first: ("" + user.username),
				second: ("" +playerTwo),
				turn:0,
				turnNumber:0,
				data:newGame
			}

			client.get('user:' + playerTwo, function(err, playerString){
				user.games.chess.push(salt)
				var player = JSON.parse(playerString)
				player.games.chess.push(salt)
				client.multi()
					.set('user:'+user.username,JSON.stringify(user))
					.set('user:'+player.username,JSON.stringify(player))
					.set('game:'+salt,JSON.stringify(gameData))
					.exec(function(err,rep){
						if (err) return console.error(err)
						return res.redirect('/chess')
					})
			})
		})
	}

}
exports.saveGame = function(res, user, game){
	var gameId = user.games.chess[gameIndex]
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
			return res.redirect('/chess')
		})
	})
}
exports.loadGame = function(){
	return gameIndex
}

function generateFreshMap(){
	/*	piece = {
			name: "",
			colour: 0,
			location: ""
		}
	*/
	var pieces = []
	var rows = ['1','2','3','4','5','6','7','8']
	var columns = ['a','b','c','d','e','f','g','h']

	for(var i=0; i<rows.length; i++){
		for(var j=0; j<columns.length; j++){
			var cellId = columns[j] + rows[i]
			if(rows[i] == '2')
				pieces.push({
					name:"pawn",
					colour:0,
					location:cellId
				})
			else if(rows[i] == '7')
				pieces.push({
					name:"pawn",
					colour:1,
					location:cellId
				})
			else if(columns[j] == 'a' || columns[j] == 'h'){
				if(rows[i] == '1')
					pieces.push({
						name:"rook",
						colour:0,
						location:cellId
					})
				else if(rows[i] == '8')
					pieces.push({
						name:"rook",
						colour:1,
						location:cellId
					})
			}
			else if(columns[j] == 'b' || columns[j] == 'g'){
				if(rows[i] == '1')
					pieces.push({
						name:"knight",
						colour:0,
						location:cellId
					})
				else if(rows[i] == '8')
					pieces.push({
						name:"knight",
						colour:1,
						location:cellId
					})
			}
			else if(columns[j] == 'c' || columns[j] == 'f'){
				if(rows[i] == '1')
					pieces.push({
						name:"bishop",
						colour:0,
						location:cellId
					})
				else if(rows[i] == '8')
					pieces.push({
						name:"bishop",
						colour:1,
						location:cellId
					})
			}
			else if(columns[j] == 'd'){
				if(rows[i] == '1')
					pieces.push({
						name:"king",
						colour:0,
						location:cellId
					})
				else if(rows[i] == '8')
					pieces.push({
						name:"queen",
						colour:1,
						location:cellId
					})
			}
			else if(columns[j] == 'e'){
				if(rows[i] == '1')
					pieces.push({
						name:"queen",
						colour:0,
						location:cellId
					})
				else if(rows[i] == '8')
					pieces.push({
						name:"king",
						colour:1,
						location:cellId
					})
			}
		}
	}
	return pieces
}