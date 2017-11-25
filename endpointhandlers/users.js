const helpers = require('./../helpers');
const database = require('./../data/database');

module.exports = {
    // Henter alle brugere fra databasen og sender dem til browseren, men kun hvis brugeren er logget ind
    'GET': function (req, res) {
        var sql = "SELECT id, username FROM users ORDER BY username";
        var values = [1];
        database.query(res, sql, values, function (data) {
            if(helpers.objEmpty(data)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            helpers.respond(res, data);
        });
    },

    'POST' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500)
                return;
            }
            var sql = "insert into users (username, password) values(?, ?)"
            var values = [formData.username, formData.password];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            })
        });
    },

    'PUT' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            var sql = "update users set username = ?, password = ? where id = ?";
            var values = [formData.username, formData.password, formData.id];
            console.log(values);
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            })
        });
    },

    'DELETE' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            // Jeg vil ikke tillade at 'admin' brugeren slettes. Jeg forudsætter at 'admin' har id = 1
            var sql = "delete from users where id = ? and id != 1";
            var values = [formData.id];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            });
        })
    }
}
