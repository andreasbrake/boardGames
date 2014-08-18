var currentPiece = null

$(document).ready(function(){
    $(".floating-piece").click(function(){
        if(currentPiece != null && $(this)[0].style.opacity != "0")
            $("#" + currentPiece.id)[0].style.opacity = "1"

        currentPiece = shipPieces[currentPiece.name]
        $(this)[0].style.opacity = "0"
    })
    $(".placed-piece").click(function(){
        if(gameStatus != "preparing")
            return
        if(currentPiece != null)
            $("#" + currentPiece.id[0].style.opacity = "0"
        var pieceType = $(this)[0].class.split[1]
        currentPiece = shipPiece[pieceType]
        eliminatePieces($(this)[0].id, pieceType)       
    })
    $(".tile").hover(function(){
        if(currentPiece == null)
            return
        cyclePiece($(this), "mask")
    })
    $(".tile").click(function(){
        if(currentPiece == null || !cyclePiece($(this), "valid"))
            return
        cyclePiece($(this), "place")
        currentPiece = null
    })

    function cyclePiece(tile, search){
        var currentPieceStart = tile.id
        var currentPieceEnd = ""
        if(currenPiece.orientation == 0){
            var row = tile.id.substr(0,1)
            var startCol = tile.id.substr(1,1)
            if(startCol + currentPiece.length > 9)
                return
            for(var i=0; i<currentPiece.length; i++){
                var tileId = "#" +row + "" + (startCol + i)
                if(search == "valid" && $(tileId)[0].innerHTML != "")
                    return false
                else if(search == "place")
                    $(tileId)[0].innerHTML = currentPiece.parts[i]
                if(search == "mask")
                    $(tileId)[0].style.background = "#777"
            }
            return true
        }
        else{
            var col = tile.id.substr(1,1)
            var startRow = tile.id.substr(1,1)
            if(startRow + currentPiece.length > 9)
                return
            for(var i=0; i<currentPiece.length; i++){
                var tileId = "#" + (startRow + i) + "" + col
                if(search == "valid" && $(tileId)[0].innerHTML != "")
                    return false
                else if(search == "place")
                    $(tileId)[0].innerHTML = currentPiece.parts[i]
                else if(search == "mask")
                    $(tileId)[0].style.background = "#777"
            }
            return true
        }
    }
    function elimintatePieces(spot, piece){
        var row = spot.substr(0,1)
        var col = spot.substr(1,1)

        for(var i=0; i<9; i++){
            if($("#" + row + "" + i)[0].innerHTML == piece){
                $("#" + row + "" + i)[0].innerHTML = ""
                $("#" + row + "" + i)[0].class = ""
            }
            if($("#" + i + "" + col)[0].innerHTML == piece){
                $("#" + i + "" + col)[0].innerHTML = ""
                $("#" + i + "" + col)[0].class = ""
            }a   
        }
    }
})
