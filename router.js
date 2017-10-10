const url = require('url');
const helpers = require('./helpers');

const routes = {
    '/cat': require('./endpointhandlers/cat'),

    '/dog': require('./endpointhandlers/dog')
};

// console.log(routes['/cat']);


module.exports = function (req, res) {
    console.log(req.method);
    var pathname = url.parse(req.url).pathname;
    var action = routes[pathname];
    if (action) {
        var method = req.method;
        var handler = action[req.method];

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