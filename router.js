const url = require('url');
const helpers = require('./helpers');
const routes = require('./routedefinitions');

module.exports = function (req, res) {
    helpers.logger(req);
    var pathname = url.parse(req.url).pathname;

    var regexFile = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png)$/);
    if(regexFile){
        helpers.fileRespond(res, 'public' + regexFile[0]);
        return;
    }
    // Vi skal undersøge om der requestes en fil fra admin-mappen
    var rx = /^\/(admin\/(img\/|css\/|js\/)?[\w-]+\.(html|png|js|css))$/i;
    var adminFile = pathname.match(rx);
    if(adminFile){
        // Hvis der requestes for en fil i admin-mapen er det nødvendigt at 
        // at checkke om brugersessionen er gyldig.
        var cookie = helpers.getCookies(req);
        database.verifySession(res, cookie, function(data){
            if(helpers.objEmpty(data)){
                helpers.redirect(res, '/')
                return;
            }
            helpers.fileRespond(res, adminFile[1]);
        });
        return;
    }


    var action = routes[pathname];
    if (action) {
        var method = req.method;
        var handler = action[method];

        if (handler){
            handler(req, res);
        }
        else{
            helpers.respond(res, `Metode ${req.method} ikke tilladt`, 404);
            return;
        }
        return;
    }
    // Hvis vi er her er der ikke fundet en route
    helpers.respond(res, 'Route findes ikke', 404);
};