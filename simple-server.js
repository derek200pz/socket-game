const express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/game.html');
});

app.listen(process.env.PORT || 8080);