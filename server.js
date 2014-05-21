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

var io = require('socket.io').listen(server);
io.set('log level', 0);

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
var n = 8, m = 8;
var mas = [];
var out = [];
function dot(){
	for (var i=0;i<n;i++){
		mas[i]=[];
	}
	mas[0][0] = new Cell(0,0,new Figure("b", "r"));
	mas[0][7] = new Cell(0,7,new Figure("b", "r"));
	mas[7][0] = new Cell(7,0,new Figure("w", "r"));
	mas[7][7] = new Cell(7,7,new Figure("w", "r"));
	mas[0][1] = new Cell(0,1,new Figure("b", "k"));
	mas[0][6] = new Cell(0,6,new Figure("b", "k"));
	mas[7][1] = new Cell(7,1,new Figure("w", "k"));
	mas[7][6] = new Cell(7,6,new Figure("w", "k"));
	mas[0][2] = new Cell(0,2,new Figure("b", "b"));
	mas[0][5] = new Cell(0,5,new Figure("b", "b"));
	mas[7][2] = new Cell(7,2,new Figure("w", "b"));
	mas[7][5] = new Cell(7,5,new Figure("w", "b"));
	mas[0][3] = new Cell(0,3,new Figure("b", "q"));
	mas[7][3] = new Cell(7,3,new Figure("w", "q"));
	mas[0][4] = new Cell(0,4,new Figure("b", "K"));
	mas[7][4] = new Cell(7,4,new Figure("w", "K"));
	for (var i=0;i<n;i++){
		mas[1][i] = new Cell(1,i,new Figure("b","p",'true'));
	}
	for (var i=0;i<n;i++){
		mas[6][i] = new Cell(6,i,new Figure("w","p",'true'));
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
	dot();
	toString();
	console.log(out);
}
ResetBoard();
function board(array, outarray){
	this.array = array;
	this.outarray = outarray;
	dot();
	toString();
	console.log(outarray);
}
/**
 * @return {string}
 * @return {string}
 */
function CanPawn(_cx, _cy, _fx, _fy, isf){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
    var movemax=isf;
	if (mas[fx][fy].child.color=='w'){
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
        else if (((fx-1==cx && fy+1==cy)||(fx-1==cx && fy-1==cy))&&mas[cx][cy].child.color=='b'){
            return true;
        }
	}
    else if (mas[fx][fy].child.color=='b'){
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
        else if (((fx+1==cx && fy+1==cy)||(fx+1==cx && fy-1==cy))&&mas[cx][cy].child.color=='w'){
            return true;
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
	else if (canMove&&canAttack) return true;
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
	else if (canMove&&canAttack) return true;
	else if (canMove) return true;
}
function CanQueenStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if (CanBishopStep(cx, cy, fx, fy)==true || CanRookStep(cx, cy, fx, fy)==true)return true;
	return false;
}
function CanKingStep(_cx,_cy,_fx,_fy){
	var cx = parseInt(_cx);
	var cy = parseInt(_cy);
	var fx = parseInt(_fx);
	var fy = parseInt(_fy);
	if ((mas[cx][cy].child.color==activeColor.enemy.charAt(0))&&
	   ((fx-cx==1&&fy-cy==0)||
		(fx-cx==1&&fy-cy==-1)||
		(fx-cx==0&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==-1)||
		(fx-cx==-1&&fy-cy==0)||
		(fx-cx==-1&&fy-cy==1)||
		(fx-cx==0&&fy-cy==1)||
		(fx-cx==1&&fy-cy==1))){
		return true;
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

var rooms = [];
function Room(id) {
	this.player1=null;
	this.player2=null;
	this.roomid=id;
};
var k=1;
io.sockets.on('connection', function(socket) {
	if (k%2==0){
		socket.join('room'+(k-1));
		socket.broadcast.in('room'+(k-1)).emit('start','white');
		socket.emit('start','black');
		k++;
	}else{
		socket.join('room'+k);
		k++;
	}
	/*socket.on('step', function(cx,cy,fx,fy){
		socket.broadcast.in('room'+k).emit('step',cx,cy,fx,fy);
	});*/
	socket.on('auth', function(message){
		if (rooms[message.roomid]===undefined){
			var session = new Room(message.roomid);
			session.player1=message.userid;
        	rooms[message.roomid]=session;
        }else if (rooms[message.roomid].player2===null){
        	rooms[message.roomid].player2=message.userid;
        }else{
        	socket.emit('error_room_is_full', 'Room is full. Please, select another one.');
        }
        console.log(rooms[message.roomid]);
	});
	socket.on('reset_board', function(message){
		if (message.m=='reset'){
			ResetBoard();
		}
	});
	socket.on('step', function(cx,cy,fx,fy){
	var signature = mas[fx][fy].child.color+''+mas[fx][fy].child.type;
        var result;
		if (signature=="wk"||signature=="bk"){
			result = CanKnightStep(cx,cy,fx,fy);
		}
		if (signature=="wp"||signature=="bp"){
            if (mas[fx][fy].child.isFirstMove=='true') {
                result = CanPawn(cx,cy,fx,fy, 2);
            }else{
                result = CanPawn(cx,cy,fx,fy, 1);
            }
		}
		if (signature=="wr"||signature=="br"){
			result = CanRookStep(cx,cy,fx,fy);
		}
		if (signature=="wb"||signature=="bb"){
			result = CanBishopStep(cx,cy,fx,fy);
		}
		if (signature=="wq"||signature=="bq"){
			result = CanQueenStep(cx, cy, fx, fy);
		}
		if (signature=="wK"||signature=="bK"){
			result = CanKingStep(cx, cy, fx, fy);
		}
		if (result==true){//если можем пойти
		    mas[fx][fy].child.isFirstMove='false';
			Move(cx,cy,fx,fy);
			console.log(out);
			io.sockets.emit('step', cx, cy, fx, fy);
		}else{// если не можем
			io.sockets.emit('step', -1, -1, fx, fy);
		}
		
	});
});