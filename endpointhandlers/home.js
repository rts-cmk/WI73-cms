const helpers = require('./../helpers');

module.exports = {
    'GET' :function(req, res){
        helpers.redirect(res, '/index.html');
    }
};