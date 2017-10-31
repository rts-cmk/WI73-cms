const fs = require('fs');
const path = require('path');
const qs = require('querystring');

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

exports.rand = function(num_chars = 48){
    var random = new Date().getTime().toString() + '#';
    while(num_chars--){
        random += Math.floor(Math.random()*36).toString(36);
    }
    return random;
};

exports.getCookies = function(req){
    var cookies = {}, cookieParts = [];
    if(req.headers.cookie){
        cookies.raw = req.headers.cookie;
        cookieParts = cookies.raw.split(';');
        cookieParts.forEach(function(cp){
            var name = decodeURI(cp.split('=')[0].trim());
            var value = decodeURI(cp.split('=')[1].trim());
            cookies[name] = value;
        })
    }
    return cookies;
}

exports.logger = function(req){
    var logTxt = new Date().toString();
        logTxt += `; From: ${req.connection.remoteAddress}`;
        logTxt += `; URL: ${req.url}`;
        logTxt += `; Method: ${req.method}`;
        logTxt += `; Cookies: ${req.headers.cookie}`;
    console.log(logTxt);
}

exports.getFormData = function(req, callback){
    var userData = '';
    var formData;
    req.on('data', function(d){
        userData += d;
    });
    req.on('end', function(){
        formData = qs.parse(userData);
        callback(formData);
    });
}

