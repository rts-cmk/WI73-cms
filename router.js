const url = require('url');
const helpers = require('./helpers');
const database = require('./data/database');
const logger = require('./logger');
const routes = require('./routedefinitions');

// Denne funktion er arbejdshesten. Den kaldes hver gang serveren modtager en request fra en client
module.exports = function(req, res){
    logger(req, 4);
    var method = req.method;
    var pathname = url.parse(req.url).pathname;

    // Check om routen er '/'
    if(pathname === '/'){
        helpers.fileRespond(res, 'public/index.html');
        return;
    }

    // Regular expression der analyserer 'pathname' for fil-request til public filer
    var rx = /^\/(img\/|css\/|js\/)?\w+\.(html|png|js|css)$/i;
    var regexFile = pathname.match(rx);

    if(regexFile){
        // Hvis regex'en fandt noget der matcher
        helpers.fileRespond(res, 'public' + regexFile[0]);
        return;
    }

    // Vi skal undersøge om der requestes en fil fra admin-mappen
    rx = /^\/(admin\/(img\/|css\/|js\/)?[\w-]+\.(html|png|js|css))$/i;
    var adminFile = pathname.match(rx);
    if(adminFile){
        // Alle filer i admin-mappen er login beskyttede.
        // Derfor er det  nødvendigt at checkke om brugersessionen er gyldig.
        var cookie = helpers.getCookies(req);
        database.verifySession(res, cookie, function(data){
            if(helpers.objEmpty(data)){
                // Hvis brugeren ikke er logget ind er vi her.
                helpers.redirect(res, '/')
                return;
            }
            // Hvis brugeren er logget ind er vi her
            helpers.fileRespond(res, adminFile[1]);
        });
        return;
    }
    // Hvis vi er her er der ikke requestet en statisk fil, hverken i public- eller admin-mappen
    var action = routes[pathname];
    if(action){
        // Hvis regex'en ikke fandt noget er vi her.
        var handler = action[method];
        if(handler){
            handler(req, res);
            return;
        }
        helpers.respond(res, 'Metode ikke tilladt', 404);
        return;
    } 
    else{
        helpers.respond(res, 'Ressource findes ikke: ' + pathname, 404)
    }
} 