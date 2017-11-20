const helpers = require('./../helpers');

module.exports = {
    'GET' : function(req, res){

        helpers.respond(res, 'Svar på GET: Miauuuuuv');
    },

    'POST' : function(req, res){
        helpers.respond(res, 'Svar på POST: Miauuuuuv');
    },

    'PUT' : function(req, res){
        helpers.respond(res, 'Svar på PUT: Miauuuuuv');
    }
}