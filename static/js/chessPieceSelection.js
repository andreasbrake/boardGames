var columns = ['a','b','c','d','e','f','g','h']
var rows = ['1','2','3','4','5','6','7','8']
var moveOptions = []

var practice = 0
var turn = 0

var moveFrom = ""
var moveTo = ""

$(document).ready(function(){
	$("#submitButton").click(function(event){
		submitMove(moveFrom, moveTo)
		moveFrom = ""
		moveTo = ""
	})
})
function setTurnData(t, p){
	practice = p
	turn = t
}

function selectionCheck(){
	$('#submitButton').css('marginLeft','-1000')

	$(".tile").click(function(event){
		var tile = "" + event.currentTarget.id

		if(moveFrom == ""){
			select1(tile)
		}
		else if(moveFrom == tile){
			moveFrom = ""
			moveTo = ""
			setBackgrounds()
		}
		else if(moveFrom != "" && moveOptions.indexOf(tile) == -1){
			moveTo = ""
			select1(tile)
		}
		else if(moveTo == ""){
			select2(tile)
		}
		else if(moveTo == tile){
			moveTo = ""
			$('#'+tile).css('backgroundColor','rgb(150,150,255)')
		}
		else if(moveTo != "" && moveOptions.indexOf(tile) != -1){
			select1(moveFrom)
			select2(tile)
		}

		if(moveFrom != "" && moveTo != "")
			$('#submitButton').css('marginLeft','50')
		else
			$('#submitButton').css('marginLeft','-1000')
	})
	function select1(tile){
		console.log(turn)
		console.log($('#playerColour').attr('value'))

		if($('#' + tile).html() == "")
			return
		if((turn != $('#playerColour').attr('value')) && !practice)
			return
		if(($('#' + tile + 'colour').html() != $('#playerColour').attr('value')) && !practice)
			return

		setBackgrounds()

		var type = $('#' + tile + 'name').html()

		if(type == 'pawn')
			pawnMove(tile, $('#' + tile + 'colour').html())
		else if(type == 'rook')
			rookMove(tile, $('#' + tile + 'colour').html())
		else if(type == 'knight')
			knightMove(tile, $('#' + tile + 'colour').html())
		else if(type == 'bishop')
			bishopMove(tile, $('#' + tile + 'colour').html())
		else if(type == 'king')
			kingMove(tile, $('#' + tile + 'colour').html())
		else if(type == 'queen')
			queenMove(tile, $('#' + tile + 'colour').html())
		displayOptions()

		moveFrom = tile
		$('#' + tile).css('backgroundColor', 'rgb(255,100,100')
	}
	function select2(tile){
		if(moveOptions.indexOf(tile) == -1)
			return

		moveTo = tile
		$('#' + tile).css('backgroundColor', 'rgb(100,100,255)')

		$('#moveData').attr('value',(moveFrom + moveTo))
	}
	function setBackgrounds(){
		moveOptions = []
		for(var i=0; i<columns.length; i++){
			for(var j=0; j<rows.length; j++){
				var tileId = "#" + columns[i] + rows[j]
				if((i+j) % 2 == 0)
					$(tileId).css('backgroundColor', 'black')
				else
					$(tileId).css('backgroundColor', 'white')
			}
		}
	}
	function resetBackground(id){
		var colNum = columns.indexOf(id[0])
		var rowNum = rows.indexOf(id[1])
		var value = colNum + rowNum

		if(value % 2 == 0)
			$('#'+id).css('backgroundColor', 'black')
		else
			$('#'+id).css('backgroundColor', 'white')
	}
	function displayOptions(){
		for(var i=0; i<moveOptions.length; i++){
			$('#'+moveOptions[i]).css('backgroundColor','rgb(150,150,255)')
		}
	}
}