var express = require('express');
var http = require('http');
var app = express();

// configuration settings for PORT
app.set('port', process.env.PORT || 8080);

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
	this.array = [];
	this.outarray = [];
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
					if ((fx==cx)&&(fy==cy)&&isEmpty(fx,fy)){
						return true;
					}else if (!isEmpty(fx,fy)){
						return false;
					}
				}
			}
		}
        else if (((fx-1==cx && fy+1==cy)||(fx-1==cx && fy-1==cy))&&mas[cx][cy].child.color=='b'){
            return 'fire';
        }
	}
    else if (mas[fx][fy].child.color=='b'){
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
        else if (((fx+1==cx && fy+1==cy)||(fx+1==cx && fy-1==cy))&&mas[cx][cy].child.color=='w'){
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
	if ((CanBishopStep(cx, cy, fx, fy)==true || CanRookStep(cx, cy, fx, fy)==true)&&mas[cx][cy].child.color!=mas[fx][fy].child.color)return true;
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('pawn'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('rook'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Knight'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Bishop'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Queen'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('King'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('pawn'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							//console.log('rook'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Knight'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Bishop'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('Queen'+t);
        							Move(m,n,i,j);
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
        						Move(i,j,m,n);
        						if (Shah()){
        							Move(m,n,i,j);
        							mas[i][j].child=temp;
        						}else{
        							t++;
        							console.log('King'+t);
        							Move(m,n,i,j);
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
		return ('White wins');
	}
	if (whiteKing==null){
		return ('Black wins');
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
					
					return true;
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
					
					return true;
				}
			}
		}
	}
	return false;
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
		if (message=='reset'){
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
		if (result==true || result=='fire'){//если можем пойти
		    mas[fx][fy].child.isFirstMove='false';
		    changeColor();
			Move(cx,cy,fx,fy);
			console.log(out);
			if (Shah()){
				console.log("Shah");
				io.sockets.in('room'+(k-2)).emit('finish', 'Шах!');
			}
			if (CheckMate(activeColor.enemy, cx,cy)==true){
				console.log("Mate!");
				io.sockets.in('room'+(k-2)).emit('finish', 'Шах и Мат!');
			}
			
			io.sockets.in('room'+(k-2)).emit('step', cx, cy, fx, fy);
		}else{// если не можем
			io.sockets.in('room'+(k-2)).emit('step', -1, -1, fx, fy);
		}
		
	});
});