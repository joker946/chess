var socket = io.connect('http://localhost:8080');
//Board creating
function CreateBoard (boardHeight, boardWidth) {
	var board = $('#board');
	for (var i = 0; i < boardHeight; i++) {
		for (var j = 0; j < boardWidth; j++) {
			if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
				board.append ($('<div class="lightCell"> </div>').attr("x",i).attr("y",j));
			} else {
				board.append ($('<div class="darkCell"> </div>').attr("x",i).attr("y",j));
            }
		}
	}
}

function Insert (x,y,figure) {
    $('[x='+x+']'+'[y='+y+']').append(figure);//$([x=''][y=''])
}

//Figures dotting
function Dotting () {
    cell = $('.darkCell, .lightCell');

    //pawns
    var blackPawn = '<img color="black" type="pawn" isFirstMove="true" src="'+pathToDark+' P.ico">';
    var whitePawn = '<img color="white" type="pawn" isFirstMove="true" src="'+pathToLight+' P.ico">';
    //rooks
    var blackRook = '<img color="black" type="rook" src="' + pathToDark + ' R.ico">';
    var whiteRook = '<img color="white" type="rook" src="' + pathToLight + ' R.ico">';
    //knights
    var blackKnight = '<img color="black" type="knight" src="' + pathToDark + ' N.ico">';
    var whiteKnight = '<img color="white" type="knight" src="' + pathToLight + ' N.ico">';
    //bishops
    var blackBishop = '<img color="black" type="bishop" src="' + pathToDark + ' B.ico">';
    var whiteBishop = '<img color="white" type="bishop" src="' + pathToLight + ' B.ico">';
    //queens
    var blackQueen = '<img color="black" type="queen" src="' + pathToDark + ' Q.ico">';
    var whiteQueen = '<img color="white" type="queen" src="' + pathToLight + ' Q.ico">';
    //kings
    var blackKing = '<img color="black" type="king" src="' + pathToDark + ' K.ico">';
    var whiteKing = '<img color="white" type="king" src="' + pathToLight + ' K.ico">';

    for (var i = 0; i < 64; i++) {
        cell.eq(i).attr('id',i);         //putting id to cells
    }

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            //pawns
            if (i == 1) {
                Insert(i,j,blackPawn);
            } else if (i == 6) {
                Insert (i,j,whitePawn);
            }
            //first row
            else if (i == 0) {
                if (j == 0 || j == 7)  {
                    Insert(i,j, blackRook);
                }
                else if (j == 1 || j == 6) {
                    Insert(i,j,blackKnight);
                }
                else if (j == 2 || j == 5) {
                    Insert (i, j, blackBishop);
                }
                else if (j == 3) {
                    Insert (i, j, blackQueen);
                } else if (j == 4) {
                    Insert(i,j,blackKing);
                }
            }
            //eigth row
            else if (i == 7) {
                if (j == 0 || j == 7)  {
                    Insert(i,j, whiteRook);
                }
                else if (j == 1 || j == 6) {
                    Insert(i,j,whiteKnight);
                }
                else if (j == 2 || j == 5) {
                    Insert (i, j, whiteBishop);
                }
                else if (j == 3) {
                    Insert (i, j, whiteQueen);
                } else if (j == 4) {
                    Insert(i,j,whiteKing);
                }
            }
        }
    }
}

function IsEmpty (cell) {
    if ($(cell).find('img').length == 0) return true;
    return false;
};
$(function() {
    $('#accept').click(function () {
        var message = {
            userid:$('#namebox').val(),
            roomid:$('#roombox').val()
        }
        $('#roombox').val('');
        $('#namebox').val('');
        socket.emit('auth', message);
    });
    $('#reset').click(function () {
    	socket.emit('reset_board', 'reset');
    	location.reload();
    });
});
socket.on('finish', function(message){
    $('#menu_elements').append('<br>'+ message);
});
socket.on('step', function(cx, cy, fx, fy){
    var figure = $('[x='+fx+']'+'[y='+fy+']').children();
	if (cx!=-1){
    	var c = $('[x='+cx+']'+'[y='+cy+']')
    	changeColor();
    	$(figure).parent().removeClass('checked');
    	$(c).empty();
    	$(c).append(figure);
    	$('[x=' + fx + ']' + '[y=' + fy + ']').empty();
        $('#menu_elements').append('<br>' + cx + ' ' + cy + ' ' + fx + ' ' + fy);
	}else{
		$(figure).parent().removeClass('checked');
	}
});
var Color;
socket.on('start', function(mes){
	console.log(mes);
	Color=mes;
});
function Move (figure) {
	//if ($(figure).attr('color')==activeColor.current && Color==activeColor.current){
        if ($(figure).attr('color')==activeColor.current){
    	$(figure).parent().toggleClass('checked');		
    	cell.unbind('click').click(function() {//this - cell
			var fx = $(figure).parent().attr('x');
			var fy = $(figure).parent().attr('y');
			var cx = $(this).attr('x');
			var cy = $(this).attr('y');
			if (fx!==undefined && fy!==undefined){
    			if (IsEmpty(this)){
    				console.log(cx+' '+cy+' '+fx+' '+fy);
    				socket.emit('step', cx,cy,fx,fy);
    				figure=null;
    			}
    			else if ($(this).children().attr('color')!=activeColor.current && $(this).children().length!=0){
    				socket.emit('step', cx, cy, fx, fy);
    				figure=null;
    			}else{
    				$(figure).parent().toggleClass('checked');
    			}
			}
    	});
    }
}

var activeColor = {
	black:"black",
	white:"white",
	current:"white",
	enemy:"black"
	};
function changeColor() {
	if (activeColor.current==activeColor.white){
		activeColor.current=activeColor.black;
		activeColor.enemy=activeColor.white;
	}else{
		activeColor.current=activeColor.white;
		activeColor.enemy=activeColor.black;
	}
}
pathToLight = 'figures/light/White';
pathToDark = 'figures/dark/Black';
$(document).ready(function () {
	CreateBoard (8,8);
	Dotting();
    figure ='img'; //клик только по белым
    $('#board').on('click', figure, function(){
        clFigure = this;        
        Move(clFigure);
	});
});