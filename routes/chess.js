var client = require('../redisdb').client
var game = require('./getGame.js')

var pieces = []

exports.get = function(req,res){
	var gameIndex = game.loadGame()
	var user = req.user.username
	client.get('user:'+user,function(err,savedUser){
		if(err) console.log('error loading game')
		var savedGames = JSON.parse(savedUser).games.chess
		
		pieces = savedGames[gameIndex]

		return res.render('chess.jade',{pieces:pieces})
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

	game.saveGame(req.user.username, pieces)
	return res.redirect('/chess')
}
