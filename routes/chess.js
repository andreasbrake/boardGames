var client = require('../redisdb').client
var game = require('./getGame.js')

var pieces = []

exports.get = function(req,res){
	var gameIndex = game.loadGame()
	var gameId = req.user.games.chess[gameIndex]

	client.get('game:'+gameId,function(err,gameString){
		if(err) console.log('error loading game')

		var game = JSON.parse(gameString)
		pieces = game.data

		var playerColour = 1
		var opponent = game.first
		var hasTurn = 'false'

		if(game.first == req.user.username){
			playerColour = 0
			opponent = game.second

			if(game.second == req.user.username)
				playerColour = game.turn
		}
		
		if(playerColour == game.turn)
			hasTurn = 'true'

		return res.render('chess.jade',{
			pieces:pieces,
			playerColour:playerColour,
			hasTurn:hasTurn,
			user:req.user.username,
			opponent:opponent
		})
	})
}
exports.post = function(req, res){
	var move = req.body.movement + ""
	var moveFrom = (move[0]+move[1]) 
	var moveTo = (move[2]+move[3])

	var movingPiece = null
	for(var i=0; i<pieces.length; i++){
		var currTile = pieces[i].location
		if(currTile == moveFrom)
			movingPiece = pieces.splice(i,1)[0]
	}
	if(movingPiece == null)
		return res.redirect('/chess')

	movingPiece.location = moveTo
	for(var i=0; i<pieces.length; i++){
		var currTile = pieces[i].location
		if(currTile == moveTo){
			pieces[i] = movingPiece
			movingPiece = null
		}
	}
	if(movingPiece != null)
		pieces.push(movingPiece)

	return game.saveGame(res, req.user, pieces, 'chess')
}
