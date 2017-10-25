const mysql = require('mysql2');
const helpers = require('./../helpers');

const creds = {
    host : 'localhost',
    user : 'wwwuser',
    password : 'wwwuser',
    database : 'demo-cms'
};

const connection = mysql.createConnection(creds);

exports.select = function(res, sql, callback){
    connection.query(sql, function(err, data){
        if(err){
            helpers.respond(res, {besked : 'Der opstod en fejl...'}, 404);
            return
        }
        callback(data);
    })
}