var images = require('../json/images.json'); //all images in the img folder, converted into base64 strings because heroku was being a butt
const replaceColor = require('replace-color')
var Jimp = require('jimp');

var randomColor = function() {
    const hex = function(num) {
        if (num == 10) return "a";
        if (num == 11) return "b";
        if (num == 12) return "c";
        if (num == 13) return "d";
        if (num == 14) return "e";
        if (num == 15) return "f";
        else return num;
    }
    return "#" + hex(Math.floor(Math.random() * 16)) + hex(Math.floor(Math.random() * 16)) + hex(Math.floor(Math.random() * 16));
}

var recolor = function(imgstr, startColor, endColor) {

    var promise = new Promise(function(resolve, reject) {

        replaceColor({
            image: Buffer.from(imgstr, 'base64'),
            colors: {
                type: 'hex',
                targetColor: startColor,
                replaceColor: endColor
            }
        }, (err, jimpObject) => {
            if (err) return console.log(err);

            recoloredImgStr = jimpObject.getBase64(Jimp.AUTO, function(err, data) {
                if (err) {
                    console.log(err);
                    reject();
                }
                resolve(data);
            });
        });

        //reject();

    });

    return promise;
}

module.exports = {
    //create a sprite object.. very basic
    generateSprite: function(num) {

        var possibilities = { "delmar": "#000000", "bird": "#3f48cc" };

        var choice = Object.keys(possibilities)[Math.floor(Math.random() * Object.keys(possibilities).length)];

        var imageStrings = {
            "right": choice + "-right",
            "left": choice + "-left",
            "rightWalk1": choice + "-walking-right-1",
            "leftWalk1": choice + "-walking-left-1",
            "rightWalk2": choice + "-walking-right-2",
            "leftWalk2": choice + "-walking-left-2"
        }

        var promise = new Promise(function(resolve, reject) {
            var finished = 0;
            var startColor = possibilities[choice];
            var endColor = randomColor();
            Object.entries(imageStrings).forEach(function(pair) {
                recolor(images[pair[1]], startColor, endColor).then(function(imgstr) {
                    imageStrings[pair[0]] = imgstr;
                    finished++;
                    console.log("recolor finished: " + finished + '/' + Object.keys(imageStrings).length);
                    if (finished == Object.keys(imageStrings).length) {
                        resolve({
                            "positions": imageStrings,
                            "display": "right",
                            "id": num,
                            "x": 0,
                            "y": 0
                        });
                    }
                });
            });
        });

        return promise;

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