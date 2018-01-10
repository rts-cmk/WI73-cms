const mysql = require('mysql2');
const helpers = require('./../helpers');

const dbcreds = {
    host : 'localhost',
    user : 'wwwuser',
    password : 'wwwuser',
    database : 'demo-cms'
};

const connection = mysql.createConnection(dbcreds);

// menuselect selecter alle menupunkter. 
// Bruger ikke prepared statements, da der ikke indgår brugerdata i queryen
exports.menuselect = function(res, sql, callback){
    connection.query(sql, function(err, data){
        if(err){
            helpers.respond(res, {besked : 'Database ikke tilgængelig'}, 503);
            return;
        }
        callback(data);
    });
};

// articleselect. Henter artikler med kategori id.
// Da der indgår client data i queryen, er der anvendt prepared statements.
// exports.articleselect = function(res, sql, values, callback){
//     connection.query(sql, values, function(err, data){
//         if(err){
//             helpers.respond(res, {besked : 'Database ikke tilgængelig'}, 503);
//             return;
//         }
//         callback(data);
//     });
// }
 
// verifyUserCreds verificerer at brugernavn og kodeord findes i DB.
// Da der indgår client data i queryen, er der anvendt prepared statements.
// Sender de fundne data til callback funktionen hvis brugernavn og kodeord matcher.
// Ellers sendes et et tom array
exports.verifyUserCreds = function(res, creds, callback){
    var sql = "select * from users where username = ? and password = ?"
    connection.query(sql, [creds.username, creds.password], function(err, data){
        if(err){
            helpers.respond(res, {besked : 'Database ikke tilgængelig'}, 503);
            return;
        }
        callback(data);
    })
};

// Opretter en session i DB
exports.createSession = function(res, creds, callback){
    var r = helpers.rand();
    var sql = "insert into user_sessions (user_id, session_key) values(?, ?)"
    connection.query(sql, [creds.id, r], function(err, data){
        if(err){
            helpers.respond(res, {besked : "Database ikke tilgængelig"}, 503);
            return;
        }
        // creds.session_key = r;
        callback(r);
    });
};

exports.deleteSession = function(res, cookie, callback){
    var sql = "delete from user_sessions where session_key = ?";
    console.log(cookie);
    connection.query(sql, [cookie.id], function(err, data){
        if(err){
            helpers.respond(res, {besked : 'Database ikke tilgængelig'}, 503);
            return;
        }
        callback(data);
    });
};

// session info. Dender data til callback funktionen hvis session_key matcher.
// Ellers sendes et et tom array
exports.verifySession = function(res, cookie, callback){
    var sql = "select * from user_sessions where session_key = ?";
    connection.query(sql, [cookie.id], function(err, data){
        if(err){
            helpers.respond(res, {besked : "Database ikke tilgængelig"}, 503);
        }
        callback(data);
    });
};

exports.query = function(res, sql, values, callback){
    connection.query(sql, values, function(err, data){
        if(err){
            helpers.respond(res, {besked: "Database ikke tilgængelig."}, 503);
            return;
        }
        callback(data);
    });
    
}
