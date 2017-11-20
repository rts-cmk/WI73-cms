const helpers = require('./../helpers');

module.exports = {
    'GET' : function(req, res){
        helpers.respond(res, 'Svar på GET: Vov');
    },

    'POST' : function(req, res){
        helpers.respond(res, 'Svar på POST: Vov');
    },

    'DELETE' : function(req, res){
        helpers.respond(res, 'Svar på DELETE: Vov');
    }
}