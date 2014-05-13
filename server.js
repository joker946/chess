var express = require('express');
var http = require('http');
var app = express();

// configuration settings for PORT
app.set('port', process.env.PORT || 80);

// configure routing
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.use("/js", express.static(__dirname+'/js'));
app.use("/style", express.static(__dirname+'/style'));
app.use("/figures", express.static(__dirname+'/figures'));

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express listening on port: " + app.get('port'));
});
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

var blackPawn =   new Figure("b", "p", 'true');
var whitePawn =   new Figure("w", "p", 'true');
var blackRook =   new Figure("b", "r");
var whiteRook =   new Figure("w", "r");
var blackKnight = new Figure("b", "k");
var whiteKnight = new Figure("w", "k");
var blackBishop = new Figure("b", "b");
var whiteBishop = new Figure("w", "b");
var blackQueen =  new Figure("b", "q");
var whiteQueen =  new Figure("w", "q");
var blackKing =   new Figure("b", "K");
var whiteKing =   new Figure("w", "K");
function Init(){
	blackPawn =   new Figure("b", "p", 'true');
	whitePawn =   new Figure("w", "p", 'true');
	blackRook =   new Figure("b", "r");
	whiteRook =   new Figure("w", "r");
	blackKnight = new Figure("b", "k");
	whiteKnight = new Figure("w", "k");
	blackBishop = new Figure("b", "b");
	whiteBishop = new Figure("w", "b");
	blackQueen =  new Figure("b", "q");
	whiteQueen =  new Figure("w", "q");
	blackKing =   new Figure("b", "K");
	whiteKing =   new Figure("w", "K");
}
var Zero = new Figure(' ',' ');
var n = 8, m = 8;
var mas = [];
var out = [];
function dot(){
	for (var i=0;i<n;i++){
		mas[i]=[];
	}
	mas[0][0] = new Cell(0,0,blackRook);
	mas[0][7] = new Cell(0,7,blackRook);
	mas[7][0] = new Cell(7,0,whiteRook);
	mas[7][7] = new Cell(7,7,whiteRook);
	mas[0][1] = new Cell(0,1,blackKnight);
	mas[0][6] = new Cell(0,6,blackKnight);
	mas[7][1] = new Cell(7,1,whiteKnight);
	mas[7][6] = new Cell(7,6,whiteKnight);
	mas[0][2] = new Cell(0,2,blackBishop);
	mas[0][5] = new Cell(0,5,blackBishop);
	mas[7][2] = new Cell(7,2,whiteBishop);
	mas[7][5] = new Cell(7,5,whiteBishop);
	mas[0][3] = new Cell(0,3,blackQueen);
	mas[7][3] = new Cell(7,3,whiteQueen);
	mas[0][4] = new Cell(0,4,blackKing);
	mas[7][4] = new Cell(7,4,whiteKing);
	for (var i=0;i<n;i++){
		mas[1][i] = new Cell(1,i,new Figure("b","p",'true'));
	}
	for (var i=0;i<n;i++){
		mas[6][i] = new Cell(6,i,new Figure("w","p",'true'));
	}
	for (var i=2;i<6;i++){
		for (var j=0;j<m;j++){
			mas[i][j]= new Cell(i,j,Zero);
		}
	}
}
function isEmpty(_x,_y){
	if (mas[_x][_y].child.color==' '){
		return true;
	}
	return false;
}
function Move(cx,cy,fx,fy){
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
	Init();
	dot();
	toString();
	console.log(out);
}
ResetBoard();

/**
 * @return {string}
 * @return {string}
 */
