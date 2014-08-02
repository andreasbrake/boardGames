exports.chess = function(){
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
						name:"queen",
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
						name:"king",
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
exports.ships = function(){
	var data = {
		ready1:0, 	// Player1 ready (setup finished)
		data1:[], 	// Player1 pieces
		shots1:[], 	// Player1 attempts
		ready2:0, 	// Player2 ready
		data2:[], 	// Player2 pieces
		shots2:[]	// Player2 attempts
	}

	var carrier = {
		name: 'carrier',
		location: ['a1','a2','a3','a4','a5','a6']
	}
	var battleship1 = {
		name: 'battleship',
		location: ['b1','b2','b3','b4']
	}
	var battleship2 = {
		name: 'battleship',
		location: ['c1','c2','c3','c4']
	}
	var submarine1 = {
		name: 'submarine',
		location: ['d1','d2','d3']
	}
	var submarine2 = {
		name: 'submarine',
		location: ['e1','e2','e3']
	}
	var patroller = {
		name: 'patroller',
		location: ['f1','f2']
	}

	data.data1 = [carrier,battleship1,battleship2,submarine1,submarine2,patroller]
	data.data2 = [carrier,battleship1,battleship2,submarine1,submarine2,patroller]

	return data
}