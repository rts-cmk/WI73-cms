const fs = require('fs');
const path = require('path');

const mimetypes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/js',
    '.png' : 'image/png'
};

exports.fileRespond = function(res, fileName){
    console.log(fileName);
    fs.readFile(fileName, function(err, fileContent){
        if(err){
            exports.respond(res, 'Fil ikke fundet', 404);
            return;
        }
        var ext = path.extname(fileName);
        var mime = mimetypes[ext];
        res.writeHead(200, {'Content-type': mime})
        res.end(fileContent);
    });
};


exports.respond = function (res, besked, status = 200) {
    res.writeHead(status, { 'Content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(besked));
};
