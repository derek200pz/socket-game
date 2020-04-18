console.log("About to get all the variables ready")

//variables

var canv;
var ctx;
var sprites = [];
var speed = 10;
var mySpriteNum = -1;

//functions

var draw = function(sprite) {
    /*ctx.beginPath();
    ctx.fillStyle = sprite.color;
    ctx.rect(sprite.x, sprite.y, sprite.width, sprite.height);
    ctx.fill();*/
    ctx.drawImage(sprite.img, sprite.x, sprite.y, 96, 192);
}

var drawDelmar = function() {
    var img = new Image();
    img.src = "img/delmar.png"
    ctx.drawImage(img, 0, 0, 96, 192);
    var speechBubble = new SpeechBubble(ctx);
    speechBubble.text = "I have a penis!"
    speechBubble.draw();
}

var clearCanvas = function() {
    ctx.clearRect(0, 0, canv.clientWidth, canv.clientHeight);
}

var refreshCanvas = function() {
    clearCanvas();
    $.each(sprites, function(i, sprite) {
        console.log(sprite);
        draw(sprite);
    });
}

//after the DOM is ready

$(document).ready(function() {
    var socket = io.connect();
    canv = document.getElementById("canvas");
    canv.width
    ctx = canv.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    //handle key presses
    const playerMovement = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    const keyDownHandler = (e) => {
        if (e.keyCode == 39) {
            playerMovement.right = true;
        } else if (e.keyCode == 37) {
            playerMovement.left = true;
        } else if (e.keyCode == 38) {
            playerMovement.up = true;
        } else if (e.keyCode == 40) {
            playerMovement.down = true;
        }
    };
    const keyUpHandler = (e) => {
        if (e.keyCode == 39) {
            playerMovement.right = false;
        } else if (e.keyCode == 37) {
            playerMovement.left = false;
        } else if (e.keyCode == 38) {
            playerMovement.up = false;
        } else if (e.keyCode == 40) {
            playerMovement.down = false;
        }
    };

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    //the heartbeat of the game: this is executed every .25 seconds
    setInterval(() => {
        if (playerMovement.up) {
            sprites[mySpriteNum].y -= speed;
        }
        if (playerMovement.down) {
            sprites[mySpriteNum].y += speed;
        }
        if (playerMovement.left) {
            sprites[mySpriteNum].x -= speed;
        }
        if (playerMovement.right) {
            sprites[mySpriteNum].x += speed;
        }
        refreshCanvas();
    }, 50);


    //Now we can listen for that event
    socket.on('connect', function() {
        //Note that the data is the object we sent from the server, as is. So we can assume its id exists.
        console.log('Connected successfully to the socket.io server. I\'m the client!');

        var keys = {};
        var moveUp = function() { socket.emit('movekey', { keyCode: 38 }); }
        var moveDown = function() { socket.emit('movekey', { keyCode: 40 }); }
        var moveRight = function() { socket.emit('movekey', { keyCode: 39 }); }
        var moveLeft = function() { socket.emit('movekey', { keyCode: 37 }); }
        window.onkeyup = function(e) { keys[e.keyCode] = false; }
        window.onkeydown = function(e) { keys[e.keyCode] = true; }

        $("#up-button").click(function() {
            moveUp();
        });

        $("#down-button").click(function() {
            moveDown();
        });

        $("#right-button").click(function() {
            moveRight();
        });

        $("#left-button").click(function() {
            moveLeft();
        });

        socket.on('startstate', function(data) {
            $.each(data.sprites, function() {
                var img = new Image();
                img.src = 'data:image/png;base64,' + this.imgstr;
                this.img = img;
            });
            sprites = data.sprites;
            mySpriteNum = data.usernum;
            refreshCanvas();
        });

        socket.on('newsprite', function(data) {
            console.log(data.sprite.imgstr);
            var img = new Image();
            img.src = 'data:image/png;base64,' + data.sprite.imgstr;
            data.sprite.img = img;
            sprites[data.num] = (data.sprite);
            console.log(sprites);
        });

        // $(document).on("keydown", function(evt) {
        //     socket.emit('movekey', { keyCode: evt.keyCode });
        // })

        socket.on('movement', function(data) {
            sprites[data.num].x = data.newcoords.x;
            sprites[data.num].y = data.newcoords.y;
            refreshCanvas();
        });

        socket.on('deletesprite', function(data) {
            delete sprites[data.num];
            refreshCanvas();

        });

    });

});