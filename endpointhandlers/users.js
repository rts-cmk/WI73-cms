const helpers = require('./../helpers');
const database = require('./../data/database');

module.exports = {
    // Henter alle brugere fra databasen og sender dem til browseren, men kun hvis brugeren er logget ind
    'GET': function (req, res) {
        var cookie = helpers.getCookies(req);
        database.verifySession(res,cookie,function(veriFyData){
            if(helpers.objEmpty(veriFyData)){
                // Hvis vi er her er brugeren logget ikke ind....
                helpers.redirect(res,'/login'); // ...derfor skal der sendes en rediect tilbage til browseren...
                return; // ...og afsluttes med en return
            }
            // Hvis vi er her er brugeren logget ind, og vi kan fortsætte
            var sql = "SELECT id, username FROM users ORDER BY username";
            var values = [1];
            database.query(res, sql, values, function (data) {
                if(helpers.objEmpty(data)){
                    helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                    return;
                }
                helpers.respond(res, data);
            });
        });
    },

    'POST' : function(req, res){
        var cookie = helpers.getCookies(req);
        database.verifySession(res,cookie,function(veriFyData){
            if(helpers.objEmpty(veriFyData)){
                // Hvis vi er her er brugeren logget ikke ind....
                helpers.redirect(res,'/login'); // ...derfor skal der sendes en rediect tilbage til browseren...
                return; // ...og afsluttes med en return
            }
            helpers.getFormData(req, res, function(formData){
                if(helpers.objEmpty(formData)){
                    helpers.respond(res, {besked : "Der opstod en fejl"}, 500)
                    return;
                }
                if(formData.username[0].toString().length == 0 || formData.password[0].toString().length == 0){
                    helpers.respond(res,{besked: 'Brugernavn og adgangskode skal begge være udfyldt'}, 500);
                    return;
                }
                var sql = "insert into users (username, password) values(?, ?)"
                var values = [formData.username, formData.password];
                database.query(res, sql, values, function(data){
                    helpers.respond(res, data);
                })
            });
        });
    },

    'PUT' : function(req, res){
        // var cookie = helpers.getCookies(req);
        // database.verifySession(res, cookie, )
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                helpers.respond(res, {besked : "Der opstod en fejl"}, 500);
                return;
            }
            // Vi skal huske at 'multiparty' modulet tager den indkommende forms elementer og organiserer dem i arrays
            // Det betyder at selv om vi kun har et inputfelt der har 'name=username' vil havne i formData.username[0]

            // Når vi skal validere input er der tre forskellige data der skal checkkes, username, password og id
            // Mulige udfald, hvor 1 angiver om værdien findes og 0 angiver at den ikke findes og user = username, pwd = password og id = user_id
            //      _________________________
            //      |usr|pwd|id | opdatering |
            //      |---|---|---|------------|
            //      | 0 | 0 | 0 | ikke mulig |
            //      | 0 | 0 | 1 | ikke mulig |
            //      | 0 | 1 | 0 | ikke mulig |
            //      | 0 | 1 | 1 | ikke mulig |
            //      | 1 | 1 | 0 | ikke mulig |
            //      | 1 | 0 | 1 | kun usr    |
            //      | 1 | 1 | 0 | ikke mulig |
            //      | 1 | 1 | 1 | usr og pwd |
            //      --------------------------
            // Som det ses af tabellen er det ikke muligt at opdatere hvis vi ikke har et id.
            // Vi kræver også at username skal findes, men password behøves ikke nødvendigvis at findes.
            if(formData.id[0].length < 1){
                // Hvis vi er her det fordi vi ikke har noget id
                helpers.respond(res, {besked : 'id må ikke være tomt'}, 400);
                return;                
            }
            if(formData.username[0].length < 1){    // Check om der eksisterer et username
                // Hvis vi er her er det fordi username ikke findes
                helpers.respond(res, {besked : 'brugernavn må ikke være tomt'}, 400);
                return;
            }
            // Hvis vi når hertil har vi både username og id
            var sql = "update users set username = ?";

            var values = [formData.username[0]];
            if(formData.password[0].length > 1){
                // Vi er her hvis vi har et password
                sql += ', password = ?'
                values.push(formData.password[0]);
            }

            sql += ' where id = ?'  // gør sql sætningen færdig
            values.push(formData.id[0]);    // og tilføj det sidste element til values-arrayet

            database.query(res, sql, values, function(data){    // Send sql sætningen til databasen...
                helpers.respond(res, data);     // ...og send svaret til browseren.
            })
        });
    },

    'DELETE' : function(req, res){
        helpers.getFormData(req, res, function(formData){
            if(helpers.objEmpty(formData)){
                // Vi eer her hvis vi ikke har nogle formData
                helpers.respond(res, {besked : "Der opstod en fejl"}, 400);
                return;
            }
            if(formData.id[0].toString().length == 0){
                // Hvis formData.id er tom er vi her
                helpers.respond(res, {besked : "Der opstod en fejl"}, 400);
                return;
            }
            // Vi er her hvis vi har de nødvendige data til rådighed til at gennemføre operationen
            // Jeg vil ikke tillade at 'admin' brugeren slettes. Jeg forudsætter at 'admin' har id = 1
            var sql = "delete from users where id = ? and id != 1";
            var values = [formData.id];
            database.query(res, sql, values, function(data){
                helpers.respond(res, data);
            });
        })
    }
}
