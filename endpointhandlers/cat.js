const helpers = require('./../helpers');

module.exports = {
    'GET' :function(req, res){
        helpers.respond(res, 'GET: Miauw');
    },

    'POST' :function(req, res){
        helpers.respond(res, 'POST: Miauw');
    }    
};
