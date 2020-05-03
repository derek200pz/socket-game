var images = require('../json/images.json'); //all images in the img folder, converted into base64 strings because heroku was being a butt

module.exports = {
    //create a sprite object.. very basic
    spriteFactory: function(num) {
        return {
            "rightStr": images["delmar-right"],
            "leftStr": images["delmar-left"],
            "rightWalkStr1": images["delmar-walking-right-1"],
            "leftWalkStr1": images["delmar-walking-left-1"],
            "rightWalkStr2": images["delmar-walking-right-2"],
            "leftWalkStr2": images["delmar-walking-left-2"],
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