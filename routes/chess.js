var client = require('../redisdb').client
var game = require('./getGame.js')

exports.get = function(req,res){
	var gameId = req.user.currentGame
	console.log("getting game: " + gameId)
	game.getGame(gameId,function(game){
		if(game == null){
			console.log('error')
			console.log('gameId: ' + gameId)
			console.log(req.user)
		}
		var pieces = game.data

		var playerColour = 1
		var opponent = game.first
		var victor = 'none'

		if(game.first == req.user.username){
			playerColour = 0
			opponent = game.second

			if(game.second == req.user.username) // Occurs when playing against yourself (during practice)
				playerColour = game.turn // Ensures your are always the one controlling the pieces
		}

		if(game.victor > -1){
			if(playerColour == game.victor)
				victor = "you"
			else
				victor = opponent
		}

		console.log('staring: ' + gameId)
		console.log('VICTOR 2 = ' + victor)
		var ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
		var port    = process.env.OPENSHIFT_NODEJS_PORT || '3000'

		return res.render('chess.jade',{
			host: ip_addr + ":" + port,
			pieces:pieces,
			playerColour: playerColour,
			user:req.user.username,
			opponent:opponent,
			gameId:gameId,
			victor:victor
		})
	})
}
exports.saveGame = function(gameId, moveFrom, moveTo, callback){
	var kingTake = false
	var kingColour = -1

	console.log(moveFrom, moveTo)
	var movingPiece = null
        var lostPiece = null
	game.getGame(gameId,function(oldData){
		var pieces = oldData.data

		for(var i=0; i<pieces.length; i++){ // Goes through all the game pieces (at the last GET request)
			var currTile = pieces[i].location
			if(currTile == moveFrom){ // Gets our desired piece from the list of game pieces based on its location.
			    pieces[i].location = moveTo
                            movingPiece = pieces[i]
                        }
                        else if(currTile == moveTo){
                            pieces[i].location = "X0"
                            lostPiece = pieces[i]
                        }
                            
		}
		// MovingPiece will be null if the player has submitted a move of empty space (won't happen unless player is cheating)

		if(movingPiece == null)
			return callback(oldData) // Don't allow
                    // anything to be saved if there shouldn't be a
                    // piece moving

		movingPiece.location = moveTo // Set pieces location to the desired move spot
                
                if(lostPiece != null && lostPiece.name == "king"){
                    kingTake = true
                    kingColour = lostPiece.colour
                }

		game.saveGame(gameId, pieces, 'chess', kingTake, !kingColour, function(udpatedGame){
			return callback(udpatedGame)
		})
	})
}
