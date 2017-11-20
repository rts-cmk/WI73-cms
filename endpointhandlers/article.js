const helpers = require('./../helpers');
const database = require('./../data/database');
const url = require('url');
const qs = require('querystring');

module.exports = {
    'GET' : function(req, res){
        var query = url.parse(req.url).query
        var params = qs.parse(query);
        var sql = 'select * from articles where category_id = ?';
        database.articleselect(res, sql, [params.catid], function(data){
            helpers.respond(res, data);
        });
    } 
};