module.exports = {
    //create a sprite object.. very basic
    spriteFactory: function(num, imgstr) {
        return {
            "imgstr": imgstr,
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