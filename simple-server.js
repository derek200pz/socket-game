var express = require('express'),
    http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');


const verbose = true;
var users = 0;
var sprites = {};
var speed = 5;

//-------GLOBAL FUNCTIONS--------//

//create a sprite object.. very basic
var spriteFactory = function(num, imgstr) {
    return {
        "imgstr": imgstr,
        "id": num,
        "x": 0,
        "y": 0
    };
}

//change the coordinates of a sprite given a keycode (only works for arrow keys)
var updateSprite = function(sprite, keyCode) {
    if (keyCode == 37) {
        sprite.x -= speed;
    }
    if (keyCode == 38) {
        sprite.y -= speed;
    }
    if (keyCode == 39) {
        sprite.x += speed;
    }
    if (keyCode == 40) {
        sprite.y += speed;
    }
}

//------SERVER CALLBACKS---------//

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/game.html');
});


//--------SOCKET IO CALLBACKS--------//


//when a new user connects
io.on('connection', function(socket) {
    if (verbose) console.log('a user connected');
    const usernum = users;
    users++;

    //send the new user the current state of the room
    socket.emit('startstate', { sprites: sprites });

    //create and broadcase a new sprite for the new user
    fs.readFile(__dirname + '/img/delmar.png', function(err, buf) {
        if (err) {
            console.log("errorrrrrr");
            sprites[usernum] = spriteFactory(usernum, "iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAAUO3…EwbssA8SNZV6kenWu+B8lpST5+xEh2wAAAABJRU5ErkJggg==");
            io.sockets.emit('newsprite', { num: usernum, sprite: sprites[usernum] });
        } else {
            sprites[usernum] = spriteFactory(usernum, buf.toString('base64'));
            io.sockets.emit('newsprite', { num: usernum, sprite: sprites[usernum] });
        }
    });

    //when the user moves, move them
    socket.on('movekey', function(data) {
        updateSprite(sprites[usernum], data.keyCode);
        if (verbose) console.log("moved a sprite, usernum = " + usernum);
        io.sockets.emit('movement', { num: usernum, newcoords: { x: sprites[usernum].x, y: sprites[usernum].y } });
    });

    //when the user leaves, delete them
    socket.on('disconnect', function() {
        if (verbose) console.log('A user disconnected');
        io.sockets.emit("deletesprite", { num: usernum });
        delete sprites[usernum];
    });
});




app.get('/*', function(req, res, next) {

    //For debugging, we can track what files are requested
    if (verbose) console.log('\t :: Express :: file requested : ' + file);

    //This is the current file they have requested
    var file = req.params[0];

    //Send the requesting client the file
    res.sendFile(__dirname + '/' + file);

});


//listen
server.listen(process.env.PORT || 8080);