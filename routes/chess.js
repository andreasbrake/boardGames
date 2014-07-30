var client = require('../redisdb').client
var game = require('./getGame.js')

var pieces = []

exports.get = function(req,res){
	var gameIndex = game.loadGame()
	var gameId = req.user.games.chess[gameIndex]

	client.get('game:'+gameId,function(err,gameString){
		if(err) console.log('error loading game')

		var game = JSON.parse(gameString)

		if(game == null){
			console.log('error')
			console.log('gameId: ' + gameId)
			console.log('gameIndex: ' + gameIndex)
			console.log(gameString)
			console.log(req.user)
		}
		pieces = game.data

		var playerColour = 1
		var opponent = game.first
		var hasTurn = 'false'
		var victor = 'none'

		if(game.first == req.user.username){
			playerColour = 0
			opponent = game.second

			if(game.second == req.user.username) // Occurs when playing against yourself (during practice)
				playerColour = game.turn // Ensures your are always the one controlling the pieces
		}
		
		if(playerColour == game.turn)
			hasTurn = 'true'

		if(game.victor > -1){
			if(playerColour == game.victor)
				victor = "you"
			else
				victor = opponent
		}

		return res.render('chess.jade',{
			pieces:pieces,
			playerColour:playerColour,
			hasTurn:hasTurn,
			user:req.user.username,
			opponent:opponent,
			victor:victor
		})
	})
}
exports.post = function(req, res){
	var move = req.body.movement + ""
	var moveFrom = (move[0]+move[1]) 
	var moveTo = (move[2]+move[3])
	var kingTake = false

	var movingPiece = null
	for(var i=0; i<pieces.length; i++){ // Goes through all the game pieces (at the last GET request)
		var currTile = pieces[i].location
		if(currTile == moveFrom) // Gets our desired piece from the list of game pieces based on its location.
			movingPiece = pieces.splice(i,1)[0]
	}
	// MovingPiece will be null if the player has submitted a move of empty space (won't happen unless player is cheating)

	if(movingPiece == null)
		return res.redirect('/chess') // Don't allow data to save

	movingPiece.location = moveTo // Set pieces location to the desired move spot
	for(var i=0; i<pieces.length; i++){
		var currTile = pieces[i].location
		if(currTile == moveTo){
			if(pieces[i].name == "king")
				kingTake = true
			pieces[i] = movingPiece // Replaces piece at move location with the moving piece
			movingPiece = null
		}
	}
	if(movingPiece != null)
		pieces.push(movingPiece)

	return game.saveGame(res, req.user, pieces, 'chess', kingTake)
}
