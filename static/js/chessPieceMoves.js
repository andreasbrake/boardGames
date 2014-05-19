function pawnMove(tile, colour){
	var col = tile[0]
	var row = parseInt(tile[1])
	var colIndex = columns.indexOf(col)
	var possibilities = []

	if(colour == 0){
		if(row < 8){
			var forward = columns[colIndex] + (row+1)
			var twice 	= columns[colIndex] + (row+2)
			if(colIndex < 7) var topRight = columns[colIndex+1] + (row+1)
			else var topRight = ""
			if(colIndex > 0) var topLeft = columns[colIndex-1] + (row+1)
			else var topLeft = ""

			if($('#'+forward).html() == "")
				possibilities.push(forward)
			if(row == 2 && $('#'+twice).html() == "")
				possibilities.push(twice)
			if(topRight != ""){
				if($('#'+topRight).html() != "" && $('#'+topRight+'colour').html() != colour)
					possibilities.push(topRight)
			}
			if(topLeft != ""){
				if($('#'+topLeft).html() != "" && $('#'+topLeft+'colour').html() != colour)
					possibilities.push(topLeft)
			}
		}
	}
	else{
		if(row > 0){
			var forward = columns[colIndex] + (row-1)
			var twice 	= columns[colIndex] + (row-2)
			if(colIndex < 7)
				var topRight = columns[colIndex+1] + (row-1)
			else
				var topRight = ""
			if(colIndex > 0)
				var topLeft = columns[colIndex-1] + (row-1)
			else
				var topLeft = ""

			if($('#'+forward).html() == "")
				possibilities.push(forward)
			if(row == 7 && $('#'+twice).html() == "")
				possibilities.push(twice)
			if(topRight != ""){
				if($('#'+topRight).html() != "" && $('#'+topRight+'colour').html() != colour)
					possibilities.push(topRight)
			}
			if(topLeft != ""){
				if($('#'+topLeft).html() != "" && $('#'+topLeft+'colour').html() != colour)
					possibilities.push(topLeft)
			}
		}
	}

	for(var i=0; i<possibilities.length; i++){
		nextTile = possibilities[i]
		if($('#'+nextTile).html() == "" || $('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
}
function rookMove(tile, colour){
	var col = tile[0]
	var row = parseInt(tile[1])
	getUp(col, row)
	getDown(col,row)
	getLeft(col,row)
	getRight(col,row)

	// up
	function getUp(col, row){
		if(row > 8)
			return

		var nextTile = col + (row+1)
		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getUp(col, row+1)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
	// down
	function getDown(col, row){
		if(row < 1)
			return

		var nextTile = col + (row-1)
		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getDown(col, row-1)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
	// left
	function getLeft(col, row){
		var colIndex = columns.indexOf(col)
		if(colIndex == 0)
			return

		var nextTile = columns[colIndex-1] + row
		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getLeft(columns[colIndex-1], row)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
	// right
	function getRight(col, row){
		var colIndex = columns.indexOf(col)
		if(colIndex == 7)
			return

		var nextTile = columns[colIndex+1] + row
		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getRight(columns[colIndex+1], row)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
}
function knightMove(tile, colour){
	var col = tile[0]
	var row = parseInt(tile[1])
	
	var colIndex = columns.indexOf(col)
	var possibilities = [
			columns[colIndex+1]+(row+2),
			columns[colIndex-1]+(row+2),
			columns[colIndex+1]+(row-2),
			columns[colIndex-1]+(row-2),
			columns[colIndex+2]+(row+1),
			columns[colIndex-2]+(row+1),
			columns[colIndex+2]+(row-1),
			columns[colIndex-2]+(row-1)
		]

	for(var i=0; i<possibilities.length; i++){
		var nextTile = possibilities[i]

		if($('#'+nextTile).html() == "" || $('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
}
function bishopMove(tile, colour){
	var col = tile[0]
	var row = parseInt(tile[1])
	getUpLeft(col, row)
	getDownLeft(col,row)
	getUpRight(col,row)
	getDownRight(col,row)

	// up-left
	function getUpLeft(col, row){
		if(row > 8)
			return

		var colIndex = columns.indexOf(col)

		if(colIndex == 0)
			return

		var nextTile = columns[colIndex-1] + (row+1)

		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getUpLeft(columns[colIndex-1] , row+1)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
	// down
	function getDownLeft(col, row){
		if(row < 1)
			return

		var colIndex = columns.indexOf(col)

		if(colIndex == 0)
			return

		var nextTile = columns[colIndex-1] + (row-1)

		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getDownLeft(columns[colIndex-1], row-1)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
	// left
	function getUpRight(col, row){
		if(row > 8)
			return

		var colIndex = columns.indexOf(col)

		if(colIndex == 7)
			return

		var nextTile = columns[colIndex+1] + (row+1)

		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getUpRight(columns[colIndex+1], row+1)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
	// right
	function getDownRight(col, row){
		if(row < 1)
			return

		var colIndex = columns.indexOf(col)

		if(colIndex == 7)
			return

		var nextTile = columns[colIndex+1] + (row-1)

		if($('#'+nextTile).html() == ""){
			moveOptions.push(nextTile)
			getDownRight(columns[colIndex+1], row-1)
		}
		else if($('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
}
function kingMove(tile, colour){
	var col = tile[0]
	var row = parseInt(tile[1])
	
	var colIndex = columns.indexOf(col)
	var possibilities = [
			columns[colIndex]+(row+1),
			columns[colIndex]+(row-1),
			columns[colIndex+1]+(row),
			columns[colIndex-1]+(row),
			columns[colIndex+1]+(row+1),
			columns[colIndex-1]+(row+1),
			columns[colIndex+1]+(row-1),
			columns[colIndex-1]+(row-1)
		]

	for(var i=0; i<possibilities.length; i++){
		var nextTile = possibilities[i]

		if($('#'+nextTile).html() == "" || $('#'+nextTile+'colour').html() != colour)
			moveOptions.push(nextTile)
	}
}
function queenMove(tile, colour){
	rookMove(tile, colour)
	bishopMove(tile, colour)
}