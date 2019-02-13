var fs           = require('fs');
var packageJson  = require(__dirname + '/../package');

function updateVersionConfig(srcPackage, file) {
    var data = fs.readFileSync(file, 'utf-8');
    var newFile = data;
    var oldVersion = data.match(/"image"*.:+.+:(.*?).*,/)[0]

    newFile = newFile.replace(oldVersion, '"image" : "replace marathon image repo here' + srcPackage.version +'",');

    fs.writeFileSync(file, newFile, 'utf-8');
}

updateVersionConfig(packageJson, __dirname + '/../marathon.json');