console.log("About to get all the variables ready")

//variables

var canv;
var sprite1 = {
	color: "red",
	id: "foo",
	x: 0,
	y: 0,
	width: 10,
	height: 10
};
//functions

var draw = function(sprite, ctx){
	ctx.beginPath();
	ctx.fillStyle = sprite.color;
	ctx.rect(sprite.x, sprite.y, sprite.width, sprite.height);
	ctx.fill();
}

var clearCanvas = function(ctx){
	ctx.clearRect(0,0,canv.clientWidth, canv.clientHeight);
}

//after the DOM is ready

$( document ).ready(function(){
	var socket = io.connect();
	canv = document.getElementById("canvas");
	var ctx = canv.getContext("2d");
	
	//Now we can listen for that event
	
	socket.on('connect', function() {
		//Note that the data is the object we sent from the server, as is. So we can assume its id exists.
		console.log( 'Connected successfully to the socket.io server. I\'m the client!');
		
		var keys = {};
		window.onkeyup = function(e) { keys[e.keyCode] = false; }
		window.onkeydown = function(e) { keys[e.keyCode] = true; }


		$( document ).on("keydown", function(evt){
			socket.emit('movekey', {keyCode: evt.keyCode});
		})
		
		socket.on('movement', function(data){
			sprite1 = data.sprite;
			clearCanvas(ctx);
			draw(sprite1, ctx);
		});

	});

});
