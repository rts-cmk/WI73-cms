const helpers = require('./../helpers');

module.exports = {
    'GET' :function(res){
        helpers.respond(res, 'GET: Vov-vov');
    },

    'POST' :function(res){
        helpers.respond(res, 'POST: Vov-vov');
    },
    
    'DELETE' :function(res){
        helpers.respond(res, 'Du har bedt om at slette vores kære Vov-vov');
    }
};