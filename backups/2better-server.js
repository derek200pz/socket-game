console.log("\n\nI'm Derek's server!\nI belong to him.\nHe is my father.\nI worship him.\nEvery whim is act on is his!\nI am his to command!\nI love you father.\n\n");

//should the server talk a lot?
var verbose = true;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = 0;
var sprites = [];

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




//actual server stuff
app.get('/', function(req, res){
	res.sendFile(__dirname + '/game2.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('movekey', function(data) {
		updateSprite(sprite1, data.keyCode);
	//	console.log({num: usernum - 1, sprite: sprites[usernum - 1]});
		io.sockets.emit('movement',{sprite: sprite1});
	});

	socket.on('disconnect', function (){
		console.log('A user disconnected');
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