function CanPawn(_cx, _cy, _fx, _fy, color, isf){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
    var movemax=isf;
	if (color=='white'){
		if (cy==fy){
			if (fx-cx<=movemax && fx-cx>0){
				while (fx>cx){
					fx--;
					if ((fx==cx)&&(fy==cy)){
						return true;
					}else if (!isEmpty(fx,fy)){
						return false;
					}
				}
			}
		}
        else if ((fx-1==cx && fy+1==cy)||(fx-1==cx && fy-1==cy)){
            return "Fire";
        }
	}
    else if (color=='black'){
        if (cy==fy){
            if (cx-fx<=movemax&& cx-fx>0){
                while (cx>fx){
                    fx++;
                    if ((fx==cx)&&(fy==cy)){
                        return true;
                    }else if (!isEmpty(fx,fy)){
                        return false;
                    }
                }
            }
        }
        else if ((fx+1==cx && fy+1==cy)||(fx+1==cx && fy-1==cy)){
            return "Fire";
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
	var canAttack = false;
	if ((cy==fy)&&(cx!=fx)){
		if (cx>fx){
			while (cx>fx){
				fx++;
				if ((fx==cx)&&(fy==cy)){
					canMove=true;
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
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
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
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
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
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
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
				}
				else if (mas[fx][fy].child.color!=' '){
					foundFigure=true;
				}
			}
		}
	}
	if (foundFigure)return false;
	else if (canMove&&canAttack) return "Fire";
	else if (canMove) return true;
}
function CanKnightStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	console.log(cx+' '+cy+' '+fx+' '+fy);

	if (((fx-1==cx)&&(fy+2==cy))||
		((fx+1==cx)&&(fy+2==cy))||
		((fx+2==cx)&&(fy+1==cy))||
		((fx+2==cx)&&(fy-1==cy))||
		((fx+1==cx)&&(fy-2==cy))||
		((fx-1==cx)&&(fy-2==cy))||
		((fx-2==cx)&&(fy-1==cy))||
		((fx-2==cx)&&(fy+1==cy))) return true;
	return false;
}
function CanBishopStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	var foundFigure=false;
	var canMove = false;
	var canAttack = false;
	if (cx<fx){
		if (cy>fy){
			while ((cx<fx)&&(cy>fy)){
				fy++;
				fx--;
				if ((fx==cx)&&(fy==cy)){
					canMove=true;
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
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
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
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
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
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
					if (mas[fx][fy].child.color==activeColor.enemy.charAt(0)){
						canAttack=true;
					}
				}
				else if (mas[fx][fy].child.color!=' '){
					foundFigure=true;
				}
			}
		}
	}
	if (foundFigure)return false;
	else if (canMove&&canAttack) return "Fire";
	else if (canMove) return true;
}
function CanQueenStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if (CanBishopStep(cx, cy, fx, fy)=="Fire" || CanRookStep(cx, cy, fx, fy)=="Fire")return "Fire";
	if (CanBishopStep(cx, cy, fx, fy)==true || CanRookStep(cx, cy, fx, fy)==true)return true;
	return false;
}
function CanKingStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if ((mas[fx][fy].child.color==activeColor.enemy.charAt(0))&&((fx-cx==1&&fy-cy==0)||
		(fx-cx==1&&fy-cy==-1)||
		(fx-cx==0&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==0)||
		(fx-cx==-1&&fy-cy==1)||
		(fx-cx==0&&fy-cy==1)||
		(fx-cx==1&&fy-cy==1))){
		return "Fire";
	}
	if ((fx-cx==1&&fy-cy==0)||
		(fx-cx==1&&fy-cy==-1)||
		(fx-cx==0&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==0)||
		(fx-cx==-1&&fy-cy==1)||
		(fx-cx==0&&fy-cy==1)||
		(fx-cx==1&&fy-cy==1)) return true;
	return false;
}
var io = require('socket.io').listen(server);
io.set('log level', 0);
var rooms = {};
io.sockets.on('connection', function(socket) {
	socket.on('auth', function(message){
		rooms[message.roomid] = message.roomid;
        rooms[message.roomid][message.userid] = message.userid;
        console.log(rooms[message.roomid]+' '+rooms[message.roomid][message.userid]);
	});
	socket.on('reset_board', function(message){
		if (message.m=='reset'){
			ResetBoard();
		}
	});
	socket.on('sendMove', function(obj){
        var result;
		if (obj.type=="knight"){
			result = CanKnightStep(obj.x1,obj.y1,obj.x2,obj.y2);
		}
		if (obj.type=="pawn"){
            if (mas[obj.x2][obj.y2].child.isFirstMove=='true') {
                result = CanPawn(obj.x1, obj.y1, obj.x2, obj.y2, obj.ccolor, 2);
            }else{
                result = CanPawn(obj.x1, obj.y1, obj.x2, obj.y2, obj.ccolor, 1);
            }
		}
		if (obj.type=="rook"){
			result = CanRookStep(obj.x1, obj.y1, obj.x2, obj.y2);
		}
		if (obj.type=="bishop"){
			result = CanBishopStep(obj.x1, obj.y1, obj.x2, obj.y2);
		}
		if (obj.type=="queen"){
			result = CanQueenStep(obj.x1, obj.y1, obj.x2, obj.y2);
		}
		if (obj.type=="king"){
			result = CanKingStep(obj.x1, obj.y1, obj.x2, obj.y2);
		}
		if (result==true){
		    mas[obj.x2][obj.y2].child.isFirstMove='false';
			Move(obj.x1,obj.y1,obj.x2,obj.y2);
			console.log(out);
			activeColor.current=obj.ccolor;
			changeColor();
			obj.ccolor=activeColor.current;
		}
		obj.result=result;
		io.sockets.emit('moveFigure', obj);
		
	});
	
	socket.on('sendAttack', function(obj){
		var result;
		if (obj.type=="knight"){
			result = CanKnightStep(obj.x1,obj.y1,obj.x2,obj.y2);
			if (result){
				Move(obj.x1,obj.y1,obj.x2,obj.y2);
				console.log(out);
				activeColor.current=obj.ccolor;
				changeColor();
				obj.ccolor=activeColor.current;

			}
		}
        if (obj.type=="pawn"){
            if (mas[obj.x2][obj.y2].child.isFirstMove=='true') {
                result = CanPawn(obj.x1, obj.y1, obj.x2, obj.y2, obj.ccolor, 2);
            }else{
                result = CanPawn(obj.x1, obj.y1, obj.x2, obj.y2, obj.ccolor, 1);
            }
            if (result=="Fire"){
            	if (mas[obj.x2][obj.y2].child.hasOwnProperty('ifFirstMove'))
            		mas[obj.x2][obj.y2].child.isFirstMove='false';
                Move(obj.x1,obj.y1,obj.x2,obj.y2);
                console.log(out);
                activeColor.current=obj.ccolor;
				changeColor();
				obj.ccolor=activeColor.current;
            }
        }
        if (obj.type=="rook"){
        	result = CanRookStep(obj.x1, obj.y1, obj.x2, obj.y2);
        	if (result=="Fire"){
        		Move(obj.x1,obj.y1,obj.x2,obj.y2);
				console.log(out);
				activeColor.current=obj.ccolor;
				changeColor();
				obj.ccolor=activeColor.current;
        	}
        }
        if (obj.type=="bishop"){
        	result = CanBishopStep(obj.x1, obj.y1, obj.x2, obj.y2);
        	if (result=="Fire"){
        		Move(obj.x1,obj.y1,obj.x2,obj.y2);
				console.log(out);
				activeColor.current=obj.ccolor;
				changeColor();
				obj.ccolor=activeColor.current;
        	}
        }
        if (obj.type=="queen"){
        	result = CanQueenStep(obj.x1, obj.y1, obj.x2, obj.y2);
        	if (result=="Fire"){
        		Move(obj.x1,obj.y1,obj.x2,obj.y2);
				console.log(out);
				activeColor.current=obj.ccolor;
				changeColor();
				obj.ccolor=activeColor.current;
        	}
        }
        if (obj.type=="king"){
        	result = CanKingStep(obj.x1, obj.y1, obj.x2, obj.y2);
        	if (result=="Fire"){
        		Move(obj.x1,obj.y1,obj.x2,obj.y2);
				console.log(out);
				activeColor.current=obj.ccolor;
				changeColor();
				obj.ccolor=activeColor.current;
        	}
        }
        obj.result=result;
        io.sockets.emit('attackFigure', obj);

	});
});