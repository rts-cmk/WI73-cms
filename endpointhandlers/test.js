const helpers = require('./../helpers');

module.exports = {
    'GET' : function(req, res){
        // helpers.redirect(res, '/');
        // return;
        // var c = helpers.getCookies(req);
        var r = helpers.rand();
        var expiretime = new Date(new Date().getTime() + 3600000).toUTCString();
        res.setHeader('Set-cookie', [`id=${r}; expires=${expiretime}`,'test1=val1', 'test2=val2']);
        helpers.respond(res, r);
    }
}