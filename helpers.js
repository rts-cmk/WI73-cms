const fs = require('fs');
const url = require('url');
const path = require('path');
const qs = require('querystring');
const multiparty = require('multiparty');
const mimetypes = require('./mimetypes');

exports.fileRespond = function(res, fileName, msg){
    var ext = path.extname(fileName);
    var mime = mimetypes[ext];
    
    // En mere memory-effektiv måde at sende en fil til browseren
    // vil være at anvende en read-stream og 'pipe' den til browseren.
    // Men de filstørrelser jeg arbejder med her kræver ikke megen RAM
    fs.readFile(fileName,  mime.enc, function(err, fileContent){
        if(err){
            exports.respond(res, 'Fil ikke fundet: ' + fileName, 404);
            return;
        }
        res.writeHead(200, {'Content-type' : mime.type});
        
        if(msg){
            // Hvis 'msg' parameteren har indhold, så erstat "<!--msg-->" med 'msg'
            fileContent = fileContent.replace(/<!--msg-->/g, msg);
        }
        res.end(fileContent);
    });
};

exports.respond = function(res, besked, status = 200){
    res.writeHead(status, {'Content-type':'application/json; charset=utf-8'});
    res.end(JSON.stringify(besked));
};

exports.rand = function(num_chars = 48){
    var random = new Date().getTime().toString() + '#';
    while(num_chars--){
        random += Math.floor(Math.random()*36).toString(36);
    }
    return random;
};

// GET-COOKIE
exports.getCookies = function(req){
    var cookies = {}, cookieParts = [], name, value;
    if(req.headers.cookie){
        cookies.raw = req.headers.cookie;
        cookieParts = cookies.raw.split(';');
        cookieParts.forEach(function(cp){
            if(cp.match(/=/)){
                name = decodeURI(cp.split('=')[0].trim());
                value = decodeURI(cp.split('=')[1].trim());
                cookies[name] = value;
            }
        })
    }
    return cookies;
};

// REDIRECT 302, {location:'url'}
exports.redirect = function(res, url){
    res.writeHead(302, {'location': url});
    res.end();
};

exports.getQueryParams = function(req){
    var params = {};
    var query = url.parse(req.url).query
    if(query){
        params = qs.parse(query);
    }
    return params;
}

// GETFORMDATA, Henter formdata fra indkommende form
exports.getFormData = function(req, res, callback){
    // console.log(res); return;
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files){
        if(err){
            exports.respond(res, {besked: 'Der opstod en fejl'}, 404);
            console.log(err);
            return;
        }
        callback(fields, files);
    });

// Oprindelig kode er udkommenteret
// function getFormData(req, callback){
//    var userdata = '';
//    req.on('data', function(data){  // bruger 'data' eventen...
//        userdata += data;   // ...til at trække formdata ind i variablen 'userdata'
//    });
//    req.on('end', function(){   // 
//        var formData = qs.parse(userdata);
//        callback(formData);
//    });


};

// Returnerer true hvis obj er tomt, ellers returneres false.
// Virker også for arrays og skalarer
exports.objEmpty = function(obj){
    return !Object.keys(obj).length;
};