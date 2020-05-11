var images = require('../json/images.json'); //all images in the img folder, converted into base64 strings because heroku was being a butt

module.exports = {
    //create a sprite object.. very basic
    spriteFactory: function(num) {
        return {
            "positions": {
                "right": images["delmar-right"],
                "left": images["delmar-left"],
                "rightWalk1": images["delmar-walking-right-1"],
                "leftWalk1": images["delmar-walking-left-1"],
                "rightWalk2": images["delmar-walking-right-2"],
                "leftWalk2": images["delmar-walking-left-2"]
            },
            "display": "right",
            "id": num,
            "x": 0,
            "y": 0
        };
    },

    //change the coordinates of a sprite given a keycode (only works for arrow keys)
    updateSprite: function(sprite, keyCode, speed) {
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
};