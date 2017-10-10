const helpers = require('./../helpers');

module.exports = {
    'GET' :function(res){
        helpers.respond(res, 'GET: Miauw');
    },

    'POST' :function(res){
        helpers.respond(res, 'POST: Miauw');
    }    
};