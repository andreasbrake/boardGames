var newsletter = require('./node_modules/newsletter/newsletter.js')

var game = require('./routes/getGame.js')
var chess = require('./routes/chess.js')

var io = null

exports.init = function(ioConnection){
	io = ioConnection
}
exports.createConnection = function(client){
	var clientCB = null

	console.log("io connection at: " + client.id)

	client.on('joinGame', function(data){
		console.log('joining game: ' + data.gameId)
		clientCB = createClient(client)
		console.log(clientCB)

		newsletter.sub(data.gameId, clientCB)
		game.getGame(data.gameId, function(game){
			console.log("VICTOR 1 = " + game.victor)
			if(game == null)
				console.log('null game')
			else{
				client.emit('gamePieces', { pieces: game.data, turn: game.turn, practice: game.practice, victor: game.victor })
			}
		})
	})
	client.on('saveGame', function(data){
		console.log('saving game..')
		chess.saveGame(data.game, data.from, data.to, function(updatedGame){
			console.log("VICTOR = " + updatedGame.victor)
			newsletter.pub(data.game, { pieces: updatedGame.data, turn: updatedGame.turn, practice: updatedGame.practice, victor: updatedGame.victor})
		})
	})
	client.on('disconnect', function(){
		console.log('disconnecting: ' + clientCB())
		newsletter.unsub(clientCB)
	})
}
function createClient(client){
	return function(updata, channel){ // updata = updated data
		var id = client.id
		console.log("getting data from: " + channel + " for " + id)
		if(channel != null)
			client.emit('gamePieces', updata)
		return id
	}
}