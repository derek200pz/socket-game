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
var delmar = "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"

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
            sprites[usernum] = spriteFactory(usernum, delmar);
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