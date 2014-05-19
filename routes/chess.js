var rows = ['1','2','3','4','5','6','7','8']
var columns = ['a','b','c','d','e','f','g','h']

var pieces = []

exports.get = function(req,res){
	if(pieces.length == 0)
		generateFreshMap()

	return res.render('chess.jade',{pieces:pieces})
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

	return res.redirect('/chess')
}
function generateFreshMap(){
	/*	piece = {
			name: "",
			colour: 0,
			location: ""
		}
	*/

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
}