const helpers = require('./../helpers');
const database = require('./../data/database');

module.exports = {
    // Public adgang. Henter alle menupunkter fra databasen og sender dem retur.
    'GET': function (req, res) {
        var params = helpers.getQueryParams(req);
        var sql = "SELECT * FROM menu ORDER BY position";
        database.menuselect(res, sql, function (data) {
            helpers.respond(res, data);
        });
    },
    // Login beskyttet
    'POST' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500)
                return;
            }
            var sql = "insert into menu (name, position) values(?, ?)"
            var values = [formData.catname, formData.catpos];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            })
        });
    },
    // Login beskyttet
    'DELETE' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res,{besked :  'Der opstod en fejl'}, 500);
                return;
            }
            var sql = "delete from menu where id = ?";
            var values = [formData.id];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            });
        });
    },

    // Login beskyttet. Opdaterer et menupunkts 'name' og/eller 'position' i databasen
    'PUT': function (req, res) {
        
        var cookie = helpers.getCookies(req)  // Først hentes browserens cookie fra det indkommende request... 
        database.verifySession(res, cookie, function (data) {   // ...dernæst verificeres om sessionen er gyldig.
            if(helpers.objEmpty(data)){
                // Hvis vi er her, er der ikke fundet en gylig session i databasen der matcher browserens cookie...
                helpers.redirect(res, '/'); // ...derfor redirectes brugeren tilbage til '/'
                return  // og afslutter kommunikationen.
            }
            // Hvis vi er her er det fordi der er fundet en gyldig session i databasen der matcher browserens cookie
            helpers.getFormData(req, res, function (formData) {  // Hent data fra formen
                if(helpers.objEmpty(formData)){ // Check om der er nogle data
                    helpers.respond(res, {besked: 'Der opstod en fejl'})    // Hvis ikke, så send fejlbesked.
                }

                var values = [formData.catname, formData.catpos, formData.id]
                var sql = "update menu set name = ?, position = ? where id = ?";
                database.query(res, sql, values, function (data) {
                    helpers.respond(res, data);
                });
            });
        });
    }
}
