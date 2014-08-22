var columns = ['a','b','c','d','e','f','g','h']
var rows = ['1','2','3','4','5','6','7','8']
var moveOptions = []

var practice = 0
var turn = 0
var victor = -1

var moveFrom = ""
var moveTo = ""

$(document).ready(function(){
	$("#submitButton").click(function(event){
		submitMove(moveFrom, moveTo)
		moveFrom = ""
		moveTo = ""
	})
})
function setTurnData(t, p, v){
	practice = p
	turn = t
	victor = v
}

function selectionCheck(){
	hideSubmitButton()

	$(".tile").click(function(event){
		var tile = $(this)[0].id

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
			$('#'+tile + 'background').css('backgroundColor','rgb(150,150,255)')
		}
		else if(moveTo != "" && moveOptions.indexOf(tile) != -1){
			select1(moveFrom)
			select2(tile)
		}

		if(moveFrom != "" && moveTo != "")
			showSubmitButton()
		else
			hideSubmitButton()
	})
	function select1(tile){
		console.log(turn)
		console.log($('#playerColour').attr('value'))

		if($('#' + tile).html() == "")
			return
		if((turn != $('#playerColour').attr('value')) && !practice)
			return
		if(victor > -1)
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
		$('#' + tile + 'background').css('backgroundColor', 'rgb(255,100,100')
	}
	function select2(tile){
		if(moveOptions.indexOf(tile) == -1)
			return

		moveTo = tile
		$('#' + tile + 'background').css('backgroundColor', 'rgb(100,100,255)')

		$('#moveData').attr('value',(moveFrom + moveTo))
	}
	function setBackgrounds(){
		moveOptions = []
		for(var i=0; i<columns.length; i++){
			for(var j=0; j<rows.length; j++){
				$("#" + columns[i] + rows[j] + "background").css('backgroundColor', 'transparent')
			}
		}
	}
	function displayOptions(){
		for(var i=0; i<moveOptions.length; i++){
			$('#'+moveOptions[i] + 'background').css('backgroundColor','rgb(150,150,255)')
		}
	}
	function showSubmitButton(){
		$('#submitButton').css({'width':'120px','margin-left':'-60px'})
		setTimeout(function(){
			$('#submitButton').css({'color':'black'})
		},300)
	}
	function hideSubmitButton(){
		$('#submitButton').css({'color':'transparent'})
		setTimeout(function(){
			$('#submitButton').css({'width':'0px','margin-left':'0px'})
		},100)
	}
}
