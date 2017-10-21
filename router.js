const url = require('url');
const helpers = require('./helpers');

const routes = {
    '/cat': require('./endpointhandlers/cat'),

    '/dog': require('./endpointhandlers/dog')
};

module.exports = function (req, res) {
    
    var pathname = url.parse(req.url).pathname;

    if(pathname === '/'){
        helpers.fileRespond(res, 'public/index.html');
        return;
    }

    var regexFile = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png)$/);
    if(regexFile){
        helpers.fileRespond(res, 'public' + regexFile[0]);
        return;
    }
    // console.log(regexFile[0]);
    
    var action = routes[pathname];
    if (action) {
        var method = req.method;
        var handler = action[method];

        if (handler){
            handler(res);
        }
        else{
            helpers.respond(res, `Metode ${req.method} ikke tilladt`, 404);
            return;
        }
        // action(res);
        return;
    }
    // Hvis vi er her er der ikke fundet en route
    helpers.respond(res, 'Route findes ikke', 404);
};
