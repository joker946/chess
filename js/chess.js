var socket = io.connect('http://194.58.100.119');
//Board creating
function CreateBoard (boardHeight, boardWidth) {
	var board = $('#board');
	for (var i = 0; i < boardHeight; i++) {
		for (var j = 0; j < boardWidth; j++) {
			if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
				board.append ($('<div class="darkCell"> </div>').attr("x",i).attr("y",j));
			} else {
				board.append ($('<div class="lightCell"> </div>').attr("x",i).attr("y",j));
            }
		}
	}
}

function Insert (x,y,figure) {
    $('[x='+x+']'+'[y='+y+']').append(figure);//$([x=''][y=''])
}
function getCell (x,y){
	return $('[x='+x+']'+'[y='+y+']');
}
function getFigure (x,y){
	return $('[x='+x+']'+'[y='+y+']').children();
}
function Figure(color, type, isFirstMove){
	this.color = color;
	this.type = type;
	this.isFirstMove = isFirstMove;
}
function Cell(x,y, child){
	this.x=x;
	this.y=y;
	this.child=child;
	this.ifFree=false;
	child.parent = this;
	if (child.color==' '){
		this.isFree = true;
	}
}
var n = 8, m = 8;
var mas = [];
var out = [];
function dot(){
	for (var i=0;i<n;i++){
		mas[i]=[];
	}
	mas[0][0] = new Cell(0,0,new Figure("w", "r"));
	mas[0][7] = new Cell(0,7,new Figure("w", "r"));
	mas[7][0] = new Cell(7,0,new Figure("b", "r"));
	mas[7][7] = new Cell(7,7,new Figure("b", "r"));
	mas[0][1] = new Cell(0,1,new Figure("w", "k"));
	mas[0][6] = new Cell(0,6,new Figure("w", "k"));
	mas[7][1] = new Cell(7,1,new Figure("b", "k"));
	mas[7][6] = new Cell(7,6,new Figure("b", "k"));
	mas[0][2] = new Cell(0,2,new Figure("w", "b"));
	mas[0][5] = new Cell(0,5,new Figure("w", "b"));
	mas[7][2] = new Cell(7,2,new Figure("b", "b"));
	mas[7][5] = new Cell(7,5,new Figure("b", "b"));
	mas[0][3] = new Cell(0,3,new Figure("w", "q"));
	mas[7][3] = new Cell(7,3,new Figure("b", "q"));
	mas[0][4] = new Cell(0,4,new Figure("w", "K"));
	mas[7][4] = new Cell(7,4,new Figure("b", "K"));
	for (var i=0;i<n;i++){
		mas[1][i] = new Cell(1,i,new Figure("w","p",'true'));
	}
	for (var i=0;i<n;i++){
		mas[6][i] = new Cell(6,i,new Figure("b","p",'true'));
	}
	for (var i=2;i<6;i++){
		for (var j=0;j<m;j++){
			mas[i][j]= new Cell(i,j,new Figure(' ',' '));
		}
	}
}
function isEmpty(_x,_y){
	if (mas[_x][_y].child.color==' '){
		return true;
	}
	return false;
}
function Moves(cx,cy,fx,fy){
	mas[cx][cy].child = mas[fx][fy].child;
	mas[fx][fy].child = new Figure(' ',' ');
	toString();
}
function toString(){
	for (var i = 0; i < m; i++){
		out[i] = [];
	}
	for (var i=0;i<n;i++){
		for (var j=0;j<m;j++){
			out[i][j] = mas[i][j].child.color+''+mas[i][j].child.type;
		}
	}
}
function ResetBoard(){
	dot();
	toString();
	console.log(out);
}
ResetBoard();
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
            if (i == 6) {
                Insert(i,j,blackPawn);
            } else if (i == 1) {
                Insert (i,j,whitePawn);
            }
            //first row
            else if (i == 7) {
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
            else if (i == 0) {
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

function CanPawn(_cx, _cy, _fx, _fy, isf){
	var cx = parseInt(_cx);//3
	var cy = parseInt(_cy);//4
	var fx = parseInt(_fx);//1
	var fy = parseInt(_fy);//4
    var movemax=isf;
	if (mas[fx][fy].child.color=='b'){
		if (cy==fy){
			if (fx-cx<=movemax && fx-cx>0){
				while (fx>cx){
					fx--;
					if ((fx==cx)&&(fy==cy)&&isEmpty(fx,fy)){
						return true;
					}else if (!isEmpty(fx,fy)){
						return false;
					}
				}
			}
		}
        else if (((fx-1==cx && fy+1==cy)||(fx-1==cx && fy-1==cy))&&mas[cx][cy].child.color=='w'){
            return 'fire';
        }
	}
    else if (mas[fx][fy].child.color=='w'){
        if (cy==fy){
            if (cx-fx<=movemax&& cx-fx>0){
                while (cx>fx){
                    fx++;
                    if ((fx==cx)&&(fy==cy)&&isEmpty(fx,fy)){
                        return true;
                    }else if (!isEmpty(fx,fy)){
                        return false;
                    }
                }
            }
        }
        else if (((fx+1==cx && fy+1==cy)||(fx+1==cx && fy-1==cy))&&mas[cx][cy].child.color=='b'){
            return 'fire';
        }
    }
}
function CanRookStep(_cx, _cy, _fx, _fy) {
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	var foundFigure=false;
	var canMove = false;
	if (mas[cx][cy].child.color!=mas[fx][fy].child.color){
		if ((cy==fy)&&(cx!=fx)){
			if (cx>fx){
				while (cx>fx){
					fx++;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}else if (cx<fx) {
				while (cx<fx){
					fx--;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}
		}
		else if ((cy!=fy)&&(cx==fx)){
			if (cy>fy){
				while (cy>fy) {
					fy++;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}else if (cy<fy) {
				while (cy<fy){
					fy--;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}
		}
	}
	if (foundFigure)return false;
	else if (canMove) return true;
}
function CanKnightStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if ((((fx-1==cx)&&(fy+2==cy))||
		((fx+1==cx)&&(fy+2==cy))||
		((fx+2==cx)&&(fy+1==cy))||
		((fx+2==cx)&&(fy-1==cy))||
		((fx+1==cx)&&(fy-2==cy))||
		((fx-1==cx)&&(fy-2==cy))||
		((fx-2==cx)&&(fy-1==cy))||
		((fx-2==cx)&&(fy+1==cy)))&&mas[cx][cy].child.color!=mas[fx][fy].child.color) return true;
	return false;
}
function CanBishopStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	var foundFigure=false;
	var canMove = false;
	if (mas[cx][cy].child.color!=mas[fx][fy].child.color){
		if (cx<fx){
			if (cy>fy){
				while ((cx<fx)&&(cy>fy)){
					fy++;
					fx--;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}else if (cy<fy){
				while ((cx<fx)&&(cy<fy)){
					fx--;
					fy--;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}
		}else if (cx>fx){
			if (cy>fy){
				while ((cx>fx)&&(cy>fy)){
					fx++;
					fy++;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}else if (cy<fy){
				while ((cx>fx)&&(cy<fy)){
					fx++;
					fy--;
					if ((fx==cx)&&(fy==cy)){
						canMove=true;
					}
					else if (mas[fx][fy].child.color!=' '){
						foundFigure=true;
					}
				}
			}
		}
	}
	if (foundFigure)return false;
	else if (canMove) return true;
}
function CanQueenStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if ((CanBishopStep(cx, cy, fx, fy)==true || CanRookStep(cx, cy, fx, fy)==true)&&
		mas[cx][cy].child.color!=mas[fx][fy].child.color)return true;
	return false;
}
function CanKingStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if (((fx-cx==1&&fy-cy==0)||
		(fx-cx==1&&fy-cy==-1)||
		(fx-cx==0&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==0)||
		(fx-cx==-1&&fy-cy==1)||
		(fx-cx==0&&fy-cy==1)||
		(fx-cx==1&&fy-cy==1))&&mas[cx][cy].child.color!=mas[fx][fy].child.color) return true;
	return false;
}
function Shah(){
	var result;
	var blackKing=null;
	var whiteKing=null;
	for (var i=0;i<8;i++){
		for (var j=0;j<8;j++){
			if ((mas[i][j].child.color+''+mas[i][j].child.type)=='bK'){
				blackKing = mas[i][j];
			}
		}
	}
	for (var i=0;i<8;i++){
		for (var j=0;j<8;j++){
			if ((mas[i][j].child.color+''+mas[i][j].child.type)=='wK'){
				whiteKing = mas[i][j];
			}
		}
	}
	if (blackKing==null){
		return ('finish');
	}
	if (whiteKing==null){
		return ('finish');
	}
	for (var i=0;i<8;i++){
		for (var j=0;j<8;j++){
			if (mas[i][j].child.color=='w'){
				var signature = mas[i][j].child.color+''+mas[i][j].child.type;
				if (signature=='wp'){
					if (mas[i][j].child.isFirstMove=='true') {
            			result = CanPawn(blackKing.x,blackKing.y,i,j, 2);
        			}else{
            			result = CanPawn(blackKing.x,blackKing.y,i,j, 1);
        			}
        			if (result=='fire') return true;
				}
				if (signature=='wr'){
					result = CanRookStep(blackKing.x,blackKing.y,i,j);
				}
				if (signature=="wk"){
					result = CanKnightStep(blackKing.x,blackKing.y,i,j);
				}
				if (signature=="wb"){
					result = CanBishopStep(blackKing.x,blackKing.y,i,j);
				}
				if (signature=="wq"){
					result = CanQueenStep(blackKing.x,blackKing.y,i,j);
				}
				if (signature=="wK"){
					result = CanKingStep(blackKing.x,blackKing.y,i,j);
				}
				if (result==true){
					
					return 'black';
				}

			}
			if (mas[i][j].child.color=='b'){
				var signature = mas[i][j].child.color+''+mas[i][j].child.type;
				if (signature=='bp'){
					if (mas[i][j].child.isFirstMove=='true') {
            			result = CanPawn(whiteKing.x,whiteKing.y,i,j, 2);
        			}else{
            			result = CanPawn(whiteKing.x,whiteKing.y,i,j, 1);
        			}
        			if (result=='fire') return true;
				}
				if (signature=='br'){
					result = CanRookStep(whiteKing.x,whiteKing.y,i,j);
				}
				if (signature=="bk"){
					result = CanKnightStep(whiteKing.x,whiteKing.y,i,j);
				}
				if (signature=="bb"){
					result = CanBishopStep(whiteKing.x,whiteKing.y,i,j);
				}
				if (signature=="bq"){
					result = CanQueenStep(whiteKing.x,whiteKing.y,i,j);
				}
				if (signature=="bK"){
					result = CanKingStep(whiteKing.x,whiteKing.y,i,j);
				}
				if (result==true){
					
					return 'white';
				}
			}
		}
	}
	return false;
}
function CheckMate(color, cx, cy){
	var t=0;
	var result=false;
	var blackKing=null;
	var whiteKing=null;
	for (var i=0;i<8;i++){
		for (var j=0;j<8;j++){
			if ((mas[i][j].child.color+''+mas[i][j].child.type)=='bK'){
				blackKing = mas[i][j];
			}
		}
	}
	for (var i=0;i<8;i++){
		for (var j=0;j<8;j++){
			if ((mas[i][j].child.color+''+mas[i][j].child.type)=='wK'){
				whiteKing = mas[i][j];
			}
		}
	}
	if (blackKing==null){
		return ('White wins');
	}
	if (whiteKing==null){
		return ('Black wins');
	}
	for (var m=0;m<8;m++){
		for (var n=0;n<8;n++){
			if (color=='black'){
				var signature = mas[m][n].child.color+''+mas[m][n].child.type;
				if (signature=='bp'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							if (mas[m][n].child.isFirstMove=='true') {
            					result = CanPawn(i,j,m,n, 2);
        					}else{
            					result = CanPawn(i,j,m,n, 1);
        					}
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('pawn'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='br'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanRookStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('rook'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='bk'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanKnightStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Knight'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='bb'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanBishopStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Bishop'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='bq'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanQueenStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Queen'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='bK'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanKingStep(i,j,m,n);
        					if (result){
        						console.log(i+' '+j)
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							++t;
        							console.log('King'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
			}
			if (color=='white'){
				var signature = mas[m][n].child.color+''+mas[m][n].child.type;
				if (signature=='wp'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){

							if (mas[m][n].child.isFirstMove=='true') {
            					result = CanPawn(i,j,m,n, 2);
        					}else{
            					result = CanPawn(i,j,m,n, 1);
        					}
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('pawn'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='wr'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanRookStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('rook'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='wk'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanKnightStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Knight'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='wb'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanBishopStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Bishop'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='wq'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanQueenStep(i,j,m,n);
        					if (result){
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Queen'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
				if (signature=='wK'){
					for (var i=0;i<8;i++){
						for (var j=0;j<8;j++){
							result = CanKingStep(i,j,m,n);
        					if (result){
        						console.log(i+' '+j)
        						var temp = mas[i][j].child;
        						Moves(i,j,m,n);
        						if (Shah()){
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('King'+t);
        							Moves(m,n,i,j);
        							mas[i][j].child=temp;
        						}
        					}
						}
					}
				}
			}
		}
	}
	console.log(t);
	if (t==0){
		return true;
	}
	return false;
}
function isEmptys (cell) {
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
    	//location.reload();
    });
});
socket.on('mes', function(message){
    $('#menu_elements').append('<br>'+ message);
});
socket.on('finish', function(){
    alert('Game over');
    //location.reload();
    //socket.emit('reset_board', 'reset');
});
socket.on('step', function(ofx, fy, ocx, cy){
	var fx = fy;
	fy = ofx;
	var cx = cy;
	cy = ocx;
    var figure = $('[x='+fx+']'+'[y='+fy+']').children();
    var c = $('[x='+cx+']'+'[y='+cy+']')
    console.log(fx,fy,cx,cy);//4 1 4 3    1 4 3 4

	if ($(figure).attr('type')=="pawn"){
		if (getFigure(fx,fy).attr('isFirstMove')=='true'){
				result = CanPawn(cx, cy, fx, fy, 2);
				
			}else{
				result = CanPawn(cx, cy, fx, fy, 1);
			}
		}
		if ($(figure).attr('type')=="rook"){
			result = CanRookStep(cx, cy, fx, fy);
		}
		if ($(figure).attr('type')=="knight"){
			result = CanKnightStep(cx, cy, fx, fy);
		}
		if ($(figure).attr('type')=="bishop"){
			result = CanBishopStep(cx, cy, fx, fy);
		}
		if ($(figure).attr('type')=="queen"){
			result = CanQueenStep(cx, cy, fx, fy);
		}
		if ($(figure).attr('type')=="king"){
			result = CanKingStep(cx, cy, fx, fy);
		}
		if (result){
			getFigure(fx,fy).attr('isFirstMove', 'false');
			var c = $('[x='+cx+']'+'[y='+cy+']')
			changeColor();
			$(figure).parent().removeClass('checked');
			$(c).empty();
			$(c).append(figure);
			getCell(fx,fy).empty();
			Moves(cx,cy,fx,fy);
			
		}
});
var Color;
socket.on('start', function(mes){
	console.log(mes);
	Color=mes;
});
function Move (figure) {
	if ($(figure).attr('color')==activeColor.current && Color==activeColor.current){
        //if ($(figure).attr('color')==activeColor.current){
    	$(figure).parent().toggleClass('checked');		
    	cell.unbind('click').click(function() {//this - cell
			var fx = $(figure).parent().attr('x');
			var fy = $(figure).parent().attr('y');
			var cx = $(this).attr('x');
			var cy = $(this).attr('y');
			if (fx!==undefined && fy!==undefined){
    			if ((isEmptys(this))||($(this).children().attr('color')!=activeColor.current && $(this).children().length!=0)){
    				var result;
    				console.log(cx+' '+cy+' '+fx+' '+fy);
    				
    				if ($(figure).attr('type')=="pawn"){
    					if (getFigure(fx,fy).attr('isFirstMove')=='true'){
    						result = CanPawn(cx, cy, fx, fy, 2);
    						
    					}else{
    						result = CanPawn(cx, cy, fx, fy, 1);
    						
    					}
    				}
    				if ($(figure).attr('type')=="rook"){
    					result = CanRookStep(cx, cy, fx, fy);
    					
    				}
    				if ($(figure).attr('type')=="knight"){
    					result = CanKnightStep(cx, cy, fx, fy);
    					
    				}
    				if ($(figure).attr('type')=="bishop"){
    					result = CanBishopStep(cx, cy, fx, fy);
    					
    				}
    				if ($(figure).attr('type')=="queen"){
    					result = CanQueenStep(cx, cy, fx, fy);
    					
    				}
    				if ($(figure).attr('type')=="king"){
    					result = CanKingStep(cx, cy, fx, fy);
    					
    				}
    				if (result){
    					var t = mas[cx][cy].child;
    					Moves(cx,cy,fx,fy);
    					if (Shah()==activeColor.current){
    						Moves(fx,fy,cx,cy);
    						mas[cx][cy].child=t;
    						return;
    					}else{
    						Moves(fx,fy,cx,cy);
    						mas[cx][cy].child=t;
    					}
    					
    					var t = mas[cx][cy].child;
    					if (Shah()&& activeColor.current==Color){
    						Moves(cx,cy,fx,fy);
    						console.log('l');
    						if ((Shah()&& activeColor.current==Color)==false){
    							console.log('w');
    							
    							var c = $('[x='+cx+']'+'[y='+cy+']');
		    					getFigure(fx,fy).attr('isFirstMove', 'false');
		    					socket.emit('step', fy, fx, cy, cx);
		    					$(figure).parent().removeClass('checked');
		    					$(c).empty();
		    					$(c).append(figure);
		    					$('[x=' + fx + ']' + '[y=' + fy + ']').empty();
		    					
		    					if (Shah()){
	    							console.log('shah');
	    							alert("Shah!");
	    						}
		    					if (CheckMate(activeColor.enemy, cx, cy)){
		    						alert("Check Mate!");
		    						socket.emit('finish');
		    						console.log('finish sent');
		    						//location.reload();
		    					}
		    					changeColor();
								figure=null;
    						}else{
    							Moves(fx,fy,cx,cy);
    							mas[cx][cy].child=t;
    						}
    						
    					}else{
    						Moves(cx,cy,fx,fy);
	    					console.log(out);
	    					var c = $('[x='+cx+']'+'[y='+cy+']')
	    					getFigure(fx,fy).attr('isFirstMove', 'false');
	    					socket.emit('step', fy, fx, cy, cx);
	    					$(figure).parent().removeClass('checked');
	    					$(c).empty();
	    					$(c).append(figure);
	    					$('[x=' + fx + ']' + '[y=' + fy + ']').empty();
	    					if (Shah()){
	    						console.log('shah');
	    						alert("Shah!");
	    					}
	    					
	    					if (CheckMate(activeColor.enemy, cx, cy)){
	    						alert("Check Mate!");
	    						socket.emit('finish');
	    						console.log('finish sent');
	    						//location.reload();
	    					}
	    					changeColor();
							figure=null;
						}
    				}
    			}
    			$(figure).parent().removeClass('checked');
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