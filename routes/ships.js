var client = require('../redisdb').client
var gameJS = require('./getGame.js')

var game = null
var player = ""

exports.get = function(req,res){
	var gameIndex = gameJS.loadGame()
	var gameId = req.user.games.ships[gameIndex]

	client.get('game:'+gameId,function(err,gameString){
		if(err) console.log('error loading game')

		game = JSON.parse(gameString)

		var hasTurn = 'false'
		opponent = game.first
		player = 'player2'

		if(game.first == req.user.username){
			opponent = game.second
			player = 'player1'

			if(game.turn == 0)
				hasTurn = 'true'
			
			if(game.second == req.user.username){
				if(game.turn == 1)
					player = 'player2'
				hasTurn = 'true'
			}
		}
		else if(game.second == req.user.username){
			if(game.turn == 1)
				hasTurn = 'true'
		}

		if(player == 'player1'){
			var pieces = game.data.data1
			var shots = game.data.shots1
		}
		else{
			var pieces = game.data.data2
			var shots = game.data.shots2
		}

		return res.render('ships.jade',{
			pieces:pieces,
			shots:shots,
			hasTurn:hasTurn,
			user:req.user.username,
			opponent:opponent
		})
	})
}
exports.post = function(req, res){
	var shot = req.body.shot

	var shotObj = {
		hit:0,
		location:shot
	}

	if(player == 'player1')
		var enemyPieces = game.data.data2
	else
		var enemyPieces = game.data.data1

	for(var i=0; i<enemyPieces.length; i++){
		var locs = enemyPieces[i].location
		var shotLoc = locs.indexOf(shot)

		if(shotLoc == -1)
			continue

		shotObj.hit = 1

		if(locs.length > 1)
			enemyPieces[i].location.splice(shotLoc,1)
		else
			enemyPieces.splice(i,1)
		
		break
	}

	if(player == 'player1'){
		game.data.data2 = enemyPieces
		game.data.shots1.push(shotObj)
	}
	else{
		game.data.data1 = enemyPieces
		game.data.shots2.push(shotObj)
	}

	return gameJS.saveGame(res, req.user, game.data, 'ships')
}
