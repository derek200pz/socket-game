const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
const verbose = true;

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

app.get('/*', function(req, res, next) {

    //For debugging, we can track what files are requested
    if (verbose) console.log('\t :: Express :: file requested : ' + file);

    //This is the current file they have requested
    var file = req.params[0];

    //Send the requesting client the file
    res.sendFile(__dirname + '/' + file);

});

app.listen(process.env.PORT || 8080);