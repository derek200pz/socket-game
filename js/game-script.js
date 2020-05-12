console.log("About to get all the variables ready")

//variables

var canv;
var ctx;
var sprites = [];
var speed = 9;
var mySpriteNum = -1;

//functions

var draw = function(sprite) {
    ctx.drawImage(sprite.images[sprite.display], sprite.x, sprite.y, 96, 192);
}

var updateSprite = function(sprite, newx, newy, newd) {
    sprite.x = newx;
    sprite.y = newy;
    sprite.display = newd;
}

var setWalkImg = function(sprite, direction, beat) {
    if (beat % 2 == 0) {
        sprite.display = direction + "Walk2";
    } else {
        sprite.display = direction + "Walk1";
    }
}

var clearCanvas = function() {
    ctx.clearRect(0, 0, canv.clientWidth, canv.clientHeight);
}

var refreshCanvas = function() {
    clearCanvas();
    spritesClone = []
    $.each(sprites, function(i, sprite) {
        spritesClone.push(sprite);
    });
    spritesClone.sort(function(a, b) { return (a.y - b.y) }) //sort the sprites by y position
    $.each(spritesClone, function(i, sprite) {
        draw(sprite);
    });
}

var buildImages = function(sprite) {
    sprite.images = {};
    $.each(sprite.positions, function(name, imgstr) {
        var img = new Image();
        if (imgstr.substring(0, 22) != 'data:image/png;base64,') {
            img.src = 'data:image/png;base64,' + imgstr;
        } else {
            img.src = imgstr;
        }

        sprite.images[name] = img;
    });
}

//after the DOM is ready

$(document).ready(function() {
    var socket = io.connect();
    canv = document.getElementById("canvas");
    canv.width
    ctx = canv.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    //stop borwser from scrolling with arrow keys
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

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


    var heart = null;

    //Now we can listen for that event
    socket.on('connect', function() {
        //Note that the data is the object we sent from the server, as is. So we can assume its id exists.
        console.log('Connected successfully to the socket.io server. I\'m the client!');


        //  __ __
        // /  V  \
        // \     /
        //  \   /
        //   \ /
        //    V
        //the heartbeat of the game: this is executed every .1 seconds
        clearInterval(heart)
        var heartBeat = 0;
        heart = setInterval(() => {
            heartBeat = (heartBeat + 1) % 1000;
            var change = false;
            if (playerMovement.up) {
                sprites[mySpriteNum].y -= speed;
                change = true;
            }
            if (playerMovement.down) {
                sprites[mySpriteNum].y += speed;
                change = true;
            }
            if (playerMovement.left) {
                sprites[mySpriteNum].x -= speed;
                sprites[mySpriteNum].display = "left";
                change = true;
            }
            if (playerMovement.right) {
                sprites[mySpriteNum].x += speed;
                sprites[mySpriteNum].display = "right";
                change = true;
            }

            var direction = (sprites[mySpriteNum].display.indexOf("right") == -1 ? "left" : "right") //if the display image contains the word "right", face right. Otherwise left.
            if (change) {
                setWalkImg(sprites[mySpriteNum], direction, heartBeat);
                socket.emit('imoved', { newcoords: { x: sprites[mySpriteNum].x, y: sprites[mySpriteNum].y }, display: sprites[mySpriteNum].display });
            } else {
                if (sprites[mySpriteNum].display != direction) {
                    socket.emit('imoved', { newcoords: { x: sprites[mySpriteNum].x, y: sprites[mySpriteNum].y }, display: direction });
                }
                sprites[mySpriteNum].display = direction;
            }

            refreshCanvas();

        }, 100);

        socket.on('startstate', function(data) {
            $.each(data.sprites, function() {
                buildImages(this);
            });
            sprites = data.sprites;
            mySpriteNum = data.usernum;
            refreshCanvas();
        });

        socket.on('newsprite', function(data) {
            buildImages(data.sprite);
            sprites[data.num] = (data.sprite);
            refreshCanvas();
        });

        socket.on('theymoved', function(data) {
            if (data.num != mySpriteNum) {
                updateSprite(sprites[data.num], data.newcoords.x, data.newcoords.y, data.display);
            }
            refreshCanvas();
        });

        socket.on('deletesprite', function(data) {
            delete sprites[data.num];
            refreshCanvas();

        });

    });

});