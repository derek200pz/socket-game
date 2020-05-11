//requiring path and fs modules
const path = require('path');
const fs = require('fs');

var images = {};

var writeToJson = function(images) {
    fs.writeFile("json/images.json", JSON.stringify(images), err => {
        // Checking for errors 
        if (err) throw err;

        console.log(err); // Success 
    });
}





//joining path of directory 
const directoryPath = path.join(__dirname, '../img');
//passing directoryPath and callback function
fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function(file) {
        if (file.indexOf(".png") != -1) {
            // Do whatever you want to do with the file
            console.log(file);

            fs.readFile(directoryPath + '/' + file, function(err, buf) {
                if (err) {
                    console.log("errorrrrr in: ");
                    console.log(directoryPath + '/' + file);
                    console.log(err);
                } else {
                    images[file.split('.')[0]] = buf.toString('base64');
                    console.log("    now:");
                    console.log(Object.keys(images).length);
                    console.log(files.length - 1);
                    if (Object.keys(images).length == files.length - 1) { // length-1 because there is exactly 1 directory (the "depricated" directory)
                        writeToJson(images);
                    }
                }
            });
        }
    });
});