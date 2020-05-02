//requiring path and fs modules
const fs = require('fs');

fs.writeFile("json/latest-update.json", JSON.stringify({ "latestUpdate": process.argv[2] }), err => {
    // Checking for errors 
    if (err) {
        console.log("ERROR in update-text.js")
        throw err;
    }
});