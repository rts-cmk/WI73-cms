const helpers = require('./../helpers');
const database = require('./../data/database');
const url = require('url');
const qs = require('querystring');

module.exports = {
    'GET' : function(req, res){
        // Denne funktion er public tilgængelig
        var cond, values;
        var query = url.parse(req.url).query
        var params = qs.parse(query);
        // Hvis params.catid, så hent artikler med cat_id
        // Hvis params.artid, så hent artiklen med artid
        if(params.catid){
            cond = 'category_id';
            values = [params.catid];
        }
        if(params.artid){
            cond = 'id';
            values = [params.artid];
        }
        var sql = `select * from articles where ${cond} = ?`;
        database.query(res, sql, values, function(data){
            helpers.respond(res, data);
        });        
    },
    
    'POST' : function(req, res){
        // Denne function er login beskyttet
        var cookie = helpers.getCookies(req);
        database.verifySession(res,cookie,function(veriFyData){
            if(helpers.objEmpty(veriFyData)){
                // Hvis vi er her er brugeren logget ikke ind....
                helpers.redirect(res,'/login'); // ...derfor skal der sendes en rediect tilbage til browseren...
                return; // ...og afsluttes med en return                
            }
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
        });
    },
    
    'PUT' : function(req, res){
        // Denne funktion er login beskyttet
        var cookie = helpers.getCookies(req);
        database.verifySession(res,cookie,function(veriFyData){
            if(helpers.objEmpty(veriFyData)){
                // Hvis vi er her er brugeren logget ikke ind....
                helpers.redirect(res,'/login'); // ...derfor skal der sendes en rediect tilbage til browseren...
                return; // ...og afsluttes med en return                
            }        
            helpers.getFormData(req, res, function(formData){
                if(helpers.objEmpty(formData)){
                    helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                    return;
                }
                var sql = 'update articles set category_id = ?, title = ?, content = ? where id = ?';
                var values = [formData.catId, formData.title, formData.article, formData.artid];
                database.query(res, sql, values, function(data){
                    helpers.respond(res, data);
                });
            });
        });
    },

    'DELETE' : function(req, res){
        // Denne funktion er login beskyttet
        var cookie = helpers.getCookies(req);
        database.verifySession(res,cookie,function(veriFyData){
            if(helpers.objEmpty(veriFyData)){
                // Hvis vi er her er brugeren logget ikke ind....
                helpers.redirect(res,'/login'); // ...derfor skal der sendes en rediect tilbage til browseren...
                return; // ...og afsluttes med en return                
            }        
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
        });
    }
};
