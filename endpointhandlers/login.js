const helpers = require('./../helpers');

module.exports = {
    'GET': function (req, res) {
        helpers.redirect(res, 'login.html');
    },

    'POST': function (req, res) {
        helpers.getFormData(req, function(fd){
            helpers.respond(res, fd);
        });
    }    
};