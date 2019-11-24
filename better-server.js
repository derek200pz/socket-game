console.log("\n\nI'm Derek's server!\nI belong to him.\nHe is my father.\nI worship him.\nEvery whim is act on is his!\nI am his to command!\nI love you father.\n\n");

//should the server talk a lot?
var verbose = true;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = 0;
var sprites = {};

var speed = 5;
var sprite1 = {
        "color": "#f00",
        "id": "foo",
        "width": 10,
        "height": 10,
        "x": 0,
        "y": 0
};

//global functions

var spriteFactory = function(num, color, width, height){
	return {
        	"color": color,
        	"id": num,
        	"width": width,
        	"height": height,
        	"x": 0,
        	"y": 0
	};
}

var updateSprite = function(sprite, keyCode){	
	if(keyCode == 37){
                sprite.x-=speed;
        }
	if(keyCode == 38){
                sprite.y-=speed;
	}
        if(keyCode == 39){
                sprite.x+=speed;
        }
        if(keyCode == 40){
                sprite.y+=speed;
        }
}

var randomColor = function(){
	const hex = function(num){
		if(num == 10) return "a";
		if(num == 11) return "b";
		if(num == 12) return "c";
		if(num == 13) return "d";
		if(num == 14) return "e";
		if(num == 15) return "f";
		else return num;
	}
	return "#" + hex(Math.floor(Math.random()*16)) + hex(Math.floor(Math.random()*16)) + hex(Math.floor(Math.random()*16));
}




//actual server stuff
app.get('/', function(req, res){
	res.sendFile(__dirname + '/game.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	users++;
	const usernum = users;
	socket.emit('startstate', {sprites: sprites});
	sprites[usernum - 1] = spriteFactory(usernum, randomColor(), 10, 10);
	io.sockets.emit('newsprite', {num: usernum - 1, sprite: sprites[usernum - 1]});

	socket.on('movekey', function(data) {
		updateSprite(sprites[usernum - 1], data.keyCode);
		console.log({num: usernum - 1, sprite: sprites[usernum - 1]});
		io.sockets.emit('movement',{num: usernum - 1, sprite: sprites[usernum - 1]});
	});

	socket.on('disconnect', function (){
		console.log('A user disconnected');
		io.sockets.emit("deletesprite", {num: usernum - 1});
		delete sprites[usernum - 1];
	});
});

app.get( '/*' , function( req, res, next ) {

	//This is the current file they have requested
	var file = req.params[0];

	//For debugging, we can track what files are requested.
	if(verbose) console.log('\t :: Express :: file requested : ' + file);

	//Send the requesting client the file.
	res.sendFile( __dirname + '/' + file );

}); 

http.listen(8080, function(){
	console.log('\tlistening on port 8080');
});
