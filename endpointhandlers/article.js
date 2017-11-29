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
    },
    
    'POST' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            var sql = 'insert into articles (category_id, title, content) values(?, ?, ?)';
            var values = [formData.catId, formData.title, formData.article];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            });
        });
    },
    
    'DELETE' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            console.log(formData); 
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            var sql = 'delete from articles where id = ?';
            var values = [formData.id];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            });
        });
    }
};
