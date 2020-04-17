const express = require('express');
var app = express();

app.use(express.static(__dirname + '/static-site'));
app.get('/', (req, res) => {
	res.sendFile('index.html');
});
app.listen(process.env.PORT || 8080);