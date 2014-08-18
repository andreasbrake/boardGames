var columns = ['a','b','c','d','e','f','g','h']
var rows = ['1','2','3','4','5','6','7','8']
var moveOptions = []

$(document).ready(function(){
	var selectedTile = ""

	$('#submitButton').css('marginLeft','-1000')
	
	$(".tile").click(function(event){
		var tile = "" + event.currentTarget.id

		if(selectedTile == ""){
			select1(tile)
		}
		else if(selectedTile == tile){
			$('#' + selectedTile).css('backgroundColor', '')
			selectedTile = ""
		}
		else if(selectedTile != ""){
			$('#' + selectedTile).css('backgroundColor', '')
			select1(tile)
		}

		if(selectedTile != "")
			$('#submitButton').css('marginLeft','50')
		else
			$('#submitButton').css('marginLeft','-1000')
	})
	function select1(tile){
		if($('#hasTurn').attr('value') == 'false')
			return
		var table = tile.substring(2)
		console.log(table)
		if(table != "shots")
			return
		
		selectedTile = tile

		$('#shotData').attr('value',selectedTile.split('shots')[0])
		$('#' + tile).css('backgroundColor', 'rgb(255,100,100')
	}
})
