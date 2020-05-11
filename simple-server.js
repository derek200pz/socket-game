var express = require('express'),
    http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
//my own files
var tools = require('./server-js/tools'); //some functions to do sprite manipulation and game logic
var images = require('./json/images.json'); //all images in the img folder, converted into base64 strings because heroku was being a butt

const verbose = true;
var users = 0;
var sprites = {};
var speed = 5;

//------SERVER CALLBACKS---------//

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/game.html');
});

app.get('/*', function(req, res, next) {

    //For debugging, we can track what files are requested
    if (verbose) console.log('\t :: Express :: file requested : ' + file);

    //This is the current file they have requested
    var file = req.params[0];

    //Send the requesting client the file
    res.sendFile(__dirname + '/' + file);

});

//--------SOCKET.IO CALLBACKS--------//


//when a new user connects
io.on('connection', function(socket) {
    if (verbose) console.log('a user connected');
    const usernum = users;
    users++;

    //send the new user the current state of the room
    socket.emit('startstate', { sprites: sprites, usernum: usernum });

    //create and broadcase a new sprite for the new user
    sprites[usernum] = tools.spriteFactory(usernum);
    io.sockets.emit('newsprite', { num: usernum, sprite: sprites[usernum] });

    //when the user moves, tell everyone else
    socket.on('imoved', function(data) {
        sprites[usernum].x = data.newcoords.x;
        sprites[usernum].y = data.newcoords.y;
        sprites[usernum].display = data.display;
        if (verbose) console.log("moved a sprite, usernum = " + usernum);
        io.sockets.emit('theymoved', { num: usernum, display: sprites[usernum].display, newcoords: { x: sprites[usernum].x, y: sprites[usernum].y } });
    });

    //when the user leaves, delete them
    socket.on('disconnect', function() {
        if (verbose) console.log('A user disconnected');
        io.sockets.emit("deletesprite", { num: usernum });
        delete sprites[usernum];
    });
});


console.log("listening on port 8080")
    //listen
server.listen(process.env.PORT || 8080);