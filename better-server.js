console.log("\n\nI'm Derek's server!\nI belong to him.\nHe is my father.\nI worship him.\nEvery whim is act on is his!\nI am his to command!\nI love you father.\n\n");

//should the server talk a lot?
var verbose = true;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var users = 0;
var sprites = {};

var speed = 5;

//global functions

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

//generate a random color hex code (of form #XXX)
var randomColor = function() {
    const hex = function(num) {
        if (num == 10) return "a";
        if (num == 11) return "b";
        if (num == 12) return "c";
        if (num == 13) return "d";
        if (num == 14) return "e";
        if (num == 15) return "f";
        else return num;
    }
    return "#" + hex(Math.floor(Math.random() * 16)) + hex(Math.floor(Math.random() * 16)) + hex(Math.floor(Math.random() * 16));
}




//serve the homepage
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/game.html');
    if (verbose) console.log('sending game.html');
});

/*
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
        }
        sprites[usernum] = spriteFactory(usernum, buf.toString('base64'));
        io.sockets.emit('newsprite', { num: usernum, sprite: sprites[usernum] });
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
});*/

//serve any other pages or files that might exist
app.get('/*', function(req, res, next) {

    //For debugging, we can track what files are requested
    if (verbose) console.log('\t :: Express :: file requested : ' + file);

    //This is the current file they have requested
    var file = req.params[0];

    //Send the requesting client the file
    res.sendFile(__dirname + '/' + file);

});

//ssshhhhh. listen.
http.listen(8080, function() {
    console.log('\tlistening on port 8080');
});