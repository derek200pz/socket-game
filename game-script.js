console.log("About to get all the variables ready")

//variables

var canv;
var ctx;
var sprites = [];

//functions

var draw = function(sprite){
	ctx.beginPath();
	ctx.fillStyle = sprite.color;
	ctx.rect(sprite.x, sprite.y, sprite.width, sprite.height);
	ctx.fill();
}

var clearCanvas = function(){
	ctx.clearRect(0,0,canv.clientWidth, canv.clientHeight);
}

var refreshCanvas = function(){	
	clearCanvas();
	$.each(sprites, function(i,sprite){
		draw(sprite);
	});
}

//after the DOM is ready

$( document ).ready(function(){
	var socket = io.connect();
	canv = document.getElementById("canvas");
	ctx = canv.getContext("2d");

	//Now we can listen for that event

	socket.on('connect', function() {
		//Note that the data is the object we sent from the server, as is. So we can assume its id exists.
		console.log( 'Connected successfully to the socket.io server. I\'m the client!');

		var keys = {};
		var moveUp = function(){socket.emit('movekey', {keyCode: 38});}
		var moveDown = function(){socket.emit('movekey', {keyCode: 40});}
		var moveRight = function(){socket.emit('movekey', {keyCode: 39});}
		var moveLeft = function(){socket.emit('movekey', {keyCode: 37});}
		window.onkeyup = function(e) { keys[e.keyCode] = false; }
		window.onkeydown = function(e) { keys[e.keyCode] = true; }

		$("#up-button").click(function(){
			moveUp();
		});

		$("#down-button").click(function(){
			moveDown();
		});

		$("#right-button").click(function(){
			moveRight();
		});

		$("#left-button").click(function(){
			moveLeft();
		});

		socket.on('startstate', function(data){
			sprites = data.sprites;
			refreshCanvas();

		});

		socket.on('newsprite', function(data){
			console.log(data);
			sprites[data.num] = (data.sprite);
			console.log(sprites);
			refreshCanvas();
		});

		$( document ).on("keydown", function(evt){
			socket.emit('movekey', {keyCode: evt.keyCode});
		})

		socket.on('movement', function(data){
			sprites[data.num] = data.sprite;
			refreshCanvas();
		});
		
		socket.on('deletesprite', function(data){
			delete sprites[data.num];
			refreshCanvas();

		});

	});

});
