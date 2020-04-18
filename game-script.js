console.log("About to get all the variables ready")

//variables

var canv;
var ctx;
var sprites = [];
var speed = 10;
var mySpriteNum = -1;

//functions

var draw = function(sprite) {
    ctx.drawImage(sprite.img, sprite.x, sprite.y, 96, 192);
}

var updateSprite = function(sprite, newx, newy) {
    if (sprite.x < newx) {
        sprite.img = sprite.rightImg;
        console.log("faceright")
    } else if (sprite.x > newx) {
        sprite.img = sprite.leftImg;
        console.log("faceleft")
    }
    sprite.x = newx;
    sprite.y = newy;
}

var clearCanvas = function() {
    ctx.clearRect(0, 0, canv.clientWidth, canv.clientHeight);
}

var refreshCanvas = function() {
    clearCanvas();
    $.each(sprites, function(i, sprite) {
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
        //the heartbeat of the game: this is executed every .25 seconds
        setInterval(() => {
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
                sprites[mySpriteNum].img = sprites[mySpriteNum].leftImg;
                change = true;
            }
            if (playerMovement.right) {
                sprites[mySpriteNum].x += speed;
                sprites[mySpriteNum].img = sprites[mySpriteNum].rightImg;
                change = true;
            }
            if (change) {
                refreshCanvas();
                socket.emit('imoved', { newcoords: { x: sprites[mySpriteNum].x, y: sprites[mySpriteNum].y } });
            }

        }, 50);


        socket.on('startstate', function(data) {
            $.each(data.sprites, function() {
                var img = new Image();
                img.src = 'data:image/png;base64,' + this.leftStr;
                this.leftImg = img;

                var img = new Image();
                img.src = 'data:image/png;base64,' + this.rightStr;
                this.rightImg = img;

                this.img = this.rightImg;
            });
            sprites = data.sprites;
            mySpriteNum = data.usernum;
            refreshCanvas();
        });

        socket.on('newsprite', function(data) {
            var img = new Image();
            img.src = 'data:image/png;base64,' + data.sprite.leftStr;
            data.sprite.leftImg = img;

            var img = new Image();
            img.src = 'data:image/png;base64,' + data.sprite.rightStr;
            data.sprite.rightImg = img;

            data.sprite.img = data.sprite.rightImg;

            sprites[data.num] = (data.sprite);
        });

        // $(document).on("keydown", function(evt) {
        //     socket.emit('movekey', { keyCode: evt.keyCode });
        // })

        socket.on('theymoved', function(data) {
            updateSprite(sprites[data.num], data.newcoords.x, data.newcoords.y);
            refreshCanvas();
        });

        socket.on('deletesprite', function(data) {
            delete sprites[data.num];
            refreshCanvas();

        });

    });

});