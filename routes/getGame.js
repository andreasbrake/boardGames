var gameIndex = -1
var client = require('../redisdb').client

exports.getList = function(req, res){
	var user = req.user
	client.get('user:'+user.username,function(err,userData){
		return res.render('getGame.jade',{games:JSON.parse(userData).games.chess.length})	
	})	
}
exports.selectGame = function(req, res){
	var user = req.user.username
	if(req.params.game == 'newGame'){
		client.get('user:'+user,function(err,userData){

			userJSON = JSON.parse(userData)
			gameIndex = userJSON.games.chess.length
			userJSON.games.chess.push(generateFreshMap())

			client.set('user:'+user,JSON.stringify(userJSON),function(err,rep){
				if(err) console.log('error saving game')
				return res.redirect('/chess')
			})
		})
	}
	else{
		gameIndex = req.params.game.split('game')[1]
		return res.redirect('/chess')
	}	

}
exports.saveGame = function(user, game){
	client.get('user:'+user, function(err, userData){

		var userJSON = JSON.parse(userData)
		userJSON.games.chess[gameIndex] = game

		client.set('user:'+user,JSON.stringify(userJSON),function(err,rep){
			if(err) console.log('error saving game')
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